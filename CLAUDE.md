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
6. Update leetcode_solved.json (mark as done, add files, set submittedAt)

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
Read the target MDX file, identify which callouts from the table above are missing, and add them. Do not restructure sections or remove existing content.

## Categories
sliding-window, linked-list, trie, backtracking, dp-multidimension, dp-1d,
heap, binary-search, monotonic-stack, intervals, bit-manipulation,
binary-search-tree, binary-tree, graph, stack, queue, hash-map-set,
two-pointers, greedy, prefix-sum, matrix, array, math, string, general