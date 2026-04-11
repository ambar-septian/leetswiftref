// src/components/DSA/StringPatternsDiagram.tsx
// Static SVG showing common Swift string patterns:
// character array conversion, ASCII arithmetic, and boundary traversal.

import React from 'react';
import styles from './DSA.module.css';

const ACCENT  = 'var(--dsa-accent)';
const GREEN   = 'var(--dsa-green)';
const AMBER   = 'var(--dsa-amber, #f59e0b)';
const MUTED   = 'var(--dsa-text-muted)';
const TEXT    = 'var(--dsa-text)';
const SURFACE = 'var(--dsa-surface)';
const BORDER  = 'var(--dsa-border)';
const MONO    = 'var(--ifm-font-family-monospace)';

function SectionLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} fontSize={10} fontWeight="700" fill={MUTED}
      textAnchor="start" fontFamily="var(--ifm-font-family-base)" letterSpacing={0.5}>
      {text}
    </text>
  );
}

const WORD = Array.from('hello');
const CELL_W = 42;
const CELL_H = 36;

export default function StringPatternsDiagram() {
  const startX = 30;
  const row1Y  = 35;

  return (
    <div className={styles.diagramWrap} style={{ padding: '12px 0 8px' }}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagramTitle}>Core String Patterns (Swift)</span>
      </div>
      <svg viewBox="0 0 420 290" style={{ width: '100%', maxWidth: 440, display: 'block', margin: '0 auto' }}>

        {/* ── Pattern 1: Array(s) — char array ── */}
        <SectionLabel x={startX} y={22} text="CHAR ARRAY — let chars = Array(s)" />
        {WORD.map((ch, i) => {
          const x = startX + i * CELL_W;
          const isFirst = i === 0;
          const isLast  = i === WORD.length - 1;
          const color   = isFirst ? GREEN : isLast ? ACCENT : BORDER;
          return (
            <g key={i}>
              <rect x={x} y={row1Y} width={CELL_W - 2} height={CELL_H} rx={4}
                fill={SURFACE} stroke={color} strokeWidth={isFirst || isLast ? 2 : 1.5} />
              <text x={x + (CELL_W - 2) / 2} y={row1Y + CELL_H / 2 - 5}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={16} fontFamily={MONO} fontWeight="700" fill={isFirst ? GREEN : isLast ? ACCENT : TEXT}>
                {ch}
              </text>
              <text x={x + (CELL_W - 2) / 2} y={row1Y + CELL_H - 5}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontFamily={MONO} fill={MUTED}>
                [{i}]
              </text>
            </g>
          );
        })}
        {/* Labels for L / R */}
        <text x={startX + 14} y={row1Y + CELL_H + 14} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight="700">L</text>
        <text x={startX + 4 * CELL_W + 14} y={row1Y + CELL_H + 14} textAnchor="middle" fontSize={11} fill={ACCENT} fontWeight="700">R</text>
        <text x={startX + 5 * CELL_W + 10} y={row1Y + CELL_H / 2 + 2} textAnchor="start" fontSize={11} fill={MUTED}>count = 5</text>

        {/* ── Pattern 2: ASCII arithmetic ── */}
        <SectionLabel x={startX} y={105} text="ASCII ARITHMETIC — Character.asciiValue" />
        {/* Show 'h' and 'e' with asciiValue boxes */}
        {[['h', 104], ['e', 101], ['l', 108]].map(([ch, val], i) => {
          const x = startX + i * 100;
          return (
            <g key={i}>
              {/* char box */}
              <rect x={x} y={115} width={38} height={36} rx={4} fill={SURFACE} stroke={BORDER} strokeWidth={1.5} />
              <text x={x + 19} y={115 + 20} textAnchor="middle" dominantBaseline="middle"
                fontSize={18} fontFamily={MONO} fontWeight="700" fill={TEXT}>{ch}</text>
              {/* arrow */}
              <text x={x + 46} y={135} textAnchor="middle" dominantBaseline="middle" fontSize={14} fill={MUTED}>→</text>
              {/* value box */}
              <rect x={x + 52} y={115} width={38} height={36} rx={4} fill={SURFACE} stroke={ACCENT} strokeWidth={1.5} />
              <text x={x + 71} y={115 + 20} textAnchor="middle" dominantBaseline="middle"
                fontSize={13} fontFamily={MONO} fontWeight="600" fill={ACCENT}>{val}</text>
            </g>
          );
        })}
        <text x={startX} y={165} fontSize={11} fill={MUTED} fontFamily={MONO}>
          {'diff = Int(a.asciiValue!) - Int(b.asciiValue!)'}
        </text>

        {/* ── Pattern 3: Boundary check / circular ── */}
        <SectionLabel x={startX} y={192} text="BOUNDARY CHECK — word ends with space or last index" />
        {/* Show "hello world" with spaces highlighted */}
        {Array.from('hello world').map((ch, i) => {
          const x = startX + i * 35;
          const isSpace = ch === ' ';
          const isLast  = i === 10;
          const color   = isSpace ? AMBER : isLast ? GREEN : BORDER;
          return (
            <g key={i}>
              <rect x={x} y={202} width={33} height={30} rx={3} fill={SURFACE}
                stroke={color} strokeWidth={isSpace || isLast ? 2 : 1.5} />
              <text x={x + 16} y={202 + 17} textAnchor="middle" dominantBaseline="middle"
                fontSize={12} fontFamily={MONO} fontWeight="600"
                fill={isSpace ? AMBER : isLast ? GREEN : TEXT}>
                {isSpace ? '·' : ch}
              </text>
            </g>
          );
        })}
        <text x={startX} y={245} fontSize={11} fill={AMBER}>■</text>
        <text x={startX + 12} y={245} fontSize={11} fill={MUTED}> = space (word boundary)</text>
        <text x={startX} y={260} fontSize={11} fill={GREEN}>■</text>
        <text x={startX + 12} y={260} fontSize={11} fill={MUTED}> = last char (i == chars.count - 1)</text>

        {/* ── Swift note ── */}
        <rect x={startX} y={270} width={360} height={18} rx={4} fill="none" />
        <text x={startX} y={283} fontSize={10.5} fill={MUTED} fontFamily={MONO}>
          {'Swift: String is not subscriptable — always convert with Array(s) first'}
        </text>
      </svg>
    </div>
  );
}
