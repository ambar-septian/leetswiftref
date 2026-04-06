// src/components/DSA/CourseScheduleIIDiagram.tsx
// 4 courses, prerequisites [[1,0],[2,0],[3,1],[3,2]].
// Same Kahn's BFS as 207 but shows the returned topological order array.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 20;

const NODES = [
  { id: 0, x: 60,  y: 80  },
  { id: 1, x: 185, y: 30  },
  { id: 2, x: 185, y: 130 },
  { id: 3, x: 310, y: 80  },
];
const EDGES: [number, number][] = [[0,1],[0,2],[1,3],[2,3]];

function arrowPath(from: typeof NODES[0], to: typeof NODES[0]) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/dist, uy = dy/dist;
  return { x1: from.x + ux*R, y1: from.y + uy*R, x2: to.x - ux*(R+4), y2: to.y - uy*(R+4) };
}

const STEPS = [
  { process: 'init', inDeg: '[0,1,1,2]', results: '[]',          note: 'seed: in-degree 0 → queue=[0]' },
  { process: '0',    inDeg: '[0,0,0,2]', results: '[0]',         note: 'neighbors 1,2 decremented' },
  { process: '1',    inDeg: '[0,0,0,1]', results: '[0,1]',       note: 'neighbor 3 decremented' },
  { process: '2',    inDeg: '[0,0,0,0]', results: '[0,1,2]',     note: 'neighbor 3 → 0, enqueue 3' },
  { process: '3',    inDeg: '[0,0,0,0]', results: '[0,1,2,3]',   note: 'no neighbors, queue empty' },
];

export default function CourseScheduleIIDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        Kahn's BFS · returns topological order, not just bool
      </div>
      <div style={{ display:'flex', gap:32, flexWrap:'wrap', alignItems:'flex-start', justifyContent:'center' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>prerequisites [[1,0],[2,0],[3,1],[3,2]]</div>
          <svg width={370} height={165} style={{ overflow:'visible' }}>
            {EDGES.map(([a,b],i) => {
              const { x1,y1,x2,y2 } = arrowPath(NODES[a], NODES[b]);
              const ang = Math.atan2(y2-y1,x2-x1)*180/Math.PI;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1.5} opacity={0.5}/>
                  <polygon points="0,-4 8,0 0,4" fill={MUTED} opacity={0.5}
                    transform={`translate(${x2},${y2}) rotate(${ang})`}/>
                </g>
              );
            })}
            {NODES.map(n => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${n.id===0?AMBER:ACCENT2} 18%, transparent)`}
                  stroke={n.id===0?AMBER:ACCENT2} strokeWidth={2}/>
                <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={13} fontWeight={700}
                  fill={n.id===0?AMBER:ACCENT2} fontFamily="var(--ifm-font-family-monospace)">{n.id}</text>
                <text x={n.x} y={n.y-R-5} textAnchor="middle" fontSize={10} fill={MUTED}
                  fontFamily="var(--ifm-font-family-monospace)">in={[0,1,1,2][n.id]}</text>
              </g>
            ))}
            <text x={185} y={158} textAnchor="middle" fontSize={10} fill={AMBER}
              fontFamily="var(--ifm-font-family-monospace)">results.count==4 == numCourses → return [0,1,2,3]</text>
          </svg>
        </div>
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', display:'flex', flexDirection:'column', gap:0 }}>
          <div style={{ display:'flex', gap:8, color:MUTED, fontWeight:700, paddingBottom:4, borderBottom:`1px solid ${BORDER}`, marginBottom:4 }}>
            <span style={{ minWidth:45 }}>process</span>
            <span style={{ minWidth:90 }}>in-degree</span>
            <span style={{ minWidth:95 }}>results</span>
          </div>
          {STEPS.map((s,i) => (
            <div key={i} style={{ display:'flex', gap:8, paddingBottom:3, color:MUTED }}>
              <span style={{ minWidth:45, color:ACCENT2 }}>{s.process}</span>
              <span style={{ minWidth:90 }}>{s.inDeg}</span>
              <span style={{ minWidth:95, color: s.results==='[0,1,2,3]' ? AMBER : MUTED,
                fontWeight: s.results==='[0,1,2,3]' ? 700 : 400 }}>{s.results}</span>
            </div>
          ))}
          <div style={{ marginTop:8, color:AMBER, fontWeight:700 }}>→ return [0, 1, 2, 3]</div>
          <div style={{ marginTop:4, color:MUTED, fontSize:10 }}>empty [] if cycle detected</div>
        </div>
      </div>
    </div>
  );
}
