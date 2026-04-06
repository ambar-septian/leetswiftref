// src/components/DSA/AddTwoNumbersDiagram.tsx
// Visualises l1=[2,4,3] + l2=[5,6,4] = [7,0,8]
// Shows two reversed linked lists being added digit-by-digit with carry.

import React from 'react';

const node = (val: string, accent: string) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 44, height: 44, borderRadius: 8,
    border: `2px solid ${accent}`,
    background: `color-mix(in srgb, ${accent} 12%, transparent)`,
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: 16, fontWeight: 700, color: accent,
    flexShrink: 0,
  }}>{val}</div>
);

const arrow = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0 4px', color: 'var(--dsa-border)', fontSize: 18 }}>→</div>
);

const nil = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: 'var(--dsa-text-muted)', paddingLeft: 4 }}>null</div>
);

const Row = ({ label, nodes, accent }: { label: string; nodes: string[]; accent: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
    <div style={{ width: 28, fontSize: 13, fontWeight: 700, color: accent, fontFamily: 'var(--ifm-font-family-monospace)', flexShrink: 0 }}>{label}</div>
    {nodes.map((v, i) => (
      <React.Fragment key={i}>
        {node(v, accent)}
        {i < nodes.length - 1 ? arrow() : null}
      </React.Fragment>
    ))}
    {arrow()}{nil()}
  </div>
);

export default function AddTwoNumbersDiagram() {
  return (
    <div style={{
      background: 'var(--dsa-surface)', border: '1px solid var(--dsa-border)',
      borderRadius: 12, padding: '20px 24px', margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--dsa-text-muted)', marginBottom: 14 }}>
        Visual — reversed digit storage
      </div>

      <Row label="L1" nodes={['2','4','3']} accent="var(--dsa-accent2)" />

      {/* carries row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, paddingLeft: 32 }}>
        {['0','0','1'].map((c, i) => (
          <React.Fragment key={i}>
            <div style={{ width: 44, textAlign: 'center', fontSize: 11, color: 'var(--dsa-text-muted)', fontFamily: 'var(--ifm-font-family-monospace)' }}>
              +carry<br />{c}
            </div>
            {i < 2 ? <div style={{ width: 28 }} /> : null}
          </React.Fragment>
        ))}
      </div>

      <Row label="L2" nodes={['5','6','4']} accent="var(--dsa-accent)" />

      {/* divider */}
      <div style={{ borderTop: '1px solid var(--dsa-border)', margin: '10px 0 12px 28px' }} />

      <Row label="=" nodes={['7','0','8']} accent="#f59e0b" />

      <p style={{ fontSize: 12, color: 'var(--dsa-text-muted)', fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 12, marginBottom: 0, textAlign: 'center' }}>
        342 + 465 = 807  ·  digits stored least-significant first
      </p>
    </div>
  );
}
