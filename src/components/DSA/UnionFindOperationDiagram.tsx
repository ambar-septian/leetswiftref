// src/components/DSA/UnionFindOperationDiagram.tsx
// Visualises union-find operations: union, find, path compression.

import React, { useState } from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const PURPLE  = '#a78bfa';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';

interface State {
  parent: number[];
  rank: number[];
  label: string;
  op: string;
  highlight: [number, number] | null;
}

const STEPS: State[] = [
  {
    parent: [0, 1, 2, 3, 4, 5],
    rank:   [0, 0, 0, 0, 0, 0],
    label: 'Initial state — 6 separate nodes',
    op: 'parent[i] = i for all i',
    highlight: null,
  },
  {
    parent: [0, 0, 2, 3, 4, 5],
    rank:   [1, 0, 0, 0, 0, 0],
    label: 'union(0, 1)',
    op: 'find(0)=0, find(1)=1 → parent[1]=0, rank[0]++',
    highlight: [0, 1],
  },
  {
    parent: [0, 0, 2, 2, 4, 5],
    rank:   [1, 0, 1, 0, 0, 0],
    label: 'union(2, 3)',
    op: 'find(2)=2, find(3)=3 → parent[3]=2, rank[2]++',
    highlight: [2, 3],
  },
  {
    parent: [0, 0, 0, 2, 4, 5],
    rank:   [1, 0, 1, 0, 0, 0],
    label: 'union(0, 2)',
    op: 'find(0)=0, find(2)=2 → rank equal → parent[2]=0, rank[0]++',
    highlight: [0, 2],
  },
  {
    parent: [0, 0, 0, 2, 0, 5],
    rank:   [2, 0, 1, 0, 0, 0],
    label: 'union(0, 4)',
    op: 'find(0)=0, find(4)=4 → parent[4]=0, rank[0]++',
    highlight: [0, 4],
  },
  {
    parent: [0, 0, 0, 0, 0, 5],
    rank:   [2, 0, 1, 0, 0, 0],
    label: 'find(3) — path compression',
    op: 'find(3): 3→2→0 → compress: parent[3]=0, parent[2]=0',
    highlight: [3, 0],
  },
];

// Lay nodes out in a circle
const N = 6;
const CX = 100, CY = 90, R = 70;
const nodePos = Array.from({ length: N }, (_, i) => {
  const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
});

export default function UnionFindOperationDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  // Determine components (roots → members)
  const roots = new Set(s.parent.map((p, i) => s.parent[p] === p ? p : s.parent[p]));
  const componentColors: Record<number, string> = {};
  const palette = [ACCENT, ACCENT2, AMBER, PURPLE, '#f87171', '#fb923c'];
  let ci = 0;
  for (let i = 0; i < N; i++) {
    // find root (simplified — max 2 hops in our data)
    let root = s.parent[i];
    while (s.parent[root] !== root) root = s.parent[root];
    if (!(root in componentColors)) {
      componentColors[root] = palette[ci++];
    }
  }

  function getRoot(i: number) {
    let r = i;
    while (s.parent[r] !== r) r = s.parent[r];
    return r;
  }

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', margin: '20px 0' }}>
      <div style={{ background: SURFACE2, borderBottom: `1px solid ${BORDER}`, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#4ade80' }} />
        </div>
        Union-Find · {s.label}
      </div>

      <div style={{ padding: 16, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>

          {/* Graph viz */}
          <div>
            <svg width={210} height={190} viewBox="10 10 190 170">
              {/* Parent edges */}
              {s.parent.map((p, i) => {
                if (p === i) return null;
                const from = nodePos[i];
                const to = nodePos[p];
                const dx = to.x - from.x; const dy = to.y - from.y;
                const len = Math.sqrt(dx*dx+dy*dy);
                const ux = dx/len; const uy = dy/len;
                const r = 13;
                const isHighlighted = s.highlight && (s.highlight.includes(i) || s.highlight.includes(p));
                return (
                  <line key={i}
                    x1={from.x + ux*r} y1={from.y + uy*r}
                    x2={to.x - ux*r} y2={to.y - uy*r}
                    stroke={isHighlighted ? AMBER : MUTED}
                    strokeWidth={isHighlighted ? 2 : 1.5}
                    strokeDasharray={isHighlighted ? 'none' : '4,3'}
                    opacity={0.7}
                  />
                );
              })}

              {/* Nodes */}
              {nodePos.map((pos, i) => {
                const root = getRoot(i);
                const color = componentColors[root] ?? MUTED;
                const isHighlighted = s.highlight && s.highlight.includes(i);
                const isRoot = s.parent[i] === i;
                return (
                  <g key={i}>
                    <circle cx={pos.x} cy={pos.y} r={13}
                      fill={`${color}18`}
                      stroke={isHighlighted ? AMBER : color}
                      strokeWidth={isHighlighted ? 2.5 : 1.5} />
                    <text x={pos.x} y={pos.y+5} textAnchor="middle"
                      fontFamily="var(--ifm-font-family-monospace)"
                      fontSize={13} fontWeight={700} fill={color}>
                      {i}
                    </text>
                    {isRoot && (
                      <text x={pos.x} y={pos.y-17} textAnchor="middle"
                        fontFamily="var(--ifm-font-family-monospace)"
                        fontSize={8} fill={color} opacity={0.7}>
                        root
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Parent array table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>parent[]</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {s.parent.map((p, i) => {
                  const root = getRoot(i);
                  const color = componentColors[root] ?? MUTED;
                  const changed = step > 0 && p !== STEPS[step-1].parent[i];
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
                      <div style={{
                        width: 28, height: 28,
                        border: `1.5px solid ${changed ? AMBER : color}`,
                        borderRadius: 5,
                        background: changed ? `rgba(245,158,11,0.12)` : `${color}12`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, fontWeight: 700,
                        color: changed ? AMBER : color,
                      }}>
                        {p}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>rank[]</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {s.rank.map((r, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ fontSize: 9, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>[{i}]</div>
                    <div style={{
                      width: 28, height: 28,
                      border: `1.5px solid ${r > 0 ? ACCENT2 : BORDER}`,
                      borderRadius: 5,
                      background: r > 0 ? 'rgba(34,211,238,0.08)' : SURFACE2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, fontWeight: 700,
                      color: r > 0 ? ACCENT2 : MUTED,
                    }}>
                      {r}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Components */}
            <div style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Components</div>
              {Object.entries(componentColors).map(([root, color]) => {
                const members = Array.from({ length: N }, (_, i) => i).filter(i => getRoot(i) === Number(root));
                return (
                  <div key={root} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color, minWidth: 50 }}>
                      root={root}:
                    </span>
                    <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED }}>
                      {'{' + members.join(', ') + '}'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Operation label */}
        <div style={{ marginTop: 12, padding: '10px 14px', background: SURFACE2, borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, color: '#9ca3af', fontFamily: 'var(--ifm-font-family-monospace)', lineHeight: 1.6 }}>
          <span style={{ color: AMBER }}>Op: </span>{s.op}
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 10px', cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.3 : 1 }}>
            ← Prev
          </button>
          <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED }}>
            {step + 1} / {STEPS.length}
          </span>
          <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
            style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '4px 10px', cursor: step === STEPS.length - 1 ? 'default' : 'pointer', opacity: step === STEPS.length - 1 ? 0.3 : 1 }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
