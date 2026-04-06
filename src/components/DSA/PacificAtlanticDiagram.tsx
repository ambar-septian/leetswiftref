// src/components/DSA/PacificAtlanticDiagram.tsx
// Visualises the 5×5 example grid for Pacific Atlantic Water Flow.
// Pacific border = top row + left col (cyan)
// Atlantic border = bottom row + right col (green)
// Intersection cells = both-reachable (amber)

import React from 'react';

const heights = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];

const ROWS = 5;
const COLS = 5;

// Cells reachable by both oceans (answer for this example)
const intersectionSet = new Set(['0,4', '1,3', '1,4', '2,2', '3,0', '3,1', '4,0']);

function cellType(r: number, c: number): 'both' | 'pacific' | 'atlantic' | 'normal' {
  const key = `${r},${c}`;
  if (intersectionSet.has(key)) return 'both';
  if (r === 0 || c === 0) return 'pacific';
  if (r === ROWS - 1 || c === COLS - 1) return 'atlantic';
  return 'normal';
}

export default function PacificAtlanticDiagram() {
  return (
    <div style={{
      background: 'var(--dsa-surface)',
      border: '1px solid var(--dsa-border)',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px 0',
    }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px', justifyContent: 'center' }}>
        {[
          { color: 'var(--dsa-accent2)', label: 'Pacific border seed' },
          { color: 'var(--dsa-accent)',  label: 'Atlantic border seed' },
          { color: '#f59e0b',            label: 'Reaches both oceans' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: color, opacity: 0.8 }} />
            <span style={{ fontSize: '12px', color: 'var(--dsa-text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Ocean label top */}
      <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--dsa-accent2)', marginBottom: '4px' }}>
        ← Pacific Ocean (top + left)
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-block' }}>
          {heights.map((row, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {row.map((val, c) => {
                const type = cellType(r, c);
                const bg =
                  type === 'both'     ? 'rgba(245,158,11,0.25)' :
                  type === 'pacific'  ? 'rgba(34,211,238,0.15)' :
                  type === 'atlantic' ? 'rgba(74,222,128,0.15)' :
                  'transparent';
                const border =
                  type === 'both'     ? '2px solid #f59e0b' :
                  type === 'pacific'  ? '2px solid var(--dsa-accent2)' :
                  type === 'atlantic' ? '2px solid var(--dsa-accent)' :
                  '1px solid var(--dsa-border)';
                const color =
                  type === 'both'     ? '#f59e0b' :
                  type === 'pacific'  ? 'var(--dsa-accent2)' :
                  type === 'atlantic' ? 'var(--dsa-accent)' :
                  'var(--dsa-text-muted)';

                return (
                  <div key={c} style={{
                    width: '44px', height: '44px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: bg,
                    border,
                    margin: '2px',
                    borderRadius: '6px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '14px', fontWeight: 600,
                    color,
                  }}>
                    {val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Ocean label bottom */}
      <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--dsa-accent)', marginTop: '4px' }}>
        Atlantic Ocean (bottom + right) →
      </div>

      {/* Caption */}
      <p style={{
        fontSize: '13px', color: 'var(--dsa-text-muted)',
        textAlign: 'center', marginTop: '16px', marginBottom: 0,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        7 cells reach both oceans — highlighted in amber
      </p>
    </div>
  );
}
