// src/components/DSA/BinarySearchDiagram.tsx
// Interactive step-through: binary search for target=11 in a sorted array.

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

const NUMS = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const TARGET = 11;

const STEPS = [
  {
    lo: 0, hi: 9, mid: 4,
    status: 'searching',
    desc: 'lo=0, hi=9 → mid=4, nums[4]=9 < 11 → search right half: lo = mid+1 = 5',
  },
  {
    lo: 5, hi: 9, mid: 7,
    status: 'searching',
    desc: 'lo=5, hi=9 → mid=7, nums[7]=15 > 11 → search left half: hi = mid-1 = 6',
  },
  {
    lo: 5, hi: 6, mid: 5,
    status: 'found',
    desc: 'lo=5, hi=6 → mid=5, nums[5]=11 == 11 → target found at index 5!',
  },
];

export default function BinarySearchDiagram() {
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
        Binary Search — find target={TARGET} in sorted array
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Green = active window · Cyan = mid · Gray = eliminated
      </div>

      {/* Array */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
        {NUMS.map((v, i) => {
          const isEliminated = i < s.lo || i > s.hi;
          const isMid = i === s.mid;
          const isInWindow = i >= s.lo && i <= s.hi && i !== s.mid;

          const color = isMid && s.status === 'found' ? AMBER
            : isMid ? ACCENT2
            : isInWindow ? ACCENT
            : MUTED;
          const bg = isMid && s.status === 'found' ? 'rgba(245,158,11,0.20)'
            : isMid ? 'rgba(34,211,238,0.18)'
            : isInWindow ? 'rgba(74,222,128,0.10)'
            : 'rgba(107,114,128,0.05)';
          const borderColor = isMid && s.status === 'found' ? AMBER
            : isMid ? ACCENT2
            : isInWindow ? ACCENT
            : BORDER;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 38, height: 38,
                border: `2px solid ${borderColor}`,
                borderRadius: 6, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 13, fontWeight: 700, color,
                opacity: isEliminated ? 0.35 : 1,
              }}>{v}</div>
              <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
            </div>
          );
        })}
      </div>

      {/* Pointer labels */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 16 }}>
        {NUMS.map((_, i) => {
          const isLo  = i === s.lo;
          const isHi  = i === s.hi;
          const isMid = i === s.mid;
          const labels = [];
          if (isLo)  labels.push(<span key="lo"  style={{ color: ACCENT,  fontSize: 9, fontWeight: 700 }}>lo</span>);
          if (isMid) labels.push(<span key="mid" style={{ color: ACCENT2, fontSize: 9, fontWeight: 700 }}>mid</span>);
          if (isHi)  labels.push(<span key="hi"  style={{ color: PURPLE,  fontSize: 9, fontWeight: 700 }}>hi</span>);
          return (
            <div key={i} style={{ width: 38, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              {labels}
            </div>
          );
        })}
      </div>

      {/* State panel */}
      <div style={{
        background: SURFACE2, border: `1px solid ${BORDER}`,
        borderRadius: 8, padding: '10px 16px', marginBottom: 14,
        display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap',
      }}>
        {[
          { label: 'lo', value: s.lo, color: ACCENT },
          { label: 'mid', value: s.mid, color: ACCENT2 },
          { label: 'hi', value: s.hi, color: PURPLE },
          { label: 'nums[mid]', value: NUMS[s.mid], color: s.status === 'found' ? AMBER : TEXT },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{
        background: SURFACE2, border: `1px solid ${s.status === 'found' ? AMBER : BORDER}`,
        borderRadius: 8, padding: '10px 16px', marginBottom: 16,
        minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: s.status === 'found' ? AMBER : TEXT, textAlign: 'center' }}>
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
