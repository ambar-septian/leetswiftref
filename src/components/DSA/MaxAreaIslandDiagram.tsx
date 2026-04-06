import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const WATER = '#38bdf8';

// Grid 4x5
// 1 1 0 0 0
// 1 1 0 0 1
// 0 0 0 1 1
// 0 0 0 1 0
// Island A: (0,0),(0,1),(1,0),(1,1) — area 4
// Island B: (1,4),(2,3),(2,4),(3,3) — area 4
// Max area = 4

type CellState = 'water' | 'land' | 'visited' | 'active';

const initialGrid: CellState[][] = [
  ['land','land','water','water','water'],
  ['land','land','water','water','land'],
  ['water','water','water','land','land'],
  ['water','water','water','land','water'],
];

const steps = [
  {
    label: 'Initial grid',
    grid: initialGrid,
    current: null as [number,number] | null,
    island: null as [number,number][] | null,
    area: 0,
    maxArea: 0,
    description: 'Scan for unvisited land cells. Two islands visible: top-left (4 cells) and right side (4 cells).',
  },
  {
    label: 'DFS from (0,0) — Island A',
    grid: initialGrid,
    current: [0,0] as [number,number],
    island: [[0,0],[0,1],[1,0],[1,1]] as [number,number][],
    area: 4,
    maxArea: 4,
    description: 'Start DFS at (0,0). Visit (0,1),(1,0),(1,1) — all connected. Area = 4. Cells sunk to 0.',
  },
  {
    label: 'DFS from (1,4) — Island B',
    grid: initialGrid,
    current: [1,4] as [number,number],
    island: [[1,4],[2,3],[2,4],[3,3]] as [number,number][],
    area: 4,
    maxArea: 4,
    description: 'Continue scan. Find unvisited land at (1,4). DFS visits (2,4),(2,3),(3,3). Area = 4. maxArea stays 4.',
  },
  {
    label: 'Complete — maxArea = 4',
    grid: initialGrid,
    current: null,
    island: null,
    area: 0,
    maxArea: 4,
    description: 'All cells scanned. Both islands have area 4. Return maxArea = 4.',
  },
];

const ROWS = 4, COLS = 5;
const CELL = 46;

export default function MaxAreaIslandDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  const islandSet = new Set((current.island ?? []).map(([r, c]) => `${r},${c}`));
  const visitedSets = [
    new Set<string>(),
    new Set([[0,0],[0,1],[1,0],[1,1]].map(([r,c]) => `${r},${c}`)),
    new Set([[0,0],[0,1],[1,0],[1,1],[1,4],[2,3],[2,4],[3,3]].map(([r,c]) => `${r},${c}`)),
    new Set([[0,0],[0,1],[1,0],[1,1],[1,4],[2,3],[2,4],[3,3]].map(([r,c]) => `${r},${c}`)),
  ];
  const visitedSet = visitedSets[step];

  function cellColor(r: number, c: number): string {
    const key = `${r},${c}`;
    const isLand = initialGrid[r][c] === 'land';
    if (!isLand) return WATER;
    if (islandSet.has(key)) return AMBER;
    if (visitedSet.has(key)) return 'var(--dsa-border)';
    return ACCENT2;
  }

  function cellText(r: number, c: number): string {
    const key = `${r},${c}`;
    const isLand = initialGrid[r][c] === 'land';
    if (!isLand) return '0';
    if (visitedSet.has(key)) return '0';
    return '1';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Grid: 4×5 &nbsp;|&nbsp; DFS flood-fill — sink visited cells, track max area
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Grid */}
        <svg width={COLS * CELL + 10} height={ROWS * CELL + 10}
          viewBox={`0 0 ${COLS * CELL + 10} ${ROWS * CELL + 10}`}
          style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const x = 5 + c * CELL;
              const y = 5 + r * CELL;
              const fill = cellColor(r, c);
              const textVal = cellText(r, c);
              const textFill = fill === WATER ? '#93c5fd' : '#fff';
              return (
                <g key={`${r}-${c}`}>
                  <rect x={x} y={y} width={CELL - 2} height={CELL - 2}
                    rx={4} fill={fill} />
                  <text x={x + (CELL - 2) / 2} y={y + (CELL - 2) / 2}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={13} fontWeight={700} fill={textFill}>
                    {textVal}
                  </text>
                </g>
              );
            })
          )}
        </svg>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {current.label}
            </div>
            {[
              ['Current island area', current.area, AMBER],
              ['Max area so far', current.maxArea, GREEN],
            ].map(([label, val, color]) => (
              <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>{label}</span>
                <span style={{ fontWeight: 700, color: color as string }}>{val as number}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, color: 'var(--dsa-text-muted)', lineHeight: 1.5 }}>
              {current.description}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: ACCENT2, label: 'Unvisited land (1)' },
              { color: AMBER, label: 'Current DFS island' },
              { color: 'var(--dsa-border)', label: 'Sunk/visited (0)' },
              { color: WATER, label: 'Water (0)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === 0 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === 0 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)',
            cursor: 'pointer', fontSize: 13,
          }}>Reset</button>
      </div>
    </div>
  );
}
