import React, { useState } from 'react';

// Stack operations — parenthesis matching for "(()())"
// Shows push on '(' and pop on ')', detecting balance

const INPUT = ['(', '(', ')', '(', ')', ')'];

const STEPS: {
  label: string;
  current: number;    // index being processed
  stack: string[];    // stack after processing
  matched: number[];  // indices of matched pairs (shown green)
  valid: boolean | null;
  note: string;
}[] = [
  {
    label: 'Start — empty stack',
    current: -1, stack: [], matched: [], valid: null,
    note: 'We use a stack to match brackets. Push "(" onto the stack; when we see ")" we pop — if the stack is empty during a pop, the string is invalid.',
  },
  {
    label: 'Process "(" at idx 0',
    current: 0, stack: ['('], matched: [], valid: null,
    note: 'Open bracket — push onto stack. Stack: ["("]',
  },
  {
    label: 'Process "(" at idx 1',
    current: 1, stack: ['(', '('], matched: [], valid: null,
    note: 'Open bracket — push onto stack. Stack: ["(", "("]',
  },
  {
    label: 'Process ")" at idx 2',
    current: 2, stack: ['('], matched: [1, 2], valid: null,
    note: 'Close bracket — pop from stack. Stack was non-empty: match found (indices 1 & 2). Stack: ["("]',
  },
  {
    label: 'Process "(" at idx 3',
    current: 3, stack: ['(', '('], matched: [1, 2], valid: null,
    note: 'Open bracket — push onto stack. Stack: ["(", "("]',
  },
  {
    label: 'Process ")" at idx 4',
    current: 4, stack: ['('], matched: [1, 2, 3, 4], valid: null,
    note: 'Close bracket — pop from stack. Match found (indices 3 & 4). Stack: ["("]',
  },
  {
    label: 'Process ")" at idx 5',
    current: 5, stack: [], matched: [0, 1, 2, 3, 4, 5], valid: null,
    note: 'Close bracket — pop from stack. Match found (indices 0 & 5). Stack: []',
  },
  {
    label: 'Valid! Stack is empty.',
    current: -1, stack: [], matched: [0, 1, 2, 3, 4, 5], valid: true,
    note: 'All characters processed and stack is empty → the string is VALID. If the stack were non-empty, there would be unmatched open brackets.',
  },
];

const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';
const red = '#ef4444';

export default function StackOperationsDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  const matchedSet = new Set(s.matched);

  const cellColor = (i: number) => {
    if (i === s.current) return accent;
    if (matchedSet.has(i)) return '#064e3b';
    return '#374151';
  };

  const cellBorder = (i: number) => {
    if (i === s.current) return `2px solid #a5b4fc`;
    if (matchedSet.has(i)) return `2px solid ${green}`;
    return '2px solid transparent';
  };

  const cellTextColor = (i: number) => {
    if (i === s.current) return '#fff';
    if (matchedSet.has(i)) return '#86efac';
    return '#9ca3af';
  };

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        Stack — Bracket Matching on "(()())"
      </div>

      {/* Input string */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>INPUT STRING</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {INPUT.map((ch, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: cellColor(i),
                border: cellBorder(i),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700,
                color: cellTextColor(i),
                transition: 'background 0.3s',
              }}>{ch}</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>idx {i}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11 }}>
          <span style={{ color: accent }}>■ current</span>
          <span style={{ color: green }}>■ matched</span>
          <span style={{ color: '#9ca3af' }}>■ pending</span>
        </div>
      </div>

      {/* Stack */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>STACK (top → right)</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', minHeight: 52 }}>
          <div style={{ fontSize: 12, color: '#4b5563', marginRight: 4 }}>bottom</div>
          {s.stack.length === 0 ? (
            <div style={{ color: '#4b5563', fontSize: 13, fontStyle: 'italic' }}>empty</div>
          ) : (
            s.stack.map((ch, i) => (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: 8,
                background: '#1f2937',
                border: `2px solid ${accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700, color: '#a5b4fc',
              }}>{ch}</div>
            ))
          )}
          <div style={{ fontSize: 12, color: '#4b5563', marginLeft: 4 }}>top</div>
        </div>
      </div>

      {/* Valid/invalid indicator */}
      {s.valid !== null && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: s.valid ? '#064e3b' : '#450a0a',
          border: `2px solid ${s.valid ? green : red}`,
          borderRadius: 8, padding: '8px 16px', marginBottom: 16,
          fontSize: 14, fontWeight: 700,
          color: s.valid ? '#86efac' : '#fca5a5',
        }}>
          {s.valid ? '✓ VALID' : '✗ INVALID'}
        </div>
      )}

      {/* Note */}
      <div style={{
        background: '#1f2937', borderRadius: 8, padding: '10px 14px',
        fontSize: 13, color: '#d1d5db', lineHeight: 1.5, marginBottom: 16,
        borderLeft: `3px solid ${amber}`,
      }}>
        {s.note}
      </div>

      {/* Stack rules reminder */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12 }}>
        <div style={{ background: '#1f2937', padding: '6px 12px', borderRadius: 6, color: '#a5b4fc' }}>
          "(" → push
        </div>
        <div style={{ background: '#1f2937', padding: '6px 12px', borderRadius: 6, color: '#86efac' }}>
          ")" + non-empty → pop (match)
        </div>
        <div style={{ background: '#1f2937', padding: '6px 12px', borderRadius: 6, color: '#fca5a5' }}>
          ")" + empty → invalid
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === 0 ? '#374151' : accent, color: step === 0 ? '#6b7280' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          ← Prev</button>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Step {step + 1} / {STEPS.length} — {s.label}</span>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === STEPS.length - 1 ? '#374151' : accent, color: step === STEPS.length - 1 ? '#6b7280' : '#fff', cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          Next →</button>
      </div>
    </div>
  );
}
