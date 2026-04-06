import Foundation

// MARK: - Models (Unchanged)
struct QuestionListResponse: Codable { let data: QuestionData }
struct QuestionData: Codable { let questionList: ProblemsetList }
struct ProblemsetList: Codable {
    let total: Int
    let questions: [LCQuestion]
    enum CodingKeys: String, CodingKey { case total = "totalNum", questions = "data" }
}
struct LCQuestion: Codable {
    let questionFrontendId: String
    let title: String
    let titleSlug: String
    let difficulty: String
    let topicTags: [TopicTag]
}
struct TopicTag: Codable { let name: String }
struct SubmissionListResponse: Codable { let data: SubmissionListData }
struct SubmissionListData: Codable { let submissionList: SubmissionList }
struct SubmissionList: Codable { let submissions: [Submission] }
struct Submission: Codable { let id: String; let statusDisplay: String; let lang: String }
struct SubmissionDetailsResponse: Codable { let data: SubmissionDetailsData }
struct SubmissionDetailsData: Codable { let submissionDetails: SubmissionDetails }
struct SubmissionDetails: Codable { let code: String }

struct ProblemOutput: Codable {
    let id: Int
    let title: String
    let slug: String
    let difficulty: String
    let category: String
    let tags: [String]
    var status: String
    let leetcodeUrl: String
    var files: [String]
}
struct FinalOutput: Codable { var problems: [ProblemOutput] }

enum AIProvider {
    case gemini(apiKey: String)
    case claude(apiKey: String)
    case localQwen(endpoint: String)
}

// MARK: - Core Exporter
class LeetCodeExporter {
    let sessionCookie: String
    let csrfToken: String
    let provider: AIProvider
    let jsonFileName = "leetcode_solved.json"
    let queueFolder = "queue"
    
    init(session: String, csrf: String, provider: AIProvider) {
        self.sessionCookie = session
        self.csrfToken = csrf
        self.provider = provider
    }

    /// PHASE 1: Sync list from LeetCode
    func syncAllQuestions() async {
        var allFetched: [LCQuestion] = []
        var skip = 0
        let limit = 100
        var hasMore = true
        print("🔄 Syncing solved list from LeetCode...")
        while hasMore {
            let query = "query questionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) { questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) { totalNum data { questionFrontendId title titleSlug difficulty topicTags { name } } } }"
            let variables: [String: Any] = ["categorySlug": "", "skip": skip, "limit": limit, "filters": ["status": "AC"]]
            let body: [String: Any] = ["query": query, "variables": variables]
            guard let data = await performPost(body: body),
                  let response = try? JSONDecoder().decode(QuestionListResponse.self, from: data) else { hasMore = false; continue }
            let batch = response.data.questionList
            allFetched.append(contentsOf: batch.questions)
            if allFetched.count >= batch.total || batch.questions.isEmpty { hasMore = false } else { skip += limit }
        }
        let mapped = mapToOutput(questions: allFetched)
        saveToJSON(data: FinalOutput(problems: mapped.sorted(by: { $0.id < $1.id })))
        print("✅ Master JSON updated. Total Solved: \(allFetched.count)")
    }

    /// NEW: PHASE 2 - BATCH PROCESS
    func processBatchQueuedProblems(batchSize: Int = 20) async {
        var output = loadExistingJSON()
        let queuedIndices = output.problems.enumerated()
            .filter { $0.element.status == "queued" }
            .map { $0.offset }
        
        let targetIndices = Array(queuedIndices.prefix(batchSize))
        
        if targetIndices.isEmpty {
            print("🎉 No queued problems to process."); return
        }

        print("🚀 Starting batch of \(targetIndices.count) problems...")

        for index in targetIndices {
            let problem = output.problems[index]
            print("📄 Processing [\(problem.id)] \(problem.title)...")
            
            guard let subId = await fetchLatestSwiftAcceptedId(slug: problem.slug),
                  let code = await fetchSubmissionCode(id: subId) else {
                print("⚠️ Skipping \(problem.title) (No Swift code found)")
                continue
            }
            
            let relativePath = "\(queueFolder)/\(problem.id).md"
            guard let mdContent = await generateMD(problem: problem, code: code) else {
                print("⚠️ Skipping \(problem.title) (AI Parsing Failed)")
                continue
            }
            saveMarkdownFile(path: relativePath, content: mdContent)
            
            // Update and save JSON immediately for safety
            output.problems[index].status = "done"
            output.problems[index].files = [relativePath]
            saveToJSON(data: output)
            
            // Wait to prevent rate limiting
            switch provider {
            case .gemini, .claude:
                print("✅ Saved \(problem.id).md. Waiting 2 seconds...")
                try? await Task.sleep(nanoseconds: 2_000_000_000)
            case .localQwen:
                print("✅ Saved \(problem.id).md.")
            }
        }
        
    }

    /// NEW: PHASE 3 - SUMMARIZE EXISTING QUEUE FILES
    func generateSummariesOnly(batchSize: Int = 20) async {
        let fileManager = FileManager.default
        guard let files = try? fileManager.contentsOfDirectory(atPath: queueFolder) else {
            print("⚠️ Cannot read \(queueFolder) directory")
            return
        }
        
        let mdFiles = files.filter { $0.hasSuffix(".md") }.sorted { 
            let id1 = Int($0.replacingOccurrences(of: ".md", with: "")) ?? Int.max
            let id2 = Int($1.replacingOccurrences(of: ".md", with: "")) ?? Int.max
            return id1 < id2
        }
        
        print("🚀 Starting summary generation for queued files...")
        var processed = 0
        
        for file in mdFiles {
            if processed >= batchSize { break }
            let path = "\(queueFolder)/\(file)"
            guard let content = try? String(contentsOfFile: path, encoding: .utf8) else { continue }
            
            // Only process files that have empty notes
            guard content.contains("notes: \"\"") else { continue }
            
            print("📄 Processing \(file)...")
            
            // Extract swift code block
            let pattern = "```swift(.*?)```"
            guard let regex = try? NSRegularExpression(pattern: pattern, options: [.dotMatchesLineSeparators]) else { continue }
            let nsString = content as NSString
            let results = regex.matches(in: content, range: NSRange(location: 0, length: nsString.length))
            
            guard let firstMatch = results.first else {
                print("⚠️ Skipping \(file) (No Swift code block found)")
                continue
            }
            
            let codeWithTicks = nsString.substring(with: firstMatch.range)
            let code = codeWithTicks.replacingOccurrences(of: "```swift", with: "").replacingOccurrences(of: "```", with: "").trimmingCharacters(in: .whitespacesAndNewlines)
            
            print("🤖 Generating summary for \(file)...")
            guard let generatedNotes = await generateNotesUsingAI(code: code) else {
                print("⚠️ Failed to generate summary for \(file)")
                continue
            }
            
            let escapedNotes: String
            if let data = try? JSONEncoder().encode(generatedNotes), let stringified = String(data: data, encoding: .utf8) {
                escapedNotes = stringified
            } else {
                escapedNotes = "\"\""
            }
            
            if let range = content.range(of: "notes: \"\"") {
                let updatedContent = content.replacingCharacters(in: range, with: "notes: \(escapedNotes)")
                try? updatedContent.write(toFile: path, atomically: true, encoding: .utf8)
                processed += 1
                
                // Wait 2 seconds to prevent API rate limit
                switch provider {
                case .gemini, .claude:
                    print("✅ Updated \(file). Waiting 2 seconds...")
                    try? await Task.sleep(nanoseconds: 2_000_000_000)
                case .localQwen:
                    print("✅ Updated \(file).")
                }
            }
        }
        
        print("🏁 Summary generation complete.")
    }

    // MARK: - Helpers
    private func determineCategory(tags: [TopicTag]) -> String {
        let tagNames = Set(tags.map { $0.name.lowercased() })
        if tagNames.contains("sliding window") { return "sliding-window" }
        if tagNames.contains("linked list") { return "linked-list" }
        if tagNames.contains("trie") { return "trie" }
        if tagNames.contains("backtracking") { return "backtracking" }
        if tagNames.contains("dynamic programming") {
            return tagNames.contains("multidimensional dynamic programming") ? "dp-multidimension" : "dp-1d"
        }
        if tagNames.contains("heap (priority queue)") || tagNames.contains("heap") { return "heap" }
        if tagNames.contains("binary search") { return "binary-search" }
        if tagNames.contains("monotonic stack") { return "monotonic-stack" }
        if tagNames.contains("intervals") { return "intervals" }
        if tagNames.contains("bit manipulation") { return "bit-manipulation" }
        if tagNames.contains("binary search tree") { return "binary-search-tree" }
        if tagNames.contains("binary tree") || tagNames.contains("tree") { return "binary-tree" }
        if tagNames.contains("graph") || tagNames.contains("breadth-first search") || tagNames.contains("depth-first search") || tagNames.contains("graph theory"){ return "graph" }
        if tagNames.contains("stack") { return "stack" }
        if tagNames.contains("queue") { return "queue" }
        if tagNames.contains("hash table") || tagNames.contains("hash set") { return "hash-map-set" }
        if tagNames.contains("two pointers") { return "two-pointers" }
        if tagNames.contains("greedy") { return "greedy" }
        if tagNames.contains("prefix sum") { return "prefix-sum" }
        if tagNames.contains("matrix") { return "matrix" }
        if tagNames.contains("array") { return "array" }
        if tagNames.contains("math") { return "math" }
        if tagNames.contains("string") { return "string" }
        return "general"
    }

    private func performPost(body: [String: Any]) async -> Data? {
        let url = URL(string: "https://leetcode.com/graphql")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("https://leetcode.com", forHTTPHeaderField: "Referer")
        request.addValue("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36", forHTTPHeaderField: "User-Agent")
        request.addValue(csrfToken, forHTTPHeaderField: "X-CSRFToken")
        request.addValue("csrftoken=\(csrfToken); LEETCODE_SESSION=\(sessionCookie)", forHTTPHeaderField: "Cookie")
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        return try? await URLSession.shared.data(for: request).0
    }

    private func mapToOutput(questions: [LCQuestion]) -> [ProblemOutput] {
        return questions.map { q in
            let category = determineCategory(tags: q.topicTags)
            let id = q.questionFrontendId
            let queuePath = "\(queueFolder)/\(id).md"
            let finalPath = "docs/\(category)/\(id)-\(q.titleSlug).mdx"
            let fileExists = FileManager.default.fileExists(atPath: queuePath) || FileManager.default.fileExists(atPath: finalPath)
            return ProblemOutput(
                id: Int(id) ?? 0, title: q.title, slug: q.titleSlug, difficulty: q.difficulty,
                category: category, tags: q.topicTags.map { $0.name },
                status: fileExists ? "done" : "queued",
                leetcodeUrl: "https://leetcode.com/problems/\(q.titleSlug)/description/",
                files: fileExists ? [FileManager.default.fileExists(atPath: queuePath) ? queuePath : finalPath] : []
            )
        }
    }

    private func generateNotesUsingAI(code: String) async -> String? {
        let prompt = """
        You are an expert software engineer specializing in algorithms and data structures.
        Analyze the following Swift code and produce a single-line summary that includes:
        1. The algorithm/pattern used (e.g., backtracking, dynamic programming, BFS)
        2. What problem it solves
        3. The key mechanism or trick that makes it work

        Format: One sentence, plain string, no bullet points or newlines.
        Use this structure: "[Pattern] to solve [problem] by [key mechanism]."
        
        ```swift
        \(code)
        ```
        """

        switch provider {
        case .gemini(let apiKey):
            return await generateWithGemini(prompt: prompt, apiKey: apiKey)
        case .claude(let apiKey):
            return await generateWithClaude(prompt: prompt, apiKey: apiKey)
        case .localQwen(let endpoint):
            return await generateWithLocalQwen(prompt: prompt, endpoint: endpoint)
        }
    }

    private func generateWithGemini(prompt: String, apiKey: String) async -> String? {
        guard let url = URL(string: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\(apiKey)") else { return nil }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let body: [String: Any] = ["contents": [["parts": [["text": prompt]]]], "generationConfig": ["temperature": 0.2]]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        guard let (data, _) = try? await URLSession.shared.data(for: request),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let candidates = json["candidates"] as? [[String: Any]],
              let first = candidates.first,
              let content = first["content"] as? [String: Any],
              let parts = content["parts"] as? [[String: Any]],
              let text = parts.first?["text"] as? String else { return nil }
        return text.trimmingCharacters(in: .whitespacesAndNewlines).replacingOccurrences(of: "\n", with: " ")
    }

    private func generateWithClaude(prompt: String, apiKey: String) async -> String? {
        guard let url = URL(string: "https://api.anthropic.com/v1/messages") else { return nil }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("2023-06-01", forHTTPHeaderField: "anthropic-version")
        let body: [String: Any] = [
            "model": "claude-3-5-sonnet-20240620",
            "max_tokens": 1024,
            "messages": [["role": "user", "content": prompt]]
        ]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode != 200 {
                let errorBody = String(data: data, encoding: .utf8) ?? "No body"
                print("⚠️ Claude API HTTP Error: \(httpResponse.statusCode)")
                print("⚠️ API Response Body: \(errorBody)")
                return nil
            }
            
            guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                let errorBody = String(data: data, encoding: .utf8) ?? "No body"
                print("⚠️ Failed to parse Claude API response as JSON. Body: \(errorBody)")
                return nil
            }
            
            guard let content = json["content"] as? [[String: Any]],
                  let text = content.first?["text"] as? String else {
                print("⚠️ Unexpected JSON structure from Claude API.")
                print("Raw JSON received: \(json)")
                return nil
            }
            
            return text.trimmingCharacters(in: .whitespacesAndNewlines).replacingOccurrences(of: "\n", with: " ")
        } catch {
            print("⚠️ Network error calling Claude API: \(error.localizedDescription)")
            return nil
        }
    }

    private func generateWithLocalQwen(prompt: String, endpoint: String) async -> String? {
        guard let url = URL(string: endpoint) else {
            print("⚠️ Invalid local Qwen endpoint URL: \(endpoint)")
            return nil
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 3600 // 1 hour timeout for local generation testing
        let body: [String: Any] = [
            "model": "qwen3.5:9b", // Assuming model name is 'qwen' or similar in local setup
            "messages": [["role": "user", "content": prompt]],
            "temperature": 0.2
        ]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 3600
        config.timeoutIntervalForResource = 3600
        let session = URLSession(configuration: config)
        
        let startTime = Date()
        do {
            let (data, response) = try await session.data(for: request)
            let duration = Date().timeIntervalSince(startTime)
            print("⏱️ Local API finished in \(String(format: "%.2f", duration)) seconds")
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode != 200 {
                let errorBody = String(data: data, encoding: .utf8) ?? "No body"
                print("⚠️ Local API HTTP Error: \(httpResponse.statusCode)")
                print("⚠️ API Response Body: \(errorBody)")
                return nil
            }
            
            guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                let errorBody = String(data: data, encoding: .utf8) ?? "No body"
                print("⚠️ Failed to parse API response as JSON. Body: \(errorBody)")
                return nil
            }
            
            guard let choices = json["choices"] as? [[String: Any]],
                  let first = choices.first,
                  let message = first["message"] as? [String: Any],
                  let text = message["content"] as? String else {
                print("⚠️ Unexpected JSON structure from Local API.")
                print("Raw JSON received: \(json)")
                return nil
            }
            
            return text.trimmingCharacters(in: .whitespacesAndNewlines).replacingOccurrences(of: "\n", with: " ")
        } catch {
            let duration = Date().timeIntervalSince(startTime)
            print("⚠️ Network error calling Local API after \(String(format: "%.2f", duration)) seconds: \(error.localizedDescription)")
            return nil
        }
    }

    private func formatCode(code: String) -> String {
        let tempDir = FileManager.default.temporaryDirectory
        let tempFile = tempDir.appendingPathComponent(UUID().uuidString + ".swift")
        
        do {
            try code.write(to: tempFile, atomically: true, encoding: .utf8)
            
            let task = Process()
            task.executableURL = URL(fileURLWithPath: "/usr/bin/env")
            task.arguments = ["swift-format", "format", "-i", tempFile.path]
            try task.run()
            task.waitUntilExit()
            
            if task.terminationStatus == 0 {
                let formatted = try String(contentsOf: tempFile, encoding: .utf8)
                try? FileManager.default.removeItem(at: tempFile)
                return formatted.trimmingCharacters(in: .whitespacesAndNewlines)
            } else {
                print("⚠️ swift-format failed with status \(task.terminationStatus)")
            }
        } catch {
            print("⚠️ Failed to run swift-format: \(error.localizedDescription)")
        }
        
        try? FileManager.default.removeItem(at: tempFile)
        return code // Fallback to original
    }

    private func generateMD(problem: ProblemOutput, code: String) async -> String? {
        let quotedTags = problem.tags.map { "\"\($0)\"" }.joined(separator: ", ")
        
        var cleanLines: [String] = []
        for line in code.components(separatedBy: .newlines) {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            if trimmed.hasPrefix("//") && trimmed.contains("print(") { continue }
            cleanLines.append(line)
        }
        
        let codeWithoutPrints = cleanLines.joined(separator: "\n")
        let formattedCode = formatCode(code: codeWithoutPrints)
        
        print("🤖 Generating AI Summary for \(problem.title)...")
        guard let generatedNotes = await generateNotesUsingAI(code: formattedCode) else {
            return nil
        }
        
        let escapedNotes: String
        if let data = try? JSONEncoder().encode(generatedNotes), let stringified = String(data: data, encoding: .utf8) {
            escapedNotes = stringified
        } else {
            escapedNotes = "\"\""
        }
        
        let header = """
        ---
        id: \(problem.id)
        title: "\(problem.title)"
        category: "\(problem.category)"
        difficulty: "\(problem.difficulty)"
        tags: [\(quotedTags)]
        leetcodeUrl: "\(problem.leetcodeUrl)"
        notes: \(escapedNotes)
        ---
        
        ```swift
        \(formattedCode)
        ```
        """
        return header
    }

    private func saveToJSON(data: FinalOutput) {
        let encoder = JSONEncoder(); encoder.outputFormatting = .prettyPrinted
        if let encoded = try? encoder.encode(data) { try? encoded.write(to: URL(fileURLWithPath: jsonFileName)) }
    }

    private func loadExistingJSON() -> FinalOutput {
        guard let data = try? Data(contentsOf: URL(fileURLWithPath: jsonFileName)),
              let output = try? JSONDecoder().decode(FinalOutput.self, from: data) else { return FinalOutput(problems: []) }
        return output
    }

    private func saveMarkdownFile(path: String, content: String) {
        let url = URL(fileURLWithPath: path)
        let dir = url.deletingLastPathComponent()
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        try? content.write(to: url, atomically: true, encoding: .utf8)
    }

    private func fetchLatestSwiftAcceptedId(slug: String) async -> String? {
        let query = "query submissionList($questionSlug: String!) { submissionList(offset: 0, limit: 20, questionSlug: $questionSlug) { submissions { id statusDisplay lang } } }"
        let body: [String: Any] = ["query": query, "variables": ["questionSlug": slug]]
        guard let data = await performPost(body: body),
              let res = try? JSONDecoder().decode(SubmissionListResponse.self, from: data) else { return nil }
        return res.data.submissionList.submissions.first(where: { $0.statusDisplay == "Accepted" && $0.lang == "swift" })?.id
    }

    private func fetchSubmissionCode(id: String) async -> String? {
        let query = "query submissionDetails($submissionId: Int!) { submissionDetails(submissionId: $submissionId) { code } }"
        let body: [String: Any] = ["query": query, "variables": ["submissionId": Int(id) ?? 0]]
        guard let data = await performPost(body: body),
              let res = try? JSONDecoder().decode(SubmissionDetailsResponse.self, from: data) else { return nil }
        return res.data.submissionDetails.code
    }
}

// MARK: - Run Block
let exporter = LeetCodeExporter(
    session: "", 
    csrf: "",
    // provider: .gemini(apiKey: "")
    provider: .claude(apiKey: "")
    // provider: .localQwen(endpoint: "localhost:11434/v1/chat/completions")
)
Task {
    // 1. Refresh the master list first
    // await exporter.syncAllQuestions()
    
    // 2. Process a batch of 20 (Fetch code + generate MD + summary)
    // await exporter.processBatchQueuedProblems(batchSize: 20)
    
    // 3. Independent run to only generate summaries for existing queued MD files
    await exporter.generateSummariesOnly(batchSize: 1)
    
    exit(0)
}

RunLoop.main.run()
