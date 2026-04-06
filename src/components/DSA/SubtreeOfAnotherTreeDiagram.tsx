import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]
// root tree:
//      3
//     / \
//    4   5
//   / \
//  1   2
// subRoot tree:
//    4
//   / \
//  1   2

const steps = [
  {
    label: 'Check isSameTree(root=3, subRoot=4)',
    checkNode: 'n3',
    result: 'no',
    description: "Values differ (3 != 4). isSameTree returns false. Try isSubtree on left child (node 4).",
    match: false,
  },
  {
    label: 'Check isSameTree(root=4, subRoot=4)',
    checkNode: 'n4',
    result: 'checking',
    description: "Values match (4 == 4). Recurse into children: isSameTree(1, 1) and isSameTree(2, 2).",
    match: null,
  },
  {
    label: 'isSameTree confirms: 4→[1,2] == subRoot',
    checkNode: 'n4',
    result: 'yes',
    description: "Both children match (1==1, 2==2). isSameTree returns true. isSubtree returns true.",
    match: true,
  },
];

interface NodeDef {
  id: string;
  val: number;
  x: number;
  y: number;
  left?: string;
  right?: string;
}

const rootNodes: NodeDef[] = [
  { id: 'n3', val: 3, x: 140, y: 40, left: 'n4', right: 'n5' },
  { id: 'n4', val: 4, x: 70,  y: 110, left: 'n1', right: 'n2' },
  { id: 'n5', val: 5, x: 210, y: 110 },
  { id: 'n1', val: 1, x: 30,  y: 180 },
  { id: 'n2', val: 2, x: 110, y: 180 },
];

const subNodes: NodeDef[] = [
  { id: 's4', val: 4, x: 100, y: 40, left: 's1', right: 's2' },
  { id: 's1', val: 1, x: 50,  y: 110 },
  { id: 's2', val: 2, x: 150, y: 110 },
];

function drawTree(nodes: NodeDef[], highlightId: string | null, highlightColor: string) {
  const nodeMap = new Map<string, NodeDef>(nodes.map(n => [n.id, n] as [string, NodeDef]));
  const subtreeIds = new Set<string>();

  // If highlighting n4 in rootNodes, also highlight its subtree
  if (highlightId === 'n4') {
    subtreeIds.add('n4'); subtreeIds.add('n1'); subtreeIds.add('n2');
  }

  return (
    <g>
      {nodes.map(n => {
        const left = n.left ? nodeMap.get(n.left) : null;
        const right = n.right ? nodeMap.get(n.right) : null;
        const inSubtree = subtreeIds.has(n.id);
        return (
          <g key={n.id + '-e'}>
            {left && (
              <line x1={n.x} y1={n.y} x2={left.x} y2={left.y}
                stroke={inSubtree && subtreeIds.has(n.left!) ? highlightColor : 'var(--dsa-border)'}
                strokeWidth={inSubtree && subtreeIds.has(n.left!) ? 2 : 1.5} />
            )}
            {right && (
              <line x1={n.x} y1={n.y} x2={right.x} y2={right.y}
                stroke={inSubtree && subtreeIds.has(n.right!) ? highlightColor : 'var(--dsa-border)'}
                strokeWidth={inSubtree && subtreeIds.has(n.right!) ? 2 : 1.5} />
            )}
          </g>
        );
      })}
      {nodes.map(n => {
        const isHighlight = n.id === highlightId;
        const inSubtree = subtreeIds.has(n.id) && n.id !== highlightId;
        const fill = isHighlight ? highlightColor : inSubtree ? ACCENT2 : 'var(--dsa-surface)';
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={18}
              fill={fill} stroke="var(--dsa-border)" strokeWidth={2} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontWeight={700}
              fill={(isHighlight || inSubtree) ? '#fff' : 'var(--dsa-text-muted)'}>
              {n.val}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function SubtreeOfAnotherTreeDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  const rootHighlight = current.checkNode;
  const rootColor = current.result === 'yes' ? GREEN : current.result === 'no' ? RED : AMBER;

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        root = [3,4,5,1,2] &nbsp;|&nbsp; subRoot = [4,1,2]
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Root tree */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>root</div>
          <svg width="240" height="210" viewBox="0 0 240 210" style={{ overflow: 'visible' }}>
            {drawTree(rootNodes, rootHighlight, rootColor)}
          </svg>
        </div>

        {/* subRoot tree */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>subRoot</div>
          <svg width="200" height="140" viewBox="0 0 200 140" style={{ overflow: 'visible' }}>
            {drawTree(subNodes, 's4', step === 2 ? GREEN : AMBER)}
          </svg>
        </div>
      </div>

      {/* Step info */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '10px 14px',
        marginTop: 6,
        fontSize: 12,
      }}>
        <div style={{
          fontWeight: 700,
          color: current.result === 'yes' ? GREEN : current.result === 'no' ? RED : AMBER,
          marginBottom: 4,
        }}>
          Step {step + 1}/{steps.length} — {current.label}
        </div>
        <div style={{ color: 'var(--dsa-text-muted)' }}>{current.description}</div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === 0 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === 0 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)',
            cursor: 'pointer', fontSize: 13,
          }}>Reset</button>
      </div>
    </div>
  );
}
