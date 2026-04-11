import React from 'react';

// Static SVG showing two greedy patterns:
// 1. Can Place Flowers — scan, place only where neither neighbour is occupied
// 2. Increasing Triplet — track min1 and min2 to detect a rising triplet

const W = 600;
const H = 280;
const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';
const red = '#ef4444';
const light = '#1f2937';
const dim = '#374151';
const textLight = '#d1d5db';
const textDim = '#6b7280';

function Cell({ x, y, w = 44, h = 36, fill, stroke, text, textColor = textLight, fontSize = 14 }: {
  x: number; y: number; w?: number; h?: number;
  fill: string; stroke: string; text: string; textColor?: string; fontSize?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle"
        fontSize={fontSize} fill={textColor} fontFamily="monospace">{text}</text>
    </g>
  );
}

export default function GreedyDiagram() {
  // Can Place Flowers: flowerbed = [1,0,0,0,1,0,0], n=2
  // Positions 0-6: 0=empty, 1=occupied
  // Can place at index 2 and 6
  const flowerbed = [1,0,0,0,1,0,0];
  const placed = [2, 6];
  const placedSet = new Set(placed);

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>Greedy Patterns</div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

        {/* ── Pattern 1: Can Place Flowers ───────────────────────── */}
        <text x={10} y={22} fontSize={12} fill={accent} fontFamily="monospace">
          Pattern 1 — Greedy Scan (Can Place Flowers: [1,0,0,0,1,0,0], n=2)
        </text>

        {/* Flowerbed cells */}
        {flowerbed.map((v, i) => {
          const canPlace = placedSet.has(i);
          const occupied = v === 1;
          const fill = occupied ? '#450a0a' : canPlace ? '#064e3b' : light;
          const stroke = occupied ? red : canPlace ? green : dim;
          const textColor = occupied ? '#fca5a5' : canPlace ? '#86efac' : textDim;
          return (
            <Cell key={i} x={10 + i * 54} y={32} w={44} h={40}
              fill={fill} stroke={stroke} text={v === 1 ? '🌸' : canPlace ? '✓' : '0'}
              textColor={textColor} fontSize={canPlace ? 11 : 16} />
          );
        })}

        {/* index labels */}
        {flowerbed.map((_, i) => (
          <text key={i} x={10 + i * 54 + 22} y={84} textAnchor="middle"
            fontSize={10} fill={textDim} fontFamily="monospace">[{i}]</text>
        ))}

        {/* Rule explanation */}
        <text x={10} y={105} fontSize={11} fill={textDim} fontFamily="monospace">
          Rule: place at i only if flowerbed[i]==0 AND flowerbed[i-1]!=1 AND flowerbed[i+1]!=1
        </text>
        <text x={10} y={120} fontSize={11} fill={green} fontFamily="monospace">
          Place at idx 2 (neighbours 1 and 3 are 0) and idx 6 (right edge, left is 0) → placed 2 ✓
        </text>

        {/* ── Pattern 2: Increasing Triplet Subsequence ──────────── */}
        <text x={10} y={150} fontSize={12} fill={amber} fontFamily="monospace">
          Pattern 2 — Two-Tracker Greedy (Increasing Triplet: [5,1,4,0,3,2])
        </text>

        {/* Array */}
        {[5,1,4,0,3,2].map((v, i) => {
          // min1 tracks: after idx 3 = 0, min2 = 1
          // triplet found: 0 < 1 < 3 at idx 4
          const isMin1 = i === 3;  // value 0 → new min1
          const isMin2 = i === 1;  // value 1 → min2
          const isThird = i === 4; // value 3 > min2 (1) > min1 (0)
          const fill = isThird ? '#064e3b' : isMin1 || isMin2 ? '#1e1b4b' : light;
          const stroke = isThird ? green : isMin1 || isMin2 ? accent : dim;
          const textColor = isThird ? '#86efac' : isMin1 || isMin2 ? '#a5b4fc' : textDim;
          return (
            <Cell key={i} x={10 + i * 54} y={160} w={44} h={40}
              fill={fill} stroke={stroke} text={String(v)} textColor={textColor} />
          );
        })}

        {/* State labels */}
        <text x={10 + 1 * 54 + 22} y={215} textAnchor="middle" fontSize={9} fill={accent} fontFamily="monospace">min2=1</text>
        <text x={10 + 3 * 54 + 22} y={215} textAnchor="middle" fontSize={9} fill={accent} fontFamily="monospace">min1=0</text>
        <text x={10 + 4 * 54 + 22} y={215} textAnchor="middle" fontSize={9} fill={green}  fontFamily="monospace">third!</text>

        <text x={10} y={235} fontSize={11} fill={textDim} fontFamily="monospace">
          Track min1 (smallest seen) and min2 (smallest after a reset). When num &gt; min2: triplet found.
        </text>

        {/* ── Pattern 3: Greedy principle box ───────────────────── */}
        <rect x={10} y={250} width={580} height={26} rx={6} fill={light} stroke={dim} strokeWidth={1} />
        <text x={20} y={267} fontSize={11} fill={textLight} fontFamily="monospace">
          Greedy key: make the locally optimal choice at each step — prove it never needs to be undone.
        </text>
      </svg>
    </div>
  );
}
