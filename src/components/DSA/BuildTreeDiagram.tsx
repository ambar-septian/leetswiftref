// src/components/DSA/BuildTreeDiagram.tsx
// preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]
// Shows: preorder[0] is root → find root in inorder → split left/right subtrees.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 18;

const PREORDER = [3, 9, 20, 15, 7];
const INORDER  = [9, 3, 15, 20, 7];

// Resulting tree nodes
const NODES = [
  { val:'3',  x:150, y:35,  color: AMBER },
  { val:'9',  x:70,  y:95,  color: ACCENT2 },
  { val:'20', x:230, y:95,  color: ACCENT2 },
  { val:'15', x:185, y:155, color: ACCENT2 },
  { val:'7',  x:275, y:155, color: ACCENT2 },
];
const EDGES: [number,number][] = [[0,1],[0,2],[2,3],[2,4]];

function ArrayRow({ label, values, rootIdx, leftRange, rightRange }: {
  label: string; values: number[]; rootIdx?: number; leftRange?: [number,number]; rightRange?: [number,number];
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', minWidth: 70 }}>{label}:</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {values.map((v, i) => {
          let color = MUTED;
          let bg = 'transparent';
          if (rootIdx === i) { color = AMBER; bg = `color-mix(in srgb, ${AMBER} 15%, transparent)`; }
          else if (leftRange && i >= leftRange[0] && i <= leftRange[1]) { color = ACCENT2; bg = `color-mix(in srgb, ${ACCENT2} 10%, transparent)`; }
          else if (rightRange && i >= rightRange[0] && i <= rightRange[1]) { color = RED; bg = `color-mix(in srgb, ${RED} 10%, transparent)`; }
          return (
            <div key={i} style={{
              width: 28, height: 28, border: `1.5px solid ${color}`, borderRadius: 5,
              background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--ifm-font-family-monospace)' }}>{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BuildTreeDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        preorder[0] = root · inorder split defines left / right subtrees
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Array annotations */}
        <div style={{ paddingTop: 8 }}>
          <ArrayRow label="preorder" values={PREORDER} rootIdx={0} leftRange={[1,1]} rightRange={[2,4]} />
          <ArrayRow label="inorder"  values={INORDER}  rootIdx={1} leftRange={[0,0]} rightRange={[2,4]} />
          <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div><span style={{ color: AMBER }}>■</span><span style={{ color: MUTED }}> root (preorder[preIndex])</span></div>
            <div><span style={{ color: ACCENT2 }}>■</span><span style={{ color: MUTED }}> left subtree</span></div>
            <div><span style={{ color: RED }}>■</span><span style={{ color: MUTED }}> right subtree</span></div>
          </div>
        </div>
        {/* Resulting tree */}
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', marginBottom: 4, textAlign: 'center' }}>Result</div>
          <svg width={310} height={195} style={{ overflow: 'visible' }}>
            {EDGES.map(([a,b],i) => (
              <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
            ))}
            {NODES.map((n,i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${n.color} 20%, transparent)`}
                  stroke={n.color} strokeWidth={2} />
                <text x={n.x} y={n.y+5} textAnchor="middle"
                  fontSize={12} fontWeight={700} fill={n.color}
                  fontFamily="var(--ifm-font-family-monospace)">{n.val}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
