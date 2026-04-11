// src/components/DSA/SameDirectionDiagram.tsx
// Interactive: slow/fast (write/read) pointers moving in the same direction.
// Example: remove duplicates from sorted array [0,0,1,1,2,2,3].

import React, { useState } from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const PURPLE  = '#a78bfa';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';
const TEXT    = '#e8eaf0';

// nums = [0,0,1,1,2,2,3]
// slow (write pointer), fast (read pointer)
// slow starts at 1, fast starts at 1
// Steps show (slow, fast, array state after write, desc)
type Step = { slow: number; fast: number; written: number[]; desc: string };

const INITIAL = [0, 0, 1, 1, 2, 2, 3];

const STEPS: Step[] = [
  {
    slow: 1, fast: 1,
    written: [0, 0, 1, 1, 2, 2, 3],
    desc: 'Init: slow=1, fast=1. nums[0]=0 is already in place (the first unique value).',
  },
  {
    slow: 1, fast: 1,
    written: [0, 0, 1, 1, 2, 2, 3],
    desc: 'fast=1: nums[1]=0 == nums[0]=0 → duplicate, skip. fast++.',
  },
  {
    slow: 1, fast: 2,
    written: [0, 1, 1, 1, 2, 2, 3],
    desc: 'fast=2: nums[2]=1 != nums[0]=0 → new unique. Write nums[slow]=1, slow++, fast++.',
  },
  {
    slow: 2, fast: 3,
    written: [0, 1, 1, 1, 2, 2, 3],
    desc: 'fast=3: nums[3]=1 == nums[2]=1 → duplicate, skip. fast++.',
  },
  {
    slow: 2, fast: 4,
    written: [0, 1, 2, 1, 2, 2, 3],
    desc: 'fast=4: nums[4]=2 != nums[1]=1 → new unique. Write nums[slow]=2, slow++, fast++.',
  },
  {
    slow: 3, fast: 5,
    written: [0, 1, 2, 1, 2, 2, 3],
    desc: 'fast=5: nums[5]=2 == nums[4]=2 → duplicate, skip. fast++.',
  },
  {
    slow: 3, fast: 6,
    written: [0, 1, 2, 3, 2, 2, 3],
    desc: 'fast=6: nums[6]=3 != nums[2]=2 → new unique. Write nums[slow]=3, slow++, fast++.',
  },
  {
    slow: 4, fast: 7,
    written: [0, 1, 2, 3, 2, 2, 3],
    desc: 'fast=7: out of bounds. Done! First slow=4 elements are the unique values: [0,1,2,3].',
  },
];

export default function SameDirectionDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const isDone = step === STEPS.length - 1;

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '20px 16px',
      margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 6, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Same Direction — Remove Duplicates from [0,0,1,1,2,2,3]
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        slow = write pointer, fast = read pointer — both move left to right
      </div>

      {/* Array cells */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
        {s.written.map((v, i) => {
          const isSlow = i === s.slow && !isDone;
          const isFast = i === s.fast && !isDone;
          const isUniqueZone = i < s.slow;
          const isProcessed = !isDone && i >= s.fast;

          const color = isSlow && isFast ? AMBER
            : isSlow ? PURPLE
            : isFast ? ACCENT2
            : isUniqueZone ? ACCENT
            : isProcessed ? MUTED
            : TEXT;
          const bg = isSlow && isFast ? 'rgba(245,158,11,0.18)'
            : isSlow ? 'rgba(167,139,250,0.15)'
            : isFast ? 'rgba(34,211,238,0.15)'
            : isUniqueZone ? 'rgba(74,222,128,0.10)'
            : isProcessed ? 'rgba(107,114,128,0.05)'
            : 'rgba(232,234,240,0.04)';
          const borderColor = isSlow && isFast ? AMBER : isSlow ? PURPLE : isFast ? ACCENT2 : isUniqueZone ? ACCENT : BORDER;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 38, height: 38,
                border: `2px solid ${borderColor}`,
                borderRadius: 6, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 15, fontWeight: 700, color,
              }}>{v}</div>
              <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
            </div>
          );
        })}
      </div>

      {/* Pointer labels */}
      {!isDone && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
          {s.written.map((_, i) => {
            const isSlow = i === s.slow;
            const isFast = i === s.fast;
            return (
              <div key={i} style={{ width: 38, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 9, fontWeight: 700 }}>
                {isSlow && isFast ? <span style={{ color: AMBER }}>S/F</span>
                  : isSlow ? <span style={{ color: PURPLE }}>slow</span>
                  : isFast ? <span style={{ color: ACCENT2 }}>fast</span>
                  : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { color: ACCENT, label: 'Unique zone (0..slow-1)' },
          { color: PURPLE, label: 'slow (write)' },
          { color: ACCENT2, label: 'fast (read)' },
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
        minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: TEXT, textAlign: 'center' }}>
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
