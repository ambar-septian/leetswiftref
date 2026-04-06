#!/usr/bin/env swift

// generate.swift — DSA Reference Site Generator
// Usage:
//   swift generate.swift          (process up to 10 queued problems)
//   swift generate.swift 5        (process up to 5 queued problems)
//   swift generate.swift --dry    (preview which problems would be processed)
//
// Requirements:
//   - ANTHROPIC_API_KEY environment variable set
//   - leetcode_solved.json in the current directory
//   - queue/ folder with .md files named [id].md

import Foundation

// ─────────────────────────────────────────────
// MARK: - Config
// ─────────────────────────────────────────────

let SONNET = "claude-sonnet-4-20250514"
let OPUS   = "claude-opus-4-20250514"

/// Problems in this list always use Opus regardless of difficulty or category.
/// Add LeetCode IDs here when a problem is tricky but not Hard/DP/Backtracking.
let CUSTOM_OPUS_FILTER: [Int] = [
    // e.g. 138, 295, 41
]

let OPUS_CATEGORIES: Set<String> = ["dp", "backtracking"]
let OPUS_DIFFICULTIES: Set<String> = ["Hard"]

let SYSTEM_PROMPT = """
You are generating Docusaurus MDX pages for a personal DSA reference site built in Swift.
Output ONLY the requested files with no explanation, preamble, or markdown fences around the file blocks.

Follow ALL of these conventions exactly:

COMPONENTS TO USE (already exist in src/components/DSA/):
- ProblemHeader — number, title, difficulty, pattern, tags, leetcodeUrl props
- SectionHeader — n (section number) and title props
- Callout — type (green/cyan/amber/purple/red) and label props
- StepList + StepItem — title inline with description as children
- ComplexityTable — rows array with approach/time/space/note/highlight
- CommonPitfalls — pitfalls array with title/body/fix strings
- PatternFlowchart — steps array with question/verdict/reason, plus answer prop
- [Title]Diagram.tsx — problem-specific visual (only for graph/tree/matrix problems)

SECTION STRUCTURE (always 8 sections using SectionHeader):
1. Problem Overview — prose + Callout(amber, "Key Constraint") + diagram if visual
2. Intuition — The Why — prose + Callout(cyan, "Core Insight") + key pattern trigger paragraph + Callout(purple, "Why [approach] works")
3. Pattern Classification — prose + PatternFlowchart + Callout(green, "Rule of Thumb")
4. Example Walkthrough — input/output line + WalkthroughDiagram (or prose steps if no diagram)
5. Step-by-Step Logic — StepList with StepItems, title inline with body
6. Swift Implementation — code block + Callout(green, "Swift Notes") + optional Union-Find/alternative
7. Time and Space Complexity — Callout(cyan, time) + Callout(green, space) + ComplexityTable + Callout(amber, tradeoffs)
8. Common Pitfalls — CommonPitfalls component with 4-5 pitfalls

MDX RULES (critical — violations cause build errors):
- hide_table_of_contents: true in frontmatter always
- NO curly braces {} inside JSX string props (use plain text instead)
- NO HTML entities (&amp; &lt; &gt;) inside JSX string props
- NO angle brackets < > inside JSX string props
- Curly braces and HTML ARE allowed inside JSX children (between open/close tags)
- Import each component individually: import X from '@site/src/components/DSA/X'

CONTENT QUALITY:
- Intuition section must include the "key pattern trigger" paragraph explaining when to recognise this pattern
- Step-by-step must explain the WHY behind each step, not just what the code does
- Complexity must explain why you cannot do better than the given complexity
- Common pitfalls must be specific to this problem, not generic advice
- All prose should be written as if explaining to your future self 6 months later

DIAGRAM TSX RULES:
- Only generate if the problem is graph, tree, or matrix-based
- Use inline styles only (no CSS modules)
- Use var(--dsa-accent), var(--dsa-accent2), var(--dsa-surface) etc for colors
- Must be a default export React functional component named [Title]Diagram

Return your response in this EXACT format with no other text:
===MDX===
[complete .mdx file]
===TSX===
[complete diagram .tsx file, or the single word NONE if not needed]
"""

// ─────────────────────────────────────────────
// MARK: - Models
// ─────────────────────────────────────────────

struct Problem: Codable {
    var id: Int
    var title: String
    var slug: String
    var category: String
    var difficulty: String
    var leetcodeUrl: String
    var tags: [String]
    var status: String           // queued | processing | done | error
    var files: [String]
    var submittedAt: String?
    var errorMessage: String?
}

struct Tracker: Codable {
    var problems: [Problem]
}

struct QueueFile {
    var id: Int
    var title: String
    var category: String
    var difficulty: String
    var leetcodeUrl: String
    var tags: [String]
    var notes: String
    var solution: String
}

// ─────────────────────────────────────────────
// MARK: - Model Selection
// ─────────────────────────────────────────────

func selectModel(id: Int, difficulty: String, category: String) -> String {
    if CUSTOM_OPUS_FILTER.contains(id) {
        print("    [opus] custom filter match — id \(id)")
        return OPUS
    }
    if OPUS_DIFFICULTIES.contains(difficulty) {
        print("    [opus] difficulty: \(difficulty)")
        return OPUS
    }
    if OPUS_CATEGORIES.contains(category) {
        print("    [opus] category: \(category)")
        return OPUS
    }
    print("    [sonnet] standard problem")
    return SONNET
}

// ─────────────────────────────────────────────
// MARK: - File Parsing
// ─────────────────────────────────────────────

func parseQueueFile(path: String) throws -> QueueFile {
    let content = try String(contentsOfFile: path, encoding: .utf8)

    // Extract frontmatter between --- delimiters
    let parts = content.components(separatedBy: "---")
    guard parts.count >= 3 else {
        throw NSError(domain: "ParseError", code: 1,
            userInfo: [NSLocalizedDescriptionKey: "Invalid frontmatter in \(path)"])
    }

    let frontmatter = parts[1]
    // Everything after the second --- is the solution
    let body = parts.dropFirst(2).joined(separator: "---").trimmingCharacters(in: .whitespacesAndNewlines)

    func extractField(_ key: String, from text: String) -> String {
        let lines = text.components(separatedBy: "\n")
        for line in lines {
            if line.hasPrefix("\(key):") {
                return line
                    .dropFirst("\(key):".count)
                    .trimmingCharacters(in: .whitespaces)
                    .trimmingCharacters(in: CharacterSet(charactersIn: "\""))
            }
        }
        return ""
    }

    func extractTags(from text: String) -> [String] {
        guard let range = text.range(of: "tags: [") else { return [] }
        let afterKey = String(text[range.upperBound...])
        guard let end = afterKey.firstIndex(of: "]") else { return [] }
        let inner = String(afterKey[..<end])
        return inner.components(separatedBy: ",")
            .map { $0.trimmingCharacters(in: .whitespaces)
                      .trimmingCharacters(in: CharacterSet(charactersIn: "\"")) }
            .filter { !$0.isEmpty }
    }

    // Extract Swift code block
    var solution = body
    if let codeStart = body.range(of: "```swift\n"),
       let codeEnd = body.range(of: "\n```", range: codeStart.upperBound..<body.endIndex) {
        solution = String(body[codeStart.upperBound..<codeEnd.lowerBound])
    }

    let idStr = extractField("id", from: frontmatter)
    guard let id = Int(idStr) else {
        throw NSError(domain: "ParseError", code: 2,
            userInfo: [NSLocalizedDescriptionKey: "Invalid id '\(idStr)' in \(path)"])
    }

    return QueueFile(
        id:          id,
        title:       extractField("title", from: frontmatter),
        category:    extractField("category", from: frontmatter),
        difficulty:  extractField("difficulty", from: frontmatter),
        leetcodeUrl: extractField("leetcodeUrl", from: frontmatter),
        tags:        extractTags(from: frontmatter),
        notes:       extractField("notes", from: frontmatter),
        solution:    solution
    )
}

// ─────────────────────────────────────────────
// MARK: - Tracker I/O
// ─────────────────────────────────────────────

func loadTracker(path: String) throws -> Tracker {
    let data = try Data(contentsOf: URL(fileURLWithPath: path))
    return try JSONDecoder().decode(Tracker.self, from: data)
}

func saveTracker(_ tracker: Tracker, path: String) throws {
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    let data = try encoder.encode(tracker)
    try data.write(to: URL(fileURLWithPath: path))
}

func slugify(_ title: String) -> String {
    title.lowercased()
         .replacingOccurrences(of: " ", with: "-")
         .filter { $0.isLetter || $0.isNumber || $0 == "-" }
}

// ─────────────────────────────────────────────
// MARK: - Anthropic API Call
// ─────────────────────────────────────────────

func callClaude(model: String, prompt: String, apiKey: String) throws -> String {
    let url = URL(string: "https://api.anthropic.com/v1/messages")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

    let body: [String: Any] = [
        "model": model,
        "max_tokens": 8000,
        "system": SYSTEM_PROMPT,
        "messages": [["role": "user", "content": prompt]]
    ]

    request.httpBody = try JSONSerialization.data(withJSONObject: body)

    var result: String = ""
    var requestError: Error?
    let semaphore = DispatchSemaphore(value: 0)

    URLSession.shared.dataTask(with: request) { data, response, error in
        defer { semaphore.signal() }
        if let error = error { requestError = error; return }
        guard let data = data else { return }

        if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
           let content = json["content"] as? [[String: Any]],
           let first = content.first,
           let text = first["text"] as? String {
            result = text
        } else {
            // Surface API error message if present
            if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let errMsg = json["error"] as? [String: Any],
               let msg = errMsg["message"] as? String {
                requestError = NSError(domain: "APIError", code: 0,
                    userInfo: [NSLocalizedDescriptionKey: msg])
            }
        }
    }.resume()

    semaphore.wait()
    if let error = requestError { throw error }
    return result
}

// ─────────────────────────────────────────────
// MARK: - File Generation
// ─────────────────────────────────────────────

func generateFiles(for queue: QueueFile, apiKey: String) throws -> (mdx: String, tsx: String?) {
    let model = selectModel(id: queue.id, difficulty: queue.difficulty, category: queue.category)

    let prompt = """
    Generate the DSA reference page for this problem:

    ID: \(queue.id)
    Title: \(queue.title)
    Difficulty: \(queue.difficulty)
    Category: \(queue.category)
    Tags: \(queue.tags.joined(separator: ", "))
    LeetCode URL: \(queue.leetcodeUrl)
    Notes: \(queue.notes)

    Swift Solution:
    ```swift
    \(queue.solution)
    ```
    """

    print("    calling \(model == OPUS ? "Opus" : "Sonnet")...")
    let response = try callClaude(model: model, prompt: prompt, apiKey: apiKey)

    guard response.contains("===MDX===") else {
        throw NSError(domain: "ParseError", code: 3,
            userInfo: [NSLocalizedDescriptionKey: "Response missing ===MDX=== marker"])
    }

    let mdxPart = response
        .components(separatedBy: "===TSX===")[0]
        .replacingOccurrences(of: "===MDX===", with: "")
        .trimmingCharacters(in: .whitespacesAndNewlines)

    var tsxPart: String? = nil
    if response.contains("===TSX===") {
        let raw = response
            .components(separatedBy: "===TSX===")[1]
            .trimmingCharacters(in: .whitespacesAndNewlines)
        if raw.uppercased() != "NONE" {
            tsxPart = raw
        }
    }

    return (mdx: mdxPart, tsx: tsxPart)
}

func saveFiles(mdx: String, tsx: String?, queue: QueueFile) throws -> [String] {
    var savedFiles: [String] = []
    let slug = slugify(queue.title)

    // Save MDX
    let mdxDir = "docs/\(queue.category)"
    try FileManager.default.createDirectory(
        atPath: mdxDir, withIntermediateDirectories: true)
    let mdxPath = "\(mdxDir)/\(queue.id)-\(slug).mdx"
    try mdx.write(toFile: mdxPath, atomically: true, encoding: .utf8)
    savedFiles.append(mdxPath)
    print("    ✓ \(mdxPath)")

    // Save TSX diagram if present
    if let tsx = tsx {
        let tsxDir = "src/components/DSA"
        let titlePascal = queue.title
            .components(separatedBy: " ")
            .map { $0.prefix(1).uppercased() + $0.dropFirst() }
            .joined()
        let tsxPath = "\(tsxDir)/\(titlePascal)Diagram.tsx"
        try tsx.write(toFile: tsxPath, atomically: true, encoding: .utf8)
        savedFiles.append(tsxPath)
        print("    ✓ \(tsxPath)")
    }

    return savedFiles
}

// ─────────────────────────────────────────────
// MARK: - Sidebar Rebuilder
// ─────────────────────────────────────────────

func rebuildSidebars(tracker: Tracker) throws {
    let categoryLabels: [String: String] = [
        "graph":          "🕸 Graph",
        "tree":           "🌲 Tree / DFS",
        "dp":             "📊 Dynamic Programming",
        "binary-search":  "🔍 Binary Search",
        "two-pointers":   "↔️ Two Pointers",
        "sliding-window": "🪟 Sliding Window",
        "hash-map-set":   "🗂 Hash Map / Set",
        "heap":           "🏔 Heap / Priority Queue",
        "backtracking":   "🔀 Backtracking",
        "string":         "🔤 String",
        "math":           "➗ Math",
        "stack":          "📚 Stack",
    ]

    // Group done problems by category, sorted by id
    var grouped: [String: [Problem]] = [:]
    for problem in tracker.problems where problem.status == "done" {
        grouped[problem.category, default: []].append(problem)
    }
    for key in grouped.keys {
        grouped[key]?.sort { $0.id < $1.id }
    }

    let categoryOrder = [
        "graph", "tree", "dp", "binary-search", "two-pointers",
        "sliding-window", "hash-map-set", "heap", "backtracking",
        "string", "math", "stack"
    ]

    var categories: [String] = []
    for cat in categoryOrder {
        guard let problems = grouped[cat], !problems.isEmpty else { continue }
        let label = categoryLabels[cat] ?? cat
        let items = problems
            .map { "{ type: 'doc', id: '\($0.category)/\($0.id)-\(slugify($0.title))', label: '\($0.id). \($0.title)' }" }
            .joined(separator: ",\n        ")
        categories.append("""
        {
          type: 'category',
          label: '\(label)',
          items: [
            \(items)
          ],
        }
        """)
    }

    let sidebar = """
    import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

    const sidebars: SidebarsConfig = {
      dsa: [
        \(categories.joined(separator: ",\n    "))
      ],
    };

    export default sidebars;
    """

    try sidebar.write(toFile: "sidebars.ts", atomically: true, encoding: .utf8)
    print("  ✓ sidebars.ts rebuilt")
}

// ─────────────────────────────────────────────
// MARK: - Git Push
// ─────────────────────────────────────────────

func gitPush(problemIds: [Int]) throws {
    let today = ISO8601DateFormatter().string(from: Date()).prefix(10)
    let ids = problemIds.map { "#\($0)" }.joined(separator: ", ")
    let message = "Add problems: \(ids) [\(today)]"

    for args in [["add", "."], ["commit", "-m", message], ["push", "origin", "main"]] {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/usr/bin/git")
        process.arguments = args
        try process.run()
        process.waitUntilExit()
        if process.terminationStatus != 0 {
            throw NSError(domain: "GitError", code: Int(process.terminationStatus),
                userInfo: [NSLocalizedDescriptionKey: "git \(args.joined(separator: " ")) failed"])
        }
    }
    print("  ✓ Pushed — GitHub Actions deploy triggered")
}

// ─────────────────────────────────────────────
// MARK: - Status Report
// ─────────────────────────────────────────────

func printStatus(tracker: Tracker) {
    let done      = tracker.problems.filter { $0.status == "done" }.count
    let queued    = tracker.problems.filter { $0.status == "queued" }.count
    let errors    = tracker.problems.filter { $0.status == "error" }.count
    let total     = tracker.problems.count

    print("\n── Status ──────────────────────")
    print("  Total:      \(total)")
    print("  Done:       \(done)")
    print("  Queued:     \(queued)")
    print("  Errors:     \(errors)")
    print("  Remaining:  \(total - done)")
    print("────────────────────────────────\n")
}

// ─────────────────────────────────────────────
// MARK: - Main
// ─────────────────────────────────────────────

let args = CommandLine.arguments
let isDryRun = args.contains("--dry")
let limit = args.dropFirst()
    .compactMap { Int($0) }
    .first ?? 10

guard let apiKey = ProcessInfo.processInfo.environment["ANTHROPIC_API_KEY"],
      !apiKey.isEmpty else {
    print("✗ ANTHROPIC_API_KEY environment variable not set")
    exit(1)
}

let trackerPath = "leetcode_solved.json"

var tracker: Tracker
do {
    tracker = try loadTracker(path: trackerPath)
} catch {
    print("✗ Could not load \(trackerPath): \(error.localizedDescription)")
    exit(1)
}

let queued = tracker.problems.filter { $0.status == "queued" }.prefix(limit)

if queued.isEmpty {
    print("✓ No problems queued.")
    printStatus(tracker: tracker)
    exit(0)
}

print("Processing \(queued.count) problem(s)...\n")

if isDryRun {
    print("── Dry run ─────────────────────")
    for problem in queued {
        let model = selectModel(id: problem.id, difficulty: problem.difficulty, category: problem.category)
        print("  [\(problem.id)] \(problem.title) → \(model == OPUS ? "Opus" : "Sonnet")")
    }
    print("────────────────────────────────")
    exit(0)
}

var doneIds: [Int] = []

for i in tracker.problems.indices {
    guard tracker.problems[i].status == "queued",
          doneIds.count < limit else { continue }

    var problem = tracker.problems[i]
    let queuePath = "queue/\(problem.id).md"

    print("[\(problem.id)] \(problem.title)")

    // Parse queue file
    guard let queueFile = try? parseQueueFile(path: queuePath) else {
        print("  ✗ Could not parse \(queuePath) — skipping")
        tracker.problems[i].status = "error"
        tracker.problems[i].errorMessage = "Queue file missing or invalid"
        try? saveTracker(tracker, path: trackerPath)
        continue
    }

    // Mark as processing
    tracker.problems[i].status = "processing"
    try? saveTracker(tracker, path: trackerPath)

    do {
        let (mdx, tsx) = try generateFiles(for: queueFile, apiKey: apiKey)
        let files = try saveFiles(mdx: mdx, tsx: tsx, queue: queueFile)

        tracker.problems[i].status = "done"
        tracker.problems[i].files = files
        tracker.problems[i].submittedAt = String(ISO8601DateFormatter().string(from: Date()).prefix(10))
        tracker.problems[i].slug = slugify(queueFile.title)
        doneIds.append(problem.id)
        print("  ✓ Done (\(files.count) file(s))\n")

    } catch {
        tracker.problems[i].status = "error"
        tracker.problems[i].errorMessage = error.localizedDescription
        print("  ✗ Error: \(error.localizedDescription)\n")
    }

    try? saveTracker(tracker, path: trackerPath)
}

// Rebuild sidebars
if !doneIds.isEmpty {
    try rebuildSidebars(tracker: tracker)
}

// Git push
if !doneIds.isEmpty {
    print("\nPushing to GitHub...")
    do {
        try gitPush(problemIds: doneIds)
    } catch {
        print("  ⚠ Git push failed: \(error.localizedDescription)")
        print("  Run manually: git add . && git commit -m 'Add problems' && git push")
    }
}

printStatus(tracker: tracker)