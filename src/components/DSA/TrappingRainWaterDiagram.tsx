// src/components/DSA/TrappingRainWaterDiagram.tsx
// height = [4,2,0,3,2,5], total trapped = 9.
// Shows bar chart with water fill, leftMax/rightMax water-level lines,
// and a two-pointer step table.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const WATER   = '#38bdf8';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

const H = [4, 2, 0, 3, 2, 5];
const N = H.length;
const UNIT  = 30;   // px per height unit
const BAR_W = 38;
const GAP   = 8;
const PAD_X = 28;
const MAX_H = 5;
const BASE_Y = 20 + MAX_H * UNIT; // y-coordinate of bar bottoms

// Precompute water per cell: min(leftMax, rightMax) - height[i]
const leftMax  = H.map((_, i) => Math.max(...H.slice(0, i + 1)));
const rightMax = H.map((_, i) => Math.max(...H.slice(i)));
const WATER_H  = H.map((h, i) => Math.min(leftMax[i], rightMax[i]) - h);

// Two-pointer steps for the table
const STEPS = [
  { l: 0, r: 5, lmax: 4, rmax: 5, added: '—', total: 0,  note: 'init' },
  { l: 1, r: 5, lmax: 4, rmax: 5, added: '2', total: 2,  note: 'lmax(4) < rmax(5) → advance l' },
  { l: 2, r: 5, lmax: 4, rmax: 5, added: '4', total: 6,  note: 'lmax(4) < rmax(5) → advance l' },
  { l: 3, r: 5, lmax: 4, rmax: 5, added: '1', total: 7,  note: 'lmax(4) < rmax(5) → advance l' },
  { l: 4, r: 5, lmax: 4, rmax: 5, added: '2', total: 9,  note: 'lmax(4) < rmax(5) → advance l' },
  { l: 4, r: 5, lmax: 4, rmax: 5, added: '—', total: 9,  note: 'l < r → loop ends → return 9' },
];

function barX(i: number) {
  return PAD_X + i * (BAR_W + GAP);
}

const SVG_W = PAD_X * 2 + N * (BAR_W + GAP) - GAP;
const SVG_H = BASE_Y + 40;

export default function TrappingRainWaterDiagram() {
  const [step, setStep] = useState(STEPS.length - 1);
  const s = STEPS[step];

  // At current step, which cells are "processed" (l pointer has passed them)
  const processedUpTo = s.l - 1;

  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 14, textAlign: 'center' }}>
        height = [4,2,0,3,2,5] · trapped = 9 units · two-pointer O(1) space
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 36, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <svg width={SVG_W} height={SVG_H} style={{ overflow: 'visible' }}>
            {/* Y-axis gridlines */}
            {[1, 2, 3, 4, 5].map(y => (
              <line key={y}
                x1={PAD_X - 4} y1={BASE_Y - y * UNIT}
                x2={PAD_X + N * (BAR_W + GAP) - GAP + 4} y2={BASE_Y - y * UNIT}
                stroke={BORDER} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
            ))}
            {[1, 2, 3, 4, 5].map(y => (
              <text key={y} x={PAD_X - 8} y={BASE_Y - y * UNIT + 4}
                textAnchor="end" fontSize={9} fill={MUTED}
                fontFamily="var(--ifm-font-family-monospace)">{y}</text>
            ))}

            {/* Water fill + bars */}
            {H.map((h, i) => {
              const x = barX(i);
              const barTop = BASE_Y - h * UNIT;
              const wh = WATER_H[i];
              const waterTop = BASE_Y - (h + wh) * UNIT;
              const isL = i === s.l;
              const isR = i === s.r;
              const barColor = (isL || isR) ? AMBER : ACCENT2;

              return (
                <g key={i}>
                  {/* Water */}
                  {wh > 0 && (
                    <rect x={x} y={waterTop} width={BAR_W} height={wh * UNIT}
                      fill={WATER} opacity={0.35} />
                  )}
                  {/* Bar */}
                  <rect x={x} y={barTop} width={BAR_W} height={h * UNIT}
                    fill={`color-mix(in srgb, ${barColor} 25%, transparent)`}
                    stroke={barColor} strokeWidth={isL || isR ? 2.5 : 1.5} rx={2} />
                  {/* Height label inside bar */}
                  {h > 0 && (
                    <text x={x + BAR_W / 2} y={barTop + (h * UNIT) / 2 + 4}
                      textAnchor="middle" fontSize={11} fontWeight={700}
                      fill={barColor} fontFamily="var(--ifm-font-family-monospace)">{h}</text>
                  )}
                  {/* Water unit label */}
                  {wh > 0 && (
                    <text x={x + BAR_W / 2} y={waterTop + (wh * UNIT) / 2 + 4}
                      textAnchor="middle" fontSize={10} fontWeight={700}
                      fill={WATER} fontFamily="var(--ifm-font-family-monospace)">{wh}</text>
                  )}
                  {/* Index label */}
                  <text x={x + BAR_W / 2} y={BASE_Y + 14}
                    textAnchor="middle" fontSize={10} fill={MUTED}
                    fontFamily="var(--ifm-font-family-monospace)">{i}</text>
                  {/* Pointer arrows */}
                  {isL && (
                    <text x={x + BAR_W / 2} y={BASE_Y + 28}
                      textAnchor="middle" fontSize={10} fontWeight={700}
                      fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">l</text>
                  )}
                  {isR && (
                    <text x={x + BAR_W / 2} y={BASE_Y + 28}
                      textAnchor="middle" fontSize={10} fontWeight={700}
                      fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">r</text>
                  )}
                </g>
              );
            })}

            {/* leftMax / rightMax water-level line */}
            {step > 0 && step < STEPS.length - 1 && (() => {
              const lx  = barX(s.l);
              const lineY = BASE_Y - s.lmax * UNIT;
              return (
                <line x1={PAD_X} y1={lineY} x2={lx + BAR_W} y2={lineY}
                  stroke={AMBER} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7} />
              );
            })()}
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { color: ACCENT2, label: 'elevation bar' },
              { color: WATER,   label: 'trapped water' },
              { color: AMBER,   label: 'l / r pointer' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: color === WATER ? 0.5 : 1 }} />
                <span style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step table + controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4, minWidth: 260 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', color: MUTED, fontWeight: 700, marginBottom: 4 }}>
            Two-pointer trace:
          </div>
          <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: 6, color: MUTED, paddingBottom: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 2 }}>
              <span style={{ minWidth: 18 }}>l</span>
              <span style={{ minWidth: 18 }}>r</span>
              <span style={{ minWidth: 38 }}>lMax</span>
              <span style={{ minWidth: 38 }}>rMax</span>
              <span style={{ minWidth: 28 }}>+W</span>
              <span style={{ minWidth: 36 }}>total</span>
            </div>
            {STEPS.map((s2, i) => (
              <div key={i} style={{
                display: 'flex', gap: 6,
                color: i === step ? AMBER : MUTED,
                fontWeight: i === step ? 700 : 400,
                background: i === step ? `color-mix(in srgb, ${AMBER} 8%, transparent)` : 'transparent',
                borderRadius: 4, padding: '1px 3px',
                cursor: 'pointer',
              }} onClick={() => setStep(i)}>
                <span style={{ minWidth: 18 }}>{s2.l}</span>
                <span style={{ minWidth: 18 }}>{s2.r}</span>
                <span style={{ minWidth: 38 }}>{s2.lmax}</span>
                <span style={{ minWidth: 38 }}>{s2.rmax}</span>
                <span style={{ minWidth: 28, color: s2.added !== '—' ? WATER : MUTED }}>{s2.added !== '—' ? `+${s2.added}` : '—'}</span>
                <span style={{ minWidth: 36, color: i === STEPS.length - 1 ? AMBER : MUTED }}>{s2.total}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 4, fontStyle: 'italic' }}>
            click a row to highlight that step
          </div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', background: `color-mix(in srgb, ${AMBER} 6%, transparent)`, borderRadius: 6, padding: '6px 8px', marginTop: 4 }}>
            {STEPS[step].note}
          </div>
        </div>
      </div>
    </div>
  );
}
