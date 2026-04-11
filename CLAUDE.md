# DSA Reference Site — Claude Code Instructions

## Project
Docusaurus DSA reference site. Swift solutions. Personal reference for LeetCode problems.

## When processing queue files:
1. Read configs/leetcode_solved.json — find all status: "queued" problems
2. For each, read queue/[id].md
3. Generate docs/[category]/[id]-[slug].mdx
4. Generate src/components/DSA/[Title]Diagram.tsx (graph/tree/matrix/trie/linked-list/backtracking only)
   - linked-list diagrams: place in Examples section to visualise node structure
   - backtracking diagrams: place in Approach section to visualise the decision/recursion tree
5. Update sidebars.ts (rebuild from all done problems grouped by category)
6. Update theory pages for the problem's category:
   a. docs/[category]/index.mdx — append the new problem to its `<ProblemList>` array
   b. docs/[category]/[algorithm].mdx — append the new problem to the Related Problems `<ProblemList>` on the relevant algorithm sub-page
      - If multiple algorithm sub-pages exist for the category, add to the one whose algorithm the problem uses
      - If no algorithm sub-page exists yet, skip this step
7. Update leetcode_solved.json (mark as done, add files, set submittedAt)

## Model selection
- Use best judgment for content quality — you have full context of all conventions

## Components available (src/components/DSA/)
ProblemHeader, SectionHeader, Callout, StepList, StepItem,
ComplexityTable, CommonPitfalls, PatternFlowchart, WalkthroughDiagram

## Problem Overview Section
- Write the problem statement as thoroughly as the official LeetCode description
- Include the full problem definition and all constraints (no examples here — those go in the Examples section)
- Use `#### Example 1`, `#### Example 2` etc. as sub-headings inside the Examples section
- If you are not confident about the exact constraints, note that the user should verify
- Never summarise or shorten — the overview should be complete enough that
  the user never needs to open LeetCode just to recall what the problem asks

## Always follow
- hide_table_of_contents: true in frontmatter
- No {} &amp; &lt; &gt; in JSX string props
- 9 sections with SectionHeader in this order: Problem Overview, Examples, Pattern Recognition, Approach, Interactive Walkthrough, Step-by-Step Solution, Code Implementation, Complexity Analysis, Common Pitfalls
- LeetCode link in ProblemHeader
- Common Pitfalls always last section
- For problems in the `heap` category, replace any `<Callout type="info" label="Swift Collections Heap">` with a `<Callout type="green" label="Swift Notes">` that covers both the swift-collections Heap API note and Swift-specific idioms (see Callout conventions below)

## Callout conventions (required in every page)
Use `<Callout>` from `@site/src/components/DSA`. Insert these in the sections below — do not remove existing content, only add where missing.

| Section | type | label | Content |
|---|---|---|---|
| Problem Overview | `amber` | `Key Constraint` | The single most critical constraint that shapes the solution (symmetry, bounds, value guarantees, edge-case gotcha) |
| Pattern Recognition | `green` | `Rule of Thumb` | One memorable trigger sentence for recognising this pattern — place after PatternFlowchart |
| Approach | `cyan` | `Core Insight` | 2–3 sentences: the core algorithm insight / mental model (flood-fill, sliding window shrink, etc.) — place at top of section |
| Approach | `purple` | `[A] vs [B] — which to choose?` | Only when the page shows multiple algorithms. Explain when to prefer each and why |
| Code Implementation | `green` | `Swift Notes` | Swift-specific idioms in the solution: nested closures, guard short-circuit order, value-type semantics, etc. — place after the primary code block |
| Complexity Analysis | `cyan` | `Time Complexity — O(...)` | One-paragraph explanation of *why* the complexity is what it is — place before ComplexityTable |
| Complexity Analysis | `green` | `Space Complexity — O(...)` | One-paragraph explanation — place before ComplexityTable, after Time callout |
| Complexity Analysis | `amber` | `When to prefer [approach]` | Only when multiple approaches exist. Practical trade-off guidance — place after ComplexityTable |

## When asked to "enrich" a page
Read the target MDX file, identify which callouts from the table above are missing, and add them. Do not restructure sections or remove existing content. After saving the file, set `"enriched": true` on that problem's entry in configs/leetcode_solved.json.

## When asked to "enrich next N" (batch enrichment)
1. Read configs/leetcode_solved.json
2. Collect all problems where `status === "done"` and `enriched === false`, take the first N
3. For each: read its MDX file, add missing callouts, save, then set `enriched: true` in the JSON
4. Save leetcode_solved.json once after all N are processed
This lets you run "enrich next 10" repeatedly across sessions — progress is always saved in the JSON.

## Categories
sliding-window, linked-list, trie, backtracking, dp-multidimension, dp-1d,
heap, binary-search, monotonic-stack, intervals, bit-manipulation,
binary-search-tree, binary-tree, graph, stack, queue, hash-map-set,
two-pointers, greedy, prefix-sum, matrix, array, math, string, general

---

## Category theory pages

Each category can have a theory index page with algorithm sub-pages. See `docs/graph/` as the reference implementation.

### When to create theory pages
Create theory pages for any category that has non-trivial algorithmic concepts. All categories in this project qualify — add theory pages when asked.

### File layout
```
docs/[category]/index.mdx          ← category overview page
docs/[category]/[algorithm].mdx    ← one file per distinct algorithm
```

### Splitting algorithms: same page vs separate page
- **Separate sub-page**: algorithms that are distinct data structures or have substantial standalone theory (Union-Find, Dijkstra, Topological Sort, Trie, Segment Tree, Bellman-Ford)
- **Same page**: variants that share the same core mechanism and differ only in a parameter or minor detail (fixed vs dynamic Sliding Window, min-heap vs max-heap Heap, DFS recursive vs iterative)

### Sidebar structure (sidebars.ts)
Replace the category's `generated-index` link with a `doc` link and add a nested "Algorithms" sub-category:
```ts
{
  type: 'category',
  label: '🕸 [Category]',
  link: { type: 'doc', id: '[category]/[category]-index' },  // frontmatter id of index.mdx
  items: [
    {
      type: 'category',
      label: 'Algorithms',
      collapsed: false,
      items: [
        '[category]/[algo-1]',
        '[category]/[algo-2]',
      ],
    },
    '[category]/[problem-slug-1]',
    '[category]/[problem-slug-2]',
    // ... all problem pages
  ],
}
```

### Components for category theory pages
```
CategoryHeader   — emoji + title + description + tags (use on index.mdx)
AlgoCard         — clickable card linking to an algorithm sub-page
AlgoCardGrid     — 2-column grid wrapper for AlgoCards
AlgoPageHeader   — breadcrumb + title + complexity + tags (use on algorithm sub-pages)
ProblemList      — compact linked list of problems (use on both index and sub-pages)
```

Import directly from their files (not the barrel index) in MDX:
```mdx
import CategoryHeader from '@site/src/components/DSA/CategoryHeader';
import AlgoCard from '@site/src/components/DSA/AlgoCard';
import AlgoCardGrid from '@site/src/components/DSA/AlgoCardGrid';
import ProblemList from '@site/src/components/DSA/ProblemList';
import AlgoPageHeader from '@site/src/components/DSA/AlgoPageHeader';
```

### Category index page (index.mdx) structure
Frontmatter: `id: [category]-index`, `title`, `sidebar_label`, `hide_table_of_contents: true`

Sections (use SectionHeader with n=1,2,…):
1. `<CategoryHeader>` — emoji, title, 1–2 sentence description, tags
2. **What is [Category]?** — definition, key properties table (e.g. directed/undirected, weighted/unweighted)
3. **Terminology** — table of key terms and definitions
4. **Visualizations** — one diagram for simple categories; 2+ diagrams for complex ones (e.g. graph shows both `GraphRepresentationDiagram` and `GraphTypesDiagram`)
5. **Algorithm Variants** — `<AlgoCardGrid>` with one `<AlgoCard>` per sub-page (title, description, href, time, space)
6. **Problems** — `<ProblemList>` with all problems in the category

Callouts on index page:
| Section | type | label | Content |
|---|---|---|---|
| What is [Category]? | `amber` | `Key Constraint` | The single most important constraint that shapes which algorithm applies |
| Algorithm Variants | `green` | `Rule of Thumb` | One sentence: how to pick the right algorithm from the list |

### Algorithm sub-page structure
Frontmatter: `id: [algorithm]`, `title`, `sidebar_label`, `hide_table_of_contents: true`

Sections (use SectionHeader with n=1,2,…):
1. `<AlgoPageHeader>` — title, description, category, categoryHref, time, space, tags
2. **Overview** — when to use, what problem it solves
3. **Key Concepts** — terminology table specific to this algorithm
4. **Visualization** — interactive step-through diagram(s); use multiple if the algorithm has distinct variants or phases
5. **Implementation** — primary Swift code template + any variant patterns
6. **Complexity Analysis** — Callout(cyan, Time) + Callout(green, Space) + `<ComplexityTable>`
7. **When to Use** — Callout(green, Rule of Thumb) + decision table comparing this algorithm to alternatives
8. **Related Problems** — `<ProblemList>` of problems in this category that use this algorithm; if none exist yet, show the SectionHeader with a plain text note (do not omit the section)

Callouts on sub-pages:
| Section | type | label | Content |
|---|---|---|---|
| Overview | `cyan` | `Core Insight` | 2–3 sentences on the key algorithmic idea |
| Key Concepts | `amber` | `Key Constraint` | The most critical prerequisite or constraint for correctness (e.g. non-negative weights for Dijkstra) |
| Implementation | `green` | `Swift Notes` | Swift-specific idioms, gotchas, or performance tips |
| When to Use | `purple` | `[A] vs [B] — which to choose?` | Only when 2+ algorithms are compared in the page |
| When to Use | `green` | `Rule of Thumb` | One memorable trigger sentence |

### Visualization guidelines
- **Simple algorithm or single variant**: 1 diagram is sufficient
- **Complex topic or multiple variants**: 2+ diagrams (e.g. graph uses one for adjacency list/matrix representation and one for directed/undirected/connected/disconnected types)
- **Process diagrams** (showing algorithm steps): interactive with Prev/Next buttons and step counter
- **Structural diagrams** (showing data representation): static SVG is fine
- Keep diagram component files in `src/components/DSA/` named `[ConceptName]Diagram.tsx`
- Export new diagram components from `src/components/DSA/index.ts`

### JSX rules for theory pages (same as problem pages)
- No `<`, `>`, `&`, `{`, `}` as literal characters in JSX string props or JSX text content
- Use `&lt;` for `<` and `&gt;` for `>` inside JSX component content (e.g. in Callout body)
- Mathematical expressions like `1 <= n <= 500` inside JSX must be written as `1 &lt;= n &lt;= 500`