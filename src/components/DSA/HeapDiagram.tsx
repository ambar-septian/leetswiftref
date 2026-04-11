// src/components/DSA/HeapDiagram.tsx
// Interactive diagram: enqueue(2) into a min-heap [1,3,5,9,7], then sift up.
// Shows the tree view and array view in sync.

import React, { useState } from 'react';
import styles from './DSA.module.css';

interface StepDef {
  label: string;
  desc: string;
  values: number[];          // heap array at this step
  highlightIndices: number[]; // nodes being compared or swapped
  swapArrow?: [number, number]; // [from, to] index pair being swapped
}

const STEPS: StepDef[] = [
  {
    label: 'Initial min-heap',
    desc: 'A valid min-heap: every parent ≤ its children. The root (index 0) is always the minimum.',
    values: [1, 3, 5, 9, 7],
    highlightIndices: [],
  },
  {
    label: 'Enqueue 2 — append to array',
    desc: 'New element is appended to the end (index 5). The heap property may now be violated — 2 < its parent 5.',
    values: [1, 3, 5, 9, 7, 2],
    highlightIndices: [5],
  },
  {
    label: 'Sift up — 2 vs parent 5 (swap)',
    desc: 'Index 5 → parent index (5−1)/2 = 2 → value 5. Since 2 < 5, swap them.',
    values: [1, 3, 2, 9, 7, 5],
    highlightIndices: [2, 5],
    swapArrow: [5, 2],
  },
  {
    label: 'Sift up — 2 vs parent 1 (stop)',
    desc: 'Index 2 → parent index (2−1)/2 = 0 → value 1. Since 2 ≥ 1, stop. Min-heap property restored!',
    values: [1, 3, 2, 9, 7, 5],
    highlightIndices: [0, 2],
  },
];

// Tree layout for up to 7 nodes (levels 0–2)
const NODE_POSITIONS = [
  { x: 210, y: 42 },   // index 0 — root
  { x: 125, y: 115 },  // index 1
  { x: 295, y: 115 },  // index 2
  { x: 75,  y: 188 },  // index 3
  { x: 165, y: 188 },  // index 4
  { x: 250, y: 188 },  // index 5
  { x: 335, y: 188 },  // index 6
];

const EDGES = [
  [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 5], [2, 6],
];

const R = 20;

export default function HeapDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const N = s.values.length;
  const highlightSet = new Set(s.highlightIndices);

  return (
    <div className={styles.diagramWrap}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagramTitle}>Min-Heap — Enqueue operation (sift up)</span>
        <span className={styles.diagramStep}>{step + 1} / {STEPS.length}</span>
      </div>

      <div style={{ textAlign: 'center', padding: '6px 16px 2px', fontSize: 13, fontWeight: 600, color: 'var(--dsa-accent)' }}>
        {s.label}
      </div>
      <div style={{ textAlign: 'center', padding: '2px 24px 8px', fontSize: 12, color: 'var(--dsa-text-muted)' }}>
        {s.desc}
      </div>

      {/* Tree view */}
      <svg viewBox="0 0 420 225" style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }}>
        {/* Edges */}
        {EDGES.filter(([p, c]) => p < N && c < N).map(([p, c]) => {
          const from = NODE_POSITIONS[p];
          const to   = NODE_POSITIONS[c];
          const isSwap = s.swapArrow && ((s.swapArrow[0] === p && s.swapArrow[1] === c) || (s.swapArrow[0] === c && s.swapArrow[1] === p));
          return (
            <line key={`${p}-${c}`}
              x1={from.x} y1={from.y + R}
              x2={to.x}   y2={to.y - R}
              stroke={isSwap ? 'var(--dsa-accent)' : 'var(--dsa-border)'}
              strokeWidth={isSwap ? 2.5 : 1.5}
              strokeDasharray={isSwap ? '5 3' : undefined}
            />
          );
        })}

        {/* Nodes */}
        {s.values.map((val, i) => {
          const pos = NODE_POSITIONS[i];
          const isHL = highlightSet.has(i);
          return (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={R}
                fill={isHL ? 'var(--dsa-accent)' : 'var(--dsa-surface)'}
                stroke={isHL ? 'var(--dsa-accent)' : 'var(--dsa-border)'}
                strokeWidth={isHL ? 2.5 : 1.5}
              />
              <text x={pos.x} y={pos.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={14} fontFamily="var(--ifm-font-family-monospace)" fontWeight="700"
                fill={isHL ? '#fff' : 'var(--dsa-text)'}>
                {val}
              </text>
              {/* index label */}
              <text x={pos.x} y={pos.y + R + 12}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill="var(--dsa-text-muted)">
                [{i}]
              </text>
            </g>
          );
        })}

        {/* Swap arrow label */}
        {s.swapArrow && (
          <text x={210} y={208}
            textAnchor="middle" fontSize={11} fontWeight="600" fill="var(--dsa-accent)">
            ↕ swap
          </text>
        )}
      </svg>

      {/* Array view */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, margin: '4px 0 8px', flexWrap: 'wrap' }}>
        {s.values.map((val, i) => {
          const isHL = highlightSet.has(i);
          return (
            <div key={i} style={{
              width: 42, height: 40,
              border: `2px solid ${isHL ? 'var(--dsa-accent)' : 'var(--dsa-border)'}`,
              borderRadius: 4,
              margin: 2,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: isHL ? 'var(--dsa-accent)' : 'var(--dsa-surface)',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--ifm-font-family-monospace)', color: isHL ? '#fff' : 'var(--dsa-text)' }}>{val}</span>
              <span style={{ fontSize: 9, color: isHL ? 'rgba(255,255,255,0.8)' : 'var(--dsa-text-muted)' }}>[{i}]</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        <span>parent(i) = (i − 1) / 2</span>
        <span>left(i) = 2i + 1</span>
        <span>right(i) = 2i + 2</span>
      </div>

      <div className={styles.diagramControls}>
        <button className={styles.diagramBtn} onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Prev</button>
        <button className={styles.diagramBtn} onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>Next →</button>
      </div>
    </div>
  );
}
