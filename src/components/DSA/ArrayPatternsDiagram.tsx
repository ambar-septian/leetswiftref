import React from 'react';

// Static SVG showing three common array patterns:
// 1. In-place index mapping: build array from permutation
// 2. Simulation: plus one with carry
// 3. Linear scan with running state: three consecutive odds

const W = 620;
const H = 320;

const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';
const gray = '#374151';
const light = '#1f2937';
const textLight = '#d1d5db';
const textDim = '#6b7280';

function Box({ x, y, w = 44, h = 36, fill = light, stroke = gray, text, textColor = textLight, fontSize = 14 }: {
  x: number; y: number; w?: number; h?: number; fill?: string; stroke?: string;
  text: string; textColor?: string; fontSize?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={fontSize} fill={textColor} fontFamily="monospace">{text}</text>
    </g>
  );
}

export default function ArrayPatternsDiagram() {
  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>
        Common Array Patterns
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

        {/* ── Pattern 1: Index mapping ─────────────────────────────── */}
        <text x={10} y={20} fontSize={12} fill={accent} fontFamily="monospace">Pattern 1 — Index Mapping (Build Array from Permutation)</text>

        {/* nums = [0,2,1,5,3,4]   result[i] = nums[nums[i]] */}
        {/* nums row */}
        {[0,2,1,5,3,4].map((v, i) => (
          <Box key={`n${i}`} x={10 + i * 50} y={30} text={String(v)}
            fill={i === 2 ? '#1e1b4b' : light} stroke={i === 2 ? accent : gray} textColor={i === 2 ? '#a5b4fc' : textLight} />
        ))}
        <text x={10} y={80} fontSize={10} fill={textDim} fontFamily="monospace">nums</text>

        {/* arrow showing nums[2]=1, nums[nums[2]]=nums[1]=2 */}
        <line x1={120} y1={68} x2={120} y2={82} stroke={accent} strokeWidth={1.5} markerEnd="url(#arr)" />
        <text x={200} y={96} fontSize={10} fill={accent} fontFamily="monospace">nums[2]=1 → nums[1]=2 → result[2]=2</text>

        {/* result row */}
        {[0,4,2,0,3,5].map((v, i) => (
          <Box key={`r${i}`} x={10 + i * 50} y={100} text={String(v)}
            fill={i === 2 ? '#064e3b' : light} stroke={i === 2 ? green : gray} textColor={i === 2 ? '#86efac' : textDim} />
        ))}
        <text x={10} y={150} fontSize={10} fill={textDim} fontFamily="monospace">result (new array)</text>

        {/* ── Pattern 2: Simulation — Plus One ──────────────────────── */}
        <text x={10} y={175} fontSize={12} fill={amber} fontFamily="monospace">Pattern 2 — Simulation (Plus One with Carry)</text>

        {/* digits = [9,9,9] → carry propagates all the way */}
        {[9,9,9].map((v, i) => (
          <Box key={`d${i}`} x={10 + i * 50} y={185} text={String(v)}
            fill="#450a0a" stroke="#ef4444" textColor="#fca5a5" />
        ))}
        <text x={175} y={208} fontSize={11} fill={amber} fontFamily="monospace">all 9s — carry propagates</text>

        {/* arrow */}
        <text x={175} y={224} fontSize={18} fill={amber} fontFamily="monospace">↓</text>

        {[1,0,0,0].map((v, i) => (
          <Box key={`p${i}`} x={10 + i * 50} y={225} text={String(v)}
            fill={i === 0 ? '#064e3b' : light} stroke={i === 0 ? green : gray} textColor={i === 0 ? '#86efac' : textLight} />
        ))}
        <text x={225} y={250} fontSize={10} fill={green} fontFamily="monospace">new leading digit prepended</text>

        {/* ── Pattern 3: Linear scan ────────────────────────────────── */}
        <text x={10} y={275} fontSize={12} fill={green} fontFamily="monospace">Pattern 3 — Linear Scan (Three Consecutive Odds)</text>

        {[2,6,4,1,3,5,2].map((v, i) => {
          const isOdd = v % 2 === 1;
          const inRun = i >= 3 && i <= 5; // indices 3,4,5 → 1,3,5
          return (
            <Box key={`s${i}`} x={10 + i * 50} y={283} text={String(v)}
              fill={inRun ? '#064e3b' : light}
              stroke={inRun ? green : (isOdd ? amber : gray)}
              textColor={inRun ? '#86efac' : (isOdd ? '#fde68a' : textDim)} />
          );
        })}
        <text x={200} y={313} fontSize={10} fill={green} fontFamily="monospace">consecutive = 3 → found!</text>

        {/* Arrow marker def */}
        <defs>
          <marker id="arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
