// src/components/DSA/BalancedBinaryTreeDiagram.tsx
// Tree [3,9,20,null,null,15,7] — post-order DFS returns (isBalanced, height).
// Shows the tuple returned at each node and the balance check at the root.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const NODES = [
  { val:'3',  x:150, y:35,  color: AMBER,   tuple: '(T,3)' },
  { val:'9',  x:70,  y:95,  color: ACCENT2, tuple: '(T,1)' },
  { val:'20', x:230, y:95,  color: ACCENT2, tuple: '(T,2)' },
  { val:'15', x:185, y:155, color: ACCENT2, tuple: '(T,1)' },
  { val:'7',  x:275, y:155, color: ACCENT2, tuple: '(T,1)' },
];
const EDGES: [number,number][] = [[0,1],[0,2],[2,3],[2,4]];

export default function BalancedBinaryTreeDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12, textAlign: 'center' }}>
        Each node returns (isBalanced, height) · |leftH - rightH| &lt;= 1
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <svg width={310} height={205} style={{ overflow: 'visible' }}>
          {EDGES.map(([a,b],i) => (
            <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
          ))}
          {NODES.map((n,i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={`color-mix(in srgb, ${n.color} 20%, transparent)`}
                stroke={n.color} strokeWidth={2} />
              <text x={n.x} y={n.y+5} textAnchor="middle"
                fontSize={12} fontWeight={700} fill={n.color}
                fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              <text x={n.x} y={n.y + R + 14} textAnchor="middle"
                fontSize={9} fill={n.color} opacity={0.9}
                fontFamily="var(--ifm-font-family-monospace)">{n.tuple}</text>
            </g>
          ))}
        </svg>
        <div style={{ paddingTop: 16, fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'dfs(nil)   →', value: '(T, 0)' },
            { label: 'dfs(9)     →', value: '(T, 1)' },
            { label: 'dfs(15)    →', value: '(T, 1)' },
            { label: 'dfs(7)     →', value: '(T, 1)' },
            { label: 'dfs(20)    →', value: '(T, 2)  |1-1|=0' },
            { label: 'dfs(3)     →', value: '(T, 3)  |1-2|=1' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: MUTED }}>{label}</span>
              <span style={{ color: ACCENT2 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: AMBER, fontFamily: 'var(--ifm-font-family-monospace)' }}>
        root returns (true, 3) → isBalanced = true
      </div>
    </div>
  );
}
