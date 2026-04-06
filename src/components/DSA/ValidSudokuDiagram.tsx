// src/components/DSA/ValidSudokuDiagram.tsx
// Shows a partial 9×9 board with row/col/box constraints highlighted.
// Demonstrates the box index formula: (i/3)*3 + (j/3).

import React, { useState } from 'react';

const ACCENT  = 'var(--dsa-accent)';
const ACCENT2 = 'var(--dsa-accent2)';
const AMBER   = '#f59e0b';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

// Partial board — "." for empty
const board = [
  ['5','3','.','.','7','.','.','.','.'],
  ['6','.','.','1','9','5','.','.','.'],
  ['.','9','8','.','.','.','.','6','.'],
  ['8','.','.','.','6','.','.','.','3'],
  ['4','.','.','8','.','3','.','.','1'],
  ['7','.','.','.','2','.','.','.','6'],
  ['.','6','.','.','.','.','2','8','.'],
  ['.','.','.','4','1','9','.','.','5'],
  ['.','.','.','.','8','.','.','7','9'],
];

// Box colours (one per 3×3 box, alternating two tones)
const BOX_BG = [
  'rgba(74,222,128,0.08)',  'rgba(34,211,238,0.08)',  'rgba(74,222,128,0.08)',
  'rgba(34,211,238,0.08)',  'rgba(74,222,128,0.08)',  'rgba(34,211,238,0.08)',
  'rgba(74,222,128,0.08)',  'rgba(34,211,238,0.08)',  'rgba(74,222,128,0.08)',
];

export default function ValidSudokuDiagram() {
  const [highlight, setHighlight] = useState<{ row: number; col: number } | null>(null);

  const hRow = highlight?.row ?? -1;
  const hCol = highlight?.col ?? -1;
  const hBox = highlight ? Math.floor(highlight.row / 3) * 3 + Math.floor(highlight.col / 3) : -1;

  return (
    <div style={{
      background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: '20px 16px', margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 4, textAlign: 'center' }}>
        Tap any cell to highlight its row, column, and 3×3 box
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginBottom: 14, textAlign: 'center' }}>
        box index = (row / 3) × 3 + (col / 3)
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-block', border: `2px solid ${BORDER}`, borderRadius: 4 }}>
          {board.map((row, i) => (
            <div key={i} style={{ display: 'flex', borderBottom: i === 8 ? 'none' : i === 2 || i === 5 ? `2px solid ${BORDER}` : `1px solid ${BORDER}` }}>
              {row.map((val, j) => {
                const boxIdx = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                const isSelected  = i === hRow && j === hCol;
                const isInRow     = !isSelected && i === hRow;
                const isInCol     = !isSelected && j === hCol;
                const isInBox     = !isSelected && !isInRow && !isInCol && boxIdx === hBox && hBox !== -1;

                const bg = isSelected ? AMBER
                  : isInRow    ? 'rgba(74,222,128,0.25)'
                  : isInCol    ? 'rgba(34,211,238,0.25)'
                  : isInBox    ? 'rgba(245,158,11,0.15)'
                  : BOX_BG[boxIdx];

                const color = isSelected ? '#000'
                  : val === '.' ? MUTED
                  : isInRow ? ACCENT
                  : isInCol ? ACCENT2
                  : 'var(--ifm-color-content)';

                return (
                  <div
                    key={j}
                    onClick={() => setHighlight(isSelected ? null : { row: i, col: j })}
                    style={{
                      width: 34, height: 34,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: bg,
                      borderRight: j === 8 ? 'none' : j === 2 || j === 5 ? `2px solid ${BORDER}` : `1px solid ${BORDER}`,
                      fontFamily: 'var(--ifm-font-family-monospace)',
                      fontSize: 14, fontWeight: val === '.' ? 400 : 700,
                      color,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background 0.15s',
                    }}
                  >
                    {val === '.' ? '·' : val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: 'rgba(74,222,128,0.25)', label: 'Same row' },
          { color: 'rgba(34,211,238,0.25)', label: 'Same column' },
          { color: 'rgba(245,158,11,0.15)', label: 'Same 3×3 box' },
          { color: AMBER,                   label: 'Selected cell' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: color, border: `1px solid ${BORDER}` }} />
            <span style={{ fontSize: 11, color: MUTED }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
