// src/components/DSA/RemoveDuplicatesDiagram.tsx
// Problem 83: Remove duplicates but keep one occurrence of each value.
// Input: 1 → 1 → 2 → 3 → 3 → null
// Output: 1 → 2 → 3 → null  (second 1 and second 3 are skipped)

import React from 'react';

const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface NodeData { val: number; skipped: boolean; }

const INPUT: NodeData[] = [
  { val: 1, skipped: false },
  { val: 1, skipped: true  },
  { val: 2, skipped: false },
  { val: 3, skipped: false },
  { val: 3, skipped: true  },
];

const OUTPUT: number[] = [1, 2, 3];

function ListNode({ node }: { node: NodeData }) {
  const color = node.skipped ? RED : ACCENT2;
  return (
    <div style={{
      border: `2px ${node.skipped ? 'dashed' : 'solid'} ${color}`,
      borderRadius: 8,
      background: `color-mix(in srgb, ${color} 12%, transparent)`,
      padding: '6px 10px', textAlign: 'center', minWidth: 40,
      opacity: node.skipped ? 0.65 : 1,
    }}>
      <div style={{
        fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 16, fontWeight: 700, color,
        textDecoration: node.skipped ? 'line-through' : 'none',
      }}>{node.val}</div>
    </div>
  );
}

function Arrow({ color = MUTED }: { color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
      <svg width="24" height="14" viewBox="0 0 24 14">
        <line x1="0" y1="7" x2="18" y2="7" stroke={color} strokeWidth="2" />
        <polygon points="18,3 24,7 18,11" fill={color} />
      </svg>
    </div>
  );
}

function NullCap() {
  return (
    <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED, alignSelf: 'center' }}>null</div>
  );
}

export default function RemoveDuplicatesDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Keep one occurrence · remove extra duplicates
      </div>

      {/* Input */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6 }}>Input</div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
          {INPUT.map((node, i) => (
            <React.Fragment key={i}>
              <ListNode node={node} />
              <Arrow color={node.skipped ? RED : MUTED} />
            </React.Fragment>
          ))}
          <NullCap />
        </div>
      </div>

      {/* Output */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6 }}>Output</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {OUTPUT.map((val, i) => (
            <React.Fragment key={i}>
              <div style={{
                border: `2px solid ${ACCENT2}`, borderRadius: 8,
                background: `color-mix(in srgb, ${ACCENT2} 12%, transparent)`,
                padding: '6px 10px', textAlign: 'center', minWidth: 40,
              }}>
                <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 16, fontWeight: 700, color: ACCENT2 }}>{val}</div>
              </div>
              <Arrow />
            </React.Fragment>
          ))}
          <NullCap />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: RED,     label: 'skipped — extra duplicate (next.val == curr.val)' },
          { color: ACCENT2, label: 'kept — first occurrence' },
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
