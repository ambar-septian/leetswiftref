// src/components/DSA/ImplementTrieDiagram.tsx
// Trie with words "app", "apple", "bad" inserted.
// End-of-word nodes highlighted in amber; intermediate nodes in accent2.

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 16;

// Nodes: id, label (char shown), x, y, isEnd
const NODES = [
  { id: 0, label: '·',    x: 200, y: 28,  isEnd: false }, // root
  { id: 1, label: 'a',    x: 100, y: 90,  isEnd: false },
  { id: 2, label: 'b',    x: 320, y: 90,  isEnd: false },
  { id: 3, label: 'p',    x: 100, y: 150, isEnd: false },
  { id: 4, label: 'p',    x: 100, y: 210, isEnd: true  }, // "app" ends here
  { id: 5, label: 'a',    x: 320, y: 150, isEnd: false },
  { id: 6, label: 'l',    x: 100, y: 270, isEnd: false },
  { id: 7, label: 'd',    x: 320, y: 210, isEnd: true  }, // "bad" ends here
  { id: 8, label: 'e',    x: 100, y: 330, isEnd: true  }, // "apple" ends here
];

// Edges: [from, to, edgeLabel]
const EDGES: [number, number, string][] = [
  [0, 1, 'a'], [0, 2, 'b'],
  [1, 3, 'p'], [2, 5, 'a'],
  [3, 4, 'p'], [5, 7, 'd'],
  [4, 6, 'l'],
  [6, 8, 'e'],
];

export default function ImplementTrieDiagram() {
  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 14, textAlign: 'center' }}>
        Trie after insert("app"), insert("apple"), insert("bad")
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width={420} height={360} style={{ overflow: 'visible' }}>
          {EDGES.map(([a, b, lbl], i) => {
            const na = NODES[a], nb = NODES[b];
            const dx = nb.x - na.x, dy = nb.y - na.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const ux = dx/dist, uy = dy/dist;
            const x1 = na.x + ux * R, y1 = na.y + uy * R;
            const x2 = nb.x - ux * R, y2 = nb.y - uy * R;
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={1.5} opacity={0.4} />
                <text x={mx + 6} y={my} fontSize={10} fill={ACCENT2}
                  fontFamily="var(--ifm-font-family-monospace)" opacity={0.9}>{lbl}</text>
              </g>
            );
          })}
          {NODES.map(n => {
            const color = n.label === '·' ? MUTED : n.isEnd ? AMBER : ACCENT2;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${color} ${n.isEnd ? 25 : 15}%, transparent)`}
                  stroke={color} strokeWidth={n.isEnd ? 2.5 : 1.5} />
                <text x={n.x} y={n.y + 5} textAnchor="middle"
                  fontSize={12} fontWeight={700} fill={color}
                  fontFamily="var(--ifm-font-family-monospace)">{n.label}</text>
                {n.isEnd && (
                  <text x={n.x + R + 4} y={n.y + 4} fontSize={9} fill={AMBER}
                    fontFamily="var(--ifm-font-family-monospace)">*</text>
                )}
              </g>
            );
          })}
          {/* word annotations */}
          <text x={30} y={218} fontSize={9} fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">← "app"</text>
          <text x={30} y={338} fontSize={9} fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">← "apple"</text>
          <text x={348} y={218} fontSize={9} fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">"bad" →</text>
          <text x={168} y={22} fontSize={10} fill={MUTED} fontFamily="var(--ifm-font-family-monospace)">root</text>
        </svg>

        <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: MUTED, fontWeight: 700, marginBottom: 4 }}>Operations:</div>
          {[
            { op: 'search("app")',     result: 'true',  note: 'reaches * node' },
            { op: 'search("ap")',      result: 'false', note: 'not end-of-word' },
            { op: 'startsWith("app")', result: 'true',  note: 'prefix exists' },
            { op: 'startsWith("baz")', result: 'false', note: 'no z child' },
          ].map(({ op, result, note }) => (
            <div key={op} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ color: ACCENT2, minWidth: 160 }}>{op}</span>
              <span style={{ color: result === 'true' ? AMBER : MUTED, fontWeight: 700 }}>{result}</span>
              <span style={{ color: MUTED, fontSize: 10 }}>// {note}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { color: AMBER,   label: 'isEnd = true (*)' },
              { color: ACCENT2, label: 'isEnd = false' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 10, color: MUTED }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
