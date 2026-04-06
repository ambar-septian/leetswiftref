import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// graph = [[1,2],[3],[3],[]]
// n=4 nodes (0-3), target=3
// Paths: 0→1→3 and 0→2→3

const nodes = [
  { id: 0, x: 60,  y: 120 },
  { id: 1, x: 190, y: 60  },
  { id: 2, x: 190, y: 180 },
  { id: 3, x: 310, y: 120 },
];

const edges = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
];

const steps = [
  {
    path: [0],
    foundPaths: [] as number[][],
    desc: 'Start DFS from node 0. path=[0]. Explore neighbor 1.',
  },
  {
    path: [0, 1],
    foundPaths: [] as number[][],
    desc: 'DFS at node 1. path=[0,1]. Explore neighbor 3.',
  },
  {
    path: [0, 1, 3],
    foundPaths: [[0, 1, 3]],
    desc: 'Reached target (n-1=3). Record path [0,1,3]. Backtrack.',
  },
  {
    path: [0, 2],
    foundPaths: [[0, 1, 3]],
    desc: 'Back at node 0. Explore neighbor 2. path=[0,2].',
  },
  {
    path: [0, 2, 3],
    foundPaths: [[0, 1, 3], [0, 2, 3]],
    desc: 'Reached target. Record path [0,2,3]. All paths found.',
  },
];

const nodeMap = new Map<number, typeof nodes[0]>(nodes.map(n => [n.id, n] as [number, typeof nodes[0]]));

function arrowHead(x1: number, y1: number, x2: number, y2: number, r: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ex = x2 - (dx / len) * r;
  const ey = y2 - (dy / len) * r;
  const nx = -dy / len * 7, ny = dx / len * 7;
  return `M ${ex + nx} ${ey + ny} L ${x2 - (dx / len) * (r - 5)} ${y2 - (dy / len) * (r - 5)} L ${ex - nx} ${ey - ny}`;
}

export default function AllPathsSourceTargetDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const pathSet = new Set(current.path);

  function isOnPath(a: number, b: number) {
    const pi = current.path.indexOf(a);
    return pi !== -1 && current.path[pi + 1] === b;
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        graph = [[1,2],[3],[3],[]] &nbsp;|&nbsp; DFS from 0, target = n-1 = 3
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="380" height="250" viewBox="0 0 380 250" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {edges.map(e => {
            const from = nodeMap.get(e.from)!;
            const to = nodeMap.get(e.to)!;
            const active = isOnPath(e.from, e.to);
            return (
              <g key={`${e.from}-${e.to}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={active ? AMBER : 'var(--dsa-border)'}
                  strokeWidth={active ? 2.5 : 1.5} />
                <path d={arrowHead(from.x, from.y, to.x, to.y, 22)}
                  fill={active ? AMBER : 'var(--dsa-border)'} />
              </g>
            );
          })}
          {nodes.map(n => {
            const isTarget = n.id === 3;
            const isSource = n.id === 0;
            const onPath = pathSet.has(n.id);
            const fill = onPath ? AMBER : 'var(--dsa-surface)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={fill}
                  stroke={isTarget ? GREEN : isSource ? ACCENT2 : 'var(--dsa-border)'}
                  strokeWidth={2} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={15} fontWeight={700}
                  fill={onPath ? '#fff' : 'var(--dsa-text-muted)'}>
                  {n.id}
                </text>
              </g>
            );
          })}
          {/* Labels */}
          <text x={60} y={150} textAnchor="middle" fontSize={10} fill={ACCENT2}>source</text>
          <text x={310} y={150} textAnchor="middle" fontSize={10} fill={GREEN}>target</text>
          {/* Current path label */}
          <text x={190} y={230} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>
            path: [{current.path.join('→')}]
          </text>
        </svg>

        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              Step {step + 1} / {steps.length}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.desc}
            </div>
          </div>
          {current.foundPaths.length > 0 && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--dsa-surface)', border: `1px solid ${GREEN}`, borderRadius: 8, fontSize: 11 }}>
              <div style={{ color: GREEN, fontWeight: 700, marginBottom: 4 }}>Paths found:</div>
              {current.foundPaths.map((p, i) => (
                <div key={i} style={{ color: GREEN }}>[{p.join('→')}]</div>
              ))}
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
