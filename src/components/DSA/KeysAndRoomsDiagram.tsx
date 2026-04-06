import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// rooms = [[1,3],[2],[],[]]
// Room 0: keys [1,3], Room 1: keys [2], Room 2: no keys, Room 3: no keys
// DFS: 0 → 1 → 2 → backtrack → 3 → all 4 visited → true

const rooms = [
  { id: 0, keys: [1, 3], x: 60,  y: 120 },
  { id: 1, keys: [2],    x: 190, y: 50  },
  { id: 2, keys: [],     x: 310, y: 50  },
  { id: 3, keys: [],     x: 190, y: 190 },
];

const steps = [
  {
    current: 0,
    visited: [0],
    stack: [0],
    desc: 'Start at room 0. Collect keys [1,3]. Mark room 0 visited.',
  },
  {
    current: 1,
    visited: [0, 1],
    stack: [0, 1],
    desc: 'Use key 1 → enter room 1. Collect keys [2]. Mark room 1 visited.',
  },
  {
    current: 2,
    visited: [0, 1, 2],
    stack: [0, 1, 2],
    desc: 'Use key 2 → enter room 2. No keys. Mark room 2 visited.',
  },
  {
    current: 1,
    visited: [0, 1, 2],
    stack: [0, 1],
    desc: 'Backtrack to room 1. No more neighbors.',
  },
  {
    current: 3,
    visited: [0, 1, 2, 3],
    stack: [0, 3],
    desc: 'Use key 3 → enter room 3. No keys. Mark room 3 visited. All 4 rooms visited!',
  },
  {
    current: -1,
    visited: [0, 1, 2, 3],
    stack: [],
    desc: 'visited.count (4) == rooms.count (4) → return true.',
  },
];

const nodeMap = new Map<number, typeof rooms[0]>(rooms.map(r => [r.id, r] as [number, typeof rooms[0]]));

export default function KeysAndRoomsDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const visitedSet = new Set(current.visited);

  function nodeColor(id: number): string {
    if (id === current.current) return AMBER;
    if (visitedSet.has(id)) return GREEN;
    return 'var(--dsa-surface)';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        rooms = [[1,3],[2],[],[]] &nbsp;|&nbsp; DFS from room 0, collect keys, verify all reachable
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="380" height="260" viewBox="0 0 380 260" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {/* Edges (key connections) */}
          {[
            { from: 0, to: 1, label: 'key 1' },
            { from: 0, to: 3, label: 'key 3' },
            { from: 1, to: 2, label: 'key 2' },
          ].map(e => {
            const from = nodeMap.get(e.from)!;
            const to = nodeMap.get(e.to)!;
            const bothVisited = visitedSet.has(e.from) && visitedSet.has(e.to);
            return (
              <g key={`${e.from}-${e.to}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={bothVisited ? GREEN : 'var(--dsa-border)'}
                  strokeWidth={bothVisited ? 2 : 1.5}
                  strokeDasharray={bothVisited ? undefined : '4 3'} />
                <text x={(from.x + to.x) / 2 + 6} y={(from.y + to.y) / 2}
                  fontSize={10} fill={bothVisited ? GREEN : 'var(--dsa-text-muted)'}>
                  {e.label}
                </text>
              </g>
            );
          })}
          {/* Nodes */}
          {rooms.map(r => {
            const fill = nodeColor(r.id);
            const isActive = r.id === current.current;
            const isVisited = visitedSet.has(r.id) && r.id !== current.current;
            return (
              <g key={r.id}>
                <circle cx={r.x} cy={r.y} r={28}
                  fill={fill}
                  stroke={isActive ? AMBER : isVisited ? GREEN : 'var(--dsa-border)'}
                  strokeWidth={2} />
                <text x={r.x} y={r.y - 6} textAnchor="middle" dominantBaseline="middle"
                  fontSize={12} fontWeight={700}
                  fill={isActive || isVisited ? '#fff' : 'var(--dsa-text-muted)'}>
                  {`R${r.id}`}
                </text>
                <text x={r.x} y={r.y + 8} textAnchor="middle" dominantBaseline="middle"
                  fontSize={9}
                  fill={isActive || isVisited ? '#fff' : 'var(--dsa-text-muted)'}>
                  {r.keys.length > 0 ? `keys:[${r.keys.join(',')}]` : 'no keys'}
                </text>
              </g>
            );
          })}
          {/* Result */}
          {step === steps.length - 1 && (
            <text x={190} y={240} textAnchor="middle" fontSize={13} fontWeight={700} fill={GREEN}>
              visited=4 == rooms=4 → return true
            </text>
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
              Step {step + 1} / {steps.length}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.desc}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
              <div>
                <span style={{ color: 'var(--dsa-text-muted)', fontSize: 11 }}>Visited: </span>
                <span style={{ color: GREEN, fontWeight: 700, fontSize: 11 }}>
                  {'{' + [...visitedSet].sort().join(',') + '}'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: AMBER, label: 'Current room (DFS)' },
              { color: GREEN, label: 'Visited room' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === 0 ? 'var(--dsa-surface)' : ACCENT2, color: step === 0 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2, color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)', cursor: 'pointer', fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}
