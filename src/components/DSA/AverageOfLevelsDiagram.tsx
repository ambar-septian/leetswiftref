import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// Tree: [3, 9, 20, null, null, 15, 7]
//      3
//     / \
//    9  20
//       / \
//      15   7

interface NodeDef {
  id: string;
  val: number;
  x: number;
  y: number;
  level: number;
  left?: string;
  right?: string;
}

const nodes: NodeDef[] = [
  { id: 'n3',  val: 3,  x: 180, y: 40,  level: 0, left: 'n9', right: 'n20' },
  { id: 'n9',  val: 9,  x: 90,  y: 110, level: 1 },
  { id: 'n20', val: 20, x: 270, y: 110, level: 1, left: 'n15', right: 'n7' },
  { id: 'n15', val: 15, x: 210, y: 180, level: 2 },
  { id: 'n7',  val: 7,  x: 330, y: 180, level: 2 },
];

const levelInfo = [
  { level: 0, nodeIds: ['n3'],        sum: 3,  count: 1, avg: 3.0 },
  { level: 1, nodeIds: ['n9', 'n20'], sum: 29, count: 2, avg: 14.5 },
  { level: 2, nodeIds: ['n15', 'n7'], sum: 22, count: 2, avg: 11.0 },
];

export default function AverageOfLevelsDiagram() {
  const [step, setStep] = useState(0);
  const current = levelInfo[step];
  const activeSet = new Set(current.nodeIds);
  const nodeMap = new Map<string, NodeDef>(nodes.map(n => [n.id, n] as [string, NodeDef]));

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Tree: [3, 9, 20, null, null, 15, 7] &nbsp;|&nbsp; BFS level-order — compute average per level
      </div>

      <svg width="100%" viewBox="0 0 420 220" style={{ maxWidth: 420, display: 'block', overflow: 'visible' }}>
        {/* Level highlight band */}
        <rect x={0} y={current.level * 70 + 18} width={420} height={50}
          fill={ACCENT2} fillOpacity={0.08} rx={6} />

        {/* Edges */}
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

        {/* Nodes */}
        {nodes.map(n => {
          const isActive = activeSet.has(n.id);
          const fill = isActive ? ACCENT2 : 'var(--dsa-surface)';
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={20}
                fill={fill} stroke="var(--dsa-border)" strokeWidth={2} />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={13} fontWeight={700}
                fill={isActive ? '#fff' : 'var(--dsa-text-muted)'}>
                {n.val}
              </text>
            </g>
          );
        })}

        {/* Level labels */}
        {levelInfo.map((l, i) => (
          <text key={i} x={8} y={l.level * 70 + 44} fontSize={11}
            fill={i === step ? AMBER : 'var(--dsa-text-muted)'}
            fontWeight={i === step ? 700 : 400}>
            L{i}
          </text>
        ))}
      </svg>

      {/* Calculation panel */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '10px 16px',
        marginTop: 4,
        fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
          Level {step} — BFS processes {current.count} node{current.count > 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'var(--dsa-text-muted)' }}>Values: </span>
            <span style={{ color: ACCENT2 }}>
              [{current.nodeIds.map(id => nodeMap.get(id)!.val).join(' + ')}]
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--dsa-text-muted)' }}>sum = </span>
            <span style={{ color: AMBER, fontWeight: 700 }}>{current.sum}</span>
          </div>
          <div>
            <span style={{ color: 'var(--dsa-text-muted)' }}>avg = </span>
            <span style={{ color: 'var(--dsa-text-muted)' }}>{current.sum}/{current.count} = </span>
            <span style={{ color: GREEN, fontWeight: 700 }}>{current.avg.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Results so far */}
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginTop: 8 }}>
        Result so far:{' '}
        <span style={{ color: GREEN, fontWeight: 700 }}>
          [{levelInfo.slice(0, step + 1).map(l => l.avg.toFixed(1)).join(', ')}]
        </span>
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
        <button onClick={() => setStep(s => Math.min(levelInfo.length - 1, s + 1))} disabled={step === levelInfo.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === levelInfo.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === levelInfo.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === levelInfo.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
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
