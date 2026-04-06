import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// n=6, edges=[[0,1],[0,2],[2,5],[3,4],[4,2]]
// in-degree: 0→0, 1→1, 2→2(from 0 and 4), 3→0, 4→1, 5→1
// nodes with in-degree 0: 0 and 3 → they are the minimum starting set

type NodePos = { id: number; x: number; y: number };

const nodePositions: NodePos[] = [
  { id: 0, x: 60,  y: 100 },
  { id: 1, x: 150, y: 50  },
  { id: 2, x: 220, y: 130 },
  { id: 3, x: 150, y: 190 },
  { id: 4, x: 280, y: 190 },
  { id: 5, x: 310, y: 80  },
];

const edges: [number, number][] = [
  [0, 1],
  [0, 2],
  [2, 5],
  [3, 4],
  [4, 2],
];

const inDegrees = [0, 1, 2, 0, 1, 1];

type Step = {
  highlightIds: number[];
  resultIds: number[];
  showInDegrees: boolean;
  desc: string;
};

const steps: Step[] = [
  {
    highlightIds: [],
    resultIds: [],
    showInDegrees: false,
    desc: 'Graph with 6 nodes (0–5) and directed edges. We need the minimum set of nodes from which all other nodes are reachable.',
  },
  {
    highlightIds: [0, 1, 2, 3, 4, 5],
    resultIds: [],
    showInDegrees: true,
    desc: 'Count in-degrees: how many edges point INTO each node. Nodes with in-degree 0 cannot be reached from any other node — they MUST be in the starting set.',
  },
  {
    highlightIds: [0, 3],
    resultIds: [0, 3],
    showInDegrees: true,
    desc: 'Nodes 0 and 3 have in-degree 0 — no edge leads to them. They must be starting points. All other nodes (1,2,4,5) have at least one incoming edge and are reachable.',
  },
  {
    highlightIds: [0, 3],
    resultIds: [0, 3],
    showInDegrees: true,
    desc: 'From 0: reach 1, 2, 5. From 3: reach 4, then 2 (already reachable). All 6 nodes covered. Return [0, 3].',
  },
];

const posMap = new Map<number, NodePos>(nodePositions.map(n => [n.id, n] as [number, NodePos]));

export default function MinVerticesDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const highlightSet = new Set(current.highlightIds);
  const resultSet = new Set(current.resultIds);

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        n=6, edges=[[0,1],[0,2],[2,5],[3,4],[4,2]] &nbsp;|&nbsp; Find nodes with in-degree 0
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="360" height="230" viewBox="0 0 360 230" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          <defs>
            {[AMBER, GREEN, 'var(--dsa-border)'].map(color => {
              const id = color.replace('#', '').replace(/[()]/g, '').replace(/[-]/g,'');
              return (
                <marker key={id} id={`mv-arrow-${id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill={color} />
                </marker>
              );
            })}
          </defs>

          {edges.map(([from, to]) => {
            const fp = posMap.get(from)!;
            const tp = posMap.get(to)!;
            const dx = tp.x - fp.x, dy = tp.y - fp.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len, uy = dy / len;
            const r = 18;
            const ax = fp.x + ux * r, ay = fp.y + uy * r;
            const bx = tp.x - ux * r, by = tp.y - uy * r;
            const color = 'var(--dsa-border)';
            const id = color.replace('#', '').replace(/[()]/g, '').replace(/[-]/g,'');
            return (
              <line key={`${from}-${to}`} x1={ax} y1={ay} x2={bx} y2={by}
                stroke={color} strokeWidth={1.5}
                markerEnd={`url(#mv-arrow-${id})`} />
            );
          })}

          {nodePositions.map(n => {
            const isResult    = resultSet.has(n.id);
            const isHighlight = highlightSet.has(n.id);
            const fill   = isResult ? GREEN : isHighlight ? `${AMBER}33` : 'var(--dsa-surface)';
            const stroke = isResult ? GREEN : isHighlight ? AMBER : 'var(--dsa-border)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={18}
                  fill={fill} stroke={stroke} strokeWidth={isResult || isHighlight ? 2 : 1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={12} fontWeight={700}
                  fill={isResult ? '#fff' : isHighlight ? AMBER : 'var(--dsa-text-muted)'}>
                  {n.id}
                </text>
                {current.showInDegrees && (
                  <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize={9}
                    fill={inDegrees[n.id] === 0 ? GREEN : 'var(--dsa-text-muted)'}>
                    in={inDegrees[n.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {step === 0 ? 'Graph overview' : step === 1 ? 'Count in-degrees' : step === 2 ? 'Find in-degree 0 nodes' : 'Verify coverage'}
            </div>
            {current.resultIds.length > 0 && (
              <div style={{ marginBottom: 8, fontWeight: 700, color: GREEN }}>
                Result: [{current.resultIds.join(', ')}]
              </div>
            )}
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
          </div>

          {current.showInDegrees && (
            <div style={{ marginTop: 8, background: 'var(--dsa-surface)', border: '1px solid var(--dsa-border)', borderRadius: 6, padding: '8px 12px', fontSize: 11 }}>
              <div style={{ color: 'var(--dsa-text-muted)', marginBottom: 4, fontWeight: 700 }}>In-degrees:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {nodePositions.map(n => (
                  <span key={n.id} style={{ color: inDegrees[n.id] === 0 ? GREEN : 'var(--dsa-text-muted)', fontWeight: inDegrees[n.id] === 0 ? 700 : 400 }}>
                    {n.id}:{inDegrees[n.id]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === 0 ? 'var(--dsa-surface)' : ACCENT2, color: step === 0 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2, color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)', cursor: 'pointer', fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}
