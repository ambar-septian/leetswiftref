// src/components/DSA/PathSumIIDiagram.tsx
// Tree [5,4,8,11,null,13,4,7,2], target=22.
// Highlights both valid root-to-leaf paths that sum to 22.
// path=[5,4,11,2] is one valid path; tree also has [5,4,11,7]=27 (pruned).

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

// Valid path indices: 0(5), 1(4), 3(11), 7(2)
const PATH = new Set([0, 1, 3, 7]);
// Dead-end path (sum != target): 0,1,3,6
const DEAD = new Set([6]);

const NODES = [
  { val:'5',  x:155, y:35,  i:0 },
  { val:'4',  x:75,  y:95,  i:1 },
  { val:'8',  x:235, y:95,  i:2 },
  { val:'11', x:40,  y:155, i:3 },
  { val:'13', x:195, y:155, i:4 },
  { val:'4',  x:280, y:155, i:5 },
  { val:'7',  x:15,  y:215, i:6 },
  { val:'2',  x:75,  y:215, i:7 },
];

const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[2,4],[2,5],[3,6],[3,7]];

export default function PathSumIIDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        target = 22 · backtracking collects ALL valid paths · path=[5,4,11,2] ✓
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap', alignItems:'flex-start' }}>
        <svg width={310} height={255} style={{ overflow:'visible' }}>
          {EDGES.map(([a,b],i) => {
            const onPath = PATH.has(a) && PATH.has(b);
            return (
              <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                stroke={onPath ? AMBER : MUTED} strokeWidth={onPath ? 2.5 : 1.5} opacity={onPath ? 0.9 : 0.35} />
            );
          })}
          {NODES.map((n,i) => {
            const color = PATH.has(n.i) ? AMBER : DEAD.has(n.i) ? RED : ACCENT2;
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
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', display:'flex', flexDirection:'column', gap:6, paddingTop:20 }}>
          <div style={{ color:MUTED }}>DFS trace (backtracking):</div>
          {[
            { step:'visit 5', path:'[5]',       sum:'5' },
            { step:'visit 4', path:'[5,4]',     sum:'9' },
            { step:'visit 11',path:'[5,4,11]',  sum:'20' },
            { step:'visit 7', path:'[5,4,11,7]',sum:'27 ≠ 22' },
            { step:'backtrack',path:'[5,4,11]', sum:'20' },
            { step:'visit 2', path:'[5,4,11,2]',sum:'22 = 22 ✓' },
            { step:'backtrack',path:'[]',       sum:'continue...' },
          ].map(({ step, path, sum }) => (
            <div key={step} style={{ display:'flex', gap:6 }}>
              <span style={{ color: sum.includes('✓') ? AMBER : sum.includes('≠') ? RED : MUTED, minWidth:88 }}>{step}</span>
              <span style={{ color: ACCENT2 }}>{path}</span>
              <span style={{ color: sum.includes('✓') ? AMBER : sum.includes('≠') ? RED : MUTED }}>→ {sum}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
