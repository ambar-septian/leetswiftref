// src/components/DSA/ContainerWithMostWaterDiagram.tsx
// Visualises the two-pointer approach for height = [1,8,6,2,5,4,8,3,7].
// Shows bars, water container fill, and a step-by-step trace table.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const WATER   = '#38bdf8';
const GREEN   = '#4ade80';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

const H: number[] = [1, 8, 6, 2, 5, 4, 8, 3, 7];
const N = H.length;
const MAX_AREA = 49;

const STEPS = [
  { l: 0, r: 8, action: 'h[L]=1 < h[R]=7  → move L right' },
  { l: 1, r: 8, action: 'h[R]=7 < h[L]=8  → move R left' },
  { l: 1, r: 7, action: 'h[R]=3 < h[L]=8  → move R left' },
  { l: 1, r: 6, action: 'h[L]=h[R]=8, equal → move L right' },
  { l: 2, r: 6, action: 'h[L]=6 < h[R]=8  → move L right' },
  { l: 3, r: 6, action: 'h[L]=2 < h[R]=8  → move L right' },
  { l: 4, r: 6, action: 'h[L]=5 < h[R]=8  → move L right' },
  { l: 5, r: 6, action: 'L+1 == R → loop ends → return 49' },
];

function area(l: number, r: number) {
  return Math.min(H[l], H[r]) * (r - l);
}

const UNIT  = 26;   // px per height unit
const BAR_W = 34;
const GAP   = 6;
const PAD_X = 22;
const MAX_H_VAL = 8;
const BASE_Y = 16 + MAX_H_VAL * UNIT;

function barX(i: number) { return PAD_X + i * (BAR_W + GAP); }

const SVG_W = PAD_X * 2 + N * (BAR_W + GAP) - GAP;
const SVG_H = BASE_Y + 38;

export default function ContainerWithMostWaterDiagram() {
  const [step, setStep] = useState(1);
  const s = STEPS[step];
  const curArea  = area(s.l, s.r);
  const maxSoFar = Math.max(...STEPS.slice(0, step + 1).map(st => area(st.l, st.r)));
  const isMax    = curArea === MAX_AREA;
  const waterLvl = Math.min(H[s.l], H[s.r]);
  const containerColor = isMax ? GREEN : WATER;

  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 14, textAlign: 'center' }}>
        height = [1,8,6,2,5,4,8,3,7] · max area = 49
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <svg width={SVG_W} height={SVG_H} style={{ overflow: 'visible' }}>

            {/* Gridlines */}
            {[2, 4, 6, 8].map(y => (
              <line key={y}
                x1={PAD_X - 4} y1={BASE_Y - y * UNIT}
                x2={SVG_W - PAD_X + 4} y2={BASE_Y - y * UNIT}
                stroke={BORDER} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
            ))}
            {[2, 4, 6, 8].map(y => (
              <text key={y} x={PAD_X - 8} y={BASE_Y - y * UNIT + 4}
                textAnchor="end" fontSize={9} fill={MUTED}
                fontFamily="var(--ifm-font-family-monospace)">{y}</text>
            ))}

            {/* Water container fill from bar L to bar R */}
            <rect
              x={barX(s.l)}
              y={BASE_Y - waterLvl * UNIT}
              width={barX(s.r) + BAR_W - barX(s.l)}
              height={waterLvl * UNIT}
              fill={`color-mix(in srgb, ${containerColor} 18%, transparent)`}
              stroke={containerColor}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              rx={2}
            />

            {/* Bars */}
            {H.map((h, i) => {
              const x      = barX(i);
              const barTop = BASE_Y - h * UNIT;
              const isL    = i === s.l;
              const isR    = i === s.r;
              const color  = (isL || isR) ? AMBER : ACCENT2;

              return (
                <g key={i}>
                  <rect x={x} y={barTop} width={BAR_W} height={h * UNIT}
                    fill={`color-mix(in srgb, ${color} 22%, transparent)`}
                    stroke={color} strokeWidth={isL || isR ? 2.5 : 1.5} rx={2} />

                  {h > 1 && (
                    <text x={x + BAR_W / 2} y={barTop + (h * UNIT) / 2 + 4}
                      textAnchor="middle" fontSize={10} fontWeight={700}
                      fill={color} fontFamily="var(--ifm-font-family-monospace)">{h}</text>
                  )}

                  {/* Index */}
                  <text x={x + BAR_W / 2} y={BASE_Y + 14}
                    textAnchor="middle" fontSize={9} fill={MUTED}
                    fontFamily="var(--ifm-font-family-monospace)">{i}</text>

                  {/* Pointer labels */}
                  {isL && (
                    <text x={x + BAR_W / 2} y={BASE_Y + 28}
                      textAnchor="middle" fontSize={10} fontWeight={700}
                      fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">L</text>
                  )}
                  {isR && (
                    <text x={x + BAR_W / 2} y={BASE_Y + 28}
                      textAnchor="middle" fontSize={10} fontWeight={700}
                      fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">R</text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Area badge */}
          <div style={{
            fontSize: 12, fontFamily: 'var(--ifm-font-family-monospace)',
            color: isMax ? GREEN : WATER, fontWeight: 700,
            background: `color-mix(in srgb, ${containerColor} 10%, transparent)`,
            border: `1px solid ${containerColor}`,
            borderRadius: 6, padding: '4px 12px',
          }}>
            area = min({H[s.l]},{H[s.r]}) × {s.r - s.l} = {curArea}{isMax ? ' ← max!' : ''}
          </div>
        </div>

        {/* Step table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4, minWidth: 270 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', color: MUTED, fontWeight: 700, marginBottom: 4 }}>
            Two-pointer trace:
          </div>
          <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)' }}>
            <div style={{ display: 'flex', gap: 8, color: MUTED, paddingBottom: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 2 }}>
              <span style={{ minWidth: 20 }}>L</span>
              <span style={{ minWidth: 20 }}>R</span>
              <span style={{ minWidth: 20 }}>h[L]</span>
              <span style={{ minWidth: 20 }}>h[R]</span>
              <span style={{ minWidth: 38 }}>area</span>
            </div>
            {STEPS.map((st, i) => {
              const a = area(st.l, st.r);
              return (
                <div key={i} style={{
                  display: 'flex', gap: 8,
                  color: i === step ? AMBER : MUTED,
                  fontWeight: i === step ? 700 : 400,
                  background: i === step ? `color-mix(in srgb, ${AMBER} 8%, transparent)` : 'transparent',
                  borderRadius: 4, padding: '2px 4px',
                  cursor: 'pointer',
                }} onClick={() => setStep(i)}>
                  <span style={{ minWidth: 20 }}>{st.l}</span>
                  <span style={{ minWidth: 20 }}>{st.r}</span>
                  <span style={{ minWidth: 20 }}>{H[st.l]}</span>
                  <span style={{ minWidth: 20 }}>{H[st.r]}</span>
                  <span style={{ minWidth: 38, color: a === MAX_AREA ? GREEN : (i === step ? AMBER : MUTED), fontWeight: a === MAX_AREA ? 700 : undefined }}>
                    {a}{a === MAX_AREA ? ' ★' : ''}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', fontStyle: 'italic' }}>
            click a row to highlight that step
          </div>
          <div style={{
            fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)',
            background: `color-mix(in srgb, ${AMBER} 6%, transparent)`,
            borderRadius: 6, padding: '6px 8px', marginTop: 2,
          }}>
            {s.action}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: AMBER,   label: 'active pointers (L, R)' },
          { color: WATER,   label: 'current container' },
          { color: GREEN,   label: 'maximum area (49)' },
          { color: ACCENT2, label: 'other bars' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.8 }} />
            <span style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
