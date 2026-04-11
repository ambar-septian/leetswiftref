import React, { useState } from 'react';

// Monotonic Decreasing Stack — "Next Greater Element" on [2,1,5,6,2,3]
// Each step shows the current element being processed and the resulting stack state

const INPUT = [2, 1, 5, 6, 2, 3];

interface StackFrame {
  val: number;
  idx: number;
}

const STEPS: {
  label: string;
  current: number;        // index of current element being processed (-1 = none)
  stack: StackFrame[];    // stack after processing
  popped: number[];       // indices of elements just popped
  result: (number | null)[]; // next-greater result array so far
  note: string;
}[] = [
  {
    label: 'Start — empty stack',
    current: -1,
    stack: [],
    popped: [],
    result: [null, null, null, null, null, null],
    note: 'We maintain a monotonic decreasing stack of indices. For each element, pop everything smaller — they found their next greater element.',
  },
  {
    label: 'Process 2 (idx 0)',
    current: 0,
    stack: [{ val: 2, idx: 0 }],
    popped: [],
    result: [null, null, null, null, null, null],
    note: 'Stack is empty. Push index 0 (value 2). Stack: [2]',
  },
  {
    label: 'Process 1 (idx 1)',
    current: 1,
    stack: [{ val: 2, idx: 0 }, { val: 1, idx: 1 }],
    popped: [],
    result: [null, null, null, null, null, null],
    note: '1 ≤ 2 — does not violate decreasing order. Push index 1. Stack: [2, 1]',
  },
  {
    label: 'Process 5 (idx 2)',
    current: 2,
    stack: [{ val: 5, idx: 2 }],
    popped: [0, 1],
    result: [5, 5, null, null, null, null],
    note: '5 > 1 — pop idx 1 (val 1), its next greater = 5. 5 > 2 — pop idx 0 (val 2), its next greater = 5. Push index 2. Stack: [5]',
  },
  {
    label: 'Process 6 (idx 3)',
    current: 3,
    stack: [{ val: 6, idx: 3 }],
    popped: [2],
    result: [5, 5, 6, null, null, null],
    note: '6 > 5 — pop idx 2 (val 5), its next greater = 6. Push index 3. Stack: [6]',
  },
  {
    label: 'Process 2 (idx 4)',
    current: 4,
    stack: [{ val: 6, idx: 3 }, { val: 2, idx: 4 }],
    popped: [],
    result: [5, 5, 6, null, null, null],
    note: '2 ≤ 6 — does not violate decreasing order. Push index 4. Stack: [6, 2]',
  },
  {
    label: 'Process 3 (idx 5)',
    current: 5,
    stack: [{ val: 6, idx: 3 }, { val: 3, idx: 5 }],
    popped: [4],
    result: [5, 5, 6, null, 3, null],
    note: '3 > 2 — pop idx 4 (val 2), its next greater = 3. 3 ≤ 6 — stop. Push index 5. Stack: [6, 3]',
  },
  {
    label: 'End — drain remaining stack',
    current: -1,
    stack: [],
    popped: [3, 5],
    result: [5, 5, 6, -1, 3, -1],
    note: 'No more elements. Remaining stack indices (3 → val 6, 5 → val 3) have no next greater element — result is -1.',
  },
];

const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';
const red = '#ef4444';
const gray = '#374151';
const lightGray = '#1f2937';

export default function MonotonicStackDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  const stackIdxSet = new Set(s.stack.map(f => f.idx));
  const poppedSet = new Set(s.popped);

  const cellColor = (i: number) => {
    if (i === s.current) return accent;
    if (poppedSet.has(i)) return red;
    if (stackIdxSet.has(i)) return green;
    return gray;
  };

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      {/* Title */}
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        Next Greater Element — Monotonic Decreasing Stack on [2, 1, 5, 6, 2, 3]
      </div>

      {/* Input array */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>INPUT ARRAY</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {INPUT.map((v, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: cellColor(i),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700,
                border: i === s.current ? `2px solid #a5b4fc` : '2px solid transparent',
                transition: 'background 0.3s',
              }}>{v}</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>idx {i}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11 }}>
          <span style={{ color: accent }}>■ current</span>
          <span style={{ color: green }}>■ in stack</span>
          <span style={{ color: red }}>■ just popped</span>
          <span style={{ color: gray }}>■ not yet / done</span>
        </div>
      </div>

      {/* Stack visualization */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>STACK (top → right)</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', minHeight: 52 }}>
          <div style={{ fontSize: 12, color: '#4b5563', marginRight: 4 }}>bottom</div>
          {s.stack.length === 0 ? (
            <div style={{ color: '#4b5563', fontSize: 13, fontStyle: 'italic' }}>empty</div>
          ) : (
            s.stack.map((frame, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 8,
                  background: lightGray,
                  border: `2px solid ${green}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: green,
                }}>{frame.val}</div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>idx {frame.idx}</div>
              </div>
            ))
          )}
          <div style={{ fontSize: 12, color: '#4b5563', marginLeft: 4 }}>top</div>
        </div>
      </div>

      {/* Result array */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>RESULT (next greater)</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {s.result.map((v, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: v === null ? '#1f2937' : v === -1 ? '#374151' : '#064e3b',
                border: v === null ? '2px dashed #374151' : '2px solid #22c55e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700,
                color: v === null ? '#4b5563' : '#22c55e',
              }}>{v === null ? '?' : v === -1 ? '-1' : v}</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>idx {i}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div style={{
        background: '#1f2937', borderRadius: 8, padding: '10px 14px',
        fontSize: 13, color: '#d1d5db', lineHeight: 1.5, marginBottom: 16,
        borderLeft: `3px solid ${amber}`,
      }}>
        {s.note}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: '6px 16px', borderRadius: 6, border: 'none',
            background: step === 0 ? '#374151' : accent,
            color: step === 0 ? '#6b7280' : '#fff',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13,
          }}>← Prev</button>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Step {step + 1} / {STEPS.length} — {s.label}</span>
        <button
          onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: 'none',
            background: step === STEPS.length - 1 ? '#374151' : accent,
            color: step === STEPS.length - 1 ? '#6b7280' : '#fff',
            cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13,
          }}>Next →</button>
      </div>
    </div>
  );
}
