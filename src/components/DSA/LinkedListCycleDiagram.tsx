// src/components/DSA/LinkedListCycleDiagram.tsx
// List [3,2,0,-4] with tail connected back to node 1 (index 1).
// Shows slow/fast pointer positions at each step until they meet.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

// Layout: nodes in a partial circle
const NODES = [
  { val:'3',  x:60,  y:40  },
  { val:'2',  x:160, y:40  },
  { val:'0',  x:260, y:40  },
  { val:'-4', x:260, y:120 },
];

export default function LinkedListCycleDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:12, textAlign:'center' }}>
        Floyd's cycle detection · slow moves 1 step · fast moves 2 steps
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap', alignItems:'flex-start' }}>
        <svg width={320} height={160} style={{ overflow:'visible' }}>
          {/* Linear edges */}
          {([0,1,2] as number[]).map(i => (
            <line key={i} x1={NODES[i].x+R} y1={NODES[i].y} x2={NODES[i+1].x-R} y2={NODES[i+1].y}
              stroke={MUTED} strokeWidth={1.5} opacity={0.5}
              markerEnd="url(#arr)" />
          ))}
          {/* Back edge: -4 → 2 */}
          <path d={`M ${NODES[3].x-R} ${NODES[3].y} Q 110 160 ${NODES[1].x} ${NODES[1].y+R}`}
            stroke={RED} strokeWidth={1.8} fill="none" opacity={0.8} />
          <polygon points={`${NODES[1].x-4},${NODES[1].y+R} ${NODES[1].x+4},${NODES[1].y+R} ${NODES[1].x},${NODES[1].y+R-7}`}
            fill={RED} opacity={0.8} />
          <text x={150} y={155} fontSize={9} fill={RED} textAnchor="middle"
            fontFamily="var(--ifm-font-family-monospace)">cycle back to index 1</text>
          {/* Nodes */}
          {NODES.map((n,i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={R}
                fill={`color-mix(in srgb, ${ACCENT2} 18%, transparent)`}
                stroke={ACCENT2} strokeWidth={2} />
              <text x={n.x} y={n.y+5} textAnchor="middle"
                fontSize={12} fontWeight={700} fill={ACCENT2}
                fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
            </g>
          ))}
        </svg>
        {/* Step table */}
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', display:'flex', flexDirection:'column', gap:5 }}>
          <div style={{ display:'flex', gap:16, color:MUTED, borderBottom:`1px solid ${BORDER}`, paddingBottom:4 }}>
            <span style={{ minWidth:40 }}>Step</span>
            <span style={{ minWidth:60, color:ACCENT2 }}>slow</span>
            <span style={{ minWidth:60, color:AMBER }}>fast</span>
          </div>
          {[
            { step:'init', slow:'3(0)', fast:'2(1)' },
            { step:'1',    slow:'2(1)', fast:'0(2)' },
            { step:'2',    slow:'0(2)', fast:'2(1)', meet:false },
            { step:'3',    slow:'-4(3)',fast:'-4(3)', meet:true },
          ].map(({ step, slow, fast, meet }) => (
            <div key={step} style={{ display:'flex', gap:16, color: meet ? AMBER : MUTED }}>
              <span style={{ minWidth:40 }}>{step}</span>
              <span style={{ minWidth:60, color: meet ? AMBER : ACCENT2 }}>{slow}</span>
              <span style={{ minWidth:60, color: meet ? AMBER : AMBER }}>{fast}{meet ? ' ✓ meet!' : ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
