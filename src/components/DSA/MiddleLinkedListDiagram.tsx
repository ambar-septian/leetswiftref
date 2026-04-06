import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// Input: [1, 2, 3, 4, 5]
// Phase 1: count while current.next != nil → count = 4
// middleIndex = 4 % 2 == 0 → 4/2 = 2
// Phase 2: walk index 0→1→2 → return node(3)

const vals = [1, 2, 3, 4, 5];

const steps = [
  {
    phase: 1,
    label: 'Count nodes',
    current: 0,
    count: 0,
    middleIndex: -1,
    walkIndex: -1,
    desc: 'Phase 1: walk until current.next == nil. Count how many times we advance.',
  },
  {
    phase: 1,
    label: 'Counting…',
    current: 1,
    count: 1,
    middleIndex: -1,
    walkIndex: -1,
    desc: 'current=node(1), next exists → count=1, advance.',
  },
  {
    phase: 1,
    label: 'Counting…',
    current: 2,
    count: 2,
    middleIndex: -1,
    walkIndex: -1,
    desc: 'current=node(2), next exists → count=2, advance.',
  },
  {
    phase: 1,
    label: 'Counting…',
    current: 3,
    count: 3,
    middleIndex: -1,
    walkIndex: -1,
    desc: 'current=node(3), next exists → count=3, advance.',
  },
  {
    phase: 1,
    label: 'Counting…',
    current: 4,
    count: 4,
    middleIndex: -1,
    walkIndex: -1,
    desc: 'current=node(4), next exists → count=4, advance.',
  },
  {
    phase: 1,
    label: 'Count done',
    current: 4,
    count: 4,
    middleIndex: 2,
    walkIndex: -1,
    desc: 'current=node(5), next==nil → stop. count=4. 4%2==0 → middleIndex = 4/2 = 2.',
  },
  {
    phase: 2,
    label: 'Phase 2: walk to middle',
    current: 0,
    count: 4,
    middleIndex: 2,
    walkIndex: 0,
    desc: 'Phase 2: reset current=head. Walk until index == middleIndex (2). Now index=0 ≠ 2, advance.',
  },
  {
    phase: 2,
    label: 'Walking…',
    current: 1,
    count: 4,
    middleIndex: 2,
    walkIndex: 1,
    desc: 'index=1 ≠ 2, advance.',
  },
  {
    phase: 2,
    label: 'Found middle',
    current: 2,
    count: 4,
    middleIndex: 2,
    walkIndex: 2,
    desc: 'index=2 == middleIndex=2. Return current node (val=3).',
  },
];

const NODE_W = 44;
const NODE_H = 36;
const NODE_GAP = 20;
const START_X = 30;
const Y = 80;

export default function MiddleLinkedListDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  const totalW = vals.length * NODE_W + (vals.length - 1) * NODE_GAP;

  function nodeColor(i: number): string {
    if (current.walkIndex === i && current.phase === 2 && current.walkIndex === current.middleIndex) return GREEN;
    if (current.current === i) return AMBER;
    return 'var(--dsa-surface)';
  }

  function nodeStroke(i: number): string {
    if (current.walkIndex === i && current.phase === 2 && current.walkIndex === current.middleIndex) return GREEN;
    if (current.current === i) return AMBER;
    return 'var(--dsa-border)';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        head = [1→2→3→4→5] &nbsp;|&nbsp; Two-pass: count nodes, walk to middle index
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width={START_X * 2 + totalW + 30} height={160} viewBox={`0 0 ${START_X * 2 + totalW + 30} 160`}
          style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {/* Nodes */}
          {vals.map((v, i) => {
            const x = START_X + i * (NODE_W + NODE_GAP);
            const fill = nodeColor(i);
            const stroke = nodeStroke(i);
            const isActive = current.current === i;
            const isMiddle = current.walkIndex === current.middleIndex && i === current.middleIndex && current.phase === 2;
            return (
              <g key={i}>
                <rect x={x} y={Y - NODE_H / 2} width={NODE_W} height={NODE_H}
                  rx={6} fill={fill} stroke={stroke} strokeWidth={2} />
                <text x={x + NODE_W / 2} y={Y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={14} fontWeight={700}
                  fill={isActive || isMiddle ? '#fff' : 'var(--dsa-text-muted)'}>
                  {v}
                </text>
                {/* Arrow to next */}
                {i < vals.length - 1 && (
                  <line x1={x + NODE_W} y1={Y} x2={x + NODE_W + NODE_GAP} y2={Y}
                    stroke="var(--dsa-border)" strokeWidth={1.5}
                    markerEnd="url(#arr)" />
                )}
                {/* Index label */}
                <text x={x + NODE_W / 2} y={Y + NODE_H / 2 + 14} textAnchor="middle"
                  fontSize={9} fill="var(--dsa-text-muted)">[{i}]</text>
                {/* Current pointer */}
                {current.current === i && (
                  <text x={x + NODE_W / 2} y={Y - NODE_H / 2 - 10} textAnchor="middle"
                    fontSize={10} fontWeight={700} fill={isMiddle ? GREEN : AMBER}>
                    {isMiddle ? '← middle' : 'curr'}
                  </text>
                )}
              </g>
            );
          })}
          {/* null terminator */}
          <text x={START_X + vals.length * (NODE_W + NODE_GAP) - NODE_GAP + 8} y={Y}
            dominantBaseline="middle" fontSize={11} fill="var(--dsa-text-muted)">null</text>
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="var(--dsa-border)" />
            </marker>
          </defs>
          {/* Stats */}
          <text x={START_X} y={145} fontSize={11} fill="var(--dsa-text-muted)">
            count={current.count}
            {current.middleIndex >= 0 ? `  middleIndex=${current.middleIndex}` : ''}
            {current.walkIndex >= 0 ? `  walkIndex=${current.walkIndex}` : ''}
          </text>
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
              {current.label}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.desc}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: AMBER, label: 'Current pointer (curr)' },
              { color: GREEN, label: 'Middle node (return value)' },
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
