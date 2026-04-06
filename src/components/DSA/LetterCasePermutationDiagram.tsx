import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// Input: "a1b"  →  branches at 'a' (letter) and 'b' (letter), digit '1' just continues
// Results: ["a1b", "a1B", "A1b", "A1B"]

// Tree layout:
//                root
//           /          \
//         a              A
//         |              |
//         1              1
//        / \            / \
//       b   B          b   B
//       |   |          |   |
//     a1b  a1B        A1b  A1B

const nodes = [
  { id: 'root', label: '"a1b"', x: 200, y: 24 },
  // left subtree (starts with 'a')
  { id: 'La', label: 'a', x: 100, y: 80 },
  { id: 'La1', label: '1', x: 100, y: 136 },
  { id: 'La1b', label: 'b', x: 60, y: 192 },
  { id: 'La1B', label: 'B', x: 140, y: 192 },
  { id: 'r0', label: 'a1b', x: 60, y: 248 },
  { id: 'r1', label: 'a1B', x: 140, y: 248 },
  // right subtree (starts with 'A')
  { id: 'RA', label: 'A', x: 300, y: 80 },
  { id: 'RA1', label: '1', x: 300, y: 136 },
  { id: 'RA1b', label: 'b', x: 260, y: 192 },
  { id: 'RA1B', label: 'B', x: 340, y: 192 },
  { id: 'r2', label: 'A1b', x: 260, y: 248 },
  { id: 'r3', label: 'A1B', x: 340, y: 248 },
];

const edges = [
  { from: 'root', to: 'La', label: 'lower' },
  { from: 'root', to: 'RA', label: 'upper' },
  { from: 'La', to: 'La1', label: '' },
  { from: 'RA', to: 'RA1', label: '' },
  { from: 'La1', to: 'La1b', label: 'lower' },
  { from: 'La1', to: 'La1B', label: 'upper' },
  { from: 'RA1', to: 'RA1b', label: 'lower' },
  { from: 'RA1', to: 'RA1B', label: 'upper' },
  { from: 'La1b', to: 'r0', label: '' },
  { from: 'La1B', to: 'r1', label: '' },
  { from: 'RA1b', to: 'r2', label: '' },
  { from: 'RA1B', to: 'r3', label: '' },
];

const results = ['a1b', 'a1B', 'A1b', 'A1B'];
const resultIds = ['r0', 'r1', 'r2', 'r3'];

const steps = [
  { active: ['root'], done: [], desc: 'Start DFS at index 0. Input is "a1b". index=0, char=\'a\' (letter) — will branch.' },
  { active: ['root', 'La'], done: [], desc: 'Branch 1: choose lowercase \'a\'. Move to index 1.' },
  { active: ['root', 'La', 'La1'], done: [], desc: 'index=1, char=\'1\' (digit) — no branch, just include \'1\'. Move to index 2.' },
  { active: ['root', 'La', 'La1', 'La1b'], done: [], desc: 'index=2, char=\'b\' (letter) — branch. Choose lowercase \'b\'.' },
  { active: ['r0'], done: ['r0'], desc: 'Reached end of string. Record result "a1b".' },
  { active: ['root', 'La', 'La1', 'La1B'], done: ['r0'], desc: 'Backtrack. Choose uppercase \'B\'.' },
  { active: ['r1'], done: ['r0', 'r1'], desc: 'Record result "a1B".' },
  { active: ['root', 'RA'], done: ['r0', 'r1'], desc: 'Backtrack to root. Branch 2: choose uppercase \'A\'.' },
  { active: ['root', 'RA', 'RA1'], done: ['r0', 'r1'], desc: 'index=1, char=\'1\' (digit) — no branch.' },
  { active: ['root', 'RA', 'RA1', 'RA1b'], done: ['r0', 'r1'], desc: 'Choose lowercase \'b\'.' },
  { active: ['r2'], done: ['r0', 'r1', 'r2'], desc: 'Record result "A1b".' },
  { active: ['root', 'RA', 'RA1', 'RA1B'], done: ['r0', 'r1', 'r2'], desc: 'Backtrack. Choose uppercase \'B\'.' },
  { active: ['r3'], done: ['r0', 'r1', 'r2', 'r3'], desc: 'Record result "A1B". All paths explored. Return ["a1b","a1B","A1b","A1B"].' },
];

const nodeMap = new Map<string, typeof nodes[0]>(nodes.map(n => [n.id, n] as [string, typeof nodes[0]]));

export default function LetterCasePermutationDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const activeSet = new Set(current.active);
  const doneSet = new Set(current.done);

  function nodeColor(id: string): string {
    if (resultIds.includes(id) && doneSet.has(id)) return GREEN;
    if (activeSet.has(id)) return AMBER;
    return 'var(--dsa-surface)';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        s = "a1b" &nbsp;|&nbsp; Branch at each letter (lower/upper), skip digits
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="400" height="280" viewBox="0 0 400 280" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {edges.map(e => {
            const from = nodeMap.get(e.from)!;
            const to = nodeMap.get(e.to)!;
            const isActive = activeSet.has(e.from) && activeSet.has(e.to);
            const isDone = doneSet.has(e.to);
            return (
              <g key={`${e.from}-${e.to}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isActive ? AMBER : isDone ? GREEN : 'var(--dsa-border)'}
                  strokeWidth={isActive || isDone ? 2 : 1.5} />
                {e.label && (
                  <text x={(from.x + to.x) / 2 + 4} y={(from.y + to.y) / 2}
                    fontSize={9} fill={isActive ? AMBER : 'var(--dsa-text-muted)'}>
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {nodes.map(n => {
            const isResult = resultIds.includes(n.id);
            const fill = nodeColor(n.id);
            const isActive = activeSet.has(n.id) || (isResult && doneSet.has(n.id));
            return (
              <g key={n.id}>
                <rect x={n.x - 18} y={n.y - 13} width={isResult ? 38 : 28} height={26}
                  rx={isResult ? 4 : 13}
                  fill={fill}
                  stroke={isResult && doneSet.has(n.id) ? GREEN : activeSet.has(n.id) ? AMBER : 'var(--dsa-border)'}
                  strokeWidth={isActive ? 2 : 1.5} />
                <text x={n.x + (isResult ? 1 : 0)} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={isResult ? 10 : 12} fontWeight={700}
                  fill={isActive ? '#fff' : 'var(--dsa-text-muted)'}>
                  {n.label}
                </text>
              </g>
            );
          })}
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
              Step {step + 1} / {steps.length}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.desc}
            </div>
            {current.done.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>Collected: </span>
                <span style={{ color: GREEN, fontWeight: 700 }}>
                  [{current.done.map(id => `"${results[resultIds.indexOf(id)]}"`).join(', ')}]
                </span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: AMBER, label: 'Active DFS path' },
              { color: GREEN, label: 'Completed result' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
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
