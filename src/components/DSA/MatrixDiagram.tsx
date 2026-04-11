import React from 'react';

// Static SVG: Matrix patterns
// 1. Row-sum scan (Richest Customer Wealth)
// 2. Four-directional traversal (BFS/DFS on grid)

const W = 600;
const H = 290;
const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';
const dim = '#374151';
const light = '#1f2937';
const textLight = '#d1d5db';
const textDim = '#6b7280';

function MatCell({ x, y, text, fill, stroke, textColor = textLight, size = 40 }: {
  x: number; y: number; text: string;
  fill: string; stroke: string; textColor?: string; size?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={5}
        fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + size / 2} y={y + size / 2 + 5} textAnchor="middle"
        fontSize={13} fill={textColor} fontFamily="monospace" fontWeight={700}>{text}</text>
    </g>
  );
}

export default function MatrixDiagram() {
  // Wealth matrix: accounts = [[1,2,3],[3,2,1],[3,3,3]]
  // Row sums: 6, 6, 9 → richest = 9 (row 2)
  const accounts = [[1,2,3],[3,2,1],[3,3,3]];
  const rowSums  = accounts.map(row => row.reduce((a,b) => a+b, 0));
  const maxSum   = Math.max(...rowSums);

  // 4-directional grid example: 3x3 grid, starting at (1,1)
  const dirs = [[-1,0,'↑'],[0,1,'→'],[1,0,'↓'],[0,-1,'←']];

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>Matrix Patterns</div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

        {/* ── Pattern 1: Row-sum scan ───────────────────────────── */}
        <text x={10} y={20} fontSize={12} fill={accent} fontFamily="monospace">
          Pattern 1 — Row Scan (Richest Customer Wealth)
        </text>

        {accounts.map((row, ri) => {
          const isRichest = rowSums[ri] === maxSum;
          return (
            <g key={ri}>
              {/* Row cells */}
              {row.map((v, ci) => (
                <MatCell key={ci}
                  x={10 + ci * 46} y={28 + ri * 46}
                  text={String(v)}
                  fill={isRichest ? '#064e3b' : light}
                  stroke={isRichest ? green : dim}
                  textColor={isRichest ? '#86efac' : textLight}
                />
              ))}
              {/* Sum arrow */}
              <text x={152} y={28 + ri * 46 + 25} fontSize={13} fill={textDim} fontFamily="monospace">→</text>
              {/* Sum value */}
              <rect x={168} y={28 + ri * 46 + 4} width={40} height={32} rx={6}
                fill={isRichest ? '#064e3b' : light}
                stroke={isRichest ? green : dim} strokeWidth={isRichest ? 2 : 1} />
              <text x={188} y={28 + ri * 46 + 25} textAnchor="middle"
                fontSize={13} fill={isRichest ? '#86efac' : textDim} fontFamily="monospace" fontWeight={isRichest ? 700 : 400}>
                {rowSums[ri]}
              </text>
              {isRichest && (
                <text x={215} y={28 + ri * 46 + 25} fontSize={11} fill={green} fontFamily="monospace"> ← max</text>
              )}
            </g>
          );
        })}

        <text x={10} y={172} fontSize={11} fill={green} fontFamily="monospace">
          Result: 9 (row index 2). O(m×n) time, O(1) space.
        </text>

        {/* ── Pattern 2: 4-directional traversal ───────────────── */}
        <text x={10} y={195} fontSize={12} fill={amber} fontFamily="monospace">
          Pattern 2 — 4-Directional Traversal (BFS/DFS on Grid)
        </text>

        {/* 3x3 grid */}
        {[0,1,2].flatMap(r => [0,1,2].map(c => {
          const isCenter = r === 1 && c === 1;
          const isNeighbour = (r === 0 && c === 1) || (r === 1 && c === 2) ||
                              (r === 2 && c === 1) || (r === 1 && c === 0);
          return (
            <MatCell key={`${r}-${c}`}
              x={10 + c * 46} y={203 + r * 46}
              text={isCenter ? '★' : isNeighbour ? dirs.find(([dr,dc]) => r === 1+dr && c === 1+dc)![2] : '·'}
              fill={isCenter ? '#1e1b4b' : isNeighbour ? '#064e3b' : light}
              stroke={isCenter ? accent : isNeighbour ? green : dim}
              textColor={isCenter ? '#a5b4fc' : isNeighbour ? '#86efac' : textDim}
            />
          );
        }))}

        {/* Direction code */}
        <text x={158} y={218} fontSize={11} fill={textDim} fontFamily="monospace">let dirs =</text>
        <text x={158} y={234} fontSize={11} fill={accent} fontFamily="monospace">  [(-1,0),(0,1),(1,0),(0,-1)]</text>
        <text x={158} y={250} fontSize={11} fill={textDim} fontFamily="monospace">for (dr, dc) in dirs &#123;</text>
        <text x={158} y={266} fontSize={11} fill={textDim} fontFamily="monospace">  let (nr, nc) = (r+dr, c+dc)</text>
        <text x={158} y={282} fontSize={11} fill={green}  fontFamily="monospace">  guard bounds check &#125;</text>
      </svg>
    </div>
  );
}
