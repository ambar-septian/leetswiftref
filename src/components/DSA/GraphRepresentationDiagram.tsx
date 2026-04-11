// src/components/DSA/GraphRepresentationDiagram.tsx
// Shows a 5-node directed graph next to its adjacency list representation.

import React from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';
const TEXT    = '#e8eaf0';

// Nodes: 0-4, positioned in a rough pentagon
const NODES = [
  { id: 0, x: 90,  y: 30  },
  { id: 1, x: 180, y: 80  },
  { id: 2, x: 150, y: 175 },
  { id: 3, x: 30,  y: 175 },
  { id: 4, x: 0,   y: 80  },
];

// Directed edges
const EDGES = [
  [0, 1], [0, 4],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 1],
];

const ADJ_LIST = [
  '[1, 4]',
  '[2]',
  '[3]',
  '[4]',
  '[1]',
];

function arrowHead(x1: number, y1: number, x2: number, y2: number) {
  const r = 14; // node radius
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  // endpoint stops at node border
  const ex = x2 - ux * r;
  const ey = y2 - uy * r;
  // start from node border too
  const sx = x1 + ux * r;
  const sy = y1 + uy * r;
  return { sx, sy, ex, ey, ux, uy };
}

export default function GraphRepresentationDiagram() {
  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '20px 16px',
      margin: '20px 0',
      overflowX: 'auto',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Graph Representation — Directed graph with 5 nodes
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>

        {/* SVG graph */}
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 8, textAlign: 'center' }}>Visual</div>
          <svg width={210} height={220} viewBox="-20 10 230 195">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={MUTED} />
              </marker>
            </defs>

            {/* Edges */}
            {EDGES.map(([a, b]) => {
              const n1 = NODES[a];
              const n2 = NODES[b];
              const { sx, sy, ex, ey } = arrowHead(n1.x, n1.y, n2.x, n2.y);
              return (
                <line key={`${a}-${b}`} x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke={MUTED} strokeWidth={1.5} markerEnd="url(#arrow)" />
              );
            })}

            {/* Nodes */}
            {NODES.map(n => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={14}
                  fill={`rgba(74,222,128,0.10)`}
                  stroke={ACCENT}
                  strokeWidth={1.5} />
                <text x={n.x} y={n.y + 5}
                  textAnchor="middle"
                  fontFamily="var(--ifm-font-family-monospace)"
                  fontSize={13}
                  fontWeight={700}
                  fill={ACCENT}>
                  {n.id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Adjacency list */}
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 8, textAlign: 'center' }}>Adjacency List</div>
          <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 16px', minWidth: 160 }}>
            {ADJ_LIST.map((neighbors, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: i < ADJ_LIST.length - 1 ? 8 : 0 }}>
                <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, color: ACCENT, fontWeight: 700, width: 16 }}>{i}</span>
                <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED }}>→</span>
                <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, color: ACCENT2 }}>{neighbors}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 16px', minWidth: 160 }}>
            <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Adjacency Matrix (partial)</div>
            <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12 }}>
              {[
                [0,1,0,0,1],
                [0,0,1,0,0],
                [0,0,0,1,0],
                [0,0,0,0,1],
                [0,1,0,0,0],
              ].map((row, r) => (
                <div key={r} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                  {row.map((cell, c) => (
                    <span key={c} style={{ color: cell ? ACCENT : MUTED, opacity: cell ? 1 : 0.4, width: 12, textAlign: 'center' }}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Properties */}
        <div style={{ fontSize: 12, fontFamily: 'var(--ifm-font-family-monospace)', color: MUTED, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 24 }}>
          {[
            { label: 'Vertices (V)', value: '5', color: ACCENT },
            { label: 'Edges (E)', value: '6', color: ACCENT },
            { label: 'Type', value: 'Directed', color: ACCENT2 },
            { label: 'Weighted', value: 'No', color: ACCENT2 },
            { label: 'Adj list space', value: 'O(V+E)', color: TEXT },
            { label: 'Matrix space', value: 'O(V²)', color: TEXT },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <span>{label}</span>
              <span style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
