// src/components/DSA/RightSideViewDiagram.tsx
// Tree [1,2,3,5,4]. BFS level-order: last node per level is the right-side view.
// Highlights the rightmost visible node at each level in amber.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { val:'1', x:170, y:35,  level:0, rightmost:true  },
  { val:'2', x:90,  y:100, level:1, rightmost:false },
  { val:'3', x:250, y:100, level:1, rightmost:true  },
  { val:'5', x:50,  y:165, level:2, rightmost:false },
  { val:'4', x:170, y:165, level:2, rightmost:true  },
];

const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[1,4]];

export default function RightSideViewDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        BFS level-order · last node per level = right-side view
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap', alignItems:'flex-start' }}>
        <svg width={320} height={205} style={{ overflow:'visible' }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
          ))}
          {/* Right-side dashed vertical line */}
          <line x1={310} y1={20} x2={310} y2={185} stroke={AMBER} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.5} />
          <text x={313} y={15} fontSize={10} fill={AMBER} fontFamily="var(--ifm-font-family-monospace)" opacity={0.8}>👁 view</text>
          {NODES.map((n,i) => {
            const color = n.rightmost ? AMBER : ACCENT2;
            return (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${color} ${n.rightmost ? 25 : 15}%, transparent)`}
                  stroke={color} strokeWidth={n.rightmost ? 2.5 : 2} />
                <text x={n.x} y={n.y+5} textAnchor="middle"
                  fontSize={13} fontWeight={700} fill={color}
                  fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              </g>
            );
          })}
          {/* Level labels */}
          {[0,1,2].map(lv => (
            <text key={lv} x={8} y={35 + lv * 65 + 5} fontSize={10} fill={MUTED}
              fontFamily="var(--ifm-font-family-monospace)">L{lv}</text>
          ))}
        </svg>
        <div style={{ fontSize:12, fontFamily:'var(--ifm-font-family-monospace)', paddingTop:20, display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ color:MUTED }}>Result:</div>
          {[
            { level:'Level 0', nodes:'[1]',   visible:'1' },
            { level:'Level 1', nodes:'[2,3]', visible:'3' },
            { level:'Level 2', nodes:'[5,4]', visible:'4' },
          ].map(({ level, nodes, visible }) => (
            <div key={level} style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ color:MUTED, minWidth:60 }}>{level}:</span>
              <span style={{ color:ACCENT2 }}>{nodes}</span>
              <span style={{ color:MUTED }}>→</span>
              <span style={{ color:AMBER, fontWeight:700 }}>{visible}</span>
            </div>
          ))}
          <div style={{ marginTop:6, color:AMBER, fontWeight:700 }}>= [1, 3, 4]</div>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:10, flexWrap:'wrap' }}>
        {[
          { color:AMBER,   label:'visible from right side' },
          { color:ACCENT2, label:'not visible (blocked)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:color }} />
            <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
