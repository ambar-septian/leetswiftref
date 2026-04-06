// src/components/DSA/LevelOrderDiagram.tsx
// Tree [3,9,20,null,null,15,7] — BFS level-order traversal.
// Each level is coloured differently to show the output groups.

import React from 'react';

const LEVEL_COLORS = ['#f59e0b', 'var(--dsa-accent2)', '#a78bfa'];
const MUTED  = 'var(--dsa-text-muted)';
const BORDER = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { val:'3',  x:150, y:35,  level:0 },
  { val:'9',  x:70,  y:95,  level:1 },
  { val:'20', x:230, y:95,  level:1 },
  { val:'15', x:185, y:155, level:2 },
  { val:'7',  x:275, y:155, level:2 },
];

const EDGES: [number,number][] = [[0,1],[0,2],[2,3],[2,4]];

export default function LevelOrderDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12, textAlign: 'center' }}>
        BFS level-order · output = [[3],[9,20],[15,7]]
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Tree */}
        <svg width={300} height={195} style={{ overflow: 'visible' }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
          ))}
          {NODES.map((n,i) => {
            const color = LEVEL_COLORS[n.level];
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

        {/* Level outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', paddingTop: 20 }}>
          {[
            { level: 0, result: '[3]' },
            { level: 1, result: '[9, 20]' },
            { level: 2, result: '[15, 7]' },
          ].map(({ level, result }) => {
            const color = LEVEL_COLORS[level];
            return (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 12, fontFamily: 'var(--ifm-font-family-monospace)', color }}>
                  Level {level + 1}: {result}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
