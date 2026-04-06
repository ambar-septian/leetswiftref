import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// Capacity = 5
// Steps: enQueue(1,2,3), deQueue(), enQueue(4), enQueue(5) — tail wraps

interface QueueStep {
  op: string;
  items: (number | null)[];
  head: number;
  tail: number;
  count: number;
  result: string;
  description: string;
}

const steps: QueueStep[] = [
  {
    op: 'init(5)',
    items: [null, null, null, null, null],
    head: 0, tail: 0, count: 0,
    result: '—',
    description: 'Circular array of capacity 5. head=0, tail=0 (both point to slot 0).',
  },
  {
    op: 'enQueue(1)',
    items: [1, null, null, null, null],
    head: 0, tail: 1, count: 1,
    result: 'true',
    description: 'Place 1 at items[tail=0]. tail = (0+1)%5 = 1. count=1.',
  },
  {
    op: 'enQueue(2)',
    items: [1, 2, null, null, null],
    head: 0, tail: 2, count: 2,
    result: 'true',
    description: 'Place 2 at items[tail=1]. tail = (1+1)%5 = 2. count=2.',
  },
  {
    op: 'enQueue(3)',
    items: [1, 2, 3, null, null],
    head: 0, tail: 3, count: 3,
    result: 'true',
    description: 'Place 3 at items[tail=2]. tail = (2+1)%5 = 3. count=3.',
  },
  {
    op: 'deQueue()',
    items: [null, 2, 3, null, null],
    head: 1, tail: 3, count: 2,
    result: 'true',
    description: 'Remove items[head=0]. head = (0+1)%5 = 1. count=2. Front is now 2.',
  },
  {
    op: 'enQueue(4)',
    items: [null, 2, 3, 4, null],
    head: 1, tail: 4, count: 3,
    result: 'true',
    description: 'Place 4 at items[tail=3]. tail = (3+1)%5 = 4. count=3.',
  },
  {
    op: 'enQueue(5)',
    items: [null, 2, 3, 4, 5],
    head: 1, tail: 0, count: 4,
    result: 'true',
    description: 'Place 5 at items[tail=4]. tail = (4+1)%5 = 0. Tail wraps around! count=4.',
  },
  {
    op: 'enQueue(6)',
    items: [6, 2, 3, 4, 5],
    head: 1, tail: 1, count: 5,
    result: 'true',
    description: 'Place 6 at items[tail=0]. tail = (0+1)%5 = 1. isFull=true. count=5.',
  },
];

const CAPACITY = 5;
const RADIUS = 90;
const CX = 140;
const CY = 130;

function slotAngle(i: number) {
  // 0 at top, clockwise
  return (i / CAPACITY) * 2 * Math.PI - Math.PI / 2;
}

function slotPos(i: number) {
  const angle = slotAngle(i);
  return {
    x: CX + RADIUS * Math.cos(angle),
    y: CY + RADIUS * Math.sin(angle),
  };
}

export default function CircularQueueDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Circular Queue — capacity = 5 &nbsp;|&nbsp; Modulo arithmetic wraps head and tail
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Circular visualization */}
        <svg width="280" height="260" viewBox="0 0 280 260" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {/* Ring */}
          <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="var(--dsa-border)" strokeWidth={1} strokeDasharray="4 4" />

          {/* Slots */}
          {Array.from({ length: CAPACITY }, (_, i) => {
            const pos = slotPos(i);
            const val = current.items[i];
            const isHead = i === current.head;
            const isTail = i === current.tail;
            const isEmpty = val === null;

            let fill = isEmpty ? 'var(--dsa-surface)' : ACCENT2;
            if (isHead && !isEmpty) fill = GREEN;
            if (isTail && !isEmpty && !isHead) fill = AMBER;

            return (
              <g key={i}>
                <rect
                  x={pos.x - 22} y={pos.y - 18}
                  width={44} height={36}
                  rx={6}
                  fill={fill}
                  stroke={isHead || isTail ? (isHead ? GREEN : AMBER) : 'var(--dsa-border)'}
                  strokeWidth={isHead || isTail ? 2.5 : 1.5}
                />
                {/* Slot index */}
                <text x={pos.x} y={pos.y - 7} textAnchor="middle" fontSize={9}
                  fill={isEmpty ? 'var(--dsa-text-muted)' : '#fff'}>
                  [{i}]
                </text>
                {/* Value */}
                <text x={pos.x} y={pos.y + 6} textAnchor="middle" fontSize={13} fontWeight={700}
                  fill={isEmpty ? 'var(--dsa-text-muted)' : '#fff'}>
                  {val === null ? '—' : val}
                </text>
                {/* Head/Tail labels */}
                {isHead && (
                  <text x={pos.x} y={pos.y + 26} textAnchor="middle" fontSize={9} fill={GREEN} fontWeight={700}>
                    HEAD
                  </text>
                )}
                {isTail && (
                  <text x={pos.x} y={pos.y + (isHead ? 36 : 26)} textAnchor="middle" fontSize={9} fill={AMBER} fontWeight={700}>
                    TAIL
                  </text>
                )}
              </g>
            );
          })}

          {/* Center stats */}
          <text x={CX} y={CY - 14} textAnchor="middle" fontSize={11} fill="var(--dsa-text-muted)">count</text>
          <text x={CX} y={CY + 4} textAnchor="middle" fontSize={18} fontWeight={700} fill={ACCENT2}>
            {current.count}
          </text>
          <text x={CX} y={CY + 20} textAnchor="middle" fontSize={10} fill="var(--dsa-text-muted)">
            / {CAPACITY}
          </text>
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
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 8 }}>
              {current.op}
              <span style={{
                marginLeft: 8, fontSize: 11,
                color: current.result === 'true' ? GREEN : current.result === 'false' ? RED : 'var(--dsa-text-muted)',
              }}>
                → {current.result}
              </span>
            </div>
            {[
              ['head', current.head, GREEN],
              ['tail', current.tail, AMBER],
              ['count', current.count, ACCENT2],
              ['isEmpty', current.count === 0 ? 'true' : 'false', 'var(--dsa-text-muted)'],
              ['isFull', current.count === CAPACITY ? 'true' : 'false', 'var(--dsa-text-muted)'],
              ['Front()', current.items[current.head] ?? -1, GREEN],
              ['Rear()', current.items[(current.tail - 1 + CAPACITY) % CAPACITY] ?? -1, AMBER],
            ].map(([label, val, color]) => (
              <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>{label}</span>
                <span style={{ fontWeight: 700, color: color as string }}>{String(val)}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--dsa-text-muted)', lineHeight: 1.5 }}>
            {current.description}
          </div>
        </div>
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
