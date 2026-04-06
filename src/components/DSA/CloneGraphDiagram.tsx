// src/components/DSA/CloneGraphDiagram.tsx
// Graph [[2,4],[1,3],[2,4],[1,3]] — 4-node cycle.
// Shows original graph and the DFS cloning process with a dict mapping old→new.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

// Nodes in a diamond: 1 top, 2 left, 3 right, 4 bottom
const ORIG_NODES = [
  { val:'1', x:75, y:30  },
  { val:'2', x:20, y:95  },
  { val:'3', x:130,y:95  },
  { val:'4', x:75, y:160 },
];

// Clone nodes offset to the right
const DX = 220;
const CLONE_NODES = ORIG_NODES.map(n => ({ ...n, x: n.x + DX }));

const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[2,3]];

function GraphSVG({ nodes, color, label }: { nodes: typeof ORIG_NODES; color: string; label: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>{label}</div>
      <svg width={155} height={195} style={{ overflow:'visible' }}>
        {EDGES.map(([a,b],i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke={color} strokeWidth={1.8} opacity={0.45} />
        ))}
        {nodes.map((n,i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={R}
              fill={`color-mix(in srgb, ${color} 18%, transparent)`}
              stroke={color} strokeWidth={2} />
            <text x={n.x} y={n.y+5} textAnchor="middle"
              fontSize={13} fontWeight={700} fill={color}
              fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function CloneGraphDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        DFS + dict — clone each node once · map old val → new node
      </div>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-start', gap:24, flexWrap:'wrap' }}>
        <GraphSVG nodes={ORIG_NODES} color={ACCENT2} label="Original" />
        {/* Arrow */}
        <div style={{ display:'flex', alignItems:'center', paddingTop:90 }}>
          <svg width={36} height={16} viewBox="0 0 36 16">
            <line x1="0" y1="8" x2="28" y2="8" stroke={MUTED} strokeWidth={1.5} />
            <polygon points="28,4 36,8 28,12" fill={MUTED} />
          </svg>
        </div>
        <GraphSVG nodes={CLONE_NODES.map(n => ({ ...n, x: n.x - DX }))} color={AMBER} label="Clone (deep copy)" />
      </div>
      {/* Dict mapping */}
      <div style={{ marginTop:14, display:'flex', justifyContent:'center' }}>
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:'8px 14px', fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:MUTED }}>
          <span style={{ color:ACCENT2 }}>dict</span> = {'{'}
          {[1,2,3,4].map((v,i) => (
            <span key={v}>
              {' '}<span style={{ color:ACCENT2 }}>{v}</span>
              <span style={{ color:MUTED }}>→</span>
              <span style={{ color:AMBER }}>Node({v})</span>
              {i < 3 ? ',' : ''}
            </span>
          ))}
          {' '}
          {'}'}
        </div>
      </div>
    </div>
  );
}
