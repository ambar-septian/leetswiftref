// src/components/DSA/WordSearchDiagram.tsx
// Shows the DFS path traced through a 3x4 grid for word = "ABCCED".
// Visited cells are numbered by visit order; unvisited cells are muted.

import React from 'react';

const AMBER  = '#f59e0b';
const RED    = '#ef4444';
const MUTED  = 'var(--dsa-text-muted)';
const BORDER = 'var(--dsa-border)';
const ACCENT2 = 'var(--dsa-accent2)';

// Standard LeetCode board
const BOARD = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];

// DFS path for "ABCCED": (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,1)
const PATH: [number, number][] = [
  [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1],
];

const pathIndex = new Map<string, number>(
  PATH.map(([r, c], i) => [`${r},${c}`, i + 1])
);

// Step colors from ACCENT2 → AMBER (gradient through steps)
const STEP_COLORS = [ACCENT2, ACCENT2, ACCENT2, ACCENT2, AMBER, AMBER];

export default function WordSearchDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        word = "ABCCED" · DFS path traced on board
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {BOARD.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 3 }}>
              {row.map((cell, c) => {
                const step = pathIndex.get(`${r},${c}`);
                const isPath = step !== undefined;
                const color = isPath ? STEP_COLORS[step! - 1] : MUTED;
                return (
                  <div key={c} style={{
                    width: 44, height: 44,
                    border: `2px solid ${isPath ? color : BORDER}`,
                    borderRadius: 6,
                    background: isPath ? `color-mix(in srgb, ${color} 15%, transparent)` : 'transparent',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 16, fontWeight: 700, color }}>{cell}</span>
                    {isPath && (
                      <span style={{
                        position: 'absolute', top: 1, right: 3,
                        fontSize: 9, fontWeight: 700, color, fontFamily: 'var(--ifm-font-family-monospace)',
                      }}>{step}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {/* Path breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4 }}>DFS steps</div>
          {PATH.map(([r, c], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                background: `color-mix(in srgb, ${STEP_COLORS[i]} 20%, transparent)`,
                border: `1px solid ${STEP_COLORS[i]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: STEP_COLORS[i],
                fontFamily: 'var(--ifm-font-family-monospace)',
              }}>{i + 1}</div>
              <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>
                ({r},{c}) = {BOARD[r][c]}  →  board[{r}][{c}] = '#'
              </span>
            </div>
          ))}
          <div style={{ marginTop: 4, fontSize: 10, color: RED, fontFamily: 'var(--ifm-font-family-monospace)' }}>
            restore: '#' → original after backtrack
          </div>
        </div>
      </div>
    </div>
  );
}
