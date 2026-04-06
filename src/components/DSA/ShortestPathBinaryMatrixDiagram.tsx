import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';
const BLOCKED = '#374151';

// grid = [[0,0,0],[1,1,0],[1,1,0]]
// BFS 8-directional from (0,0) to (2,2)
// Level 1: process (0,0) → mark (0,1). results→2
// Level 2: process (0,1) → mark (0,2),(1,2). results→3
// Level 3: process (0,2),(1,2) → mark (2,2). results→4
// Reach (2,2) → return 4

type CellType = 'blocked' | 'free' | 'visited' | 'active' | 'dest' | 'path';

const ROWS = 3, COLS = 3;
const baseGrid = [[0,0,0],[1,1,0],[1,1,0]];

const stepStates: { cells: CellType[][], queue: string[], level: number, desc: string }[] = [
  {
    cells: [
      ['active','free','free'],
      ['blocked','blocked','free'],
      ['blocked','blocked','dest'],
    ],
    queue: ['(0,0)'],
    level: 1,
    desc: 'Start: queue=[(0,0)]. Grid[0][0]=0 and grid[2][2]=0 — both open. Path length starts at 1.',
  },
  {
    cells: [
      ['visited','active','free'],
      ['blocked','blocked','free'],
      ['blocked','blocked','dest'],
    ],
    queue: ['(0,1)'],
    level: 2,
    desc: 'Level 1: process (0,0). Explore 8 dirs — only (0,1) is free. Mark (0,1). Advance level→2.',
  },
  {
    cells: [
      ['visited','visited','active'],
      ['blocked','blocked','active'],
      ['blocked','blocked','dest'],
    ],
    queue: ['(0,2)','(1,2)'],
    level: 3,
    desc: 'Level 2: process (0,1). Free neighbors: (0,2) and (1,2). Mark both. Advance level→3.',
  },
  {
    cells: [
      ['visited','visited','visited'],
      ['blocked','blocked','visited'],
      ['blocked','blocked','active'],
    ],
    queue: ['(2,2)'],
    level: 4,
    desc: 'Level 3: process (0,2) and (1,2). (1,2)→neighbor (2,2) is free → mark it. Advance level→4.',
  },
  {
    cells: [
      ['path','path','path'],
      ['blocked','blocked','path'],
      ['blocked','blocked','path'],
    ],
    queue: [],
    level: 4,
    desc: 'Level 4: process (2,2) — this IS the destination! Return level = 4.',
  },
];

const CELL = 52;

export default function ShortestPathBinaryMatrixDiagram() {
  const [step, setStep] = useState(0);
  const current = stepStates[step];

  function cellFill(type: CellType): string {
    if (type === 'blocked') return BLOCKED;
    if (type === 'active') return AMBER;
    if (type === 'visited') return 'var(--dsa-border)';
    if (type === 'path') return GREEN;
    if (type === 'dest') return ACCENT2;
    return 'var(--dsa-surface)';
  }

  function cellText(r: number, c: number, type: CellType): string {
    if (type === 'blocked') return '1';
    return '0';
  }

  function textColor(type: CellType): string {
    if (type === 'free' || type === 'dest') return 'var(--dsa-text-muted)';
    return '#fff';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        grid = [[0,0,0],[1,1,0],[1,1,0]] &nbsp;|&nbsp; BFS 8-directional — shortest clear path
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 auto' }}>
          <svg width={COLS * CELL + 10} height={ROWS * CELL + 10}
            viewBox={`0 0 ${COLS * CELL + 10} ${ROWS * CELL + 10}`}
            style={{ overflow: 'visible' }}>
            {current.cells.map((row, r) =>
              row.map((type, c) => {
                const x = 5 + c * CELL;
                const y = 5 + r * CELL;
                const isStart = r === 0 && c === 0;
                const isEnd = r === ROWS - 1 && c === COLS - 1;
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={x} y={y} width={CELL - 2} height={CELL - 2} rx={4}
                      fill={cellFill(type)}
                      stroke={type === 'active' ? AMBER : type === 'path' ? GREEN : 'var(--dsa-border)'}
                      strokeWidth={type === 'active' || type === 'path' ? 2 : 1} />
                    <text x={x + (CELL - 2) / 2} y={y + (CELL - 2) / 2 - 4}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={12} fontWeight={700} fill={textColor(type)}>
                      {cellText(r, c, type)}
                    </text>
                    {(isStart || isEnd) && (
                      <text x={x + (CELL - 2) / 2} y={y + (CELL - 2) / 2 + 9}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={9} fill={textColor(type)}>
                        {isStart ? 'start' : 'end'}
                      </text>
                    )}
                  </g>
                );
              })
            )}
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {step === stepStates.length - 1 ? 'Destination reached!' : `Level ${current.level}`}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.desc}
            </div>
            {current.queue.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 11 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>Queue: </span>
                <span style={{ color: AMBER, fontWeight: 700 }}>[{current.queue.join(', ')}]</span>
              </div>
            )}
            {step === stepStates.length - 1 && (
              <div style={{ marginTop: 8, fontWeight: 700, color: GREEN }}>Return 4</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: AMBER, label: 'Current BFS frontier' },
              { color: GREEN, label: 'Shortest path / destination' },
              { color: 'var(--dsa-border)', label: 'Visited (marked 1)' },
              { color: BLOCKED, label: 'Blocked cell (1)' },
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
        <button onClick={() => setStep(s => Math.min(stepStates.length - 1, s + 1))} disabled={step === stepStates.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === stepStates.length - 1 ? 'var(--dsa-surface)' : ACCENT2, color: step === stepStates.length - 1 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === stepStates.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)', cursor: 'pointer', fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}
