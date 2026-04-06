// src/components/DSA/PermutationsDiagram.tsx
// Decision tree for nums=[1,2,3] — shows the used[] array approach.
// Only expands the first branch fully; others are collapsed for readability.

import React from 'react';

const ACCENT  = 'var(--dsa-accent)';
const ACCENT2 = 'var(--dsa-accent2)';
const AMBER   = '#f59e0b';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface N { label: string; meta: string; color: string; leaf?: boolean; collapsed?: boolean; children?: N[]; }

const tree: N = {
  label: '[]', meta: 'used=[F,F,F]', color: MUTED,
  children: [
    {
      label: '[1]', meta: 'used=[T,F,F]', color: ACCENT2,
      children: [
        {
          label: '[1,2]', meta: 'used=[T,T,F]', color: ACCENT2,
          children: [{ label: '[1,2,3]', meta: '✓', color: AMBER, leaf: true }],
        },
        {
          label: '[1,3]', meta: 'used=[T,F,T]', color: ACCENT2,
          children: [{ label: '[1,3,2]', meta: '✓', color: AMBER, leaf: true }],
        },
      ],
    },
    {
      label: '[2]', meta: 'used=[F,T,F]', color: ACCENT, collapsed: true,
      children: [
        { label: '[2,1,3]', meta: '✓', color: AMBER, leaf: true },
        { label: '[2,3,1]', meta: '✓', color: AMBER, leaf: true },
      ],
    },
    {
      label: '[3]', meta: 'used=[F,F,T]', color: ACCENT, collapsed: true,
      children: [
        { label: '[3,1,2]', meta: '✓', color: AMBER, leaf: true },
        { label: '[3,2,1]', meta: '✓', color: AMBER, leaf: true },
      ],
    },
  ],
};

function Node({ n, depth = 0 }: { n: N; depth?: number }) {
  const showChildren = !n.collapsed && n.children && n.children.length > 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        border: `2px solid ${n.color}`, borderRadius: 8,
        background: `color-mix(in srgb, ${n.color} 12%, transparent)`,
        padding: '4px 8px', textAlign: 'center', minWidth: n.leaf ? 68 : 80,
      }}>
        <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, fontWeight: 700, color: n.color }}>{n.label}</div>
        <div style={{ fontSize: 10, color: n.color, opacity: 0.8, marginTop: 1 }}>{n.meta}</div>
      </div>
      {n.collapsed && n.children && (
        <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>
          ({n.children.map(c => c.label).join(', ')})
        </div>
      )}
      {showChildren && (
        <>
          <div style={{ width: 2, height: 12, background: BORDER }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            {n.children!.map((child, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 2, height: 8, background: BORDER }} />
                <Node n={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PermutationsDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Decision tree  ·  nums = [1, 2, 3]  ·  6 permutations
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Node n={tree} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: AMBER,   label: 'complete permutation' },
          { color: ACCENT2, label: 'expanded branch' },
          { color: ACCENT,  label: 'collapsed (results shown inline)' },
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
