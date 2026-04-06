// src/components/DSA/PathSumDiagram.tsx
// Tree [5,4,8,11,null,13,4,7,2], target=22.
// Highlights the valid path 5→4→11→2 = 22 in amber.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const PATH_SET = new Set([0, 1, 3, 7]); // indices of nodes on the target path

const NODES = [
  { val:'5',  x:160, y:35,  i:0 },
  { val:'4',  x:75,  y:95,  i:1 },
  { val:'8',  x:245, y:95,  i:2 },
  { val:'11', x:35,  y:155, i:3 },
  { val:'13', x:195, y:155, i:4 },
  { val:'4',  x:285, y:155, i:5 },
  { val:'7',  x:15,  y:215, i:6 },
  { val:'2',  x:75,  y:215, i:7 },
];

const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[2,4],[2,5],[3,6],[3,7]];

export default function PathSumDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12, textAlign: 'center' }}>
        target = 22 · path 5→4→11→2 = 22 ✓
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={310} height={255} style={{ overflow: 'visible' }}>
          {EDGES.map(([a,b],i) => {
            const onPath = PATH_SET.has(a) && PATH_SET.has(b);
            return (
              <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                stroke={onPath ? AMBER : MUTED} strokeWidth={onPath ? 2.5 : 1.5} opacity={onPath ? 0.9 : 0.35} />
            );
          })}
          {NODES.map((n,i) => {
            const color = PATH_SET.has(n.i) ? AMBER : ACCENT2;
            return (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${color} 20%, transparent)`}
                  stroke={color} strokeWidth={2} />
                <text x={n.x} y={n.y+5} textAnchor="middle"
                  fontSize={12} fontWeight={700} fill={color}
                  fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        {[
          { color: AMBER,   label: 'path node (sum = 22 at leaf)' },
          { color: ACCENT2, label: 'other nodes' },
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
