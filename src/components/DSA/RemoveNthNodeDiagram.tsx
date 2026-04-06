// src/components/DSA/RemoveNthNodeDiagram.tsx
// Visualises head=[1,2,3,4,5], n=2 → remove node 4 (2nd from end).
// Shows the before list with the target node highlighted and the after list.

import React from 'react';

const ACCENT   = 'var(--dsa-accent)';
const ACCENT2  = 'var(--dsa-accent2)';
const DANGER   = '#ef4444';
const MUTED    = 'var(--dsa-text-muted)';

function Node({ val, highlight, removed }: { val: string; highlight?: boolean; removed?: boolean }) {
  const accent = removed ? DANGER : highlight ? '#f59e0b' : ACCENT2;
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 8,
        border: `2px solid ${accent}`,
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--ifm-font-family-monospace)',
        fontSize: 16, fontWeight: 700, color: accent,
        textDecoration: removed ? 'line-through' : 'none',
        opacity: removed ? 0.6 : 1,
      }}>{val}</div>
      {removed && (
        <div style={{ fontSize: 10, color: DANGER, fontWeight: 700, letterSpacing: 0.5 }}>REMOVE</div>
      )}
    </div>
  );
}

const Arrow = ({ skip }: { skip?: boolean }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', fontSize: 18,
    color: skip ? DANGER : 'var(--dsa-border)',
    padding: '0 4px', alignSelf: 'flex-start', marginTop: 12,
    textDecoration: skip ? 'none' : 'none',
  }}>
    {skip ? '↛' : '→'}
  </div>
);

const Null = () => (
  <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED, alignSelf: 'center', marginTop: 4 }}>null</div>
);

export default function RemoveNthNodeDiagram() {
  return (
    <div style={{
      background: 'var(--dsa-surface)', border: '1px solid var(--dsa-border)',
      borderRadius: 12, padding: '20px 24px', margin: '20px 0',
    }}>
      {/* Before */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>
        Before  ·  n = 2 (2nd from end)
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        <Node val="1" />
        <Arrow /><Node val="2" />
        <Arrow /><Node val="3" />
        <Arrow /><Node val="4" removed />
        <Arrow skip /><Node val="5" highlight />
        <Arrow /><Null />
      </div>

      {/* After */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
        After
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {['1','2','3','5'].map((v, i, arr) => (
          <React.Fragment key={i}>
            <Node val={v} />
            {i < arr.length - 1 ? <Arrow /> : null}
          </React.Fragment>
        ))}
        <Arrow /><Null />
      </div>

      <p style={{ fontSize: 12, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 16, marginBottom: 0, textAlign: 'center' }}>
        node 4 unlinked  ·  curr.next = curr.next.next
      </p>
    </div>
  );
}
