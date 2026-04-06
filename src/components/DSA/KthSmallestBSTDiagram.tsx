// src/components/DSA/KthSmallestBSTDiagram.tsx
// BST [5,3,6,2,4,null,null,1], k=3 → answer = 3.
// Highlights inorder traversal order and the stack state.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { id:0, val:'5', x:180, y:28  },
  { id:1, val:'3', x:100, y:90  },
  { id:2, val:'6', x:260, y:90  },
  { id:3, val:'2', x:55,  y:152 },
  { id:4, val:'4', x:145, y:152 },
  { id:5, val:'1', x:30,  y:214 },
];
const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[1,4],[3,5]];

// Inorder: 1,2,3,4,5,6 — k=3 → 3 (index 2)
const INORDER = ['1','2','3','4','5','6'];

// Steps: [visited node ids in order so far]
const STEPS = [
  { visited: [],        stack:['5','3','2','1'], curr:'1', n:0, note:'push 5→3→2→1, pop 1 (n=1)' },
  { visited: ['1'],     stack:['5','3','2'],     curr:'2', n:1, note:'no right child; pop 2 (n=2)' },
  { visited: ['1','2'], stack:['5','3'],         curr:'3', n:2, note:'no right child; pop 3 (n=3) ← k=3 ✓' },
  { visited: ['1','2','3'], stack:['5'],         curr:'3', n:3, note:'n==k → return 3' },
];

export default function KthSmallestBSTDiagram() {
  const [step, setStep] = useState(2);
  const s = STEPS[step];
  const visitedVals = new Set(s.visited);
  const isAnswer = s.curr === '3' && step >= 2;

  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        iterative inorder · stack traversal · k=3 → 3rd smallest
      </div>
      <div style={{ display:'flex', gap:32, flexWrap:'wrap', justifyContent:'center', alignItems:'flex-start' }}>
        {/* Tree */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>BST</div>
          <svg width={300} height={250} style={{ overflow:'visible' }}>
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
              const visited = visitedVals.has(n.val);
              const isCurr  = n.val === s.curr && step < 3;
              const color   = isCurr ? AMBER : visited ? MUTED : ACCENT2;
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={R}
                    fill={`color-mix(in srgb, ${color} ${isCurr?30:15}%, transparent)`}
                    stroke={color} strokeWidth={isCurr?2.5:1.5}/>
                  <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight={700}
                    fill={color} fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
                  {visited && (
                    <text x={n.x+R+2} y={n.y-R+2} fontSize={9} fill={MUTED}
                      fontFamily="var(--ifm-font-family-monospace)">✓</text>
                  )}
                </g>
              );
            })}
            {/* Inorder sequence */}
            <text x={150} y={242} textAnchor="middle" fontSize={10} fill={MUTED}
              fontFamily="var(--ifm-font-family-monospace)">inorder: 1,2,3,4,5,6</text>
          </svg>
        </div>

        {/* Step controls + stack */}
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', paddingTop:4, display:'flex', flexDirection:'column', gap:8, minWidth:240 }}>
          <div style={{ color:MUTED, fontWeight:700 }}>Traversal steps (click to advance):</div>
          {STEPS.map((st,i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              cursor:'pointer', padding:'5px 8px', borderRadius:6,
              border:`1px solid ${i===step ? AMBER : BORDER}`,
              background: i===step ? `color-mix(in srgb, ${AMBER} 8%, transparent)` : 'transparent',
              color: i===step ? AMBER : MUTED,
              fontWeight: i===step ? 700 : 400,
            }}>
              <span style={{ color:ACCENT2, marginRight:6 }}>n={st.n}</span>
              {st.note}
            </div>
          ))}
          {/* Stack state */}
          <div style={{ marginTop:8, padding:'8px 10px', borderRadius:8,
            background:`color-mix(in srgb, ${ACCENT2} 6%, transparent)`, border:`1px solid ${BORDER}` }}>
            <div style={{ color:MUTED, marginBottom:4 }}>stack (top → bottom):</div>
            <div style={{ color:ACCENT2 }}>[ {s.stack.join(', ')} ]</div>
          </div>
          {step >= 2 && (
            <div style={{ padding:'6px 10px', borderRadius:6,
              background:`color-mix(in srgb, ${AMBER} 10%, transparent)`,
              color:AMBER, fontWeight:700 }}>
              n=3 == k=3 → return 3 ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
