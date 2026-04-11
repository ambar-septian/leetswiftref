// src/components/DSA/VariableWindowDiagram.tsx
// Interactive: variable-size sliding window — min subarray with sum >= target.
// nums=[2,3,1,2,4,3], target=7

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

const NUMS = [2, 3, 1, 2, 4, 3];
const TARGET = 7;

type Step = { L: number; R: number; sum: number; minLen: number; action: 'expand' | 'shrink' | 'done'; desc: string };

const STEPS: Step[] = [
  { L: 0, R: 0, sum: 2,  minLen: Infinity, action: 'expand', desc: 'Expand R: add nums[0]=2 → sum=2 < 7, keep expanding' },
  { L: 0, R: 1, sum: 5,  minLen: Infinity, action: 'expand', desc: 'Expand R: add nums[1]=3 → sum=5 < 7, keep expanding' },
  { L: 0, R: 2, sum: 6,  minLen: Infinity, action: 'expand', desc: 'Expand R: add nums[2]=1 → sum=6 < 7, keep expanding' },
  { L: 0, R: 3, sum: 8,  minLen: 4,        action: 'shrink', desc: 'Expand R: add nums[3]=2 → sum=8 >= 7 ✓ window=4. Shrink L.' },
  { L: 1, R: 3, sum: 6,  minLen: 4,        action: 'expand', desc: 'Shrink L: remove nums[0]=2 → sum=6 < 7, stop shrinking. Expand R.' },
  { L: 1, R: 4, sum: 10, minLen: 4,        action: 'shrink', desc: 'Expand R: add nums[4]=4 → sum=10 >= 7 ✓ window=4. Shrink L.' },
  { L: 2, R: 4, sum: 7,  minLen: 3,        action: 'shrink', desc: 'Shrink L: remove nums[1]=3 → sum=7 >= 7 ✓ window=3. New min! Shrink L.' },
  { L: 3, R: 4, sum: 6,  minLen: 3,        action: 'expand', desc: 'Shrink L: remove nums[2]=1 → sum=6 < 7, stop shrinking. Expand R.' },
  { L: 3, R: 5, sum: 9,  minLen: 3,        action: 'shrink', desc: 'Expand R: add nums[5]=3 → sum=9 >= 7 ✓ window=3. Shrink L.' },
  { L: 4, R: 5, sum: 7,  minLen: 2,        action: 'done',   desc: 'Shrink L: remove nums[3]=2 → sum=7 >= 7 ✓ window=2. New min! R=5=end → done. Answer=2.' },
];

export default function VariableWindowDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const minDisplay = s.minLen === Infinity ? '∞' : String(s.minLen);
  const actionColor = s.action === 'expand' ? ACCENT : s.action === 'shrink' ? AMBER : PURPLE;
  const actionLabel = s.action === 'expand' ? '→ Expand R' : s.action === 'shrink' ? '← Shrink L' : '✓ Done';

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '20px 16px',
      margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 6, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Variable Window — Minimum Subarray with Sum ≥ {TARGET}
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Expand R until sum meets target · Shrink L while sum still meets target
      </div>

      {/* Array */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        {NUMS.map((v, i) => {
          const inWindow = i >= s.L && i <= s.R;
          const isL = i === s.L;
          const isR = i === s.R;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 44, height: 44,
                border: `2px solid ${inWindow ? (s.sum >= TARGET ? AMBER : ACCENT) : BORDER}`,
                borderRadius: 6,
                background: inWindow ? (s.sum >= TARGET ? 'rgba(245,158,11,0.14)' : 'rgba(74,222,128,0.10)') : 'rgba(107,114,128,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 16, fontWeight: 700,
                color: inWindow ? (s.sum >= TARGET ? AMBER : ACCENT) : MUTED,
              }}>{v}</div>
              <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
            </div>
          );
        })}
      </div>

      {/* Pointer labels */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {NUMS.map((_, i) => {
          const isL = i === s.L, isR = i === s.R;
          return (
            <div key={i} style={{ width: 44, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 9, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              {isL && <span style={{ color: ACCENT }}>L</span>}
              {isR && <span style={{ color: ACCENT2 }}>R</span>}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Window sum', value: s.sum, color: s.sum >= TARGET ? AMBER : ACCENT2 },
          { label: 'Window size', value: s.R - s.L + 1, color: ACCENT },
          { label: 'Min length', value: minDisplay, color: PURPLE },
          { label: 'Action', value: actionLabel, color: actionColor },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{
        background: SURFACE2, border: `1px solid ${s.action === 'done' ? PURPLE : BORDER}`,
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
