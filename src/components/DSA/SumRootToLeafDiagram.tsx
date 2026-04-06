// src/components/DSA/SumRootToLeafDiagram.tsx
// Tree [4,9,0,5,1] — each root-to-leaf path forms a number.
// Paths: 4→9→5=495, 4→9→1=491, 4→0=40. Sum=1026.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const PATH_COLORS = ['#f59e0b', 'var(--dsa-accent2)', '#a78bfa'];

const NODES = [
  { val:'4', x:130, y:35  },
  { val:'9', x:65,  y:100 },
  { val:'0', x:195, y:100 },
  { val:'5', x:30,  y:165 },
  { val:'1', x:100, y:165 },
];

// path 0: nodes 0,1,3 → 495
// path 1: nodes 0,1,4 → 491
// path 2: nodes 0,2   → 40
const PATHS = [
  { nodes:[0,1,3], number:'495', color:PATH_COLORS[0] },
  { nodes:[0,1,4], number:'491', color:PATH_COLORS[1] },
  { nodes:[0,2],   number:'40',  color:PATH_COLORS[2] },
];

const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[1,4]];

export default function SumRootToLeafDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        Each root-to-leaf path forms a number · 495 + 491 + 40 = 1026
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap', alignItems:'flex-start' }}>
        <svg width={230} height={205} style={{ overflow:'visible' }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.35} />
          ))}
          {NODES.map((n,i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={`color-mix(in srgb, ${ACCENT2} 18%, transparent)`}
                stroke={ACCENT2} strokeWidth={2} />
              <text x={n.x} y={n.y+5} textAnchor="middle"
                fontSize={13} fontWeight={700} fill={ACCENT2}
                fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
            </g>
          ))}
        </svg>
        <div style={{ display:'flex', flexDirection:'column', gap:10, paddingTop:20 }}>
          {PATHS.map(({ nodes: ns, number, color }) => (
            <div key={number} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                {ns.map((ni, j) => (
                  <React.Fragment key={j}>
                    <div style={{
                      width:28, height:28, border:`2px solid ${color}`, borderRadius:6,
                      background:`color-mix(in srgb, ${color} 15%, transparent)`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:12, fontWeight:700, color }}>{NODES[ni].val}</span>
                    </div>
                    {j < ns.length - 1 && <span style={{ fontSize:10, color, fontFamily:'var(--ifm-font-family-monospace)' }}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              <span style={{ fontSize:12, color, fontFamily:'var(--ifm-font-family-monospace)' }}>= {number}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:8, fontSize:13, fontWeight:700, color:AMBER, fontFamily:'var(--ifm-font-family-monospace)' }}>
            Total = 1026
          </div>
        </div>
      </div>
    </div>
  );
}
