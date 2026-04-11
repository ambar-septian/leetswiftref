// src/components/DSA/HashMapDiagram.tsx
// Static diagram: shows hashing keys into buckets with chaining, plus a Set variant.

import React from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';
const TEXT    = '#e8eaf0';

// Simulated hash table with 5 buckets
const ENTRIES = [
  { key: '"apple"',  hash: 0, value: '3' },
  { key: '"banana"', hash: 2, value: '5' },
  { key: '"cherry"', hash: 2, value: '6' }, // collision at bucket 2
  { key: '"date"',   hash: 4, value: '4' },
];

const BUCKET_COUNT = 5;

export default function HashMapDiagram() {
  // Group entries by bucket
  const buckets: Array<typeof ENTRIES> = Array.from({ length: BUCKET_COUNT }, () => []);
  for (const e of ENTRIES) buckets[e.hash].push(e);

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '20px 16px',
      margin: '20px 0',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Hash Map — Key → Hash → Bucket → Value
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>

        {/* Keys column */}
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8 }}>Keys</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ENTRIES.map((e) => (
              <div key={e.key} style={{
                padding: '6px 12px',
                background: 'rgba(34,211,238,0.10)',
                border: `1px solid ${ACCENT2}`,
                borderRadius: 6,
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 12, color: ACCENT2, fontWeight: 600,
                minWidth: 90, textAlign: 'center',
              }}>{e.key}</div>
            ))}
          </div>
        </div>

        {/* Hash function */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>hash(key) % 5</div>
          <div style={{
            padding: '10px 14px',
            background: 'rgba(245,158,11,0.12)',
            border: `1px solid ${AMBER}`,
            borderRadius: 8,
            fontFamily: 'var(--ifm-font-family-monospace)',
            fontSize: 13, color: AMBER, fontWeight: 700,
          }}>h(k)</div>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ENTRIES.map((e) => (
              <div key={e.key} style={{ fontSize: 11, color: AMBER, fontFamily: 'var(--ifm-font-family-monospace)', textAlign: 'center' }}>→ {e.hash}</div>
            ))}
          </div>
        </div>

        {/* Buckets */}
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8 }}>Buckets (chaining)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {buckets.map((entries, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Index */}
                <div style={{
                  width: 28, height: 32,
                  border: `1.5px solid ${MUTED}`,
                  borderRadius: 4,
                  background: 'rgba(107,114,128,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ifm-font-family-monospace)',
                  fontSize: 12, color: MUTED, fontWeight: 600,
                }}>{i}</div>
                {/* Chain */}
                {entries.length === 0 ? (
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>null</div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {entries.map((e, j) => (
                      <React.Fragment key={e.key}>
                        {j > 0 && <span style={{ fontSize: 11, color: MUTED }}>→</span>}
                        <div style={{
                          padding: '3px 8px',
                          background: 'rgba(74,222,128,0.10)',
                          border: `1px solid ${ACCENT}`,
                          borderRadius: 4,
                          fontFamily: 'var(--ifm-font-family-monospace)',
                          fontSize: 11, color: ACCENT,
                        }}>{e.key}: {e.value}</div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Collision note */}
      <div style={{
        marginTop: 20, padding: '8px 14px',
        background: SURFACE2, border: `1px solid ${BORDER}`,
        borderRadius: 8, fontFamily: 'var(--ifm-font-family-monospace)',
        fontSize: 12, color: MUTED, textAlign: 'center',
      }}>
        <span style={{ color: AMBER }}>Collision</span> at bucket 2: "banana" and "cherry" both hash to 2 — chained via linked list. Average lookup still O(1) with a good hash function.
      </div>

      {/* HashSet variant */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8 }}>Hash Set (keys only, no values)</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {['"apple"', '"banana"', '"cherry"', '"date"'].map((k) => (
            <div key={k} style={{
              padding: '5px 12px',
              background: 'rgba(167,139,250,0.10)',
              border: `1px solid #a78bfa`,
              borderRadius: 6,
              fontFamily: 'var(--ifm-font-family-monospace)',
              fontSize: 12, color: '#a78bfa',
            }}>{k}</div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED, textAlign: 'center' }}>
          Same structure — bucket array of keys — used for O(1) membership test, not value lookup.
        </div>
      </div>
    </div>
  );
}
