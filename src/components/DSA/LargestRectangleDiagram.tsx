// src/components/DSA/LargestRectangleDiagram.tsx
// Visualises the monotonic stack approach for heights = [2,1,5,6,2,3].
// Shows the histogram bars, the maximum rectangle (area=10), and the
// key stack state at i=4 when bars 5 and 6 are popped.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

const HEIGHTS = [2, 1, 5, 6, 2, 3];
const SCALE   = 16;   // px per unit height
const W       = 40;   // bar width px
const GAP     = 6;    // gap between bars px
const MAX_H   = 6;

// Max rectangle: spans indices 2–3, limited to height 5 → area 10
const RECT = { fromIdx: 2, toIdx: 3, limitHeight: 5 };

// Key stack pop event at i=4: bars popped and areas computed
const POPS = [
  { index: 3, height: 6, i: 4, area: 6 },
  { index: 2, height: 5, i: 4, area: 10 },
];

function barLeft(idx: number) { return idx * (W + GAP); }

export default function LargestRectangleDiagram() {
  const containerH = MAX_H * SCALE;
  const containerW = HEIGHTS.length * (W + GAP) - GAP;

  const rectLeft   = barLeft(RECT.fromIdx);
  const rectWidth  = (RECT.toIdx - RECT.fromIdx + 1) * W + (RECT.toIdx - RECT.fromIdx) * GAP;
  const rectHeight = RECT.limitHeight * SCALE;

  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 20, textAlign: 'center' }}>
        heights = [2,1,5,6,2,3] · max area = 10 (highlighted)
      </div>

      {/* Histogram */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ position: 'relative', width: containerW, height: containerH }}>
          {/* Max rectangle overlay */}
          <div style={{
            position: 'absolute',
            left: rectLeft,
            bottom: 0,
            width: rectWidth,
            height: rectHeight,
            background: `color-mix(in srgb, ${AMBER} 28%, transparent)`,
            border: `2px solid ${AMBER}`,
            borderRadius: 4,
            zIndex: 1,
          }} />

          {/* Bars */}
          {HEIGHTS.map((h, i) => {
            const isPopped = POPS.some(p => p.index === i);
            const color = isPopped ? RED : (i >= RECT.fromIdx && i <= RECT.toIdx ? AMBER : ACCENT2);
            return (
              <div key={i} style={{
                position: 'absolute',
                left: barLeft(i),
                bottom: 0,
                width: W,
                height: h * SCALE,
                background: `color-mix(in srgb, ${color} 20%, transparent)`,
                border: `2px solid ${color}`,
                borderRadius: '4px 4px 0 0',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                paddingTop: 3,
                zIndex: 2,
              }}>
                <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, fontWeight: 700, color }}>{h}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Index labels */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: GAP }}>
          {HEIGHTS.map((_, i) => (
            <div key={i} style={{ width: W, textAlign: 'center', fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>
              i={i}
            </div>
          ))}
        </div>
      </div>

      {/* Stack pop events */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', alignSelf: 'center' }}>
          when i=4 (h=2):
        </div>
        {POPS.map((p, idx) => (
          <div key={idx} style={{
            border: `1px solid ${p.area === 10 ? AMBER : RED}`,
            borderRadius: 8, padding: '4px 10px',
            background: `color-mix(in srgb, ${p.area === 10 ? AMBER : RED} 10%, transparent)`,
            fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)',
            color: p.area === 10 ? AMBER : RED,
          }}>
            pop h={p.height} · area = {p.height}×({p.i}−{p.index}) = <strong>{p.area}</strong>
            {p.area === 10 ? ' ← max' : ''}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: AMBER,   label: 'max rectangle (area=10)' },
          { color: RED,     label: 'popped bar' },
          { color: ACCENT2, label: 'remaining in stack' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
