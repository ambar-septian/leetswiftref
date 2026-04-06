import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';
const FRESH = '#86efac';

// Grid 3x3:
// 2 1 1
// 1 1 0
// 0 1 1
// Multi-source BFS from (0,0).
// Minute 0: rotten={(0,0)}
// Minute 1: (0,1),(1,0) rot
// Minute 2: (0,2),(1,1) rot
// Minute 3: (2,1) rots
// Minute 4: (2,2) rots → all fresh gone → 4

// Cell values: 0=empty, 1=fresh, 2=rotten
type CellState = 0 | 1 | 2;

const initialGrid: CellState[][] = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
];

const stepGrids: CellState[][][] = [
  // step 0: initial
  [[2,1,1],[1,1,0],[0,1,1]],
  // step 1: minute 1
  [[2,2,1],[2,1,0],[0,1,1]],
  // step 2: minute 2
  [[2,2,2],[2,2,0],[0,1,1]],
  // step 3: minute 3
  [[2,2,2],[2,2,0],[0,2,1]],
  // step 4: minute 4
  [[2,2,2],[2,2,0],[0,2,2]],
];

const stepNewRotten: string[][] = [
  [],
  ['0,1','1,0'],
  ['0,2','1,1'],
  ['2,1'],
  ['2,2'],
];

const stepDescriptions = [
  'Seed BFS queue with all rotten cells: (0,0). freshCount=5. minute=0.',
  'Minute 1: rot spreads from (0,0) → (0,1) and (1,0). freshCount=3.',
  'Minute 2: rot spreads from (0,1)→(0,2) and (1,0)→(1,1). freshCount=1.',
  'Minute 3: rot spreads from (1,1)→(2,1). freshCount=0.',
  'Minute 4: rot spreads from (2,1)→(2,2). freshCount=0. All fresh gone → return 4.',
];

const CELL = 46;
const ROWS = 3, COLS = 3;

export default function RottingOrangesDiagram() {
  const [step, setStep] = useState(0);
  const grid = stepGrids[step];
  const newRotten = new Set(stepNewRotten[step]);

  function cellColor(r: number, c: number): string {
    const key = `${r},${c}`;
    if (grid[r][c] === 0) return 'var(--dsa-surface)';
    if (grid[r][c] === 2) {
      if (newRotten.has(key)) return AMBER;
      return RED;
    }
    return FRESH;
  }

  function cellText(r: number, c: number): string {
    if (grid[r][c] === 0) return '0';
    if (grid[r][c] === 2) return '2';
    return '1';
  }

  function cellTextColor(r: number, c: number): string {
    if (grid[r][c] === 0) return 'var(--dsa-text-muted)';
    return '#fff';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        3×3 grid &nbsp;|&nbsp; Multi-source BFS — rot spreads one level per minute
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width={COLS * CELL + 10} height={ROWS * CELL + 10}
          viewBox={`0 0 ${COLS * CELL + 10} ${ROWS * CELL + 10}`}
          style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const x = 5 + c * CELL;
              const y = 5 + r * CELL;
              const fill = cellColor(r, c);
              return (
                <g key={`${r}-${c}`}>
                  <rect x={x} y={y} width={CELL - 2} height={CELL - 2} rx={4} fill={fill}
                    stroke={newRotten.has(`${r},${c}`) ? AMBER : 'var(--dsa-border)'}
                    strokeWidth={newRotten.has(`${r},${c}`) ? 2 : 1} />
                  <text x={x + (CELL - 2) / 2} y={y + (CELL - 2) / 2}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={13} fontWeight={700} fill={cellTextColor(r, c)}>
                    {cellText(r, c)}
                  </text>
                </g>
              );
            })
          )}
        </svg>

        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {step === 0 ? 'Initial State' : `Minute ${step}`}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {stepDescriptions[step]}
            </div>
            {step === stepGrids.length - 1 && (
              <div style={{ marginTop: 8, fontWeight: 700, color: GREEN }}>
                Return 4
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: RED, label: 'Rotten (prev minutes)' },
              { color: AMBER, label: 'Newly rotten this minute' },
              { color: FRESH, label: 'Fresh orange' },
              { color: 'var(--dsa-surface)', label: 'Empty cell (0)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color, border: '1px solid var(--dsa-border)' }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === 0 ? 'var(--dsa-surface)' : ACCENT2, color: step === 0 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(stepGrids.length - 1, s + 1))} disabled={step === stepGrids.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === stepGrids.length - 1 ? 'var(--dsa-surface)' : ACCENT2, color: step === stepGrids.length - 1 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === stepGrids.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)', cursor: 'pointer', fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}
