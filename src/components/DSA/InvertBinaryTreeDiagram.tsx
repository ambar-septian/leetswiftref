// src/components/DSA/InvertBinaryTreeDiagram.tsx
// Tree [4,2,7,1,3,6,9] → inverted [4,7,2,9,6,3,1].
// Shows before and after side by side.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

interface Node { val: string; x: number; y: number; }

const BEFORE: Node[] = [
  { val:'4', x:140, y:28  },
  { val:'2', x:70,  y:90  },
  { val:'7', x:210, y:90  },
  { val:'1', x:35,  y:152 },
  { val:'3', x:105, y:152 },
  { val:'6', x:175, y:152 },
  { val:'9', x:245, y:152 },
];
const BEFORE_EDGES: [number,number][] = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

const AFTER: Node[] = [
  { val:'4', x:140, y:28  },
  { val:'7', x:70,  y:90  },
  { val:'2', x:210, y:90  },
  { val:'9', x:35,  y:152 },
  { val:'6', x:105, y:152 },
  { val:'3', x:175, y:152 },
  { val:'1', x:245, y:152 },
];
const AFTER_EDGES = BEFORE_EDGES;

function Tree({ nodes, edges, highlight }: { nodes: Node[]; edges: [number,number][]; highlight: boolean }) {
  const color = highlight ? AMBER : ACCENT2;
  return (
    <svg width={280} height={188} style={{ overflow:'visible' }}>
      {edges.map(([a,b],i) => {
        const na=nodes[a], nb=nodes[b];
        const dx=nb.x-na.x, dy=nb.y-na.y, dist=Math.sqrt(dx*dx+dy*dy);
        const ux=dx/dist, uy=dy/dist;
        return (
          <line key={i}
            x1={na.x+ux*R} y1={na.y+uy*R}
            x2={nb.x-ux*R} y2={nb.y-uy*R}
            stroke={MUTED} strokeWidth={1.5} opacity={0.4}/>
        );
      })}
      {nodes.map((n,i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={R}
            fill={`color-mix(in srgb, ${color} 20%, transparent)`}
            stroke={color} strokeWidth={2}/>
          <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight={700}
            fill={color} fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
        </g>
      ))}
    </svg>
  );
}

export default function InvertBinaryTreeDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        recursive DFS · swap left and right children post-order
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>Before</div>
          <Tree nodes={BEFORE} edges={BEFORE_EDGES} highlight={false} />
        </div>
        {/* Arrow */}
        <div style={{ display:'flex', alignItems:'center', paddingTop:40 }}>
          <svg width={44} height={16} viewBox="0 0 44 16">
            <line x1="0" y1="8" x2="34" y2="8" stroke={MUTED} strokeWidth={1.5}/>
            <polygon points="34,4 44,8 34,12" fill={MUTED}/>
          </svg>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>After (inverted)</div>
          <Tree nodes={AFTER} edges={AFTER_EDGES} highlight={true} />
        </div>
        {/* Steps */}
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', display:'flex', flexDirection:'column', gap:5, paddingTop:8 }}>
          <div style={{ color:MUTED, marginBottom:4 }}>DFS call order:</div>
          {[
            { call:'invert(4)',  action:'recurse left and right first' },
            { call:'invert(2)',  action:'recurse → swap 1 and 3 → return' },
            { call:'invert(7)',  action:'recurse → swap 6 and 9 → return' },
            { call:'swap at 4', action:'node.left=7, node.right=2' },
            { call:'return 4',  action:'root unchanged, subtrees swapped' },
          ].map(({ call, action }) => (
            <div key={call} style={{ display:'flex', gap:8 }}>
              <span style={{ color:ACCENT2, minWidth:100 }}>{call}</span>
              <span style={{ color:MUTED }}>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
