// src/components/DSA/SameTreeDiagram.tsx
// Shows two trees being compared node-by-node via preorder serialisation.
// Left: p = [1,2,3], Right: q = [1,2,3] — identical ✓
// Also shows a mismatch case where one subtree differs.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

interface N { val: string; x: number; y: number; color: string; }

const SAME_A: N[] = [
  { val:'1', x:70, y:40,  color:ACCENT2 },
  { val:'2', x:30, y:100, color:ACCENT2 },
  { val:'3', x:110,y:100, color:ACCENT2 },
];
const SAME_B: N[] = [
  { val:'1', x:70, y:40,  color:ACCENT2 },
  { val:'2', x:30, y:100, color:ACCENT2 },
  { val:'3', x:110,y:100, color:ACCENT2 },
];
const DIFF_A: N[] = [
  { val:'1', x:70, y:40,  color:ACCENT2 },
  { val:'2', x:30, y:100, color:ACCENT2 },
  { val:'3', x:110,y:100, color:ACCENT2 },
];
const DIFF_B: N[] = [
  { val:'1', x:70, y:40,  color:ACCENT2 },
  { val:'2', x:30, y:100, color:ACCENT2 },
  { val:'4', x:110,y:100, color:RED },
];
const EDGES: [number,number][] = [[0,1],[0,2]];

function MiniTree({ nodes, title }: { nodes: N[]; title: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4 }}>{title}</div>
      <svg width={140} height={135} style={{ overflow: 'visible' }}>
        {EDGES.map(([a,b],i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke={MUTED} strokeWidth={1.5} opacity={0.5} />
        ))}
        {nodes.map((n,i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={R}
              fill={`color-mix(in srgb, ${n.color} 18%, transparent)`}
              stroke={n.color} strokeWidth={2} />
            <text x={n.x} y={n.y+5} textAnchor="middle"
              fontSize={13} fontWeight={700} fill={n.color}
              fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Pair({ a, b, label, match }: { a: N[]; b: N[]; label: string; match: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: match ? ACCENT2 : RED,
        fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MiniTree nodes={a} title="p" />
        <div style={{ fontSize: 20, color: match ? ACCENT2 : RED, alignSelf: 'flex-start', paddingTop: 32 }}>
          {match ? '=' : '≠'}
        </div>
        <MiniTree nodes={b} title="q" />
      </div>
      <div style={{ fontSize: 11, color: match ? ACCENT2 : RED,
        fontFamily: 'var(--ifm-font-family-monospace)' }}>
        {match ? 'dfs(p)==dfs(q) → true' : 'dfs(p)≠dfs(q) → false'}
      </div>
    </div>
  );
}

export default function SameTreeDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Preorder serialise both trees (incl. nulls) — compare arrays
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        <Pair a={SAME_A} b={SAME_B} label="Same tree" match={true} />
        <Pair a={DIFF_A} b={DIFF_B} label="Different tree" match={false} />
      </div>
    </div>
  );
}
