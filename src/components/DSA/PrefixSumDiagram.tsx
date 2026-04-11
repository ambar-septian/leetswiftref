// src/components/DSA/PrefixSumDiagram.tsx
// Interactive step-through: build prefix sum array, then answer a range query.

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

const NUMS = [2, 3, -1, 4, 2];
// prefix[i] = sum of nums[0..i-1], prefix[0] = 0
const PREFIX = [0, 2, 5, 4, 8, 10];

// Steps: build prefix array one element at a time, then show a query
const BUILD_STEPS = [
  { built: 1, desc: 'Initialise: prefix[0] = 0 (empty prefix sum)', highlight: -1 },
  { built: 2, desc: 'prefix[1] = prefix[0] + nums[0] = 0 + 2 = 2', highlight: 0 },
  { built: 3, desc: 'prefix[2] = prefix[1] + nums[1] = 2 + 3 = 5', highlight: 1 },
  { built: 4, desc: 'prefix[3] = prefix[2] + nums[2] = 5 + (−1) = 4', highlight: 2 },
  { built: 5, desc: 'prefix[4] = prefix[3] + nums[3] = 4 + 4 = 8', highlight: 3 },
  { built: 6, desc: 'prefix[5] = prefix[4] + nums[4] = 8 + 2 = 10. Build complete!', highlight: 4 },
  { built: 6, desc: 'Query: sum(1, 3) = prefix[4] − prefix[1] = 8 − 2 = 6  (O(1)!)', highlight: -1, query: true },
];

const CELL_W = 44;
const CELL_H = 36;

function Cell({ value, color, bg, label }: { value: string; color: string; bg?: string; label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {label && <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</div>}
      <div style={{
        width: CELL_W, height: CELL_H,
        border: `1.5px solid ${color}`,
        borderRadius: 6,
        background: bg ?? `rgba(74,222,128,0.07)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--ifm-font-family-monospace)',
        fontSize: 15, fontWeight: 700, color,
      }}>{value}</div>
    </div>
  );
}

export default function PrefixSumDiagram() {
  const [step, setStep] = useState(0);
  const s = BUILD_STEPS[step];

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '20px 16px',
      margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Prefix Sum — Interactive Build + Query
      </div>

      {/* Input array */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 8, textAlign: 'center' }}>
          Input: nums
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {NUMS.map((v, i) => {
            const isHighlighted = s.highlight === i;
            const isQueryRange = s.query && i >= 1 && i <= 3;
            return (
              <Cell
                key={i}
                value={String(v)}
                color={isHighlighted ? AMBER : isQueryRange ? ACCENT2 : ACCENT}
                bg={isHighlighted ? 'rgba(245,158,11,0.15)' : isQueryRange ? 'rgba(34,211,238,0.12)' : undefined}
                label={`[${i}]`}
              />
            );
          })}
        </div>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: 'center', fontSize: 18, color: MUTED, marginBottom: 12 }}>↓</div>

      {/* Prefix array */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 8, textAlign: 'center' }}>
          Prefix sum array
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {PREFIX.map((v, i) => {
            const isBuilt = i < s.built;
            const isQueryL = s.query && i === 1;
            const isQueryR = s.query && i === 4;
            const color = !isBuilt ? MUTED
              : isQueryL ? AMBER
              : isQueryR ? AMBER
              : PURPLE;
            const bg = !isBuilt ? 'rgba(107,114,128,0.07)'
              : (isQueryL || isQueryR) ? 'rgba(245,158,11,0.15)'
              : 'rgba(167,139,250,0.12)';
            return (
              <Cell
                key={i}
                value={isBuilt ? String(v) : '?'}
                color={color}
                bg={bg}
                label={`[${i}]`}
              />
            );
          })}
        </div>
      </div>

      {/* Query result */}
      {s.query && (
        <div style={{
          background: SURFACE2,
          border: `1px solid ${AMBER}`,
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 16,
          textAlign: 'center',
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: 13,
          color: AMBER,
        }}>
          sum(1, 3) = prefix[4] − prefix[1] = 8 − 2 = <span style={{ fontWeight: 700 }}>6</span>
        </div>
      )}

      {/* Step description */}
      <div style={{
        background: SURFACE2,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        minHeight: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, color: TEXT, textAlign: 'center' }}>
          {s.desc}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{
            padding: '6px 18px', borderRadius: 6, border: `1px solid ${BORDER}`,
            background: step === 0 ? SURFACE2 : ACCENT, color: step === 0 ? MUTED : '#000',
            fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, cursor: step === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}>← Prev</button>
        <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>
          {step + 1} / {BUILD_STEPS.length}
        </span>
        <button
          onClick={() => setStep(Math.min(BUILD_STEPS.length - 1, step + 1))}
          disabled={step === BUILD_STEPS.length - 1}
          style={{
            padding: '6px 18px', borderRadius: 6, border: `1px solid ${BORDER}`,
            background: step === BUILD_STEPS.length - 1 ? SURFACE2 : ACCENT, color: step === BUILD_STEPS.length - 1 ? MUTED : '#000',
            fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, cursor: step === BUILD_STEPS.length - 1 ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}>Next →</button>
      </div>
    </div>
  );
}
