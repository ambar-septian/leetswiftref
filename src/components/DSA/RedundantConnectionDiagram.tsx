import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// edges = [[1,2],[1,3],[2,3]]
// Step 1: process [1,2] → unite(0,1) → different roots → merged. parent=[1,1,2]
// Step 2: process [1,3] → unite(0,2) → find(0)=1, find(2)=2 → merged. parent=[1,1,1]
// Step 3: process [2,3] → unite(1,2) → find(1)=1, find(2)=1 → SAME ROOT → redundant [2,3]

const nodes = [
  { id: 1, x: 100, y: 80 },
  { id: 2, x: 260, y: 80 },
  { id: 3, x: 180, y: 200 },
];

const steps = [
  {
    edge: [1, 2],
    parent: [1, 1, 2],
    activeEdge: [1, 2],
    redundant: false,
    connectedPairs: [[1, 2]] as number[][],
    description: 'unite(0,1): find(0)=0, find(1)=1 — different roots. Merge: parent[0]=1. Edge [1,2] is valid.',
  },
  {
    edge: [1, 3],
    parent: [1, 1, 1],
    activeEdge: [1, 3],
    redundant: false,
    connectedPairs: [[1, 2], [1, 3]] as number[][],
    description: 'unite(0,2): find(0)=1, find(2)=2 — different roots. Merge: parent[2]=1. Edge [1,3] is valid.',
  },
  {
    edge: [2, 3],
    parent: [1, 1, 1],
    activeEdge: [2, 3],
    redundant: true,
    connectedPairs: [[1, 2], [1, 3]] as number[][],
    description: 'unite(1,2): find(1)=1, find(2)=find(1)=1 — SAME ROOT! Edge [2,3] is redundant → return [2,3].',
  },
];

export default function RedundantConnectionDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  const connectedSet = new Set(current.connectedPairs.map(p => `${p[0]}-${p[1]}`));

  function isConnected(a: number, b: number) {
    return connectedSet.has(`${a}-${b}`) || connectedSet.has(`${b}-${a}`);
  }

  const isRedundantEdge = current.redundant;

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        edges = [[1,2],[1,3],[2,3]] &nbsp;|&nbsp; Union-Find — find the edge that forms a cycle
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Graph SVG */}
        <svg width="360" height="260" viewBox="0 0 360 260" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {/* All possible edges */}
          {[[1,2],[1,3],[2,3]].map(([a, b]) => {
            const na = nodes.find(n => n.id === a)!;
            const nb = nodes.find(n => n.id === b)!;
            const isCurrent = current.activeEdge[0] === a && current.activeEdge[1] === b;
            const isAlreadyConnected = isConnected(a, b) && !isCurrent;
            const color = isCurrent
              ? (isRedundantEdge ? RED : GREEN)
              : isAlreadyConnected ? ACCENT2 : 'var(--dsa-border)';
            return (
              <line key={`${a}-${b}`}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={color} strokeWidth={isCurrent ? 3 : 1.5}
                strokeDasharray={isCurrent && isRedundantEdge ? '6 3' : undefined}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map(n => {
            const isActive = current.activeEdge.includes(n.id);
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={isActive ? ACCENT2 : 'var(--dsa-surface)'}
                  stroke="var(--dsa-border)" strokeWidth={2} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={15} fontWeight={700}
                  fill={isActive ? '#fff' : 'var(--dsa-text-muted)'}>
                  {n.id}
                </text>
              </g>
            );
          })}
          {/* Edge label */}
          <text x={180} y={245} textAnchor="middle" fontSize={12}
            fill={isRedundantEdge ? RED : GREEN} fontWeight={700}>
            Edge [{current.edge[0]},{current.edge[1]}]{isRedundantEdge ? ' → REDUNDANT' : ' → merged'}
          </text>
        </svg>

        {/* Union-Find state */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 8 }}>
              Union-Find State (0-indexed)
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--dsa-text-muted)', fontSize: 10 }}>node {i}</div>
                  <div style={{
                    width: 36, height: 36, borderRadius: 6,
                    background: 'var(--dsa-surface)',
                    border: '1px solid var(--dsa-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14,
                    color: ACCENT2,
                  }}>
                    {current.parent[i]}
                  </div>
                  <div style={{ color: 'var(--dsa-text-muted)', fontSize: 10 }}>parent</div>
                </div>
              ))}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', fontSize: 11, lineHeight: 1.5 }}>
              {current.description}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: ACCENT2, label: 'Merged edges' },
              { color: GREEN, label: 'Current (valid)' },
              { color: RED, label: 'Current (redundant)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 16, height: 3, background: item.color, borderRadius: 2 }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === 0 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === 0 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)',
            cursor: 'pointer', fontSize: 13,
          }}>Reset</button>
      </div>
    </div>
  );
}
