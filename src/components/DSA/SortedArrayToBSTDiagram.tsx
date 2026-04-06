// src/components/DSA/SortedArrayToBSTDiagram.tsx
// nums=[-10,-3,0,5,9] — shows midpoint selection at each recursive step
// and the resulting BST.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 20;

const NUMS = [-10, -3, 0, 5, 9];

// recursive(0,4): mid=2, val=0 → root
// recursive(0,1): mid=0, val=-10 → left child
//   recursive(1,1): mid=1, val=-3 → right child of -10
// recursive(3,4): mid=3, val=5 → right child
//   recursive(4,4): mid=4, val=9 → right child of 5

const NODES = [
  { val: '0',   x: 160, y: 40,  color: AMBER,   label: 'mid=2' },
  { val: '-10', x: 75,  y: 110, color: ACCENT2, label: 'mid=0' },
  { val: '5',   x: 245, y: 110, color: ACCENT2, label: 'mid=3' },
  { val: '-3',  x: 120, y: 180, color: ACCENT2, label: 'mid=1' },
  { val: '9',   x: 290, y: 180, color: ACCENT2, label: 'mid=4' },
];
const EDGES: [number,number][] = [[0,1],[0,2],[1,3],[2,4]];

function ArrayViz() {
  const mids = [2, 0, 1, 3, 4];
  const midColors = [AMBER, ACCENT2, ACCENT2, ACCENT2, ACCENT2];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 12 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginRight: 4 }}>nums:</span>
      {NUMS.map((v, i) => {
        const isMid = i === 2;
        return (
          <div key={i} style={{
            minWidth: 34, height: 34, border: `1.5px solid ${isMid ? AMBER : ACCENT2}`,
            borderRadius: 5, background: isMid ? `color-mix(in srgb, ${AMBER} 18%, transparent)` : `color-mix(in srgb, ${ACCENT2} 10%, transparent)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: isMid ? AMBER : ACCENT2, fontFamily: 'var(--ifm-font-family-monospace)' }}>{v}</span>
            <span style={{ fontSize: 8, color: isMid ? AMBER : MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</span>
          </div>
        );
      })}
      <span style={{ fontSize: 11, color: AMBER, fontFamily: 'var(--ifm-font-family-monospace)', marginLeft: 4 }}>← mid=2</span>
    </div>
  );
}

export default function SortedArrayToBSTDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12, textAlign: 'center' }}>
        Always pick midpoint as root · guarantees height-balanced BST
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <ArrayViz />
          <svg width={330} height={220} style={{ overflow: 'visible' }}>
            {EDGES.map(([a,b],i) => (
              <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
            ))}
            {NODES.map((n,i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${n.color} 20%, transparent)`}
                  stroke={n.color} strokeWidth={2} />
                <text x={n.x} y={n.y + 5} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill={n.color}
                  fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
                <text x={n.x} y={n.y + R + 14} textAnchor="middle"
                  fontSize={9} fill={n.color} opacity={0.8}
                  fontFamily="var(--ifm-font-family-monospace)">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
