// src/components/DSA/PalindromeLinkedListDiagram.tsx
// [1,2,2,1]. Shows 3 phases: find mid (fast/slow), reverse 2nd half, compare.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

function NodeBox({ val, color, label }: { val: string; color: string; label?: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <div style={{
        border:`2px solid ${color}`, borderRadius:8,
        background:`color-mix(in srgb, ${color} 15%, transparent)`,
        width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:13, fontWeight:700, color }}>{val}</span>
      </div>
      {label && <span style={{ fontSize:9, color, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</span>}
    </div>
  );
}

function Arr({ color = MUTED, reverse }: { color?: string; reverse?: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', paddingBottom:14 }}>
      <svg width={20} height={10} viewBox="0 0 20 10">
        {reverse
          ? <><line x1="20" y1="5" x2="10" y2="5" stroke={color} strokeWidth={1.5}/>
              <polygon points="10,2 4,5 10,8" fill={color}/></>
          : <><line x1="0" y1="5" x2="12" y2="5" stroke={color} strokeWidth={1.5}/>
              <polygon points="12,2 20,5 12,8" fill={color}/></>
        }
      </svg>
    </div>
  );
}

export default function PalindromeLinkedListDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        [1,2,2,1] · fast/slow mid-find → reverse 2nd half → compare
      </div>

      {/* Phase 1: Find midpoint */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:8 }}>
          Phase 1: slow/fast pointers — slow stops at mid
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', gap:2 }}>
          <NodeBox val="1" color={ACCENT2} label="slow=1 fast=1" />
          <Arr color={ACCENT2} />
          <NodeBox val="2" color={ACCENT2} />
          <Arr color={ACCENT2} />
          <NodeBox val="2" color={AMBER} label="slow stops" />
          <Arr color={ACCENT2} />
          <NodeBox val="1" color={ACCENT2} label="fast.next=nil" />
          <Arr color={MUTED} />
          <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', paddingBottom:14 }}>nil</span>
        </div>
      </div>

      {/* Phase 2: Reverse second half */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:8 }}>
          Phase 2: reverse from slow → prev becomes new head of 2nd half
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', gap:2 }}>
          <NodeBox val="1" color={ACCENT2} />
          <Arr color={ACCENT2} />
          <NodeBox val="2" color={ACCENT2} />
          <Arr color={MUTED} />
          <NodeBox val="2" color={AMBER} label="p1 starts" />
          <Arr color={AMBER} reverse />
          <NodeBox val="1" color={AMBER} label="p2 starts (prev)" />
          <Arr color={MUTED} />
          <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', paddingBottom:14 }}>nil</span>
        </div>
      </div>

      {/* Phase 3: Compare */}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:8 }}>
          Phase 3: walk p1 (head) and p2 (reversed) simultaneously
        </div>
        <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:4 }}>p1 (1st half)</div>
            <div style={{ display:'flex', alignItems:'center', gap:2 }}>
              <NodeBox val="1" color={ACCENT2} />
              <Arr color={ACCENT2} />
              <NodeBox val="2" color={ACCENT2} />
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:6 }}>
            <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:AMBER }}>1 == 1 ✓</div>
            <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:AMBER }}>2 == 2 ✓</div>
          </div>
          <div>
            <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:4 }}>p2 (reversed 2nd half)</div>
            <div style={{ display:'flex', alignItems:'center', gap:2 }}>
              <NodeBox val="1" color={AMBER} />
              <Arr color={AMBER} />
              <NodeBox val="2" color={AMBER} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:AMBER, fontWeight:700, marginTop:4 }}>
        p2 exhausted without mismatch → return true
      </div>
    </div>
  );
}
