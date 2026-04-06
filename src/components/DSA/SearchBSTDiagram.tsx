import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// BST: [4, 2, 7, 1, 3], searching for val = 3
// Step 1: curr=4, 3 < 4 → go left
// Step 2: curr=2, 3 > 2 → go right
// Step 3: curr=3, 3 == 3 → FOUND!

const nodes = [
  { id: 4, x: 180, y: 50 },
  { id: 2, x: 90,  y: 130 },
  { id: 7, x: 270, y: 130 },
  { id: 1, x: 45,  y: 210 },
  { id: 3, x: 135, y: 210 },
];

const edges = [
  { from: 4, to: 2 },
  { from: 4, to: 7 },
  { from: 2, to: 1 },
  { from: 2, to: 3 },
];

const steps = [
  {
    label: 'Start at root',
    active: 4,
    found: false,
    path: [4],
    decision: 'curr.val=4, target=3 — 3 < 4 → go left',
  },
  {
    label: 'Visit left child',
    active: 2,
    found: false,
    path: [4, 2],
    decision: 'curr.val=2, target=3 — 3 > 2 → go right',
  },
  {
    label: 'Found target',
    active: 3,
    found: true,
    path: [4, 2, 3],
    decision: 'curr.val=3 == target=3 → return subtree rooted at 3',
  },
];

const nodeMap = new Map<number, typeof nodes[0]>(nodes.map(n => [n.id, n] as [number, typeof nodes[0]]));

export default function SearchBSTDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  const pathSet = new Set(current.path);

  function nodeColor(id: number): string {
    if (!pathSet.has(id)) return 'var(--dsa-surface)';
    if (id === current.active && current.found) return GREEN;
    if (id === current.active) return AMBER;
    return 'var(--dsa-border)';
  }

  function edgeColor(from: number, to: number): string {
    if (pathSet.has(from) && pathSet.has(to)) return AMBER;
    return 'var(--dsa-border)';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        BST: [4,2,7,1,3] &nbsp;|&nbsp; Search for val = 3 — go left if target is smaller, right if larger
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Tree SVG */}
        <svg width="320" height="260" viewBox="0 0 320 260" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {edges.map(e => {
            const from = nodeMap.get(e.from)!;
            const to = nodeMap.get(e.to)!;
            return (
              <line key={`${e.from}-${e.to}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={edgeColor(e.from, e.to)} strokeWidth={2} />
            );
          })}
          {nodes.map(n => {
            const isActive = n.id === current.active;
            const inPath = pathSet.has(n.id);
            const fill = nodeColor(n.id);
            const textFill = inPath ? '#fff' : 'var(--dsa-text-muted)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={fill}
                  stroke={isActive && current.found ? GREEN : isActive ? AMBER : 'var(--dsa-border)'}
                  strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={15} fontWeight={700} fill={textFill}>
                  {n.id}
                </text>
              </g>
            );
          })}
          {/* Pointer label */}
          {(() => {
            const activeNode = nodeMap.get(current.active)!;
            return (
              <text x={activeNode.x + 28} y={activeNode.y - 8}
                fontSize={11} fontWeight={700}
                fill={current.found ? GREEN : AMBER}>
                curr
              </text>
            );
          })()}
        </svg>

        {/* Info panel */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              Step {step + 1}: {current.label}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.decision}
            </div>
            {current.found && (
              <div style={{ marginTop: 8, fontWeight: 700, color: GREEN }}>
                Return node with val=3
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: AMBER, label: 'Current node (curr)' },
              { color: GREEN, label: 'Found — return this node' },
              { color: 'var(--dsa-border)', label: 'Visited (on path)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color, border: '1px solid var(--dsa-border)' }} />
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
