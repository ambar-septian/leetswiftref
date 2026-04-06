// src/components/DSA/RemoveElementsDiagram.tsx
// List [1,2,6,3,4,5,6], val=6. Shows dummy head pattern.
// Before: full list. After: 6s removed via curr.next = curr.next.next.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

function NodeBox({ val, color, crossed }: { val: string; color: string; crossed?: boolean }) {
  return (
    <div style={{
      border: `2px solid ${color}`, borderRadius: 8,
      background: `color-mix(in srgb, ${color} 15%, transparent)`,
      width: 32, height: 32,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', opacity: crossed ? 0.55 : 1,
    }}>
      <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize: 13, fontWeight: 700, color,
        textDecoration: crossed ? 'line-through' : undefined }}>{val}</span>
    </div>
  );
}

function Arr({ color = MUTED, skip }: { color?: string; skip?: boolean }) {
  if (skip) {
    // curved skip arrow
    return (
      <div style={{ display:'flex', alignItems:'center' }}>
        <svg width={52} height={32} viewBox="0 0 52 32">
          <path d="M 0 16 Q 26 2 52 16" stroke={AMBER} strokeWidth={1.5} fill="none" strokeDasharray="3 2" />
          <polygon points="46,11 52,16 46,20" fill={AMBER} />
        </svg>
      </div>
    );
  }
  return (
    <div style={{ display:'flex', alignItems:'center' }}>
      <svg width={16} height={10} viewBox="0 0 16 10">
        <line x1="0" y1="5" x2="10" y2="5" stroke={color} strokeWidth={1.5} />
        <polygon points="10,2 16,5 10,8" fill={color} />
      </svg>
    </div>
  );
}

export default function RemoveElementsDiagram() {
  const vals = [1,2,6,3,4,5,6];
  const target = 6;

  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        val = 6 · dummy head · bypass matching nodes via curr.next = curr.next.next
      </div>
      {/* Before */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>Before</div>
        <div style={{ display:'flex', alignItems:'center', gap:2, flexWrap:'wrap' }}>
          <NodeBox val="D" color={MUTED} />
          <Arr />
          {vals.map((v, i) => (
            <React.Fragment key={i}>
              <NodeBox val={String(v)} color={v === target ? RED : ACCENT2} crossed={v === target} />
              {i < vals.length - 1 && <Arr color={v === target ? RED : MUTED} />}
            </React.Fragment>
          ))}
          <Arr /><span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>
      {/* After */}
      <div>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>After</div>
        <div style={{ display:'flex', alignItems:'center', gap:2, flexWrap:'wrap' }}>
          <NodeBox val="D" color={MUTED} />
          <Arr />
          {vals.filter(v => v !== target).map((v, i, arr) => (
            <React.Fragment key={i}>
              <NodeBox val={String(v)} color={AMBER} />
              {i < arr.length - 1 && <Arr color={AMBER} />}
            </React.Fragment>
          ))}
          <Arr color={AMBER} /><span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>
      <div style={{ marginTop:12, fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:MUTED }}>
        D = dummy sentinel · return D.next to skip dummy
      </div>
    </div>
  );
}
