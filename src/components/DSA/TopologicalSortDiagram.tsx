// src/components/DSA/TopologicalSortDiagram.tsx
// Visualises Kahn's algorithm on a course-prerequisite DAG.
// Courses 0-5, prerequisites: 0→2, 0→3, 1→3, 1→4, 2→5, 3→5, 4→5

import React, { useState } from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';
const RED     = '#f87171';

// node positions
const NP: Record<number, { x: number; y: number }> = {
  0: { x: 30,  y: 70  },
  1: { x: 30,  y: 145 },
  2: { x: 115, y: 30  },
  3: { x: 115, y: 108 },
  4: { x: 115, y: 185 },
  5: { x: 200, y: 108 },
};

const EDGES = [[0,2],[0,3],[1,3],[1,4],[2,5],[3,5],[4,5]];

interface KahnStep {
  inDegree: number[];
  queue: number[];
  order: number[];
  processing: number | null;
  desc: string;
}

const STEPS: KahnStep[] = [
  {
    inDegree: [0,0,1,2,1,3],
    queue: [0,1],
    order: [],
    processing: null,
    desc: 'Compute in-degrees: 0→[2,3], 1→[3,4], etc. Enqueue nodes with in-degree 0: [0, 1]',
  },
  {
    inDegree: [0,0,0,1,1,3],
    queue: [1,2],
    order: [0],
    processing: 0,
    desc: 'Dequeue 0 → add to order. Decrement in-degree of neighbors 2,3. In-degree[2]=0 → enqueue 2',
  },
  {
    inDegree: [0,0,0,0,0,3],
    queue: [2,3,4],
    order: [0,1],
    processing: 1,
    desc: 'Dequeue 1 → add to order. Decrement in-degree of neighbors 3,4. Both become 0 → enqueue [3, 4]',
  },
  {
    inDegree: [0,0,0,0,0,2],
    queue: [3,4],
    order: [0,1,2],
    processing: 2,
    desc: 'Dequeue 2 → add to order. Decrement in-degree of neighbor 5: 3→2',
  },
  {
    inDegree: [0,0,0,0,0,1],
    queue: [4],
    order: [0,1,2,3],
    processing: 3,
    desc: 'Dequeue 3 → add to order. Decrement in-degree of neighbor 5: 2→1',
  },
  {
    inDegree: [0,0,0,0,0,0],
    queue: [5],
    order: [0,1,2,3,4],
    processing: 4,
    desc: 'Dequeue 4 → add to order. Decrement in-degree of neighbor 5: 1→0 → enqueue 5',
  },
  {
    inDegree: [0,0,0,0,0,0],
    queue: [],
    order: [0,1,2,3,4,5],
    processing: 5,
    desc: 'Dequeue 5 → add to order. Queue empty. Topological order: [0, 1, 2, 3, 4, 5]',
  },
];

export default function TopologicalSortDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  function nodeColor(id: number) {
    if (id === s.processing) return AMBER;
    if (s.order.includes(id)) return ACCENT;
    if (s.queue.includes(id)) return ACCENT2;
    return MUTED;
  }

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', margin: '20px 0' }}>
      <div style={{ background: SURFACE2, borderBottom: `1px solid ${BORDER}`, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#4ade80' }} />
        </div>
        Topological Sort — Kahn's Algorithm (BFS)
      </div>

      <div style={{ padding: 16, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', minWidth: 520 }}>

          {/* DAG */}
          <div>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textAlign: 'center' }}>Course Prerequisite DAG</div>
            <svg width={240} height={230} viewBox="10 10 210 200">
              <defs>
                <marker id="topoarr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill={MUTED} />
                </marker>
              </defs>
              {EDGES.map(([a, b]) => {
                const n1 = NP[a]; const n2 = NP[b];
                const dx = n2.x-n1.x; const dy = n2.y-n1.y;
                const len = Math.sqrt(dx*dx+dy*dy);
                const ux = dx/len; const uy = dy/len;
                const r = 14;
                const isDone = s.order.includes(a);
                return (
                  <line key={`${a}-${b}`}
                    x1={n1.x+ux*r} y1={n1.y+uy*r}
                    x2={n2.x-ux*r} y2={n2.y-uy*r}
                    stroke={isDone ? ACCENT : MUTED}
                    strokeWidth={1.5}
                    opacity={isDone ? 0.7 : 0.4}
                    markerEnd="url(#topoarr)" />
                );
              })}
              {Object.entries(NP).map(([id, pos]) => {
                const nid = Number(id);
                const color = nodeColor(nid);
                return (
                  <g key={id}>
                    <circle cx={pos.x} cy={pos.y} r={14}
                      fill={`${color}18`}
                      stroke={color}
                      strokeWidth={nid === s.processing ? 2.5 : 1.5} />
                    <text x={pos.x} y={pos.y+5} textAnchor="middle"
                      fontFamily="var(--ifm-font-family-monospace)"
                      fontSize={13} fontWeight={700} fill={color}>
                      {id}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
              {[
                { color: AMBER, label: 'Processing' },
                { color: ACCENT2, label: 'In queue' },
                { color: ACCENT, label: 'Done' },
                { color: MUTED, label: 'Waiting' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* State tables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* in-degree table */}
            <div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>In-Degree</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {s.inDegree.map((d, i) => {
                  const prev = step > 0 ? STEPS[step-1].inDegree[i] : d;
                  const changed = d !== prev;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
                      <div style={{
                        width: 28, height: 28,
                        border: `1.5px solid ${changed ? AMBER : d === 0 ? ACCENT : BORDER}`,
                        borderRadius: 5,
                        background: changed ? 'rgba(245,158,11,0.12)' : d === 0 ? 'rgba(74,222,128,0.08)' : SURFACE2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, fontWeight: 700,
                        color: changed ? AMBER : d === 0 ? ACCENT : MUTED,
                      }}>
                        {d}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Queue */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '8px 12px', minWidth: 180 }}>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>Queue</div>
              <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, color: ACCENT2 }}>
                [{s.queue.join(', ')}]
              </div>
            </div>

            {/* Order */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '8px 12px', minWidth: 180 }}>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>Topological Order</div>
              <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, color: ACCENT }}>
                [{s.order.join(', ')}]
                {s.order.length === 6 && <span style={{ color: ACCENT, marginLeft: 6 }}>✓</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Desc */}
        <div style={{ marginTop: 12, padding: '10px 14px', background: SURFACE2, borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, color: '#9ca3af', fontFamily: 'var(--ifm-font-family-monospace)', lineHeight: 1.6 }}>
          <span style={{ color: AMBER }}>Step {step + 1}: </span>{s.desc}
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 10px', cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.3 : 1 }}>
            ← Prev
          </button>
          <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED }}>
            {step + 1} / {STEPS.length}
          </span>
          <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
            style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 10px', cursor: step === STEPS.length - 1 ? 'default' : 'pointer', opacity: step === STEPS.length - 1 ? 0.3 : 1 }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
