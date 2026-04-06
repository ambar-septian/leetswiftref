// src/components/DSA/BinaryTreePathsDiagram.tsx
// Tree [1,2,3,null,5]. DFS path building: ["1->2->5","1->3"].
// Shows two coloured paths and the backtracking trace.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { id:0, val:'1', x:160, y:28  },
  { id:1, val:'2', x:80,  y:90  },
  { id:2, val:'3', x:240, y:90  },
  { id:3, val:'5', x:120, y:152 },
];
const EDGES:[number,number][] = [[0,1],[0,2],[1,3]];

// path1: 1→2→5 (amber), path2: 1→3 (accent2)
const PATH1 = new Set([0,1,3]);
const PATH2 = new Set([0,2]);

const STEPS = [
  { active: new Set([0]),   path:'[1]',       note:'visit 1, push to path' },
  { active: new Set([0,1]), path:'[1,2]',     note:'go left, visit 2, push' },
  { active: new Set([0,1,3]),path:'[1,2,5]',  note:'go left, visit 5 (leaf) → record "1->2->5"' },
  { active: new Set([0,1]), path:'[1,2]',     note:'backtrack: pop 5, pop 2' },
  { active: new Set([0]),   path:'[1]',       note:'backtrack to root' },
  { active: new Set([0,2]), path:'[1,3]',     note:'go right, visit 3 (leaf) → record "1->3"' },
  { active: new Set<number>([]), path:'[]',   note:'backtrack: pop 3, pop 1 — done' },
];

export default function BinaryTreePathsDiagram() {
  const [step, setStep] = useState(2);
  const s = STEPS[step];

  const isResult1 = step === 2;
  const isResult2 = step === 5;

  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        DFS backtracking · build path string at leaf · pop on return
      </div>
      <div style={{ display:'flex', gap:32, flexWrap:'wrap', justifyContent:'center', alignItems:'flex-start' }}>
        {/* Tree */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <svg width={320} height={192} style={{ overflow:'visible' }}>
            {EDGES.map(([a,b],i) => {
              const na=NODES[a], nb=NODES[b];
              const dx=nb.x-na.x, dy=nb.y-na.y, dist=Math.sqrt(dx*dx+dy*dy);
              const ux=dx/dist, uy=dy/dist;
              const active = s.active.has(a) && s.active.has(b);
              const c = active ? (PATH1.has(b) ? AMBER : ACCENT2) : MUTED;
              return (
                <line key={i} x1={na.x+ux*R} y1={na.y+uy*R} x2={nb.x-ux*R} y2={nb.y-uy*R}
                  stroke={c} strokeWidth={active?2.5:1.5} opacity={active?1:0.3}/>
              );
            })}
            {NODES.map(n => {
              const inP1 = PATH1.has(n.id), inP2 = PATH2.has(n.id);
              const active = s.active.has(n.id);
              const color = active ? (inP2 && !inP1 ? ACCENT2 : AMBER) : MUTED;
              const isLeaf = n.id === 2 || n.id === 3;
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={R}
                    fill={`color-mix(in srgb, ${color} ${active?25:10}%, transparent)`}
                    stroke={color} strokeWidth={active?2.5:1.5}/>
                  <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight={700}
                    fill={color} fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
                  {isLeaf && (
                    <text x={n.x} y={n.y+R+12} textAnchor="middle" fontSize={9} fill={MUTED}
                      fontFamily="var(--ifm-font-family-monospace)">leaf</text>
                  )}
                </g>
              );
            })}
          </svg>
          {/* Results */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {[
              { label:'"1->2->5"', color:AMBER,   done: step >= 2 },
              { label:'"1->3"',    color:ACCENT2,  done: step >= 5 },
            ].map(({ label, color, done }) => (
              <div key={label} style={{ padding:'3px 8px', borderRadius:6,
                border:`1px solid ${done ? color : BORDER}`,
                background: done ? `color-mix(in srgb, ${color} 10%, transparent)` : 'transparent',
                fontSize:11, fontFamily:'var(--ifm-font-family-monospace)',
                color: done ? color : MUTED, fontWeight: done ? 700 : 400 }}>{label}</div>
            ))}
          </div>
        </div>
        {/* Steps */}
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', paddingTop:4, display:'flex', flexDirection:'column', gap:5, minWidth:240 }}>
          <div style={{ color:MUTED, fontWeight:700, marginBottom:4 }}>DFS trace (click row):</div>
          {STEPS.map((st,i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              cursor:'pointer', padding:'4px 8px', borderRadius:6,
              border:`1px solid ${i===step ? AMBER : BORDER}`,
              background: i===step ? `color-mix(in srgb, ${AMBER} 8%, transparent)` : 'transparent',
              color: i===step ? AMBER : MUTED, fontWeight: i===step?700:400,
            }}>
              <span style={{ color:ACCENT2, marginRight:6 }}>path={st.path}</span>
              {st.note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
