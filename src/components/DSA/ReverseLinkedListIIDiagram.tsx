// src/components/DSA/ReverseLinkedListIIDiagram.tsx
// Problem 92: Reverse nodes from position left=2 to right=4.
// Input:  1 → 2 → 3 → 4 → 5  (sublist [2,3,4] highlighted)
// Output: 1 → 4 → 3 → 2 → 5  (sublist reversed to [4,3,2])

import React from 'react';

const ACCENT2 = 'var(--dsa-accent2)';
const AMBER   = '#f59e0b';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface NodeItem { val: number; highlight: 'before' | 'after' | 'normal'; }

const BEFORE: NodeItem[] = [
  { val: 1, highlight: 'normal' },
  { val: 2, highlight: 'before' },
  { val: 3, highlight: 'before' },
  { val: 4, highlight: 'before' },
  { val: 5, highlight: 'normal' },
];

const AFTER: NodeItem[] = [
  { val: 1, highlight: 'normal' },
  { val: 4, highlight: 'after' },
  { val: 3, highlight: 'after' },
  { val: 2, highlight: 'after' },
  { val: 5, highlight: 'normal' },
];

function colorOf(h: NodeItem['highlight']) {
  if (h === 'before') return ACCENT2;
  if (h === 'after')  return AMBER;
  return MUTED;
}

function Arrow({ color = MUTED, reversed = false }: { color?: string; reversed?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
      <svg width="28" height="14" viewBox="0 0 28 14">
        {reversed ? (
          <>
            <line x1="28" y1="7" x2="6" y2="7" stroke={color} strokeWidth="2" />
            <polygon points="6,3 0,7 6,11" fill={color} />
          </>
        ) : (
          <>
            <line x1="0" y1="7" x2="22" y2="7" stroke={color} strokeWidth="2" />
            <polygon points="22,3 28,7 22,11" fill={color} />
          </>
        )}
      </svg>
    </div>
  );
}

function ListRow({ nodes, label, reversed }: { nodes: NodeItem[]; label: string; reversed?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
        {nodes.map((node, i) => {
          const color = colorOf(node.highlight);
          const isSublist = node.highlight !== 'normal';
          return (
            <React.Fragment key={i}>
              <div style={{
                border: `2px solid ${color}`,
                borderRadius: 8,
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                padding: '6px 10px', textAlign: 'center', minWidth: 40,
              }}>
                <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 16, fontWeight: 700, color }}>{node.val}</div>
              </div>
              {i < nodes.length - 1 && (
                <Arrow
                  color={isSublist && reversed ? AMBER : MUTED}
                  reversed={isSublist && reversed && i < nodes.length - 2 && nodes[i + 1].highlight !== 'normal'}
                />
              )}
            </React.Fragment>
          );
        })}
        <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 12, color: MUTED, marginLeft: 4, alignSelf: 'center' }}>→ null</div>
      </div>
    </div>
  );
}

export default function ReverseLinkedListIIDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        left = 2, right = 4 · reverse positions 2 through 4
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start', paddingLeft: 8 }}>
        <ListRow nodes={BEFORE} label="Before — sublist [2,3,4] to be reversed" />
        <ListRow nodes={AFTER}  label="After  — sublist reversed to [4,3,2]" reversed />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { color: ACCENT2, label: 'sublist (before reversal)' },
          { color: AMBER,   label: 'sublist (after reversal)' },
          { color: MUTED,   label: 'unchanged nodes' },
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
