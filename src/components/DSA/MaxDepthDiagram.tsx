// src/components/DSA/MaxDepthDiagram.tsx
// Tree [3,9,20,null,null,15,7] — post-order DFS computing height bottom-up.
// Each node shows its returned height value.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { val:'3',  x:150, y:35,  height:'3', color: AMBER },
  { val:'9',  x:70,  y:95,  height:'1', color: ACCENT2 },
  { val:'20', x:230, y:95,  height:'2', color: ACCENT2 },
  { val:'15', x:185, y:155, height:'1', color: ACCENT2 },
  { val:'7',  x:275, y:155, height:'1', color: ACCENT2 },
];

const EDGES: [number,number][] = [[0,1],[0,2],[2,3],[2,4]];

export default function MaxDepthDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12, textAlign: 'center' }}>
        Post-order DFS · each node returns 1 + max(left, right) · answer = 3
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={310} height={200} style={{ overflow: 'visible' }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
          ))}
          {NODES.map((n,i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={`color-mix(in srgb, ${n.color} 20%, transparent)`}
                stroke={n.color} strokeWidth={2} />
              <text x={n.x} y={n.y+5} textAnchor="middle"
                fontSize={12} fontWeight={700} fill={n.color}
                fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              {/* height badge */}
              <rect x={n.x + R - 2} y={n.y - R - 12} width={22} height={14} rx={3}
                fill={`color-mix(in srgb, ${n.color} 25%, transparent)`}
                stroke={n.color} strokeWidth={1} />
              <text x={n.x + R + 9} y={n.y - R - 2} textAnchor="middle"
                fontSize={9} fontWeight={700} fill={n.color}
                fontFamily="var(--ifm-font-family-monospace)">h={n.height}</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        {[
          { color: AMBER,   label: 'root — max depth returned' },
          { color: ACCENT2, label: 'subtree height' },
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
