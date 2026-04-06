// src/components/DSA/DeleteNodeDiagram.tsx
// List [4,5,1,9]. Delete node with val=5 (no head access).
// Shows value-copy trick: copy next.val into node, then skip next.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

function NodeBox({ val, color, label, strikethrough }: { val: string; color: string; label?: string; strikethrough?: boolean }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <div style={{
        border:`2px solid ${color}`, borderRadius:8,
        background:`color-mix(in srgb, ${color} 15%, transparent)`,
        width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center',
        opacity: strikethrough ? 0.45 : 1,
      }}>
        <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:13, fontWeight:700, color,
          textDecoration: strikethrough ? 'line-through' : undefined }}>{val}</span>
      </div>
      {label && <span style={{ fontSize:9, color, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</span>}
    </div>
  );
}

function Arr({ color = MUTED, skip }: { color?: string; skip?: boolean }) {
  if (skip) return (
    <div style={{ display:'flex', alignItems:'center' }}>
      <svg width={50} height={32} viewBox="0 0 50 32">
        <path d="M 0 16 Q 25 2 50 16" stroke={AMBER} strokeWidth={1.5} fill="none" strokeDasharray="3 2"/>
        <polygon points="44,11 50,16 44,20" fill={AMBER}/>
      </svg>
    </div>
  );
  return (
    <div style={{ display:'flex', alignItems:'center', paddingBottom:12 }}>
      <svg width={18} height={10} viewBox="0 0 18 10">
        <line x1="0" y1="5" x2="11" y2="5" stroke={color} strokeWidth={1.5}/>
        <polygon points="11,2 18,5 11,8" fill={color}/>
      </svg>
    </div>
  );
}

export default function DeleteNodeDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        delete node(5) without head · copy next value → skip next node
      </div>

      {/* Before */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>Before — node to delete is 5 (no access to head or prev)</div>
        <div style={{ display:'flex', alignItems:'center', gap:2 }}>
          <NodeBox val="4" color={MUTED} />
          <Arr />
          <NodeBox val="5" color={RED} label="node" />
          <Arr color={RED} />
          <NodeBox val="1" color={ACCENT2} label="node.next" />
          <Arr color={ACCENT2} />
          <NodeBox val="9" color={ACCENT2} />
          <Arr />
          <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', paddingBottom:12 }}>nil</span>
        </div>
      </div>

      {/* Step */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>Step 1 — copy node.next.val (1) into node.val</div>
        <div style={{ display:'flex', alignItems:'center', gap:2 }}>
          <NodeBox val="4" color={MUTED} />
          <Arr />
          <NodeBox val="1" color={AMBER} label="node (val copied)" />
          <Arr color={ACCENT2} />
          <NodeBox val="1" color={ACCENT2} label="node.next (to skip)" strikethrough />
          <Arr color={ACCENT2} />
          <NodeBox val="9" color={ACCENT2} />
          <Arr />
          <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', paddingBottom:12 }}>nil</span>
        </div>
      </div>

      {/* After */}
      <div>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>Step 2 — node.next = node.next.next (skip the duplicate)</div>
        <div style={{ display:'flex', alignItems:'center', gap:2 }}>
          <NodeBox val="4" color={MUTED} />
          <Arr />
          <NodeBox val="1" color={AMBER} />
          <Arr skip />
          <NodeBox val="1" color={MUTED} strikethrough />
          <Arr color={AMBER} />
          <NodeBox val="9" color={AMBER} />
          <Arr />
          <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', paddingBottom:12 }}>nil</span>
        </div>
        <div style={{ fontSize:10, color:AMBER, fontFamily:'var(--ifm-font-family-monospace)', marginTop:4 }}>
          Result: [4, 1, 9] — original node(5) is effectively gone
        </div>
      </div>
    </div>
  );
}
