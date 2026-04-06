// src/components/DSA/PreorderTraversalDiagram.tsx
// Tree [1,null,2,3]. Preorder: root → left → right → [1,2,3].
// Highlights visit order with numbered badges.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { val:'1', x:160, y:35,  order:1 },
  { val:'2', x:240, y:100, order:2 },
  { val:'3', x:180, y:165, order:3 },
];

const EDGES: [number,number][] = [[0,1],[1,2]];

export default function PreorderTraversalDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        Preorder: root → left → right &nbsp;·&nbsp; result = [1, 2, 3]
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap', alignItems:'center' }}>
        <svg width={300} height={200} style={{ overflow:'visible' }}>
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
              {/* visit order badge */}
              <circle cx={n.x+14} cy={n.y-14} r={9} fill={AMBER} />
              <text x={n.x+14} y={n.y-10} textAnchor="middle"
                fontSize={10} fontWeight={700} fill="#000"
                fontFamily="var(--ifm-font-family-monospace)">{n.order}</text>
            </g>
          ))}
          {/* "null left" label for node 1 */}
          <text x={80} y={100} fontSize={10} fill={MUTED} fontFamily="var(--ifm-font-family-monospace)" opacity={0.6}>left=nil</text>
        </svg>
        <div style={{ fontSize:12, fontFamily:'var(--ifm-font-family-monospace)', display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ color:MUTED }}>Call stack:</div>
          {[
            { call:'preorder(1)',  action:'visit 1 → [1]',  color:AMBER },
            { call:'preorder(nil)',action:'left nil → []',   color:MUTED },
            { call:'preorder(2)',  action:'visit 2 → [1,2]', color:AMBER },
            { call:'preorder(3)',  action:'visit 3 → [1,2,3]',color:AMBER },
          ].map(({ call, action, color }) => (
            <div key={call} style={{ display:'flex', gap:8 }}>
              <span style={{ color:ACCENT2, minWidth:110 }}>{call}</span>
              <span style={{ color }}>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
