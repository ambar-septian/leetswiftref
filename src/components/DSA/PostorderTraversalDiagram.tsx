// src/components/DSA/PostorderTraversalDiagram.tsx
// Tree [1,2,3]. Postorder: left → right → root → [2,3,1].
// Highlights visit order with numbered badges.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { val:'1', x:160, y:35,  order:3 },
  { val:'2', x:80,  y:100, order:1 },
  { val:'3', x:240, y:100, order:2 },
];

const EDGES: [number,number][] = [[0,1],[0,2]];

export default function PostorderTraversalDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        Postorder: left → right → root &nbsp;·&nbsp; result = [2, 3, 1]
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap', alignItems:'center' }}>
        <svg width={320} height={145} style={{ overflow:'visible' }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
          ))}
          {NODES.map((n,i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={`color-mix(in srgb, ${ACCENT2} 18%, transparent)`}
                stroke={ACCENT2} strokeWidth={2} />
              <text x={n.x} y={n.y+5} textAnchor="middle"
                fontSize={13} fontWeight={700} fill={ACCENT2}
                fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              <circle cx={n.x+14} cy={n.y-14} r={9} fill={AMBER} />
              <text x={n.x+14} y={n.y-10} textAnchor="middle"
                fontSize={10} fontWeight={700} fill="#000"
                fontFamily="var(--ifm-font-family-monospace)">{n.order}</text>
            </g>
          ))}
        </svg>
        <div style={{ fontSize:12, fontFamily:'var(--ifm-font-family-monospace)', display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ color:MUTED }}>Recursive calls:</div>
          {[
            { call:'postorder(1)', action:'recurse left first', color:MUTED },
            { call:'postorder(2)', action:'leaf → return [2]',  color:AMBER },
            { call:'postorder(3)', action:'leaf → return [3]',  color:AMBER },
            { call:'postorder(1)', action:'[] + [] + [1] = [2,3,1]', color:AMBER },
          ].map(({ call, action, color }, i) => (
            <div key={i} style={{ display:'flex', gap:8 }}>
              <span style={{ color:ACCENT2, minWidth:110 }}>{call}</span>
              <span style={{ color }}>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
