// src/components/DSA/OppositeEndsDiagram.tsx
// Interactive: two pointers converging from opposite ends (palindrome check example).

import React, { useState } from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';
const TEXT    = '#e8eaf0';

// "racecar" palindrome check
const CHARS = ['r', 'a', 'c', 'e', 'c', 'a', 'r'];

const STEPS = [
  { L: 0, R: 6, match: true,  desc: "L=0, R=6 → 'r' == 'r' ✓  match, shrink window" },
  { L: 1, R: 5, match: true,  desc: "L=1, R=5 → 'a' == 'a' ✓  match, shrink window" },
  { L: 2, R: 4, match: true,  desc: "L=2, R=4 → 'c' == 'c' ✓  match, shrink window" },
  { L: 3, R: 3, match: true,  desc: "L=3, R=3 → pointers meet at 'e' → palindrome confirmed!" },
];

export default function OppositeEndsDiagram() {
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
        Opposite Ends — Palindrome Check on "racecar"
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Left pointer moves right, Right pointer moves left — they converge toward the center
      </div>

      {/* Array cells */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
        {CHARS.map((ch, i) => {
          const isL = i === s.L;
          const isR = i === s.R;
          const isBoth = isL && isR;
          const isInside = i > s.L && i < s.R;
          const isProcessed = i < s.L || i > s.R;

          const color = isBoth ? AMBER
            : isL ? ACCENT
            : isR ? ACCENT2
            : isProcessed ? MUTED
            : TEXT;
          const bg = isBoth ? 'rgba(245,158,11,0.18)'
            : isL ? 'rgba(74,222,128,0.15)'
            : isR ? 'rgba(34,211,238,0.15)'
            : isProcessed ? 'rgba(107,114,128,0.07)'
            : 'rgba(232,234,240,0.05)';
          const borderColor = isBoth ? AMBER : isL ? ACCENT : isR ? ACCENT2 : isProcessed ? MUTED : BORDER;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 40, height: 40,
                border: `2px solid ${borderColor}`,
                borderRadius: 6,
                background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 16, fontWeight: 700, color,
              }}>{ch}</div>
              <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
            </div>
          );
        })}
      </div>

      {/* Pointer labels */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
        {CHARS.map((_, i) => {
          const isL = i === s.L && i !== s.R;
          const isR = i === s.R && i !== s.L;
          const isBoth = i === s.L && i === s.R;
          return (
            <div key={i} style={{ width: 40, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 10, fontWeight: 700 }}>
              {isBoth ? <span style={{ color: AMBER }}>L=R</span>
                : isL ? <span style={{ color: ACCENT }}>L</span>
                : isR ? <span style={{ color: ACCENT2 }}>R</span>
                : null}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { color: ACCENT, label: 'Left pointer' },
          { color: ACCENT2, label: 'Right pointer' },
          { color: AMBER, label: 'Pointers meet' },
          { color: MUTED, label: 'Already checked' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Step description */}
      <div style={{
        background: SURFACE2, border: `1px solid ${BORDER}`,
        borderRadius: 8, padding: '10px 16px', marginBottom: 16,
        minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, color: TEXT, textAlign: 'center' }}>
          {s.desc}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          style={{
            padding: '6px 18px', borderRadius: 6, border: `1px solid ${BORDER}`,
            background: step === 0 ? SURFACE2 : ACCENT, color: step === 0 ? MUTED : '#000',
            fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, cursor: step === 0 ? 'not-allowed' : 'pointer', fontWeight: 600,
          }}>← Prev</button>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>{step + 1} / {STEPS.length}</span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1}
          style={{
            padding: '6px 18px', borderRadius: 6, border: `1px solid ${BORDER}`,
            background: step === STEPS.length - 1 ? SURFACE2 : ACCENT, color: step === STEPS.length - 1 ? MUTED : '#000',
            fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 600,
          }}>Next →</button>
      </div>
    </div>
  );
}
