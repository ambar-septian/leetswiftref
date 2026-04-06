// src/components/DSA/OddEvenLinkedListDiagram.tsx
// [1,2,3,4,5] → [1,3,5,2,4].
// Shows odd chain, even chain, and the final joined list.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

function NodeBox({ val, color }: { val: string; color: string }) {
  return (
    <div style={{
      border:`2px solid ${color}`, borderRadius:8,
      background:`color-mix(in srgb, ${color} 15%, transparent)`,
      width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:13, fontWeight:700, color }}>{val}</span>
    </div>
  );
}

function Arr({ color = MUTED }: { color?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center' }}>
      <svg width={18} height={10} viewBox="0 0 18 10">
        <line x1="0" y1="5" x2="11" y2="5" stroke={color} strokeWidth={1.5}/>
        <polygon points="11,2 18,5 11,8" fill={color}/>
      </svg>
    </div>
  );
}

function Row({ label, nodes, colors }: { label: string; nodes: string[]; colors: string[] }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'center', gap:2 }}>
        {nodes.map((v,i) => (
          <React.Fragment key={i}>
            <NodeBox val={v} color={colors[i]} />
            {i < nodes.length - 1 && <Arr color={colors[i]} />}
          </React.Fragment>
        ))}
        <Arr color={MUTED} />
        <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
      </div>
    </div>
  );
}

export default function OddEvenLinkedListDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        [1,2,3,4,5] · weave into odd and even chains · join at end
      </div>

      {/* Before */}
      <Row
        label="Before — interleaved order"
        nodes={['1','2','3','4','5']}
        colors={[AMBER, ACCENT2, AMBER, ACCENT2, AMBER]}
      />

      {/* Odd chain */}
      <Row
        label="Odd chain (1-indexed positions 1,3,5)"
        nodes={['1','3','5']}
        colors={[AMBER, AMBER, AMBER]}
      />

      {/* Even chain */}
      <Row
        label="Even chain (positions 2,4) — evenHead saved before loop"
        nodes={['2','4']}
        colors={[ACCENT2, ACCENT2]}
      />

      {/* After */}
      <div style={{ marginBottom:4 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>
          After — odd.next = evenHead; return head
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:2 }}>
          {['1','3','5'].map((v,i) => (
            <React.Fragment key={i}>
              <NodeBox val={v} color={AMBER} />
              <Arr color={AMBER} />
            </React.Fragment>
          ))}
          {['2','4'].map((v,i,arr) => (
            <React.Fragment key={i}>
              <NodeBox val={v} color={ACCENT2} />
              {i < arr.length - 1 && <Arr color={ACCENT2} />}
            </React.Fragment>
          ))}
          <Arr color={MUTED} />
          <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>

      <div style={{ marginTop:10, fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', color:MUTED }}>
        <span style={{ color:AMBER }}>odd nodes →</span>
        {'  '}
        <span style={{ color:ACCENT2 }}>even nodes →</span>
        {'  '}relative order within each group is preserved
      </div>
    </div>
  );
}
