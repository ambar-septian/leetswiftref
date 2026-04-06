// src/components/DSA/FlattenBinaryTreeDiagram.tsx
// Tree [1,2,5,3,4,null,6] flattened to preorder linked list: 1→2→3→4→5→6.
// Shows before (tree) and after (right-linked list).

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

// Before: tree [1,2,5,3,4,null,6]
const TREE_NODES = [
  { val:'1', x:130, y:35  },
  { val:'2', x:65,  y:95  },
  { val:'5', x:195, y:95  },
  { val:'3', x:30,  y:155 },
  { val:'4', x:100, y:155 },
  { val:'6', x:230, y:155 },
];
const TREE_EDGES: [number,number][] = [[0,1],[0,2],[1,3],[1,4],[2,5]];

function Arrow() {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'0 2px' }}>
      <svg width={22} height={12} viewBox="0 0 22 12">
        <line x1="0" y1="6" x2="16" y2="6" stroke={MUTED} strokeWidth={1.5} />
        <polygon points="16,3 22,6 16,9" fill={MUTED} />
      </svg>
    </div>
  );
}

export default function FlattenBinaryTreeDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:16, textAlign:'center' }}>
        Flatten to preorder right-linked list in-place
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap', alignItems:'flex-start' }}>
        {/* Before: tree */}
        <div>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6, textAlign:'center' }}>Before</div>
          <svg width={260} height={190} style={{ overflow:'visible' }}>
            {TREE_EDGES.map(([a,b],i) => (
              <line key={i} x1={TREE_NODES[a].x} y1={TREE_NODES[a].y} x2={TREE_NODES[b].x} y2={TREE_NODES[b].y}
                stroke={MUTED} strokeWidth={1.5} opacity={0.45} />
            ))}
            {TREE_NODES.map((n,i) => (
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
        </div>
        {/* After: linked list */}
        <div>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6, textAlign:'center' }}>After (preorder)</div>
          <div style={{ display:'flex', alignItems:'center', marginTop:36 }}>
            {[1,2,3,4,5,6].map((v,i) => (
              <React.Fragment key={v}>
                <div style={{
                  border:`2px solid ${AMBER}`, borderRadius:8,
                  background:`color-mix(in srgb, ${AMBER} 15%, transparent)`,
                  width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:14, fontWeight:700, color:AMBER }}>{v}</span>
                </div>
                {i < 5 && <Arrow />}
              </React.Fragment>
            ))}
            <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:12, color:MUTED, marginLeft:4 }}>null</span>
          </div>
          <div style={{ marginTop:12, fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:MUTED }}>
            left=nil on all nodes · right=next preorder node
          </div>
        </div>
      </div>
    </div>
  );
}
