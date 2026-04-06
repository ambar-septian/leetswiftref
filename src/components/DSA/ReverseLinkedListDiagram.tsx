// src/components/DSA/ReverseLinkedListDiagram.tsx
// List [1,2,3,4,5]. Shows three-pointer iterative reversal.
// Before: 1→2→3→4→5→nil. Step: prev=2,curr=3,temp=4 before redirect.
// After:  5→4→3→2→1→nil.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

function NodeBox({ val, color }: { val: string; color: string }) {
  return (
    <div style={{
      border: `2px solid ${color}`, borderRadius: 8,
      background: `color-mix(in srgb, ${color} 15%, transparent)`,
      width: 32, height: 32,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, fontWeight: 700, color }}>{val}</span>
    </div>
  );
}

function Arr({ color = MUTED, reverse }: { color?: string; reverse?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg width={20} height={10} viewBox="0 0 20 10">
        {reverse
          ? <>
              <line x1="20" y1="5" x2="10" y2="5" stroke={color} strokeWidth={1.5} />
              <polygon points="10,2 4,5 10,8" fill={color} />
            </>
          : <>
              <line x1="0" y1="5" x2="12" y2="5" stroke={color} strokeWidth={1.5} />
              <polygon points="12,2 20,5 12,8" fill={color} />
            </>
        }
      </svg>
    </div>
  );
}

const VALS = [1, 2, 3, 4, 5];

export default function ReverseLinkedListDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 14, textAlign: 'center' }}>
        iterative reversal · prev pointer redirects each node's next
      </div>

      {/* Before */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6 }}>Before</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>nil</span>
          <Arr color={MUTED} />
          {VALS.map((v, i) => (
            <React.Fragment key={i}>
              <NodeBox val={String(v)} color={ACCENT2} />
              {i < VALS.length - 1 && <Arr color={ACCENT2} />}
            </React.Fragment>
          ))}
          <Arr color={MUTED} />
          <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>

      {/* Mid step */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6 }}>Step: curr=3 — redirect curr.next = prev (2)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>nil</span>
          {[1, 2].map((v, i) => (
            <React.Fragment key={i}>
              <Arr color={AMBER} reverse />
              <NodeBox val={String(v)} color={AMBER} />
            </React.Fragment>
          ))}
          <Arr color={MUTED} />
          <NodeBox val="3" color={AMBER} />
          {[4, 5].map((v, i) => (
            <React.Fragment key={i}>
              <Arr color={ACCENT2} />
              <NodeBox val={String(v)} color={ACCENT2} />
            </React.Fragment>
          ))}
          <Arr color={MUTED} />
          <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginTop: 4 }}>
          <span style={{ color: AMBER }}>← reversed so far</span>
          {'  '}
          <span style={{ color: MUTED }}>curr</span>
          {'  '}
          <span style={{ color: ACCENT2 }}>remaining →</span>
        </div>
      </div>

      {/* After */}
      <div>
        <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 6 }}>After</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>nil</span>
          {[...VALS].reverse().map((v, i) => (
            <React.Fragment key={i}>
              <Arr color={AMBER} reverse />
              <NodeBox val={String(v)} color={AMBER} />
            </React.Fragment>
          ))}
          <Arr color={MUTED} />
          <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', color: MUTED }}>
        temp saves curr.next before redirect · prev becomes the new head when curr = nil
      </div>
    </div>
  );
}
