// src/components/DSA/SubsetsDiagram.tsx
// Include / exclude binary decision tree for nums = [1, 2, 3].
// Each level decides whether to include or exclude nums[i].
// All 8 subsets (2^3) are produced as leaves.

import React from 'react';

const ACCENT  = 'var(--dsa-accent)';
const ACCENT2 = 'var(--dsa-accent2)';
const AMBER   = '#f59e0b';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface N { label: string; meta: string; color: string; leaf?: boolean; children?: N[]; }

const tree: N = {
  label: '[]', meta: 'i=0', color: MUTED,
  children: [
    {
      label: '[1]', meta: 'incl 1', color: ACCENT2,
      children: [
        {
          label: '[1,2]', meta: 'incl 2', color: ACCENT2,
          children: [
            { label: '[1,2,3]', meta: '✓', color: AMBER, leaf: true },
            { label: '[1,2]',   meta: '✓', color: AMBER, leaf: true },
          ],
        },
        {
          label: '[1]', meta: 'excl 2', color: ACCENT,
          children: [
            { label: '[1,3]', meta: '✓', color: AMBER, leaf: true },
            { label: '[1]',   meta: '✓', color: AMBER, leaf: true },
          ],
        },
      ],
    },
    {
      label: '[]', meta: 'excl 1', color: ACCENT,
      children: [
        {
          label: '[2]', meta: 'incl 2', color: ACCENT2,
          children: [
            { label: '[2,3]', meta: '✓', color: AMBER, leaf: true },
            { label: '[2]',   meta: '✓', color: AMBER, leaf: true },
          ],
        },
        {
          label: '[]', meta: 'excl 2', color: ACCENT,
          children: [
            { label: '[3]', meta: '✓', color: AMBER, leaf: true },
            { label: '[]',  meta: '✓', color: AMBER, leaf: true },
          ],
        },
      ],
    },
  ],
};

function Node({ n }: { n: N }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        border: `2px solid ${n.color}`, borderRadius: 8,
        background: `color-mix(in srgb, ${n.color} 12%, transparent)`,
        padding: '3px 7px', textAlign: 'center', minWidth: n.leaf ? 52 : 44,
      }}>
        <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, fontWeight: 700, color: n.color }}>{n.label}</div>
        <div style={{ fontSize: 9, color: n.color, opacity: 0.85, marginTop: 1 }}>{n.meta}</div>
      </div>
      {n.children && n.children.length > 0 && (
        <>
          <div style={{ width: 2, height: 10, background: BORDER }} />
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
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

export default function SubsetsDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Decision tree  ·  nums = [1, 2, 3]  ·  8 subsets (2³)
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Node n={tree} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: AMBER,   label: 'complete subset ✓' },
          { color: ACCENT2, label: 'include branch' },
          { color: ACCENT,  label: 'exclude branch' },
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
