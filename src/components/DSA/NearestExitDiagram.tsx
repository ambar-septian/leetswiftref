import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const BLOCKED = '#374151';

// maze = [["+",".","+"],[".",".","."],["+","+","."]]
// entrance = [1,0]
// BFS level 1: visit (1,1)
// BFS level 2: visit (0,1) and (1,2)
//   (0,1) tries going up → out-of-bounds → NOT entrance → return 2
// Answer: 2

type CellType = 'wall' | 'free' | 'entrance' | 'visited' | 'active' | 'exit';

const ROWS = 3, COLS = 3;

const stepStates: { cells: CellType[][], queue: string[], level: number, desc: string }[] = [
  {
    cells: [
      ['wall','free','wall'],
      ['entrance','free','free'],
      ['wall','wall','free'],
    ],
    queue: ['(1,0)'],
    level: 0,
    desc: 'Start at entrance (1,0). BFS explores 4-directionally. Exits are empty cells on the border — except the entrance itself.',
  },
  {
    cells: [
      ['wall','free','wall'],
      ['visited','active','free'],
      ['wall','wall','free'],
    ],
    queue: ['(1,1)'],
    level: 1,
    desc: 'Level 1: process (1,0). Left/up/down are walls or out-of-bounds at entrance — skip. Right (1,1) is free → mark visited. Advance level→1.',
  },
  {
    cells: [
      ['wall','active','wall'],
      ['visited','visited','active'],
      ['wall','wall','free'],
    ],
    queue: ['(0,1)','(1,2)'],
    level: 2,
    desc: 'Level 2: process (1,1). Free neighbors: up (0,1) and right (1,2). Mark both. Advance level→2.',
  },
  {
    cells: [
      ['wall','exit','wall'],
      ['visited','visited','visited'],
      ['wall','wall','free'],
    ],
    queue: [],
    level: 2,
    desc: 'Process (0,1). Going up is out-of-bounds — (0,1) is a border cell and is NOT the entrance → exit found! Return level = 2.',
  },
];

const CELL = 52;

function cellFill(type: CellType): string {
  if (type === 'wall')     return BLOCKED;
  if (type === 'active')   return AMBER;
  if (type === 'visited')  return 'var(--dsa-border)';
  if (type === 'exit')     return GREEN;
  if (type === 'entrance') return ACCENT2;
  return 'var(--dsa-surface)';
}

function cellTextColor(type: CellType): string {
  if (type === 'free') return 'var(--dsa-text-muted)';
  return '#fff';
}

export default function NearestExitDiagram() {
  const [step, setStep] = useState(0);
  const current = stepStates[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        maze = [["+",".","+"],[".",".","."],["+","+","."]] &nbsp;|&nbsp; entrance=[1,0] &nbsp;|&nbsp; BFS 4-directional
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
                const isEntrance = type === 'entrance';
                const isExit = type === 'exit';
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={x} y={y} width={CELL - 2} height={CELL - 2} rx={4}
                      fill={cellFill(type)}
                      stroke={type === 'active' ? AMBER : type === 'exit' ? GREEN : 'var(--dsa-border)'}
                      strokeWidth={type === 'active' || type === 'exit' ? 2 : 1} />
                    <text x={x + (CELL-2)/2} y={y + (CELL-2)/2 - 4}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={11} fontWeight={700} fill={cellTextColor(type)}>
                      {type === 'wall' ? '+' : '.'}
                    </text>
                    {(isEntrance || isExit) && (
                      <text x={x + (CELL-2)/2} y={y + (CELL-2)/2 + 9}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={9} fill={cellTextColor(type)}>
                        {isEntrance ? 'start' : 'exit!'}
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
              {step === stepStates.length - 1 ? 'Exit found!' : `Level ${current.level}`}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
            {current.queue.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 11 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>Queue: </span>
                <span style={{ color: AMBER, fontWeight: 700 }}>[{current.queue.join(', ')}]</span>
              </div>
            )}
            {step === stepStates.length - 1 && (
              <div style={{ marginTop: 8, fontWeight: 700, color: GREEN }}>Return 2</div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: ACCENT2,  label: 'Entrance (not a valid exit)' },
              { color: AMBER,    label: 'Current BFS frontier' },
              { color: GREEN,    label: 'Exit found (border cell)' },
              { color: 'var(--dsa-border)', label: 'Visited' },
              { color: BLOCKED,  label: 'Wall (+)' },
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
