// src/components/DSA/NextRightPointersDiagram.tsx
// Perfect binary tree [1,2,3,4,5,6,7].
// Shows next pointers populated level by level as horizontal arrows.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { val:'1', x:200, y:35,  level:0 },
  { val:'2', x:110, y:100, level:1 },
  { val:'3', x:290, y:100, level:1 },
  { val:'4', x:60,  y:165, level:2 },
  { val:'5', x:160, y:165, level:2 },
  { val:'6', x:240, y:165, level:2 },
  { val:'7', x:340, y:165, level:2 },
];

const TREE_EDGES: [number,number][] = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

// next pointer connections (same level, left to right)
const NEXT_EDGES: [number,number][] = [[1,2],[3,4],[4,5],[5,6]];

export default function NextRightPointersDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        Perfect binary tree · next pointers connect nodes at the same level
      </div>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <svg width={400} height={210} style={{ overflow:'visible' }}>
          {/* Tree edges */}
          {TREE_EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
          ))}
          {/* Next pointer arrows */}
          {NEXT_EDGES.map(([a,b],i) => {
            const ax = NODES[a].x + R + 2;
            const bx = NODES[b].x - R - 2;
            const y  = NODES[a].y;
            return (
              <g key={i}>
                <line x1={ax} y1={y} x2={bx - 6} y2={y}
                  stroke={AMBER} strokeWidth={2} />
                <polygon points={`${bx-6},${y-4} ${bx},${y} ${bx-6},${y+4}`} fill={AMBER} />
              </g>
            );
          })}
          {/* Nodes */}
          {NODES.map((n,i) => {
            const color = n.level === 0 ? MUTED : ACCENT2;
            return (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${color} 18%, transparent)`}
                  stroke={color} strokeWidth={2} />
                <text x={n.x} y={n.y+5} textAnchor="middle"
                  fontSize={13} fontWeight={700} fill={color}
                  fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              </g>
            );
          })}
          {/* null labels at end of each level */}
          <text x={NODES[2].x + R + 18} y={NODES[2].y + 5} fontSize={11} fill={MUTED}
            fontFamily="var(--ifm-font-family-monospace)">→ null</text>
          <text x={NODES[6].x + R + 18} y={NODES[6].y + 5} fontSize={11} fill={MUTED}
            fontFamily="var(--ifm-font-family-monospace)">→ null</text>
        </svg>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:8, flexWrap:'wrap' }}>
        {[
          { color: AMBER,   label: 'next pointer (same level)' },
          { color: ACCENT2, label: 'parent → child edge' },
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
