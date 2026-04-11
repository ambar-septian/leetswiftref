import React from 'react';

// Static SVG: bit operations reference
// Row 1: AND / OR / XOR truth table
// Row 2: Left/right shift
// Row 3: "Steps to reduce to zero" for n=14

const W = 600;
const H = 300;
const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';
const dim = '#374151';
const light = '#1f2937';
const textLight = '#d1d5db';
const textDim = '#6b7280';

function Bit({ x, y, v, color }: { x: number; y: number; v: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={26} height={26} rx={4}
        fill={v === '1' ? color + '33' : '#111827'}
        stroke={v === '1' ? color : dim} strokeWidth={1.5} />
      <text x={x + 13} y={y + 18} textAnchor="middle"
        fontSize={13} fill={v === '1' ? color : textDim} fontFamily="monospace" fontWeight={700}>{v}</text>
    </g>
  );
}

function BitsRow({ x, y, bits, color, label }: { x: number; y: number; bits: string; color: string; label: string }) {
  return (
    <g>
      <text x={x - 4} y={y + 18} textAnchor="end" fontSize={10} fill={textDim} fontFamily="monospace">{label}</text>
      {bits.split('').map((b, i) => <Bit key={i} x={x + i * 30} y={y} v={b} color={color} />)}
    </g>
  );
}

export default function BitManipulationDiagram() {
  // n=14: binary 1110
  // Steps:
  // 14 (1110): even → 14/2=7  (+1 step)
  // 7  (0111): odd  → 7-1=6   (+1 step)
  // 6  (0110): even → 6/2=3   (+1 step)
  // 3  (0011): odd  → 3-1=2   (+1 step)
  // 2  (0010): even → 2/2=1   (+1 step)
  // 1  (0001): odd  → 1-1=0   (+1 step)
  // Total: 6 steps

  const reductions = [
    { n: 14, bits: '1110', op: '÷2 (even → right shift)',     next: 7,  step: 1 },
    { n:  7, bits: '0111', op: '-1 (odd → clear last bit)',   next: 6,  step: 2 },
    { n:  6, bits: '0110', op: '÷2 (even → right shift)',     next: 3,  step: 3 },
    { n:  3, bits: '0011', op: '-1 (odd → clear last bit)',   next: 2,  step: 4 },
    { n:  2, bits: '0010', op: '÷2 (even → right shift)',     next: 1,  step: 5 },
    { n:  1, bits: '0001', op: '-1 (odd → clear last bit)',   next: 0,  step: 6 },
  ];

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>Bit Manipulation Patterns</div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

        {/* ── Section 1: Common bit operations ──────────────────── */}
        <text x={10} y={20} fontSize={12} fill={accent} fontFamily="monospace">Key Bit Operations</text>

        {[
          { op: 'n & 1',       desc: 'Check if odd (last bit = 1)',  color: green  },
          { op: 'n >> 1',      desc: 'Divide by 2 (right shift)',    color: amber  },
          { op: 'n & (n-1)',   desc: 'Clear lowest set bit',         color: accent },
          { op: 'n | (1<<k)',  desc: 'Set bit k',                    color: '#ec4899' },
        ].map((row, i) => (
          <g key={i}>
            <rect x={10 + (i % 2) * 295} y={28 + Math.floor(i / 2) * 34} width={285} height={28} rx={5}
              fill={light} stroke={dim} strokeWidth={1} />
            <text x={20 + (i % 2) * 295} y={28 + Math.floor(i / 2) * 34 + 18}
              fontSize={12} fill={row.color} fontFamily="monospace">{row.op}</text>
            <text x={150 + (i % 2) * 295} y={28 + Math.floor(i / 2) * 34 + 18}
              fontSize={10} fill={textDim} fontFamily="monospace">{row.desc}</text>
          </g>
        ))}

        {/* ── Section 2: Steps to reduce 14 to 0 ───────────────── */}
        <text x={10} y={112} fontSize={12} fill={amber} fontFamily="monospace">
          Steps to Reduce 14 → 0 (LeetCode 1342)
        </text>

        {reductions.map((r, i) => {
          const isEven = r.n % 2 === 0;
          const opColor = isEven ? green : accent;
          const y = 120 + i * 28;
          return (
            <g key={i}>
              {/* Step number */}
              <text x={10} y={y + 16} fontSize={10} fill={textDim} fontFamily="monospace">#{r.step}</text>
              {/* n value */}
              <text x={30} y={y + 16} fontSize={13} fill={textLight} fontFamily="monospace" fontWeight={700}>{r.n}</text>
              {/* bits */}
              <text x={62} y={y + 16} fontSize={11} fill={textDim} fontFamily="monospace">({r.bits})</text>
              {/* operation */}
              <rect x={115} y={y + 2} width={210} height={22} rx={4} fill={opColor + '22'} stroke={opColor} strokeWidth={1} />
              <text x={122} y={y + 16} fontSize={10} fill={opColor} fontFamily="monospace">{r.op}</text>
              {/* arrow + result */}
              <text x={332} y={y + 16} fontSize={12} fill={textDim} fontFamily="monospace">→</text>
              <text x={345} y={y + 16} fontSize={13} fill={r.next === 0 ? green : textLight} fontFamily="monospace" fontWeight={700}>
                {r.next}{r.next === 0 ? ' ✓' : ''}
              </text>
            </g>
          );
        })}

        {/* Total steps summary */}
        <rect x={10} y={290} width={580} height={4} rx={2} fill={amber + '44'} />

        {/* Parity check visualisation */}
        <text x={400} y={130} fontSize={11} fill={textDim} fontFamily="monospace">Parity check:</text>
        <text x={400} y={148} fontSize={12} fill={green}  fontFamily="monospace">n &amp; 1 == 0 → even → n&gt;&gt;1</text>
        <text x={400} y={166} fontSize={12} fill={accent} fontFamily="monospace">n &amp; 1 == 1 → odd  → n-1</text>
      </svg>
    </div>
  );
}
