import React, { useState } from 'react';

const AMBER = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const ACCENT2 = 'var(--dsa-accent2)';

// BST: [5,3,6,2,4,null,7], key = 3
// Tree layout:
//       5
//      / \
//     3   6
//    / \   \
//   2   4   7

interface NodeDef {
  id: string;
  val: number;
  x: number;
  y: number;
  left?: string;
  right?: string;
}

const tree: NodeDef[] = [
  { id: 'n5',  val: 5,  x: 240, y: 50,  left: 'n3', right: 'n6' },
  { id: 'n3',  val: 3,  x: 130, y: 130, left: 'n2', right: 'n4' },
  { id: 'n6',  val: 6,  x: 350, y: 130,              right: 'n7' },
  { id: 'n2',  val: 2,  x: 80,  y: 210 },
  { id: 'n4',  val: 4,  x: 180, y: 210 },
  { id: 'n7',  val: 7,  x: 400, y: 210 },
];

// After deletion: 3 replaced by inorder successor 4, 4 removed from right subtree
// Result tree: [5,4,6,2,null,null,7]
const treeAfter: NodeDef[] = [
  { id: 'n5',  val: 5,  x: 240, y: 50,  left: 'n4', right: 'n6' },
  { id: 'n4',  val: 4,  x: 130, y: 130, left: 'n2' },
  { id: 'n6',  val: 6,  x: 350, y: 130,              right: 'n7' },
  { id: 'n2',  val: 2,  x: 80,  y: 210 },
  { id: 'n7',  val: 7,  x: 400, y: 210 },
];

const steps = [
  {
    phase: 'Navigate to key=3',
    description: "Compare key=3 with root.val=5. 3 < 5 → go left. Found node with val=3.",
    tree: tree,
    highlight: 'n3',
    successor: null as string | null,
    showAfter: false,
  },
  {
    phase: 'Find inorder successor',
    description: "Node 3 has two children (2 and 4). Find min of right subtree: go right to 4, then left until null. Inorder successor = 4.",
    tree: tree,
    highlight: 'n3',
    successor: 'n4',
    showAfter: false,
  },
  {
    phase: 'Replace and delete successor',
    description: "Set node.val = 4 (successor value). Recursively delete 4 from the right subtree. Result: 3 is gone, replaced by 4.",
    tree: treeAfter,
    highlight: 'n4',
    successor: null,
    showAfter: true,
  },
];

function drawTree(nodes: NodeDef[], highlight: string | null, successor: string | null) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <g>
      {nodes.map(n => {
        const left = n.left ? nodeMap.get(n.left) : null;
        const right = n.right ? nodeMap.get(n.right) : null;
        return (
          <g key={n.id + '-edges'}>
            {left && <line x1={n.x} y1={n.y} x2={left.x} y2={left.y} stroke="var(--dsa-border)" strokeWidth={1.5} />}
            {right && <line x1={n.x} y1={n.y} x2={right.x} y2={right.y} stroke="var(--dsa-border)" strokeWidth={1.5} />}
          </g>
        );
      })}
      {nodes.map(n => {
        const isHighlight = n.id === highlight;
        const isSuccessor = n.id === successor;
        const fill = isHighlight ? RED : isSuccessor ? AMBER : 'var(--dsa-surface)';
        const textColor = (isHighlight || isSuccessor) ? '#fff' : 'var(--dsa-text-muted)';
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={20}
              fill={fill} stroke="var(--dsa-border)" strokeWidth={2} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={14} fontWeight={700} fill={textColor}>
              {n.val}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function DeleteNodeBSTDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        BST: [5,3,6,2,4,null,7] &nbsp;|&nbsp; Delete key = 3 (two-children case)
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
        {[
          { fill: RED,    label: 'Target node' },
          { fill: AMBER,  label: 'Inorder successor' },
          { fill: ACCENT2, label: 'Replacement (after)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.fill }} />
            <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <svg width="100%" viewBox="0 0 480 280" style={{ maxWidth: 480, display: 'block', overflow: 'visible' }}>
        {drawTree(
          current.tree,
          current.highlight,
          current.successor,
        )}
        {/* After label */}
        {current.showAfter && (
          <text x={240} y={265} textAnchor="middle" fontSize={12} fill={GREEN} fontWeight={700}>
            ✓ Deletion complete
          </text>
        )}
      </svg>

      {/* Step info */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '10px 16px',
        marginTop: 4,
        fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, color: AMBER, marginBottom: 4 }}>
          Step {step + 1}/{steps.length} — {current.phase}
        </div>
        <div style={{ color: 'var(--dsa-text-muted)' }}>{current.description}</div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === 0 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === 0 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>
          ← Prev
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>
          Next →
        </button>
        <button
          onClick={() => setStep(0)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)',
            cursor: 'pointer', fontSize: 13,
          }}>
          Reset
        </button>
      </div>
    </div>
  );
}
