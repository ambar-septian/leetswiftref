import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// Tree: [1, 2, 3, 4, 5]
//      1
//     / \
//    2   3
//   / \
//  4   5
// Post-order: 4, 5, 2, 3, 1
// Heights returned: 4→1, 5→1, 2→2, 3→1, 1→3
// Diameter at each: 4→0, 5→0, 2→2(1+1), 3→0, 1→3(2+1)
// result = max(0,0,2,0,3) = 3

const steps = [
  {
    active: 'n4',
    label: 'Visit node 4 (leaf)',
    leftH: 0, rightH: 0, diameter: 0, returnH: 1,
    globalMax: 0,
    path: [] as string[],
    description: 'Leaf node. left=0, right=0. Diameter contribution = 0+0 = 0. Return height = 1.',
  },
  {
    active: 'n5',
    label: 'Visit node 5 (leaf)',
    leftH: 0, rightH: 0, diameter: 0, returnH: 1,
    globalMax: 0,
    path: [] as string[],
    description: 'Leaf node. left=0, right=0. Diameter contribution = 0+0 = 0. Return height = 1.',
  },
  {
    active: 'n2',
    label: 'Visit node 2',
    leftH: 1, rightH: 1, diameter: 2, returnH: 2,
    globalMax: 2,
    path: ['n4', 'n2', 'n5'],
    description: 'left=1 (from node 4), right=1 (from node 5). Diameter = 1+1 = 2. Update global max to 2. Return height = 1+max(1,1) = 2.',
  },
  {
    active: 'n3',
    label: 'Visit node 3 (leaf)',
    leftH: 0, rightH: 0, diameter: 0, returnH: 1,
    globalMax: 2,
    path: [] as string[],
    description: 'Leaf node. left=0, right=0. Diameter contribution = 0. Global max stays 2. Return height = 1.',
  },
  {
    active: 'n1',
    label: 'Visit node 1 (root)',
    leftH: 2, rightH: 1, diameter: 3, returnH: 3,
    globalMax: 3,
    path: ['n4', 'n2', 'n1', 'n3'],
    description: 'left=2 (from node 2), right=1 (from node 3). Diameter = 2+1 = 3. Update global max to 3. Return height = 1+max(2,1) = 3.',
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

const nodes: NodeDef[] = [
  { id: 'n1', val: 1, x: 200, y: 40, left: 'n2', right: 'n3' },
  { id: 'n2', val: 2, x: 110, y: 110, left: 'n4', right: 'n5' },
  { id: 'n3', val: 3, x: 290, y: 110 },
  { id: 'n4', val: 4, x: 55,  y: 180 },
  { id: 'n5', val: 5, x: 165, y: 180 },
];

export default function DiameterBinaryTreeDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const nodeMap = new Map<string, NodeDef>(nodes.map(n => [n.id, n] as [string, NodeDef]));
  const pathSet = new Set(current.path);

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Tree: [1, 2, 3, 4, 5] &nbsp;|&nbsp; Post-order DFS — track left+right height at each node
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Tree SVG */}
        <svg width="360" viewBox="0 0 360 220" style={{ maxWidth: 360, flex: '0 0 auto', overflow: 'visible' }}>
          <defs>
            <marker id="dbt-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="var(--dsa-border)" />
            </marker>
          </defs>

          {/* Edges */}
          {nodes.map(n => {
            const left = n.left ? nodeMap.get(n.left) : null;
            const right = n.right ? nodeMap.get(n.right) : null;
            const leftPath = n.left ? (pathSet.has(n.id) && pathSet.has(n.left)) : false;
            const rightPath = n.right ? (pathSet.has(n.id) && pathSet.has(n.right)) : false;
            return (
              <g key={n.id + '-e'}>
                {left && (
                  <line x1={n.x} y1={n.y} x2={left.x} y2={left.y}
                    stroke={leftPath ? AMBER : 'var(--dsa-border)'}
                    strokeWidth={leftPath ? 2.5 : 1.5} />
                )}
                {right && (
                  <line x1={n.x} y1={n.y} x2={right.x} y2={right.y}
                    stroke={rightPath ? AMBER : 'var(--dsa-border)'}
                    strokeWidth={rightPath ? 2.5 : 1.5} />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const isActive = n.id === current.active;
            const isPath = pathSet.has(n.id) && !isActive;
            const fill = isActive ? RED : isPath ? AMBER : 'var(--dsa-surface)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={20}
                  fill={fill} stroke="var(--dsa-border)" strokeWidth={2} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={14} fontWeight={700}
                  fill={(isActive || isPath) ? '#fff' : 'var(--dsa-text-muted)'}>
                  {n.val}
                </text>
              </g>
            );
          })}

          {/* Height labels */}
          {step > 0 && nodes.slice(0, step).map((n, i) => {
            const h = steps[i].returnH;
            return (
              <text key={n.id + '-h'} x={n.x + 24} y={n.y - 10} fontSize={10}
                fill={GREEN} fontWeight={700}>
                h={h}
              </text>
            );
          })}
        </svg>

        {/* Info panel */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: RED, marginBottom: 6 }}>
              {current.label}
            </div>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                {[
                  ['leftH', current.leftH],
                  ['rightH', current.rightH],
                  ['left+right', current.diameter],
                  ['return h', current.returnH],
                  ['global max', current.globalMax],
                ].map(([label, val]) => (
                  <tr key={label as string}>
                    <td style={{ color: 'var(--dsa-text-muted)', paddingRight: 10, paddingBottom: 3 }}>{label}</td>
                    <td style={{
                      fontWeight: 700,
                      color: label === 'global max' ? GREEN : label === 'left+right' ? AMBER : ACCENT2,
                    }}>{val as number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '8px 14px',
        marginTop: 6,
        fontSize: 12,
        color: 'var(--dsa-text-muted)',
      }}>
        <span style={{ fontWeight: 700, color: AMBER }}>Step {step + 1}/{steps.length}: </span>
        {current.description}
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

      {step === steps.length - 1 && (
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: GREEN }}>
          ✓ Diameter = {current.globalMax} (path: 4 → 2 → 1 → 3)
        </div>
      )}
    </div>
  );
}
