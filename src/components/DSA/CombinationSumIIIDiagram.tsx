// src/components/DSA/CombinationSumIIIDiagram.tsx
// k=2, n=5 → [[1,4],[2,3]]. Shows the backtracking decision tree.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface TreeNode {
  label: string;
  x: number;
  y: number;
  type: 'root' | 'choice' | 'result' | 'pruned';
}

const NODES: TreeNode[] = [
  // root
  { label:'[]  sum=0', x:300, y:24,  type:'root' },
  // depth 1 choices
  { label:'[1] sum=1', x:110, y:90,  type:'choice' },
  { label:'[2] sum=2', x:300, y:90,  type:'choice' },
  { label:'[3] sum=3', x:490, y:90,  type:'choice' },
  // depth 2 from [1]
  { label:'[1,2]',     x:30,  y:160, type:'choice' },
  { label:'[1,3]',     x:90,  y:160, type:'choice' },
  { label:'[1,4] ✓',  x:150, y:160, type:'result' },
  { label:'[1,5] >5', x:210, y:160, type:'pruned' },
  // depth 2 from [2]
  { label:'[2,3] ✓',  x:270, y:160, type:'result' },
  { label:'[2,4] >5', x:340, y:160, type:'pruned' },
  // depth 2 from [3]
  { label:'[3,4] >5', x:430, y:160, type:'pruned' },
  { label:'[3,5] >5', x:510, y:160, type:'pruned' },
];

// Edges: [from index, to index]
const EDGES: [number,number][] = [
  [0,1],[0,2],[0,3],
  [1,4],[1,5],[1,6],[1,7],
  [2,8],[2,9],
  [3,10],[3,11],
];

function nodeColor(type: TreeNode['type']) {
  if (type === 'result') return AMBER;
  if (type === 'pruned') return RED;
  if (type === 'root')   return MUTED;
  return ACCENT2;
}

export default function CombinationSumIIIDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        k=2, n=5 · choose 2 distinct digits from 1–9 summing to 5
      </div>
      <svg width={600} height={210} style={{ display:'block', margin:'0 auto', overflow:'visible' }}>
        {EDGES.map(([a,b],i) => {
          const na=NODES[a], nb=NODES[b];
          const isPruned = NODES[b].type === 'pruned';
          return (
            <line key={i}
              x1={na.x} y1={na.y+10} x2={nb.x} y2={nb.y-10}
              stroke={isPruned ? RED : MUTED} strokeWidth={1.5}
              opacity={isPruned ? 0.5 : 0.35}
              strokeDasharray={isPruned ? '3 2' : undefined}/>
          );
        })}
        {NODES.map((n,i) => {
          const color = nodeColor(n.type);
          const w = n.label.length * 7 + 12;
          const h = 22;
          return (
            <g key={i}>
              <rect x={n.x - w/2} y={n.y - h/2} width={w} height={h} rx={5}
                fill={`color-mix(in srgb, ${color} ${n.type==='result'?25:15}%, transparent)`}
                stroke={color} strokeWidth={n.type==='result'?2.5:1.5}/>
              <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={11} fontWeight={n.type==='result'?700:400}
                fill={color} fontFamily="var(--ifm-font-family-monospace)">{n.label}</text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', marginTop:8 }}>
        {[
          { color:AMBER,   label:'valid result (sum==n, len==k)' },
          { color:RED,     label:'pruned (sum > n)' },
          { color:ACCENT2, label:'in-progress path' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:color }}/>
            <span style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign:'center', marginTop:8, fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:AMBER, fontWeight:700 }}>
        result: [[1,4],[2,3]]
      </div>
    </div>
  );
}
