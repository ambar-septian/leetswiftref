// src/components/DSA/CopyRandomListDiagram.tsx
// Shows 3-node list [7,13,11] interleaved clone pattern.
// Step 1: insert clones inline; Step 2: set random; Step 3: detach.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

function NodeBox({ val, color, label }: { val: string; color: string; label?: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      {label && <div style={{ fontSize:9, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</div>}
      <div style={{
        border:`2px solid ${color}`, borderRadius:8,
        background:`color-mix(in srgb, ${color} 15%, transparent)`,
        width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:13, fontWeight:700, color }}>{val}</span>
      </div>
    </div>
  );
}

function Arrow({ color = MUTED }: { color?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', paddingBottom:10 }}>
      <svg width={20} height={12} viewBox="0 0 20 12">
        <line x1="0" y1="6" x2="13" y2="6" stroke={color} strokeWidth={1.5} />
        <polygon points="13,3 20,6 13,9" fill={color} />
      </svg>
    </div>
  );
}

export default function CopyRandomListDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        3-pass interleave · insert clones · wire randoms · detach
      </div>
      {/* Pass 1: interleaved */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>Pass 1 — clone inserted next to original</div>
        <div style={{ display:'flex', alignItems:'center', gap:0, flexWrap:'wrap' }}>
          {[
            { val:'7', color:ACCENT2 }, { val:"7'", color:AMBER },
            { val:'13', color:ACCENT2 }, { val:"13'", color:AMBER },
            { val:'11', color:ACCENT2 }, { val:"11'", color:AMBER },
          ].map((n, i, arr) => (
            <React.Fragment key={i}>
              <NodeBox val={n.val} color={n.color} />
              {i < arr.length - 1 && <Arrow />}
            </React.Fragment>
          ))}
          <Arrow /><span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
        </div>
      </div>
      {/* Pass 2: random wiring */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:4 }}>Pass 2 — clone.random = orig.random.next (the interleaved clone)</div>
        <div style={{ fontSize:11, color:AMBER, fontFamily:'var(--ifm-font-family-monospace)' }}>
          7'.random = 7.random?.next &nbsp;·&nbsp; 13'.random = 13.random?.next
        </div>
      </div>
      {/* Pass 3: detach */}
      <div style={{ display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>Original (restored)</div>
          <div style={{ display:'flex', alignItems:'center' }}>
            {['7','13','11'].map((v,i,arr) => (
              <React.Fragment key={v}>
                <NodeBox val={v} color={ACCENT2} />
                {i < arr.length-1 && <Arrow />}
              </React.Fragment>
            ))}
            <Arrow /><span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:6 }}>Clone (deep copy)</div>
          <div style={{ display:'flex', alignItems:'center' }}>
            {["7'","13'","11'"].map((v,i,arr) => (
              <React.Fragment key={v}>
                <NodeBox val={v} color={AMBER} />
                {i < arr.length-1 && <Arrow color={AMBER} />}
              </React.Fragment>
            ))}
            <Arrow color={AMBER} /><span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>nil</span>
          </div>
        </div>
      </div>
    </div>
  );
}
