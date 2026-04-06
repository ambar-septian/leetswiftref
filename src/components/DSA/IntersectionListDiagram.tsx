// src/components/DSA/IntersectionListDiagram.tsx
// Lists A=[4,1,8,4,5] B=[5,6,1,8,4,5] intersect at node 8.
// Shows two-pointer redirect: when pointer hits nil, redirect to other head.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

function NodeBox({ val, color, highlight }: { val: string; color: string; highlight?: boolean }) {
  return (
    <div style={{
      border:`2px solid ${color}`, borderRadius:8,
      background:`color-mix(in srgb, ${color} ${highlight ? 25 : 14}%, transparent)`,
      width:30, height:30,
      display:'flex', alignItems:'center', justifyContent:'center',
      outline: highlight ? `2px solid ${AMBER}` : undefined,
      outlineOffset: highlight ? 2 : undefined,
    }}>
      <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:12, fontWeight:700, color }}>{val}</span>
    </div>
  );
}

function Arr({ color = MUTED }: { color?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center' }}>
      <svg width={16} height={10} viewBox="0 0 16 10">
        <line x1="0" y1="5" x2="10" y2="5" stroke={color} strokeWidth={1.5} />
        <polygon points="10,2 16,5 10,8" fill={color} />
      </svg>
    </div>
  );
}

export default function IntersectionListDiagram() {
  const sharedColor = AMBER;
  const shared = ['8','4','5'];
  const aOnly  = ['4','1'];
  const bOnly  = ['5','6','1'];

  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        two pointers redirect to opposite head on nil · paths equalise · meet at intersection
      </div>
      {/* List A */}
      <div style={{ marginBottom:8 }}>
        <span style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginRight:8 }}>A:</span>
        <div style={{ display:'inline-flex', alignItems:'center', gap:2 }}>
          {aOnly.map((v,i) => (<React.Fragment key={i}><NodeBox val={v} color={ACCENT2} /><Arr /></React.Fragment>))}
          {shared.map((v,i,arr) => (<React.Fragment key={v}><NodeBox val={v} color={sharedColor} highlight />{i<arr.length-1&&<Arr color={sharedColor} />}</React.Fragment>))}
          <Arr /><span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>
      {/* List B */}
      <div style={{ marginBottom:14 }}>
        <span style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginRight:8 }}>B:</span>
        <div style={{ display:'inline-flex', alignItems:'center', gap:2 }}>
          {bOnly.map((v,i) => (<React.Fragment key={i}><NodeBox val={v} color={ACCENT2} /><Arr /></React.Fragment>))}
          {shared.map((v,i,arr) => (<React.Fragment key={v}><NodeBox val={v} color={sharedColor} highlight />{i<arr.length-1&&<Arr color={sharedColor} />}</React.Fragment>))}
          <Arr /><span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>
      {/* Key insight */}
      <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:MUTED, textAlign:'center' }}>
        |A|+|shared| = |B|+|shared| after redirect &nbsp;→&nbsp;
        <span style={{ color:AMBER }}>both pointers reach node 8 simultaneously</span>
      </div>
    </div>
  );
}
