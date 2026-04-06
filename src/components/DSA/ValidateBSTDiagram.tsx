// src/components/DSA/ValidateBSTDiagram.tsx
// Shows two trees: a valid BST and an invalid one.
// Each node is annotated with its (min, max) valid bounds.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

const R = 18;

interface N { val: string; x: number; y: number; color: string; bounds: string; }
interface E { a: N; b: N; }

// Valid BST: [2,1,3]
const VALID_NODES: N[] = [
  { val: '2', x: 80, y: 40,  color: ACCENT2, bounds: '(-∞,+∞)' },
  { val: '1', x: 35, y: 100, color: ACCENT2, bounds: '(-∞,2)' },
  { val: '3', x: 125,y: 100, color: ACCENT2, bounds: '(2,+∞)' },
];
const VALID_EDGES: [number,number][] = [[0,1],[0,2]];

// Invalid BST: [5,1,4,null,null,3,6] — 4 is right child of 5, but 4 < 5
const INV_NODES: N[] = [
  { val: '5', x: 80, y: 40,  color: ACCENT2, bounds: '(-∞,+∞)' },
  { val: '1', x: 35, y: 100, color: ACCENT2, bounds: '(-∞,5)' },
  { val: '4', x: 125,y: 100, color: RED,     bounds: '(5,+∞) ✗' },
  { val: '3', x: 90, y: 160, color: RED,     bounds: '(5,4) ✗' },
  { val: '6', x: 160,y: 160, color: ACCENT2, bounds: '(4,+∞)' },
];
const INV_EDGES: [number,number][] = [[0,1],[0,2],[2,3],[2,4]];

function Tree({ nodes, edges, title, titleColor }: { nodes: N[]; edges: [number,number][]; title: string; titleColor: string }) {
  const maxY = Math.max(...nodes.map(n => n.y));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: titleColor, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6 }}>{title}</div>
      <svg width={200} height={maxY + 60} style={{ overflow: 'visible' }}>
        {edges.map(([a,b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke={MUTED} strokeWidth={1.5} opacity={0.5} />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={R}
              fill={`color-mix(in srgb, ${n.color} 18%, transparent)`}
              stroke={n.color} strokeWidth={2} />
            <text x={n.x} y={n.y + 5} textAnchor="middle"
              fontSize={12} fontWeight={700} fill={n.color}
              fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
            <text x={n.x} y={n.y + R + 12} textAnchor="middle"
              fontSize={8} fill={n.color} opacity={0.9}
              fontFamily="var(--ifm-font-family-monospace)">{n.bounds}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function ValidateBSTDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Node must fall strictly within its inherited (min, max) bounds
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        <Tree nodes={VALID_NODES} edges={VALID_EDGES} title="Valid BST ✓" titleColor={ACCENT2} />
        <Tree nodes={INV_NODES}   edges={INV_EDGES}   title="Invalid BST ✗" titleColor={RED} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        {[
          { color: ACCENT2, label: 'valid node (within bounds)' },
          { color: RED,     label: 'invalid node (violates bounds)' },
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
