import React, { useState } from 'react';

// Tree: 1→(2,3), 2→(4,5), 3→(null,6)
//        1
//       / \
//      2   3
//     / \   \
//    4   5   6

interface NodeDef { id: number; x: number; y: number; left?: number; right?: number; }

const NODES: NodeDef[] = [
  { id: 1, x: 280, y: 30,  left: 2,  right: 3  },
  { id: 2, x: 160, y: 110, left: 4,  right: 5  },
  { id: 3, x: 400, y: 110,           right: 6  },
  { id: 4, x:  80, y: 195 },
  { id: 5, x: 240, y: 195 },
  { id: 6, x: 470, y: 195 },
];

const EDGES = NODES.flatMap(n => {
  const es = [];
  if (n.left  !== undefined) es.push({ from: n.id, to: n.left  });
  if (n.right !== undefined) es.push({ from: n.id, to: n.right });
  return es;
});

const TRAVERSALS: {
  name: string;
  order: number[];
  color: string;
  note: string;
  code: string;
}[] = [
  {
    name: 'Inorder (L → Root → R)',
    order: [4, 2, 5, 1, 3, 6],
    color: '#6366f1',
    note: 'Left subtree → visit root → right subtree. For a BST, inorder produces elements in sorted ascending order.',
    code: 'func inorder(_ root: TreeNode?) {\n  guard let n = root else { return }\n  inorder(n.left)\n  visit(n)        // ← root in middle\n  inorder(n.right)\n}',
  },
  {
    name: 'Preorder (Root → L → R)',
    order: [1, 2, 4, 5, 3, 6],
    color: '#22c55e',
    note: 'Visit root first, then traverse left and right. Useful for cloning a tree or serialisation — you see parents before children.',
    code: 'func preorder(_ root: TreeNode?) {\n  guard let n = root else { return }\n  visit(n)        // ← root first\n  preorder(n.left)\n  preorder(n.right)\n}',
  },
  {
    name: 'Postorder (L → R → Root)',
    order: [4, 5, 2, 6, 3, 1],
    color: '#f59e0b',
    note: 'Left and right subtrees before the root. Used when you must process children before their parent — deleting a tree, computing subtree sizes.',
    code: 'func postorder(_ root: TreeNode?) {\n  guard let n = root else { return }\n  postorder(n.left)\n  postorder(n.right)\n  visit(n)        // ← root last\n}',
  },
  {
    name: 'BFS / Level Order',
    order: [1, 2, 3, 4, 5, 6],
    color: '#ec4899',
    note: 'Process nodes level by level using a queue. Guarantees the shortest path in an unweighted tree. Used for level-order traversal and right-side view.',
    code: 'var queue = [root!], front = 0\nwhile front < queue.count {\n  let n = queue[front]; front += 1\n  visit(n)\n  if let l = n.left  { queue.append(l) }\n  if let r = n.right { queue.append(r) }\n}',
  },
];

const nodeMap = new Map(NODES.map(n => [n.id, n]));

export default function BinaryTreeTraversalDiagram() {
  const [tIdx, setTIdx] = useState(0);
  const [step, setStep] = useState(0);

  const t = TRAVERSALS[tIdx];
  // Nodes visited so far at this step
  const visitedSet = new Set(t.order.slice(0, step));
  const currentNode = step > 0 && step <= t.order.length ? t.order[step - 1] : null;

  const maxStep = t.order.length;

  const handleTraversalChange = (idx: number) => {
    setTIdx(idx);
    setStep(0);
  };

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>Binary Tree Traversals</div>

      {/* Traversal selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {TRAVERSALS.map((tr, i) => (
          <button key={i} onClick={() => handleTraversalChange(i)}
            style={{
              padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: tIdx === i ? tr.color : '#1f2937',
              color: tIdx === i ? '#fff' : '#6b7280',
              fontFamily: 'monospace', fontSize: 12,
            }}>{tr.name}</button>
        ))}
      </div>

      {/* Tree SVG */}
      <svg width="100%" viewBox="0 0 560 240" style={{ display: 'block', marginBottom: 16 }}>
        {/* Edges */}
        {EDGES.map(e => {
          const from = nodeMap.get(e.from)!;
          const to   = nodeMap.get(e.to)!;
          const bothVisited = visitedSet.has(e.from) && visitedSet.has(e.to);
          return (
            <line key={`${e.from}-${e.to}`}
              x1={from.x} y1={from.y + 18} x2={to.x} y2={to.y - 18}
              stroke={bothVisited ? t.color : '#374151'}
              strokeWidth={bothVisited ? 2 : 1}
            />
          );
        })}

        {/* Order labels */}
        {t.order.map((id, idx) => {
          if (idx >= step) return null;
          const n = nodeMap.get(id)!;
          return (
            <text key={`lbl-${id}`} x={n.x + 20} y={n.y - 10}
              fontSize={10} fill={t.color} fontFamily="monospace">#{idx + 1}</text>
          );
        })}

        {/* Nodes */}
        {NODES.map(n => {
          const visited = visitedSet.has(n.id);
          const current = n.id === currentNode;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={18}
                fill={current ? t.color : visited ? '#1e2030' : '#1f2937'}
                stroke={current ? '#fff' : visited ? t.color : '#374151'}
                strokeWidth={current ? 3 : visited ? 2 : 1}
              />
              <text x={n.x} y={n.y + 5} textAnchor="middle"
                fontSize={14} fill={current ? '#fff' : visited ? t.color : '#6b7280'}
                fontFamily="monospace" fontWeight={current ? 700 : 400}>
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Visit order display */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Visit order:</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          {t.order.map((id, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                width: 32, height: 32, borderRadius: 6,
                background: idx < step ? (idx === step - 1 ? t.color : '#1f2937') : '#111827',
                border: `2px solid ${idx < step ? t.color : '#374151'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                color: idx < step ? (idx === step - 1 ? '#fff' : t.color) : '#374151',
              }}>{id}</div>
              {idx < t.order.length - 1 && (
                <span style={{ color: '#4b5563', fontSize: 12 }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Code */}
      <div style={{
        background: '#0d1117', borderRadius: 8, padding: '10px 14px',
        fontSize: 12, color: '#c9d1d9', lineHeight: 1.7, marginBottom: 12,
        whiteSpace: 'pre',
      }}>{t.code}</div>

      {/* Note */}
      <div style={{
        background: '#1f2937', borderRadius: 8, padding: '10px 14px',
        fontSize: 13, color: '#d1d5db', lineHeight: 1.5, marginBottom: 16,
        borderLeft: `3px solid ${t.color}`,
      }}>{t.note}</div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === 0 ? '#374151' : t.color, color: step === 0 ? '#6b7280' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          ← Prev</button>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Node {step} / {maxStep}</span>
        <button onClick={() => setStep(s => Math.min(maxStep, s + 1))} disabled={step === maxStep}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === maxStep ? '#374151' : t.color, color: step === maxStep ? '#6b7280' : '#fff', cursor: step === maxStep ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          Next →</button>
      </div>
    </div>
  );
}
