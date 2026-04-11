// src/components/DSA/QueueDiagram.tsx
// Static diagram showing FIFO queue operations: enqueue at rear, dequeue at front.

import React from 'react';
import styles from './DSA.module.css';

const ACCENT  = 'var(--dsa-accent)';
const GREEN   = 'var(--dsa-green)';
const MUTED   = 'var(--dsa-text-muted)';
const TEXT    = 'var(--dsa-text)';
const SURFACE = 'var(--dsa-surface)';
const BORDER  = 'var(--dsa-border)';
const MONO    = 'var(--ifm-font-family-monospace)';

export default function QueueDiagram() {
  const items = [10, 20, 30, 40];
  const cellW = 56, cellH = 44, startX = 80, rowY = 90;

  return (
    <div className={styles.diagramWrap} style={{ padding: '12px 0 8px' }}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagramTitle}>Queue — FIFO (First In, First Out)</span>
      </div>
      <svg viewBox="0 0 420 200" style={{ width: '100%', maxWidth: 440, display: 'block', margin: '0 auto' }}>

        {/* Dequeue arrow (left) */}
        <text x={28} y={rowY + cellH / 2 - 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={GREEN}>dequeue</text>
        <text x={28} y={rowY + cellH / 2 + 6} textAnchor="middle" fontSize={10} fill={MUTED}>O(1)</text>
        <line x1={54} y1={rowY + cellH / 2} x2={startX - 3} y2={rowY + cellH / 2}
          stroke={GREEN} strokeWidth={2} markerEnd="url(#arrowG)" />

        {/* Queue cells */}
        {items.map((val, i) => {
          const x = startX + i * cellW;
          const isFront = i === 0;
          const isRear  = i === items.length - 1;
          return (
            <g key={i}>
              <rect x={x} y={rowY} width={cellW - 2} height={cellH} rx={4}
                fill={SURFACE}
                stroke={isFront ? GREEN : isRear ? ACCENT : BORDER}
                strokeWidth={isFront || isRear ? 2.5 : 1.5} />
              <text x={x + (cellW - 2) / 2} y={rowY + cellH / 2 + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={16} fontFamily={MONO} fontWeight="700" fill={TEXT}>
                {val}
              </text>
            </g>
          );
        })}

        {/* Front / Rear labels */}
        <text x={startX + (cellW - 2) / 2} y={rowY - 12}
          textAnchor="middle" fontSize={11} fontWeight="700" fill={GREEN}>
          front
        </text>
        <text x={startX + (items.length - 1) * cellW + (cellW - 2) / 2} y={rowY - 12}
          textAnchor="middle" fontSize={11} fontWeight="700" fill={ACCENT}>
          rear
        </text>

        {/* Enqueue arrow (right) */}
        <line
          x1={startX + items.length * cellW + 2} y1={rowY + cellH / 2}
          x2={startX + items.length * cellW + 38} y2={rowY + cellH / 2}
          stroke={ACCENT} strokeWidth={2} markerEnd="url(#arrowA)" />
        <text x={startX + items.length * cellW + 58} y={rowY + cellH / 2 - 8}
          textAnchor="middle" fontSize={11} fontWeight="700" fill={ACCENT}>enqueue</text>
        <text x={startX + items.length * cellW + 58} y={rowY + cellH / 2 + 6}
          textAnchor="middle" fontSize={10} fill={MUTED}>O(1)</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowG" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={GREEN} />
          </marker>
          <marker id="arrowA" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Time labels row */}
        <text x={215} y={154} textAnchor="middle" fontSize={11} fontWeight="700" fill={MUTED}>
          Array-backed queue in Swift — append(rear) + removeFirst(front)
        </text>

        {/* Two-row comparison */}
        {/* Array (FIFO) */}
        <rect x={30} y={163} width={170} height={28} rx={5} fill={SURFACE} stroke={BORDER} strokeWidth={1.2} />
        <text x={115} y={181} textAnchor="middle" fontSize={11} fontFamily={MONO} fill={MUTED}>
          var q = [Int]()  — simple
        </text>
        {/* Linked list (O(1) dequeue) */}
        <rect x={218} y={163} width={172} height={28} rx={5} fill={SURFACE} stroke={BORDER} strokeWidth={1.2} />
        <text x={304} y={181} textAnchor="middle" fontSize={11} fontFamily={MONO} fill={MUTED}>
          LinkedList — O(1) dequeue
        </text>
      </svg>
    </div>
  );
}
