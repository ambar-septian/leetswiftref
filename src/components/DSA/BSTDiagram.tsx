import React, { useState } from 'react';

// BST:        4
//            / \
//           2   6
//          / \ / \
//         1  3 5  7
// Shows: BST property + search path + inorder = sorted

interface NodeDef { id: number; x: number; y: number; left?: number; right?: number; }

const NODES: NodeDef[] = [
  { id: 4, x: 260, y: 30, left: 2, right: 6 },
  { id: 2, x: 140, y: 110, left: 1, right: 3 },
  { id: 6, x: 380, y: 110, left: 5, right: 7 },
  { id: 1, x:  70, y: 195 },
  { id: 3, x: 210, y: 195 },
  { id: 5, x: 310, y: 195 },
  { id: 7, x: 450, y: 195 },
];

const EDGES = NODES.flatMap(n => {
  const es = [];
  if (n.left  !== undefined) es.push({ from: n.id, to: n.left  });
  if (n.right !== undefined) es.push({ from: n.id, to: n.right });
  return es;
});

const STEPS: {
  label: string;
  highlightNodes: number[];
  highlightEdges: [number,number][];
  note: string;
  found?: boolean;
}[] = [
  {
    label: 'BST Property',
    highlightNodes: [4,2,6,1,3,5,7],
    highlightEdges: [],
    note: 'BST invariant: every node in the left subtree is strictly less than the root; every node in the right subtree is strictly greater. This holds recursively for every subtree.',
  },
  {
    label: 'Search for 5 — start at root 4',
    highlightNodes: [4],
    highlightEdges: [],
    note: '5 > 4 → go right. We eliminate the entire left subtree (1, 2, 3) in one step.',
  },
  {
    label: 'Search for 5 — visit 6',
    highlightNodes: [4, 6],
    highlightEdges: [[4,6]],
    note: '5 < 6 → go left. We eliminate the right subtree (7) in one step.',
  },
  {
    label: 'Search for 5 — found!',
    highlightNodes: [4, 6, 5],
    highlightEdges: [[4,6],[6,5]],
    note: '5 == 5 → found. Total comparisons: 3 (height of tree). BST search is O(h) — O(log n) for balanced, O(n) worst case.',
    found: true,
  },
  {
    label: 'Inorder = sorted output',
    highlightNodes: [1,2,3,4,5,6,7],
    highlightEdges: [],
    note: 'Inorder traversal of any BST yields elements in sorted ascending order: 1, 2, 3, 4, 5, 6, 7. This property links BST with sorting and is the basis for the kth-smallest algorithm.',
  },
];

const accent = '#6366f1';
const green = '#22c55e';
const nodeMap = new Map(NODES.map(n => [n.id, n]));

export default function BSTDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  const hlNodeSet = new Set(s.highlightNodes);
  const hlEdgeSet = new Set(s.highlightEdges.map(([a,b]) => `${a}-${b}`));

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        Binary Search Tree — Property and Search
      </div>

      <svg width="100%" viewBox="0 0 520 240" style={{ display: 'block', marginBottom: 16 }}>
        {/* BST range labels */}
        <text x={10} y={220} fontSize={10} fill="#4b5563" fontFamily="monospace">{"left subtree < root"}</text>
        <text x={310} y={220} fontSize={10} fill="#4b5563" fontFamily="monospace">{"root < right subtree"}</text>

        {/* Edges */}
        {EDGES.map(e => {
          const from = nodeMap.get(e.from)!;
          const to   = nodeMap.get(e.to)!;
          const key  = `${e.from}-${e.to}`;
          const hl   = hlEdgeSet.has(key);
          return (
            <line key={key}
              x1={from.x} y1={from.y + 18} x2={to.x} y2={to.y - 18}
              stroke={hl ? accent : '#374151'}
              strokeWidth={hl ? 2.5 : 1}
            />
          );
        })}

        {/* Left/right labels on root edges */}
        <text x={182} y={74} fontSize={10} fill="#4b5563" fontFamily="monospace">L&lt;</text>
        <text x={322} y={74} fontSize={10} fill="#4b5563" fontFamily="monospace">&gt;R</text>

        {/* Nodes */}
        {NODES.map(n => {
          const hl = hlNodeSet.has(n.id);
          const isCurrent = hl && s.highlightNodes[s.highlightNodes.length - 1] === n.id && !s.found && step > 0;
          const isFound = s.found && n.id === 5 && hl;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={18}
                fill={isFound ? '#064e3b' : isCurrent ? '#1e1b4b' : hl ? '#1f2937' : '#111827'}
                stroke={isFound ? green : isCurrent ? accent : hl ? '#6366f1' : '#374151'}
                strokeWidth={isCurrent || isFound ? 2.5 : 1.5}
              />
              <text x={n.x} y={n.y + 5} textAnchor="middle"
                fontSize={14} fontWeight={700}
                fill={isFound ? '#86efac' : isCurrent ? '#a5b4fc' : hl ? '#d1d5db' : '#4b5563'}
                fontFamily="monospace">
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Inorder sequence for last step */}
      {step === 4 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Inorder output (sorted):</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4,5,6,7].map((v,i) => (
              <React.Fragment key={v}>
                <div style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: '#064e3b', border: `2px solid ${green}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#86efac',
                }}>{v}</div>
                {i < 6 && <span style={{ color: '#4b5563', fontSize: 12 }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div style={{
        background: '#1f2937', borderRadius: 8, padding: '10px 14px',
        fontSize: 13, color: '#d1d5db', lineHeight: 1.5, marginBottom: 16,
        borderLeft: `3px solid ${s.found ? green : accent}`,
      }}>{s.note}</div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === 0 ? '#374151' : accent, color: step === 0 ? '#6b7280' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          ← Prev</button>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Step {step + 1} / {STEPS.length} — {s.label}</span>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === STEPS.length - 1 ? '#374151' : accent, color: step === STEPS.length - 1 ? '#6b7280' : '#fff', cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          Next →</button>
      </div>
    </div>
  );
}
