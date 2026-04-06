// src/components/DSA/LetterCombinationsDiagram.tsx
// Visualises the backtracking decision tree for digits="23".
// Root → digit-2 letters (a/b/c) → digit-3 letters (d/e/f) → leaf combinations.

import React from 'react';

const ACCENT  = 'var(--dsa-accent)';
const ACCENT2 = 'var(--dsa-accent2)';
const AMBER   = '#f59e0b';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

const digit2 = ['a', 'b', 'c'];
const digit3 = ['d', 'e', 'f'];

function TreeNode({ label, color, small }: { label: string; color: string; small?: boolean }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: small ? 36 : 40, height: small ? 36 : 40, borderRadius: '50%',
      border: `2px solid ${color}`,
      background: `color-mix(in srgb, ${color} 15%, transparent)`,
      fontFamily: 'var(--ifm-font-family-monospace)',
      fontSize: small ? 12 : 14, fontWeight: 700, color,
      flexShrink: 0,
    }}>{label}</div>
  );
}

export default function LetterCombinationsDiagram() {
  return (
    <div style={{
      background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Decision tree  ·  digits = "23"
      </div>

      {/* Root */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TreeNode label='""' color={MUTED} />
        <div style={{ fontSize: 10, color: MUTED, marginTop: 2, marginBottom: 4 }}>start</div>

        {/* Level-1 connector lines */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, width: '100%', position: 'relative', height: 24 }}>
          <svg width="100%" height="24" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Three branches from center to left/center/right */}
            <line x1="50%" y1="0" x2="18%" y2="24" stroke={ACCENT2} strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="50%" y1="0" x2="50%" y2="24" stroke={ACCENT2} strokeWidth="1.5" strokeDasharray="3 2" />
            <line x1="50%" y1="0" x2="82%" y2="24" stroke={ACCENT2} strokeWidth="1.5" strokeDasharray="3 2" />
          </svg>
        </div>

        {/* Level 1 — digit 2 letters */}
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: 4 }}>
          {digit2.map(ch => (
            <div key={ch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <TreeNode label={ch} color={ACCENT2} />
              <div style={{ fontSize: 10, color: ACCENT2, marginTop: 2 }}>digit 2</div>
            </div>
          ))}
        </div>

        {/* Level-2 connector lines */}
        <div style={{ display: 'flex', width: '100%', position: 'relative', height: 24 }}>
          <svg width="100%" height="24" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Each of 3 parent nodes fans into 3 children */}
            {[18, 50, 82].map(px =>
              [-12, 0, 12].map(offset => (
                <line
                  key={`${px}-${offset}`}
                  x1={`${px}%`} y1="0"
                  x2={`${px + offset * 0.9}%`} y2="24"
                  stroke={ACCENT} strokeWidth="1.5" strokeDasharray="3 2"
                />
              ))
            )}
          </svg>
        </div>

        {/* Level 2 — digit 3 letters (9 leaves) */}
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: 4 }}>
          {digit2.flatMap(c1 =>
            digit3.map(c2 => (
              <div key={c1 + c2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <TreeNode label={c1 + c2} color={AMBER} small />
                <div style={{ fontSize: 9, color: AMBER, marginTop: 2 }}>✓</div>
              </div>
            ))
          )}
        </div>

        <p style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 12, marginBottom: 0, textAlign: 'center' }}>
          cyan = choices for "2"  ·  green = choices for "3"  ·  amber = complete combinations
        </p>
      </div>
    </div>
  );
}
