// src/components/DSA/PalindromePartitioningDiagram.tsx
// Decision tree for s="aab" — tries every prefix from each index.
// Palindrome prefixes recurse; non-palindromes are pruned.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

interface N { label: string; meta: string; color: string; skipped?: boolean; leaf?: boolean; children?: N[]; }

const tree: N = {
  label: '"aab"', meta: 'i=0', color: MUTED,
  children: [
    {
      label: '"a"', meta: 'i=0..0 ✓', color: ACCENT2,
      children: [
        {
          label: '"a"', meta: 'i=1..1 ✓', color: ACCENT2,
          children: [
            { label: '["a","a","b"]', meta: '✓', color: AMBER, leaf: true },
          ],
        },
        {
          label: '"ab"', meta: 'i=1..2 ✗', color: RED, skipped: true,
        },
      ],
    },
    {
      label: '"aa"', meta: 'i=0..1 ✓', color: ACCENT2,
      children: [
        { label: '["aa","b"]', meta: '✓', color: AMBER, leaf: true },
      ],
    },
    {
      label: '"aab"', meta: 'i=0..2 ✗', color: RED, skipped: true,
    },
  ],
};

function Node({ n }: { n: N }) {
  if (n.skipped) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', opacity:0.65 }}>
        <div style={{
          border:`2px dashed ${RED}`, borderRadius:8,
          padding:'3px 8px', textAlign:'center', minWidth:64,
          background:'rgba(239,68,68,0.07)',
        }}>
          <div style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:11, fontWeight:700, color:RED, textDecoration:'line-through' }}>{n.label}</div>
          <div style={{ fontSize:9, color:RED, marginTop:1 }}>{n.meta}</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{
        border:`2px solid ${n.color}`, borderRadius:8,
        background:`color-mix(in srgb, ${n.color} 12%, transparent)`,
        padding:'3px 8px', textAlign:'center', minWidth: n.leaf ? 88 : 64,
      }}>
        <div style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:11, fontWeight:700, color:n.color }}>{n.label}</div>
        <div style={{ fontSize:9, color:n.color, opacity:0.85, marginTop:1 }}>{n.meta}</div>
      </div>
      {n.children && n.children.length > 0 && (
        <>
          <div style={{ width:2, height:10, background:BORDER }} />
          <div style={{ display:'flex', gap:6, alignItems:'flex-start' }}>
            {n.children.map((child, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ width:2, height:8, background:BORDER }} />
                <Node n={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PalindromePartitioningDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:16, textAlign:'center' }}>
        s = "aab" · try every prefix · recurse only on palindromes
      </div>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <Node n={tree} />
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:14, flexWrap:'wrap' }}>
        {[
          { color:AMBER,   label:'complete partition ✓' },
          { color:RED,     label:'not a palindrome — pruned' },
          { color:ACCENT2, label:'valid palindrome prefix' },
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
