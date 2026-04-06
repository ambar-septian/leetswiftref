// src/components/DSA/CourseScheduleDiagram.tsx
// 4 courses, prerequisites [[1,0],[2,0],[3,1],[3,2]].
// Shows directed graph + Kahn's BFS topological sort trace.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 20;

// Nodes: 0→1, 0→2, 1→3, 2→3
const NODES = [
  { id: 0, x: 60,  y: 80  },
  { id: 1, x: 185, y: 30  },
  { id: 2, x: 185, y: 130 },
  { id: 3, x: 310, y: 80  },
];

const EDGES: [number, number][] = [[0,1],[0,2],[1,3],[2,3]];

function arrowPath(from: typeof NODES[0], to: typeof NODES[0]) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist, uy = dy / dist;
  const x1 = from.x + ux * R, y1 = from.y + uy * R;
  const x2 = to.x - ux * (R + 4), y2 = to.y - uy * (R + 4);
  return { x1, y1, x2, y2 };
}

const STEPS = [
  { queue: '[0]',    process: '—',  indegree: '[0,1,1,2]', results: '[]',       note: 'init: nodes with in-degree 0 → queue' },
  { queue: '[1,2]',  process: '0',  indegree: '[0,0,0,2]', results: '[0]',      note: 'process 0: decrement neighbors 1 and 2' },
  { queue: '[2,3]?', process: '1',  indegree: '[0,0,0,1]', results: '[0,1]',    note: 'process 1: decrement neighbor 3' },
  { queue: '[3]',    process: '2',  indegree: '[0,0,0,0]', results: '[0,1,2]',  note: 'process 2: decrement neighbor 3 → in-degree hits 0' },
  { queue: '[]',     process: '3',  indegree: '[0,0,0,0]', results: '[0,1,2,3]',note: 'process 3: no neighbors' },
];

export default function CourseScheduleDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 14, textAlign: 'center' }}>
        Kahn's algorithm · BFS topological sort · detect cycle via result count
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>

        {/* Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>prerequisites [[1,0],[2,0],[3,1],[3,2]]</div>
          <svg width={370} height={165} style={{ overflow: 'visible' }}>
            {EDGES.map(([a, b], i) => {
              const { x1, y1, x2, y2 } = arrowPath(NODES[a], NODES[b]);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1.5} opacity={0.5} />
                  <polygon
                    points={`0,-4 8,0 0,4`}
                    fill={MUTED} opacity={0.5}
                    transform={`translate(${x2},${y2}) rotate(${Math.atan2(y2-y1, x2-x1) * 180 / Math.PI})`}
                  />
                </g>
              );
            })}
            {NODES.map(n => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${n.id === 0 ? AMBER : ACCENT2} 18%, transparent)`}
                  stroke={n.id === 0 ? AMBER : ACCENT2} strokeWidth={2} />
                <text x={n.x} y={n.y + 5} textAnchor="middle"
                  fontSize={13} fontWeight={700}
                  fill={n.id === 0 ? AMBER : ACCENT2}
                  fontFamily="var(--ifm-font-family-monospace)">{n.id}</text>
              </g>
            ))}
            {/* in-degree labels */}
            {NODES.map(n => (
              <text key={n.id} x={n.x} y={n.y - R - 5} textAnchor="middle"
                fontSize={10} fill={MUTED} fontFamily="var(--ifm-font-family-monospace)">
                in={[0,1,1,2][n.id]}
              </text>
            ))}
            <text x={185} y={158} textAnchor="middle" fontSize={10} fill={AMBER}
              fontFamily="var(--ifm-font-family-monospace)">node 0 has in-degree 0 → starts in queue</text>
          </svg>
        </div>

        {/* BFS trace table */}
        <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', gap: 8, color: MUTED, fontWeight: 700, paddingBottom: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 4 }}>
            <span style={{ minWidth: 30 }}>step</span>
            <span style={{ minWidth: 60 }}>queue</span>
            <span style={{ minWidth: 95 }}>in-degree</span>
            <span style={{ minWidth: 80 }}>results</span>
          </div>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, paddingBottom: 3, color: MUTED }}>
              <span style={{ minWidth: 30, color: ACCENT2 }}>{i === 0 ? 'init' : `p=${s.process}`}</span>
              <span style={{ minWidth: 60 }}>{s.queue}</span>
              <span style={{ minWidth: 95 }}>{s.indegree}</span>
              <span style={{ minWidth: 80, color: s.results === '[0,1,2,3]' ? AMBER : MUTED, fontWeight: s.results === '[0,1,2,3]' ? 700 : 400 }}>{s.results}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, color: AMBER, fontWeight: 700 }}>result.count (4) == numCourses (4) → true</div>
        </div>
      </div>
    </div>
  );
}
