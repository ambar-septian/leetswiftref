// src/components/DSA/MergeTwoListsDiagram.tsx
// Visualises list1=[1,2,4], list2=[1,3,4] → merged=[1,1,2,3,4,4].
// Shows the two input lists and the merged output with source labels.

import React from 'react';

const MUTED = 'var(--dsa-text-muted)';

function ListRow({ label, values, accent }: { label: string; values: number[]; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
      <div style={{ width: 52, fontSize: 12, fontWeight: 700, color: accent, fontFamily: 'var(--ifm-font-family-monospace)', flexShrink: 0 }}>{label}</div>
      {values.map((v, i) => (
        <React.Fragment key={i}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            border: `2px solid ${accent}`,
            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 15, fontWeight: 700, color: accent,
          }}>{v}</div>
          {i < values.length - 1 && (
            <div style={{ color: 'var(--dsa-border)', fontSize: 16, padding: '0 2px' }}>→</div>
          )}
        </React.Fragment>
      ))}
      <div style={{ color: 'var(--dsa-border)', fontSize: 16, padding: '0 2px' }}>→</div>
      <div style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>null</div>
    </div>
  );
}

// Merged row showing source of each node
const merged = [
  { val: 1, src: 'L1' }, { val: 1, src: 'L2' },
  { val: 2, src: 'L1' }, { val: 3, src: 'L2' },
  { val: 4, src: 'L1' }, { val: 4, src: 'L2' },
];

export default function MergeTwoListsDiagram() {
  return (
    <div style={{
      background: 'var(--dsa-surface)', border: '1px solid var(--dsa-border)',
      borderRadius: 12, padding: '20px 24px', margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>
        Inputs
      </div>
      <ListRow label="list1" values={[1, 2, 4]} accent="var(--dsa-accent2)" />
      <ListRow label="list2" values={[1, 3, 4]} accent="var(--dsa-accent)" />

      <div style={{ borderTop: '1px solid var(--dsa-border)', margin: '12px 0' }} />

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>
        Merged output
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
        {merged.map((item, i) => {
          const accent = item.src === 'L1' ? 'var(--dsa-accent2)' : 'var(--dsa-accent)';
          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  border: `2px solid ${accent}`,
                  background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 15, fontWeight: 700, color: accent,
                }}>{item.val}</div>
                <div style={{ fontSize: 9, color: accent, fontFamily: 'var(--ifm-font-family-monospace)', fontWeight: 700 }}>{item.src}</div>
              </div>
              {i < merged.length - 1 && (
                <div style={{ color: 'var(--dsa-border)', fontSize: 16, padding: '0 2px', alignSelf: 'center', marginBottom: 16 }}>→</div>
              )}
            </React.Fragment>
          );
        })}
        <div style={{ color: 'var(--dsa-border)', fontSize: 16, padding: '0 2px', alignSelf: 'center', marginBottom: 16 }}>→</div>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', alignSelf: 'center', marginBottom: 16 }}>null</div>
      </div>

      <p style={{ fontSize: 12, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 4, marginBottom: 0, textAlign: 'center' }}>
        cyan = from list1  ·  green = from list2  ·  no new nodes allocated
      </p>
    </div>
  );
}
