// src/components/DSA/CombinationSumDiagram.tsx
// Decision tree for candidates=[2,3], target=6.
// Key: dfs(i) allows reusing the same element; prune when sum > target.

import React from 'react';

const ACCENT  = 'var(--dsa-accent)';
const ACCENT2 = 'var(--dsa-accent2)';
const AMBER   = '#f59e0b';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface N {
  label: string;
  sum: string;
  color: string;
  note?: string;
  children?: N[];
}

const tree: N = {
  label: '[]', sum: 'sum=0', color: MUTED,
  children: [
    {
      label: '[2]', sum: 'sum=2', color: ACCENT2,
      children: [
        {
          label: '[2,2]', sum: 'sum=4', color: ACCENT2,
          children: [
            { label: '[2,2,2]', sum: 'sum=6 ✓', color: AMBER },
            { label: '[2,2,3]', sum: 'sum=7 ✗', color: RED, note: 'prune' },
          ],
        },
        {
          label: '[2,3]', sum: 'sum=5', color: ACCENT2,
          children: [
            { label: '[2,3,3]', sum: 'sum=8 ✗', color: RED, note: 'prune' },
          ],
        },
      ],
    },
    {
      label: '[3]', sum: 'sum=3', color: ACCENT,
      children: [
        {
          label: '[3,3]', sum: 'sum=6 ✓', color: AMBER,
        },
      ],
    },
  ],
};

function Node({ n }: { n: N }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        border: `2px solid ${n.color}`,
        borderRadius: 8,
        background: `color-mix(in srgb, ${n.color} 12%, transparent)`,
        padding: '4px 8px',
        textAlign: 'center',
        minWidth: 72,
      }}>
        <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, fontWeight: 700, color: n.color }}>{n.label}</div>
        <div style={{ fontSize: 10, color: n.color, opacity: 0.85, marginTop: 1 }}>{n.sum}</div>
        {n.note && <div style={{ fontSize: 9, color: RED, fontWeight: 700, letterSpacing: 0.5 }}>{n.note}</div>}
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

export default function CombinationSumDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Decision tree  ·  candidates = [2, 3], target = 6
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Node n={tree} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: AMBER, label: 'sum == target ✓' },
          { color: RED,   label: 'sum > target — prune' },
          { color: ACCENT2, label: 'reuse same element (dfs(i))' },
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
