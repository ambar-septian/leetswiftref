import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// Tree: [1, 7, 0, 7, -8]
//        1           level 1: sum=1
//       / \
//      7   0         level 2: sum=7+0=7 ← max
//     / \
//    7  -8           level 3: sum=7+(-8)=-1
// maxSum=7 at level 2 → return 2

type NodeDef = { id: string; val: number; x: number; y: number };

const nodes: NodeDef[] = [
  { id: 'n1',  val: 1,  x: 160, y: 40  },
  { id: 'n7a', val: 7,  x: 80,  y: 110 },
  { id: 'n0',  val: 0,  x: 240, y: 110 },
  { id: 'n7b', val: 7,  x: 40,  y: 180 },
  { id: 'nm8', val: -8, x: 120, y: 180 },
];

const edges = [
  { from: 'n1',  to: 'n7a' },
  { from: 'n1',  to: 'n0'  },
  { from: 'n7a', to: 'n7b' },
  { from: 'n7a', to: 'nm8' },
];

const levelNodes = [
  ['n1'],
  ['n7a', 'n0'],
  ['n7b', 'nm8'],
];

const steps = [
  {
    level: 0,
    activeIds: [] as string[],
    sum: 0,
    maxSum: -Infinity,
    maxLevel: 0,
    desc: 'BFS level-order traversal. Queue starts with root.',
  },
  {
    level: 1,
    activeIds: ['n1'],
    sum: 1,
    maxSum: 1,
    maxLevel: 1,
    desc: 'Level 1: process root (val=1). sum=1. maxSum=1, result=1.',
  },
  {
    level: 2,
    activeIds: ['n7a', 'n0'],
    sum: 7,
    maxSum: 7,
    maxLevel: 2,
    desc: 'Level 2: process nodes 7 and 0. sum=7+0=7. 7>1 → maxSum=7, result=2.',
  },
  {
    level: 3,
    activeIds: ['n7b', 'nm8'],
    sum: -1,
    maxSum: 7,
    maxLevel: 2,
    desc: 'Level 3: process nodes 7 and -8. sum=7+(-8)=-1. -1<7 → no update. result stays 2.',
  },
  {
    level: -1,
    activeIds: [] as string[],
    sum: -1,
    maxSum: 7,
    maxLevel: 2,
    desc: 'Queue empty. maxSum=7 at level 2. Return 2.',
  },
];

const nodeMap = new Map<string, NodeDef>(nodes.map(n => [n.id, n] as [string, NodeDef]));

export default function MaxLevelSumDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const activeSet = new Set(current.activeIds);

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Tree [1,7,0,7,-8] &nbsp;|&nbsp; BFS level-order — track level with highest sum
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="300" height="220" viewBox="0 0 300 220" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {edges.map(e => {
            const from = nodeMap.get(e.from)!;
            const to = nodeMap.get(e.to)!;
            const active = activeSet.has(e.from) && activeSet.has(e.to);
            return (
              <line key={`${e.from}-${e.to}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={active ? AMBER : 'var(--dsa-border)'} strokeWidth={active ? 2 : 1.5} />
            );
          })}
          {nodes.map(n => {
            const isActive = activeSet.has(n.id);
            const fill = isActive
              ? (current.level === current.maxLevel && current.maxLevel > 0 ? GREEN : AMBER)
              : 'var(--dsa-surface)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={fill}
                  stroke={isActive ? (fill === GREEN ? GREEN : AMBER) : 'var(--dsa-border)'}
                  strokeWidth={isActive ? 2 : 1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={13} fontWeight={700}
                  fill={isActive ? '#fff' : 'var(--dsa-text-muted)'}>
                  {n.val}
                </text>
              </g>
            );
          })}
          {/* Level labels */}
          {[0, 1, 2].map(i => (
            <text key={i} x={290} y={40 + i * 70} textAnchor="end" fontSize={10}
              fill={current.maxLevel === i + 1 ? GREEN : 'var(--dsa-text-muted)'}>
              L{i + 1}
            </text>
          ))}
        </svg>

        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {current.level > 0 ? `Level ${current.level}` : current.level === -1 ? 'Complete' : 'Start'}
            </div>
            {current.level > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {[
                  ['Level sum', current.sum, current.sum === current.maxSum ? GREEN : AMBER],
                  ['Max sum so far', current.maxSum, GREEN],
                  ['Best level', current.maxLevel, GREEN],
                ].map(([label, val, color]) => (
                  <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--dsa-text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: color as string }}>{val as number}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: GREEN, label: 'Level with max sum' },
              { color: AMBER, label: 'Current level (processing)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === 0 ? 'var(--dsa-surface)' : ACCENT2, color: step === 0 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2, color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)', cursor: 'pointer', fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}
