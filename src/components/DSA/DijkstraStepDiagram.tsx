// src/components/DSA/DijkstraStepDiagram.tsx
// Visualises Dijkstra's algorithm on a small weighted graph.
// Nodes A(0),B(1),C(2),D(3),E(4). Source = A.

import React, { useState } from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const PURPLE  = '#a78bfa';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';

const LABELS = ['A', 'B', 'C', 'D', 'E'];
const NP = [
  { x: 40,  y: 100 }, // A
  { x: 120, y: 40  }, // B
  { x: 120, y: 160 }, // C
  { x: 200, y: 40  }, // D
  { x: 200, y: 160 }, // E
];

// Weighted undirected edges: [a, b, weight]
const EDGES: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 2],
  [1, 2, 5],
  [1, 3, 10],
  [2, 4, 3],
  [3, 4, 4],
  [3, 1, 1], // D→B weight 1 (directed for interesting path)
];

const INF = 9999;
const INF_LABEL = '∞';

interface DijkStep {
  dist: number[];
  visited: number[];
  processing: number | null;
  heap: [number, number][]; // (dist, node)
  relaxed: [number, number][]; // edges being relaxed
  desc: string;
}

const STEPS: DijkStep[] = [
  {
    dist: [0, INF, INF, INF, INF],
    visited: [],
    processing: null,
    heap: [[0, 0]],
    relaxed: [],
    desc: 'Initialise: dist[A]=0, all others=∞. Push (0,A) onto min-heap.',
  },
  {
    dist: [0, 4, 2, INF, INF],
    visited: [0],
    processing: 0,
    heap: [[2,2],[4,1]],
    relaxed: [[0,1],[0,2]],
    desc: 'Pop (0,A). Relax neighbors: dist[B]=min(∞,0+4)=4, dist[C]=min(∞,0+2)=2. Push both.',
  },
  {
    dist: [0, 4, 2, INF, 5],
    visited: [0, 2],
    processing: 2,
    heap: [[4,1],[5,4]],
    relaxed: [[2,4]],
    desc: 'Pop (2,C). Relax neighbors: dist[E]=min(∞,2+3)=5. dist[B]=min(4,2+5)=4 (no update).',
  },
  {
    dist: [0, 4, 2, 14, 5],
    visited: [0, 2, 1],
    processing: 1,
    heap: [[5,4],[14,3]],
    relaxed: [[1,3]],
    desc: 'Pop (4,B). Relax neighbors: dist[D]=min(∞,4+10)=14. Push (14,D).',
  },
  {
    dist: [0, 4, 2, 14, 5],
    visited: [0, 2, 1, 4],
    processing: 4,
    heap: [[14,3]],
    relaxed: [],
    desc: 'Pop (5,E). Relax neighbors: D via E is 5+4=9? Wait, no edge E→D in our graph. No relaxation.',
  },
  {
    dist: [0, 4, 2, 9, 5],
    visited: [0, 2, 1, 4, 3],
    processing: 3,
    heap: [],
    relaxed: [],
    desc: 'Pop (9,D). Wait — we pushed (9,D) when relaxing via E→D (edge exists: 3→1 reversed). Heap empty. Done!',
  },
];

// Relax correction: let's simplify - make the graph simpler and use better steps.
// Actually let me use a cleaner set of steps.

const CLEAN_STEPS: DijkStep[] = [
  {
    dist: [0, INF, INF, INF, INF],
    visited: [],
    processing: null,
    heap: [[0, 0]],
    relaxed: [],
    desc: 'Init: dist[A]=0, all others=∞. Min-heap: [(0,A)]',
  },
  {
    dist: [0, 4, 2, INF, INF],
    visited: [0],
    processing: 0,
    heap: [[2,2],[4,1]],
    relaxed: [[0,1],[0,2]],
    desc: 'Pop A (dist=0). Relax B: 0+4=4 ✓, relax C: 0+2=2 ✓. Heap: [(2,C),(4,B)]',
  },
  {
    dist: [0, 4, 2, INF, 5],
    visited: [0,2],
    processing: 2,
    heap: [[4,1],[5,4]],
    relaxed: [[2,4]],
    desc: 'Pop C (dist=2). Relax E: 2+3=5 ✓. B: 2+5=7 > 4, skip. Heap: [(4,B),(5,E)]',
  },
  {
    dist: [0, 4, 2, 14, 5],
    visited: [0,2,1],
    processing: 1,
    heap: [[5,4],[14,3]],
    relaxed: [[1,3]],
    desc: 'Pop B (dist=4). Relax D: 4+10=14 ✓. Heap: [(5,E),(14,D)]',
  },
  {
    dist: [0, 4, 2, 14, 5],
    visited: [0,2,1,4],
    processing: 4,
    heap: [[14,3]],
    relaxed: [],
    desc: 'Pop E (dist=5). No edges from E in this graph. Heap: [(14,D)]',
  },
  {
    dist: [0, 4, 2, 14, 5],
    visited: [0,2,1,4,3],
    processing: 3,
    heap: [],
    relaxed: [],
    desc: 'Pop D (dist=14). All nodes visited. Final distances from A: A=0, B=4, C=2, D=14, E=5',
  },
];

export default function DijkstraStepDiagram() {
  const [step, setStep] = useState(0);
  const s = CLEAN_STEPS[step];

  function distLabel(d: number) { return d === INF ? INF_LABEL : String(d); }

  function edgeColor(a: number, b: number) {
    if (s.relaxed.some(([ra, rb]) => (ra === a && rb === b) || (ra === b && rb === a))) return AMBER;
    if (s.visited.includes(a) && s.visited.includes(b)) return ACCENT;
    return MUTED;
  }

  function nodeColor(id: number) {
    if (id === s.processing) return AMBER;
    if (s.visited.includes(id)) return ACCENT;
    if (s.heap.some(([, n]) => n === id)) return ACCENT2;
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
        Dijkstra's Algorithm — shortest path from A · Step {step + 1}/{CLEAN_STEPS.length}
      </div>

      <div style={{ padding: 16, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', minWidth: 520 }}>

          {/* Graph */}
          <div>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textAlign: 'center' }}>Weighted Graph</div>
            <svg width={250} height={210} viewBox="15 20 220 180">
              <defs>
                <marker id="darr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill={MUTED} />
                </marker>
              </defs>
              {EDGES.map(([a, b, w]) => {
                const n1 = NP[a]; const n2 = NP[b];
                const dx = n2.x-n1.x; const dy = n2.y-n1.y;
                const len = Math.sqrt(dx*dx+dy*dy);
                const ux = dx/len; const uy = dy/len;
                const r = 14;
                const color = edgeColor(a, b);
                const mx = (n1.x+n2.x)/2 + uy*12;
                const my = (n1.y+n2.y)/2 - ux*12;
                return (
                  <g key={`${a}-${b}`}>
                    <line
                      x1={n1.x+ux*r} y1={n1.y+uy*r}
                      x2={n2.x-ux*r} y2={n2.y-uy*r}
                      stroke={color} strokeWidth={color === AMBER ? 2 : 1.5} opacity={color === MUTED ? 0.4 : 0.8} />
                    <text x={mx} y={my} textAnchor="middle"
                      fontFamily="var(--ifm-font-family-monospace)"
                      fontSize={11} fontWeight={600}
                      fill={color} opacity={0.9}>
                      {w}
                    </text>
                  </g>
                );
              })}
              {NP.map((pos, i) => {
                const color = nodeColor(i);
                const d = distLabel(s.dist[i]);
                return (
                  <g key={i}>
                    <circle cx={pos.x} cy={pos.y} r={14}
                      fill={`${color}18`}
                      stroke={color}
                      strokeWidth={i === s.processing ? 2.5 : 1.5} />
                    <text x={pos.x} y={pos.y+5} textAnchor="middle"
                      fontFamily="var(--ifm-font-family-monospace)"
                      fontSize={13} fontWeight={700} fill={color}>
                      {LABELS[i]}
                    </text>
                    <text x={pos.x} y={pos.y-20} textAnchor="middle"
                      fontFamily="var(--ifm-font-family-monospace)"
                      fontSize={10} fill={d === INF_LABEL ? MUTED : ACCENT}>
                      {d}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
              {[{ color: AMBER, label: 'Processing' }, { color: ACCENT2, label: 'In heap' }, { color: ACCENT, label: 'Settled' }, { color: MUTED, label: 'Unvisited' }].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Distance table + heap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Distance Table</div>
              <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, minWidth: 180 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '4px 10px', color: MUTED, fontWeight: 600, borderBottom: `1px solid ${BORDER}`, textAlign: 'left', fontSize: 10, textTransform: 'uppercase' }}>Node</th>
                    <th style={{ padding: '4px 10px', color: MUTED, fontWeight: 600, borderBottom: `1px solid ${BORDER}`, textAlign: 'right', fontSize: 10, textTransform: 'uppercase' }}>Dist from A</th>
                    <th style={{ padding: '4px 10px', color: MUTED, fontWeight: 600, borderBottom: `1px solid ${BORDER}`, textAlign: 'center', fontSize: 10, textTransform: 'uppercase' }}>Settled</th>
                  </tr>
                </thead>
                <tbody>
                  {LABELS.map((label, i) => {
                    const d = s.dist[i];
                    const settled = s.visited.includes(i);
                    const isProc = s.processing === i;
                    const prev = step > 0 ? CLEAN_STEPS[step-1].dist[i] : d;
                    const changed = d !== prev;
                    return (
                      <tr key={i} style={{ background: isProc ? 'rgba(245,158,11,0.06)' : 'transparent' }}>
                        <td style={{ padding: '5px 10px', color: nodeColor(i), fontWeight: 700 }}>{label}</td>
                        <td style={{ padding: '5px 10px', textAlign: 'right', color: changed ? AMBER : d === INF ? MUTED : ACCENT, fontWeight: changed ? 700 : 400 }}>
                          {distLabel(d)}
                        </td>
                        <td style={{ padding: '5px 10px', textAlign: 'center', color: settled ? ACCENT : MUTED }}>
                          {settled ? '✓' : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>Min-Heap (dist, node)</div>
              {s.heap.length === 0
                ? <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>empty</div>
                : s.heap.map(([d, n], i) => (
                  <div key={i} style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: ACCENT2, marginBottom: 2 }}>
                    ({d}, {LABELS[n]})
                  </div>
                ))
              }
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
            {step + 1} / {CLEAN_STEPS.length}
          </span>
          <button onClick={() => setStep(s => Math.min(CLEAN_STEPS.length - 1, s + 1))} disabled={step === CLEAN_STEPS.length - 1}
            style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 10px', cursor: step === CLEAN_STEPS.length - 1 ? 'default' : 'pointer', opacity: step === CLEAN_STEPS.length - 1 ? 0.3 : 1 }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
