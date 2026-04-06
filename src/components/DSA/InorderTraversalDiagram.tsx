// src/components/DSA/InorderTraversalDiagram.tsx
// Tree [4,2,6,1,3,5,7] — inorder gives 1,2,3,4,5,6,7.
// Each node is labelled with its traversal visit step.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

// [val, x, y, step, parent?]
const NODES = [
  { val: '4', x: 150, y: 35,  step: 4, color: ACCENT2 },
  { val: '2', x: 75,  y: 95,  step: 2, color: ACCENT2 },
  { val: '6', x: 225, y: 95,  step: 6, color: ACCENT2 },
  { val: '1', x: 37,  y: 155, step: 1, color: AMBER },
  { val: '3', x: 113, y: 155, step: 3, color: AMBER },
  { val: '5', x: 187, y: 155, step: 5, color: AMBER },
  { val: '7', x: 263, y: 155, step: 7, color: AMBER },
];

const EDGES = [
  [0,1],[0,2],[1,3],[1,4],[2,5],[2,6],
];

const R = 18;

export default function InorderTraversalDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12, textAlign: 'center' }}>
        Inorder: left → root → right · result = [1,2,3,4,5,6,7]
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={300} height={195} style={{ overflow: 'visible' }}>
          {EDGES.map(([a, b], i) => (
            <line key={i}
              x1={NODES[a].x} y1={NODES[a].y}
              x2={NODES[b].x} y2={NODES[b].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.5}
            />
          ))}
          {NODES.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={`color-mix(in srgb, ${n.color} 18%, transparent)`}
                stroke={n.color} strokeWidth={2}
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                fontSize={13} fontWeight={700} fill={n.color}
                fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              <text x={n.x + R - 4} y={n.y - R + 6} textAnchor="middle"
                fontSize={9} fontWeight={700} fill={AMBER}
                fontFamily="var(--ifm-font-family-monospace)">{n.step}</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
        {[
          { color: AMBER,   label: 'leaf (visited first / last in subtree)' },
          { color: ACCENT2, label: 'internal node' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
