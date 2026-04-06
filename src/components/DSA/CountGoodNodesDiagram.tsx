import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// Tree: [3,1,4,3,null,1,5]
//         3          root: val=3, maxSoFar=-∞ → GOOD (count=1)
//        / \
//       1   4        1: maxSoFar=3, 1<3 NOT good  4: maxSoFar=3, 4>=3 GOOD (count=3)
//      /   / \
//     3   1   5      3: maxSoFar=3, 3>=3 GOOD(count=2)  1: <4 bad  5: >=4 GOOD(count=4)
// Answer: 4

type NodeDef = { id: string; val: number; x: number; y: number };

const nodes: NodeDef[] = [
  { id: 'n3r',  val: 3, x: 160, y: 40  },
  { id: 'n1a',  val: 1, x: 80,  y: 110 },
  { id: 'n4',   val: 4, x: 240, y: 110 },
  { id: 'n3l',  val: 3, x: 40,  y: 180 },
  { id: 'n1b',  val: 1, x: 200, y: 180 },
  { id: 'n5',   val: 5, x: 280, y: 180 },
];

const edges = [
  { from: 'n3r', to: 'n1a' },
  { from: 'n3r', to: 'n4'  },
  { from: 'n1a', to: 'n3l' },
  { from: 'n4',  to: 'n1b' },
  { from: 'n4',  to: 'n5'  },
];

type StepState = {
  activeId: string;
  goodIds: string[];
  badIds: string[];
  maxSoFar: string;
  count: number;
  desc: string;
};

const steps: StepState[] = [
  {
    activeId: '',
    goodIds: [],
    badIds: [],
    maxSoFar: '-∞',
    count: 0,
    desc: 'DFS starts at root. Pass maxSoFar = -∞ down. A node is "good" if its value is >= maxSoFar seen on the path from root.',
  },
  {
    activeId: 'n3r',
    goodIds: ['n3r'],
    badIds: [],
    maxSoFar: '3',
    count: 1,
    desc: 'Visit root (3). maxSoFar=-∞, 3 >= -∞ → GOOD. count=1. Update maxSoFar=3.',
  },
  {
    activeId: 'n1a',
    goodIds: ['n3r'],
    badIds: ['n1a'],
    maxSoFar: '3',
    count: 1,
    desc: 'Visit left child (1). maxSoFar=3, 1 < 3 → NOT good. count stays 1. maxSoFar stays 3.',
  },
  {
    activeId: 'n3l',
    goodIds: ['n3r', 'n3l'],
    badIds: ['n1a'],
    maxSoFar: '3',
    count: 2,
    desc: 'Visit left-left (3). maxSoFar=3, 3 >= 3 → GOOD. count=2. Leaf — backtrack.',
  },
  {
    activeId: 'n4',
    goodIds: ['n3r', 'n3l', 'n4'],
    badIds: ['n1a'],
    maxSoFar: '4',
    count: 3,
    desc: 'Visit right child (4). maxSoFar=3, 4 >= 3 → GOOD. count=3. Update maxSoFar=4.',
  },
  {
    activeId: 'n1b',
    goodIds: ['n3r', 'n3l', 'n4'],
    badIds: ['n1a', 'n1b'],
    maxSoFar: '4',
    count: 3,
    desc: 'Visit left of 4 (1). maxSoFar=4, 1 < 4 → NOT good. count stays 3. Leaf — backtrack.',
  },
  {
    activeId: 'n5',
    goodIds: ['n3r', 'n3l', 'n4', 'n5'],
    badIds: ['n1a', 'n1b'],
    maxSoFar: '4',
    count: 4,
    desc: 'Visit right of 4 (5). maxSoFar=4, 5 >= 4 → GOOD. count=4. Leaf — done.',
  },
  {
    activeId: '',
    goodIds: ['n3r', 'n3l', 'n4', 'n5'],
    badIds: ['n1a', 'n1b'],
    maxSoFar: '—',
    count: 4,
    desc: 'DFS complete. 4 nodes were good. Return 4.',
  },
];

const nodeMap = new Map<string, NodeDef>(nodes.map(n => [n.id, n] as [string, NodeDef]));

export default function CountGoodNodesDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const goodSet = new Set(current.goodIds);
  const badSet  = new Set(current.badIds);

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Tree [3,1,4,3,null,1,5] &nbsp;|&nbsp; DFS — pass maxSoFar down each path
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="320" height="220" viewBox="0 0 320 220" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {edges.map(e => {
            const from = nodeMap.get(e.from)!;
            const to   = nodeMap.get(e.to)!;
            return (
              <line key={`${e.from}-${e.to}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke='var(--dsa-border)' strokeWidth={1.5} />
            );
          })}
          {nodes.map(n => {
            const isActive = n.id === current.activeId;
            const isGood   = goodSet.has(n.id);
            const isBad    = badSet.has(n.id);
            const fill = isActive
              ? (isGood ? GREEN : RED)
              : isGood
                ? `${GREEN}44`
                : isBad
                  ? `${RED}33`
                  : 'var(--dsa-surface)';
            const stroke = isActive
              ? (isGood ? GREEN : RED)
              : isGood
                ? GREEN
                : isBad
                  ? RED
                  : 'var(--dsa-border)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={13} fontWeight={700}
                  fill={isActive ? '#fff' : isGood ? GREEN : isBad ? RED : 'var(--dsa-text-muted)'}>
                  {n.val}
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {step === steps.length - 1 ? 'Complete' : step === 0 ? 'Start DFS' : `Visit node ${nodes.find(n => n.id === current.activeId)?.val ?? '—'}`}
            </div>
            {step > 0 && step < steps.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {[
                  ['maxSoFar', current.maxSoFar],
                  ['Good count', current.count],
                ].map(([label, val]) => (
                  <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--dsa-text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: AMBER }}>{val as string|number}</span>
                  </div>
                ))}
              </div>
            )}
            {step === steps.length - 1 && (
              <div style={{ fontWeight: 700, color: GREEN, marginBottom: 8 }}>Return {current.count}</div>
            )}
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: GREEN, label: 'Good node (val >= maxSoFar)' },
              { color: RED,   label: 'Not good (val < maxSoFar)' },
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
