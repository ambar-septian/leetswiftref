// src/components/DSA/SymmetricTreeDiagram.tsx
// Tree [1,2,2,3,4,4,3] — symmetric.
// Highlights mirror pairs checked by BFS: (2,2), (3,4) and (4,3) → all match.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

// Mirror pair colours
const PAIR1 = ACCENT2;
const PAIR2 = AMBER;

const NODES = [
  { val:'1', x:175, y:35,  color: MUTED },   // 0 root
  { val:'2', x:90,  y:95,  color: PAIR1 },   // 1 left
  { val:'2', x:260, y:95,  color: PAIR1 },   // 2 right (mirror of 1)
  { val:'3', x:45,  y:155, color: PAIR2 },   // 3
  { val:'4', x:135, y:155, color: PAIR2 },   // 4
  { val:'4', x:215, y:155, color: PAIR2 },   // 5
  { val:'3', x:305, y:155, color: PAIR2 },   // 6
];

const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

// Mirror arrows: 1↔2, 3↔6, 4↔5
const MIRRORS: [number,number,string][] = [
  [1, 2, PAIR1],
  [3, 6, PAIR2],
  [4, 5, PAIR2],
];

export default function SymmetricTreeDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12, textAlign: 'center' }}>
        BFS mirror pairs — l1.left paired with l2.right, l1.right with l2.left
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={350} height={210} style={{ overflow: 'visible' }}>
          {/* Tree edges */}
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
          ))}
          {/* Mirror dashed arcs (simple horizontal lines at node level) */}
          {MIRRORS.map(([a,b,color],i) => (
            <line key={`m${i}`}
              x1={NODES[a].x} y1={NODES[a].y}
              x2={NODES[b].x} y2={NODES[b].y}
              stroke={color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7} />
          ))}
          {/* Nodes */}
          {NODES.map((n,i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={`color-mix(in srgb, ${n.color} 18%, transparent)`}
                stroke={n.color} strokeWidth={2} />
              <text x={n.x} y={n.y+5} textAnchor="middle"
                fontSize={13} fontWeight={700} fill={n.color}
                fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
            </g>
          ))}
          {/* Mirror ✓ labels */}
          {MIRRORS.map(([a,b,color],i) => {
            const mx = (NODES[a].x + NODES[b].x) / 2;
            const my = NODES[a].y - 12;
            return (
              <text key={`ml${i}`} x={mx} y={my} textAnchor="middle"
                fontSize={10} fill={color} fontFamily="var(--ifm-font-family-monospace)">✓</text>
            );
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
        {[
          { color: PAIR1, label: 'mirror pair — level 1' },
          { color: PAIR2, label: 'mirror pairs — level 2' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
