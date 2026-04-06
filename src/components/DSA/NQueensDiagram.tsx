// src/components/DSA/NQueensDiagram.tsx
// Shows the two valid solutions for n=4.
// queens[r] = column where the queen is placed in row r.

import React from 'react';

const AMBER  = '#f59e0b';
const MUTED  = 'var(--dsa-text-muted)';
const BORDER = 'var(--dsa-border)';

function Board({ queens, title }: { queens: number[]; title: string }) {
  const n = queens.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', textAlign: 'center', maxWidth: 180 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 36px)`, gap: 2 }}>
        {Array.from({ length: n }, (_, r) =>
          Array.from({ length: n }, (_, c) => {
            const isQueen = queens[r] === c;
            return (
              <div key={`${r}-${c}`} style={{
                width: 36, height: 36,
                background: isQueen
                  ? `color-mix(in srgb, ${AMBER} 22%, transparent)`
                  : (r + c) % 2 === 0 ? 'rgba(128,128,128,0.09)' : 'rgba(128,128,128,0.04)',
                border: `1px solid ${isQueen ? AMBER : BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: isQueen ? 20 : 11,
                color: isQueen ? AMBER : MUTED,
                borderRadius: 3,
                fontWeight: isQueen ? 700 : 400,
              }}>
                {isQueen ? '♛' : '.'}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function NQueensDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        n = 4 · both valid solutions
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        <Board queens={[1, 3, 0, 2]} title='[".Q..","...Q","Q...","..Q."]' />
        <Board queens={[2, 0, 3, 1]} title='["..Q.","Q...","...Q",".Q.."]' />
      </div>
      <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>
        No two queens share a column, positive diagonal (r+c), or negative diagonal (r-c)
      </div>
    </div>
  );
}
