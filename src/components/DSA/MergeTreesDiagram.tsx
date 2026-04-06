import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// root1 = [1, 3, 2, 5]     root2 = [2, 1, 3, null, 4]    merged = [3, 4, 5, 5, 4]
//      1                        2                               3
//     / \                      / \                             / \
//    3   2                    1   3                           4   5
//   /                          \                             / \
//  5                            4                           5   4

interface NodeDef {
  id: string;
  val: number;
  x: number;
  y: number;
  left?: string;
  right?: string;
}

const tree1: NodeDef[] = [
  { id: 'a1', val: 1, x: 110, y: 40, left: 'a3', right: 'a2' },
  { id: 'a3', val: 3, x: 60,  y: 110, left: 'a5' },
  { id: 'a2', val: 2, x: 160, y: 110 },
  { id: 'a5', val: 5, x: 30,  y: 180 },
];

const tree2: NodeDef[] = [
  { id: 'b2', val: 2, x: 110, y: 40, left: 'b1', right: 'b3' },
  { id: 'b1', val: 1, x: 60,  y: 110, right: 'b4' },
  { id: 'b3', val: 3, x: 160, y: 110 },
  { id: 'b4', val: 4, x: 90,  y: 180 },
];

const treeMerged: NodeDef[] = [
  { id: 'm3', val: 3, x: 110, y: 40, left: 'm4', right: 'm5' },
  { id: 'm4', val: 4, x: 60,  y: 110, left: 'm5b', right: 'm4b' },
  { id: 'm5', val: 5, x: 160, y: 110 },
  { id: 'm5b',val: 5, x: 20,  y: 180 },
  { id: 'm4b',val: 4, x: 100, y: 180 },
];

function TreeSVG({ nodes, color, label }: { nodes: NodeDef[]; color: string; label: string }) {
  const nodeMap = new Map<string, NodeDef>(nodes.map(n => [n.id, n] as [string, NodeDef]));
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>{label}</div>
      <svg width="200" height="220" viewBox="0 0 200 220" style={{ overflow: 'visible' }}>
        {nodes.map(n => {
          const left = n.left ? nodeMap.get(n.left) : null;
          const right = n.right ? nodeMap.get(n.right) : null;
          return (
            <g key={n.id + '-e'}>
              {left && <line x1={n.x} y1={n.y} x2={left.x} y2={left.y} stroke="var(--dsa-border)" strokeWidth={1.5} />}
              {right && <line x1={n.x} y1={n.y} x2={right.x} y2={right.y} stroke="var(--dsa-border)" strokeWidth={1.5} />}
            </g>
          );
        })}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={18} fill={color} stroke="var(--dsa-border)" strokeWidth={2} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontWeight={700} fill="#fff">
              {n.val}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const steps = [
  { phase: 'Before', description: 'Two input trees side-by-side. Overlapping nodes will be summed.' },
  { phase: 'After Merge', description: 'Root: 1+2=3. Left: 3+1=4. Right: 2+3=5. Node 5 (root1 only) stays 5. Node 4 (root2 only) stays 4.' },
];

export default function MergeTreesDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        root1 = [1,3,2,5] &nbsp;+&nbsp; root2 = [2,1,3,null,4] &nbsp;→&nbsp; merged
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {step === 0 ? (
          <>
            <TreeSVG nodes={tree1} color={ACCENT2} label="root1" />
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: 'var(--dsa-text-muted)', paddingTop: 60 }}>+</div>
            <TreeSVG nodes={tree2} color={AMBER} label="root2" />
          </>
        ) : (
          <TreeSVG nodes={treeMerged} color={GREEN} label="merged" />
        )}
      </div>

      {/* Overlay table when showing merged */}
      {step === 1 && (
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8,
          fontSize: 12,
        }}>
          {[['root', '1+2', '=3'], ['left', '3+1', '=4'], ['right', '2+3', '=5'], ['left.left', '5 only', '=5'], ['left.right', '4 only', '=4']].map(([pos, sum, res]) => (
            <div key={pos} style={{
              background: 'var(--dsa-surface)',
              border: '1px solid var(--dsa-border)',
              borderRadius: 6, padding: '4px 8px',
            }}>
              <span style={{ color: 'var(--dsa-text-muted)' }}>{pos}: </span>
              <span style={{ color: ACCENT2 }}>{sum}</span>
              <span style={{ color: GREEN, fontWeight: 700 }}>{res}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step info */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '8px 14px',
        marginTop: 8,
        fontSize: 12,
        color: 'var(--dsa-text-muted)',
      }}>
        <span style={{ fontWeight: 700, color: step === 1 ? GREEN : AMBER }}>{current.phase} — </span>
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
          }}>← Before</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>After →</button>
      </div>
    </div>
  );
}
