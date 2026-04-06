// src/components/DSA/LCADiagram.tsx
// Tree [3,5,1,6,2,0,8], p=5, q=1 → LCA=3.
// Shows post-order DFS return values bubbling up to find the LCA.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN   = '#22c55e';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { id:0, val:'3', x:200, y:28  },
  { id:1, val:'5', x:100, y:90  },
  { id:2, val:'1', x:300, y:90  },
  { id:3, val:'6', x:50,  y:152 },
  { id:4, val:'2', x:150, y:152 },
  { id:5, val:'0', x:255, y:152 },
  { id:6, val:'8', x:345, y:152 },
];
const EDGES:[number,number][] = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

// Steps: which nodes are "active" (p=5, q=1, lca=3)
// type: 'p' | 'q' | 'lca' | 'none' | 'returning'
const STEPS = [
  {
    title: 'DFS reaches node 5 (= p)',
    note: 'root === p → return root (node 5)',
    highlight: { 1:'p' },
  },
  {
    title: 'DFS reaches node 1 (= q)',
    note: 'root === q → return root (node 1)',
    highlight: { 2:'q' },
  },
  {
    title: 'Back at root 3: left=5 (non-nil), right=1 (non-nil)',
    note: 'Both subtrees returned non-nil → root 3 is the LCA',
    highlight: { 0:'lca', 1:'p', 2:'q' },
  },
];

type HighlightMap = Record<number, string>;

function nodeColor(id: number, highlight: HighlightMap) {
  const h = highlight[id];
  if (h === 'p')   return AMBER;
  if (h === 'q')   return ACCENT2;
  if (h === 'lca') return GREEN;
  return MUTED;
}

export default function LCADiagram() {
  const [step, setStep] = useState(2);
  const s = STEPS[step];

  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        post-order DFS · LCA is where both subtrees return non-nil
      </div>
      <div style={{ display:'flex', gap:32, flexWrap:'wrap', justifyContent:'center', alignItems:'flex-start' }}>
        {/* Tree */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <svg width={395} height={192} style={{ overflow:'visible' }}>
            {EDGES.map(([a,b],i) => {
              const na=NODES[a], nb=NODES[b];
              const dx=nb.x-na.x, dy=nb.y-na.y, dist=Math.sqrt(dx*dx+dy*dy);
              const ux=dx/dist, uy=dy/dist;
              return (
                <line key={i} x1={na.x+ux*R} y1={na.y+uy*R} x2={nb.x-ux*R} y2={nb.y-uy*R}
                  stroke={MUTED} strokeWidth={1.5} opacity={0.4}/>
              );
            })}
            {NODES.map(n => {
              const color = nodeColor(n.id, s.highlight as HighlightMap);
              const isKey = s.highlight[n.id] !== undefined;
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={R}
                    fill={`color-mix(in srgb, ${color} ${isKey?28:12}%, transparent)`}
                    stroke={color} strokeWidth={isKey?2.5:1.5}/>
                  <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight={700}
                    fill={color} fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
                </g>
              );
            })}
            {/* Return value labels */}
            {step >= 0 && (
              <text x={100} y={68} textAnchor="middle" fontSize={10} fill={AMBER}
                fontFamily="var(--ifm-font-family-monospace)">returns 5</text>
            )}
            {step >= 1 && (
              <text x={300} y={68} textAnchor="middle" fontSize={10} fill={ACCENT2}
                fontFamily="var(--ifm-font-family-monospace)">returns 1</text>
            )}
            {step >= 2 && (
              <text x={200} y={14} textAnchor="middle" fontSize={10} fill={GREEN} fontWeight={700}
                fontFamily="var(--ifm-font-family-monospace)">LCA = 3</text>
            )}
          </svg>
          {/* Legend */}
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            {[{ color:AMBER, label:'p = 5' },{ color:ACCENT2, label:'q = 1' },{ color:GREEN, label:'LCA = 3' }].map(({ color, label }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:color }}/>
                <span style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Steps */}
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', paddingTop:4, display:'flex', flexDirection:'column', gap:8, minWidth:240 }}>
          <div style={{ color:MUTED, fontWeight:700, marginBottom:4 }}>DFS trace (click to advance):</div>
          {STEPS.map((st,i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              cursor:'pointer', padding:'6px 8px', borderRadius:6,
              border:`1px solid ${i===step ? GREEN : BORDER}`,
              background: i===step ? `color-mix(in srgb, ${GREEN} 8%, transparent)` : 'transparent',
              color: i===step ? GREEN : MUTED, fontWeight: i===step?700:400,
            }}>
              <div style={{ marginBottom:3 }}>{st.title}</div>
              <div style={{ fontSize:10, opacity:0.8 }}>{st.note}</div>
            </div>
          ))}
          <div style={{ marginTop:8, padding:'8px 10px', borderRadius:8,
            background:`color-mix(in srgb, ${GREEN} 8%, transparent)`, border:`1px solid ${BORDER}` }}>
            <div style={{ color:GREEN, fontWeight:700, marginBottom:4 }}>Key insight:</div>
            <div style={{ color:MUTED, fontSize:10 }}>
              If left AND right both non-nil → current node is LCA.<br/>
              If only one is non-nil → propagate that result up.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
