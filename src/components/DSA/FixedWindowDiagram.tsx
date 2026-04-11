// src/components/DSA/FixedWindowDiagram.tsx
// Interactive: fixed-size sliding window — max sum of k=3 consecutive elements.

import React, { useState } from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';
const TEXT    = '#e8eaf0';

const NUMS = [2, 1, 5, 1, 3, 2];
const K = 3;

// Precompute steps: each step is one window position
const STEPS = (() => {
  const steps = [];
  let windowSum = NUMS.slice(0, K).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  steps.push({ L: 0, R: K - 1, windowSum, maxSum, desc: `Initial window [0..2]: sum = ${windowSum}` });
  for (let L = 1; L <= NUMS.length - K; L++) {
    const R = L + K - 1;
    windowSum = windowSum - NUMS[L - 1] + NUMS[R];
    maxSum = Math.max(maxSum, windowSum);
    steps.push({
      L, R, windowSum, maxSum,
      desc: `Slide window: subtract nums[${L-1}]=${NUMS[L-1]}, add nums[${R}]=${NUMS[R]} → sum = ${windowSum}${windowSum === maxSum ? ' ← new max!' : ''}`,
    });
  }
  return steps;
})();

export default function FixedWindowDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '20px 16px',
      margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 6, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Fixed Window (k={K}) — Maximum Sum Subarray
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Window slides right by 1 each step — add new element, remove outgoing element
      </div>

      {/* Array */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        {NUMS.map((v, i) => {
          const inWindow = i >= s.L && i <= s.R;
          const isLeft   = i === s.L;
          const isRight  = i === s.R;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 44, height: 44,
                border: `2px solid ${inWindow ? ACCENT : BORDER}`,
                borderRadius: 6,
                background: inWindow ? 'rgba(74,222,128,0.14)' : 'rgba(107,114,128,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 16, fontWeight: 700,
                color: inWindow ? ACCENT : MUTED,
                boxShadow: inWindow ? '0 0 0 1px rgba(74,222,128,0.2)' : 'none',
              }}>{v}</div>
              <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
            </div>
          );
        })}
      </div>

      {/* Window bracket labels */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {NUMS.map((_, i) => (
          <div key={i} style={{ width: 44, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 9, fontWeight: 700 }}>
            {i === s.L ? <span style={{ color: ACCENT }}>L</span> : i === s.R ? <span style={{ color: ACCENT }}>R</span> : null}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Window sum', value: s.windowSum, color: ACCENT2 },
          { label: 'Max so far', value: s.maxSum, color: AMBER },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{
        background: SURFACE2, border: `1px solid ${BORDER}`,
        borderRadius: 8, padding: '10px 16px', marginBottom: 16,
        minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: TEXT, textAlign: 'center' }}>
          {s.desc}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          style={{ padding: '6px 18px', borderRadius: 6, border: `1px solid ${BORDER}`, background: step === 0 ? SURFACE2 : ACCENT, color: step === 0 ? MUTED : '#000', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, cursor: step === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
          ← Prev
        </button>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>{step + 1} / {STEPS.length}</span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}
          style={{ padding: '6px 18px', borderRadius: 6, border: `1px solid ${BORDER}`, background: step === STEPS.length - 1 ? SURFACE2 : ACCENT, color: step === STEPS.length - 1 ? MUTED : '#000', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
          Next →
        </button>
      </div>
    </div>
  );
}
