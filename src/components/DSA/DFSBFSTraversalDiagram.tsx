// src/components/DSA/DFSBFSTraversalDiagram.tsx
// Interactive step-through comparing DFS vs BFS traversal on the same graph.

import React, { useState } from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';

// Graph: 0 connects to 1,2; 1 connects to 3,4; 2 connects to 5,6
const NODES_POS: Record<number, { x: number; y: number }> = {
  0: { x: 110, y: 20  },
  1: { x: 50,  y: 80  },
  2: { x: 170, y: 80  },
  3: { x: 10,  y: 150 },
  4: { x: 90,  y: 150 },
  5: { x: 130, y: 150 },
  6: { x: 210, y: 150 },
};

const EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

// DFS from 0 (stack order, left-to-right neighbors)
const DFS_STEPS = [
  { visited: [0],           stack: [0],       desc: 'Push 0 onto stack, mark visited' },
  { visited: [0,1],         stack: [2,1],     desc: 'Pop 0 → push neighbors [1,2] → visit 1' },
  { visited: [0,1,3],       stack: [2,4,3],   desc: 'Pop 1 → push neighbors [3,4] → visit 3' },
  { visited: [0,1,3,4],     stack: [2,4],     desc: 'Pop 3 → no unvisited neighbors → visit 4' },
  { visited: [0,1,3,4,2],   stack: [2],       desc: 'Pop 4 → no neighbors → pop 2 → visit 2' },
  { visited: [0,1,3,4,2,5], stack: [6,5],     desc: 'Pop 2 → push [5,6] → visit 5' },
  { visited: [0,1,3,4,2,5,6], stack: [6],     desc: 'Pop 5 → no neighbors → visit 6' },
  { visited: [0,1,3,4,2,5,6], stack: [],      desc: 'Pop 6 → done! Order: 0,1,3,4,2,5,6' },
];

// BFS from 0 (queue order)
const BFS_STEPS = [
  { visited: [0],                 queue: [0],     desc: 'Enqueue 0, mark visited' },
  { visited: [0,1,2],             queue: [1,2],   desc: 'Dequeue 0 → enqueue neighbors [1,2]' },
  { visited: [0,1,2,3,4],         queue: [2,3,4], desc: 'Dequeue 1 → enqueue neighbors [3,4]' },
  { visited: [0,1,2,3,4,5,6],     queue: [3,4,5,6], desc: 'Dequeue 2 → enqueue neighbors [5,6]' },
  { visited: [0,1,2,3,4,5,6],     queue: [4,5,6], desc: 'Dequeue 3 → no unvisited neighbors' },
  { visited: [0,1,2,3,4,5,6],     queue: [5,6],   desc: 'Dequeue 4 → no unvisited neighbors' },
  { visited: [0,1,2,3,4,5,6],     queue: [6],     desc: 'Dequeue 5 → no unvisited neighbors' },
  { visited: [0,1,2,3,4,5,6],     queue: [],      desc: 'Dequeue 6 → done! Order: 0,1,2,3,4,5,6' },
];

function GraphSVG({ highlighted }: { highlighted: number[] }) {
  const r = 14;
  return (
    <svg width={240} height={185} viewBox="-5 5 230 175">
      <defs>
        <marker id="arr2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={MUTED} />
        </marker>
      </defs>
      {EDGES.map(([a, b]) => {
        const n1 = NODES_POS[a];
        const n2 = NODES_POS[b];
        const dx = n2.x - n1.x; const dy = n2.y - n1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const ux = dx/len; const uy = dy/len;
        return (
          <line key={`${a}-${b}`}
            x1={n1.x + ux*r} y1={n1.y + uy*r}
            x2={n2.x - ux*r} y2={n2.y - uy*r}
            stroke={MUTED} strokeWidth={1.5} markerEnd="url(#arr2)" />
        );
      })}
      {Object.entries(NODES_POS).map(([id, pos]) => {
        const nid = Number(id);
        const idx = highlighted.indexOf(nid);
        const isVisited = idx !== -1;
        const isLatest = idx === highlighted.length - 1;
        return (
          <g key={id}>
            <circle cx={pos.x} cy={pos.y} r={r}
              fill={isLatest ? `rgba(74,222,128,0.25)` : isVisited ? `rgba(74,222,128,0.08)` : SURFACE2}
              stroke={isLatest ? ACCENT : isVisited ? `rgba(74,222,128,0.5)` : BORDER}
              strokeWidth={isLatest ? 2 : 1.5} />
            <text x={pos.x} y={pos.y+5} textAnchor="middle"
              fontFamily="var(--ifm-font-family-monospace)"
              fontSize={12} fontWeight={700}
              fill={isVisited ? ACCENT : MUTED}>
              {id}
            </text>
            {idx !== -1 && (
              <text x={pos.x + r + 2} y={pos.y - r - 2}
                fontFamily="var(--ifm-font-family-monospace)"
                fontSize={9} fill={ACCENT} opacity={0.7}>
                {idx + 1}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function DFSBFSTraversalDiagram() {
  const [step, setStep] = useState(0);
  const maxStep = DFS_STEPS.length - 1;

  const dfs = DFS_STEPS[step];
  const bfs = BFS_STEPS[step];

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', margin: '20px 0' }}>
      {/* Header */}
      <div style={{ background: SURFACE2, borderBottom: `1px solid ${BORDER}`, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#4ade80' }} />
        </div>
        DFS vs BFS — traversal order comparison · Step {step + 1}/{DFS_STEPS.length}
      </div>

      <div style={{ padding: 16, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', minWidth: 480 }}>

          {/* DFS panel */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: ACCENT, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 8, textAlign: 'center' }}>
              DFS (Stack)
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GraphSVG highlighted={dfs.visited} />
            </div>
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '8px 12px', marginTop: 8 }}>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4 }}>STACK</div>
              <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: ACCENT }}>
                [{dfs.stack.join(', ')}]
              </div>
            </div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 8, lineHeight: 1.6 }}>
              Visited: [{dfs.visited.join(' → ')}]
            </div>
          </div>

          {/* BFS panel */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: ACCENT2, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 8, textAlign: 'center' }}>
              BFS (Queue)
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GraphSVG highlighted={bfs.visited} />
            </div>
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '8px 12px', marginTop: 8 }}>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4 }}>QUEUE</div>
              <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: ACCENT2 }}>
                [{bfs.queue.join(', ')}]
              </div>
            </div>
            <div style={{ fontSize: 12, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 8, lineHeight: 1.6 }}>
              Visited: [{bfs.visited.join(' → ')}]
            </div>
          </div>
        </div>

        {/* Current step description */}
        <div style={{ marginTop: 12, padding: '10px 14px', background: SURFACE2, borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 13, color: '#9ca3af', fontFamily: 'var(--ifm-font-family-monospace)', lineHeight: 1.6 }}>
          <span style={{ color: AMBER }}>Step {step + 1}:</span> {dfs.desc}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 10px', cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.3 : 1 }}>
            ← Prev
          </button>
          <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED }}>
            {step + 1} / {DFS_STEPS.length}
          </span>
          <button
            onClick={() => setStep(s => Math.min(maxStep, s + 1))}
            disabled={step === maxStep}
            style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 10px', cursor: step === maxStep ? 'default' : 'pointer', opacity: step === maxStep ? 0.3 : 1 }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
