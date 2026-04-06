// src/components/DSA/PermutationsIIDiagram.tsx
// Decision tree for nums=[1,1,2] (sorted).
// Shows how duplicate branches are pruned to avoid repeated permutations.

import React from 'react';

const ACCENT2 = 'var(--dsa-accent2)';
const AMBER   = '#f59e0b';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface N { label: string; meta: string; color: string; skipped?: boolean; leaf?: boolean; children?: N[]; }

const tree: N = {
  label: '[]', meta: 'sorted=[1,1,2]', color: MUTED,
  children: [
    {
      // i=0, pick first 1 (used[0]=false → ok)
      label: '[1]', meta: 'i=0 (1st)', color: ACCENT2,
      children: [
        {
          label: '[1,1]', meta: 'i=1', color: ACCENT2,
          children: [{ label: '[1,1,2]', meta: '✓', color: AMBER, leaf: true }],
        },
        {
          label: '[1,2]', meta: 'i=2', color: ACCENT2,
          children: [{ label: '[1,2,1]', meta: '✓', color: AMBER, leaf: true }],
        },
      ],
    },
    {
      // i=1, skip: sorted[1]==sorted[0], but used[0] depends on approach
      label: 'skip 1', meta: 'i=1 — dup of i=0', color: RED, skipped: true,
    },
    {
      label: '[2]', meta: 'i=2', color: ACCENT2,
      children: [
        {
          label: '[2,1]', meta: 'i=0', color: ACCENT2,
          children: [{ label: '[2,1,1]', meta: '✓', color: AMBER, leaf: true }],
        },
        {
          label: 'skip 1', meta: 'i=1 — dup at level', color: RED, skipped: true,
        },
      ],
    },
  ],
};

function Node({ n }: { n: N }) {
  if (n.skipped) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.65 }}>
        <div style={{
          border: `2px dashed ${RED}`, borderRadius: 8,
          padding: '4px 8px', textAlign: 'center', minWidth: 68,
          background: 'rgba(239,68,68,0.07)',
        }}>
          <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, fontWeight: 700, color: RED, textDecoration: 'line-through' }}>{n.label}</div>
          <div style={{ fontSize: 10, color: RED, marginTop: 1 }}>{n.meta}</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        border: `2px solid ${n.color}`, borderRadius: 8,
        background: `color-mix(in srgb, ${n.color} 12%, transparent)`,
        padding: '4px 8px', textAlign: 'center', minWidth: 68,
      }}>
        <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, fontWeight: 700, color: n.color }}>{n.label}</div>
        <div style={{ fontSize: 10, color: n.color, opacity: 0.85, marginTop: 1 }}>{n.meta}</div>
      </div>
      {n.children && n.children.length > 0 && (
        <>
          <div style={{ width: 2, height: 12, background: BORDER }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            {n.children.map((child, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 2, height: 8, background: BORDER }} />
                <Node n={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PermutationsIIDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Decision tree  ·  sorted nums = [1, 1, 2]  ·  3 unique permutations
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Node n={tree} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: AMBER,   label: 'unique permutation ✓' },
          { color: RED,     label: 'skipped — duplicate at same level' },
          { color: ACCENT2, label: 'valid branch' },
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
