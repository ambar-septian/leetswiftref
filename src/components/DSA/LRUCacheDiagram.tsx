// src/components/DSA/LRUCacheDiagram.tsx
// Capacity=2 LRU Cache — doubly linked list between dummy left/right sentinels.
// Shows put(1,1), put(2,2), get(1), put(3,3) → evicts 2.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface Step { op: string; list: string[]; evict?: string; }

const STEPS: Step[] = [
  { op: 'put(1,1)', list: ['L','1','R'] },
  { op: 'put(2,2)', list: ['L','1','2','R'] },
  { op: 'get(1) → move to MRU', list: ['L','2','1','R'] },
  { op: 'put(3,3) → evict LRU(2)', list: ['L','1','3','R'], evict:'2' },
];

function ListRow({ step }: { step: Step }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
      <span style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', minWidth:180 }}>{step.op}</span>
      <div style={{ display:'flex', alignItems:'center', gap:2 }}>
        {step.list.map((v, i) => {
          const isSentinel = v === 'L' || v === 'R';
          const color = isSentinel ? MUTED : ACCENT2;
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg width={16} height={10} viewBox="0 0 16 10">
                  <line x1="0" y1="5" x2="10" y2="5" stroke={MUTED} strokeWidth={1} />
                  <polygon points="10,2 16,5 10,8" fill={MUTED} />
                </svg>
              )}
              <div style={{
                border:`2px solid ${color}`, borderRadius:6,
                background:`color-mix(in srgb, ${color} 14%, transparent)`,
                width:isSentinel ? 24 : 28, height:24,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:10, fontWeight:700, color }}>{v}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {step.evict && (
        <span style={{ fontSize:10, color:RED, fontFamily:'var(--ifm-font-family-monospace)', marginLeft:6 }}>✕ evict {step.evict}</span>
      )}
    </div>
  );
}

export default function LRUCacheDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        capacity=2 · L=LRU sentinel · R=MRU sentinel · map keys→nodes
      </div>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <div>
          {STEPS.map((s, i) => <ListRow key={i} step={s} />)}
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:12, flexWrap:'wrap' }}>
        {[
          { color:ACCENT2, label:'cached node (key→val)' },
          { color:RED,     label:'evicted (LRU = left.next)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:color }} />
            <span style={{ fontSize:11, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
