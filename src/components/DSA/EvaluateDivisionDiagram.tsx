import React, { useState } from 'react';

const AMBER = '#f59e0b';
const GREEN = '#22c55e';
const RED = '#ef4444';
const ACCENT2 = 'var(--dsa-accent2)';

// Graph: a -2.0-> b -3.0-> c
// BFS query: a/c = 6.0
// Steps: start at a(1.0) -> visit b(2.0) -> visit c(6.0)

const nodes = [
  { id: 'a', x: 80,  y: 120, label: 'a' },
  { id: 'b', x: 240, y: 120, label: 'b' },
  { id: 'c', x: 400, y: 120, label: 'c' },
];

const edges = [
  { from: 'a', to: 'b', label: '2.0',   x1: 80,  y1: 120, x2: 240, y2: 120, bend: -30 },
  { from: 'b', to: 'a', label: '0.5',   x1: 240, y1: 120, x2: 80,  y2: 120, bend: -30 },
  { from: 'b', to: 'c', label: '3.0',   x1: 240, y1: 120, x2: 400, y2: 120, bend: -30 },
  { from: 'c', to: 'b', label: '0.33',  x1: 400, y1: 120, x2: 240, y2: 120, bend: -30 },
];

// BFS steps for query a/c
const bfsSteps = [
  { visited: ['a'],        queue: [{ node: 'a', weight: 1.0 }],  description: "Start BFS from 'a' with weight 1.0" },
  { visited: ['a', 'b'],   queue: [{ node: 'b', weight: 2.0 }],  description: "Visit 'b' via a→b (×2.0) → weight=2.0" },
  { visited: ['a', 'b', 'c'], queue: [{ node: 'c', weight: 6.0 }], description: "Visit 'c' via b→c (×3.0) → weight=6.0. Target found!" },
];

function Arrow({ x1, y1, x2, y2, label, highlighted }: {
  x1: number; y1: number; x2: number; y2: number; label: string; highlighted?: boolean;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const r = 26;
  const sx = x1 + (dx / len) * r;
  const sy = y1 + (dy / len) * r;
  const ex = x2 - (dx / len) * r;
  const ey = y2 - (dy / len) * r;
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  // perpendicular offset for label
  const px = -dy / len * 14;
  const py = dx / len * 14;
  const color = highlighted ? AMBER : 'var(--dsa-border)';

  return (
    <g>
      <defs>
        <marker id={`arrow-${label}`} markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={color} />
        </marker>
      </defs>
      <line
        x1={sx} y1={sy} x2={ex} y2={ey}
        stroke={color} strokeWidth={highlighted ? 2.5 : 1.5}
        markerEnd={`url(#arrow-${label})`}
      />
      <text x={mx + px} y={my + py} textAnchor="middle" dominantBaseline="middle"
        fontSize={11} fill={highlighted ? AMBER : 'var(--dsa-text-muted)'} fontWeight={highlighted ? 700 : 400}>
        {label}
      </text>
    </g>
  );
}

export default function EvaluateDivisionDiagram() {
  const [step, setStep] = useState(0);

  const current = bfsSteps[step];
  const visitedSet = new Set(current.visited);

  // Determine highlighted edges based on visited path
  const highlightedEdges = new Set<string>();
  if (step >= 1) highlightedEdges.add('a→b');
  if (step >= 2) highlightedEdges.add('b→c');

  const edgeKeys: Record<string, string> = {
    '2.0': 'a→b', '3.0': 'b→c', '0.5': 'b→a', '0.33': 'c→b',
  };

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Graph: equations = [["a","b"],["b","c"]], values = [2.0, 3.0] &nbsp;|&nbsp; Query: a / c = ?
      </div>

      <svg width="100%" viewBox="0 0 480 200" style={{ maxWidth: 500, display: 'block', overflow: 'visible' }}>
        {/* Top edges (a→b, b→c) */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--dsa-border)" />
          </marker>
          <marker id="arrowhead-amber" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={AMBER} />
          </marker>
        </defs>

        {/* Forward edges a→b, b→c */}
        {[
          { x1: 106, y1: 105, x2: 214, y2: 105, label: '2.0', key: 'a→b' },
          { x1: 266, y1: 105, x2: 374, y2: 105, label: '3.0', key: 'b→c' },
        ].map(e => {
          const hl = highlightedEdges.has(e.key);
          return (
            <g key={e.key}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={hl ? AMBER : 'var(--dsa-border)'} strokeWidth={hl ? 2.5 : 1.5}
                markerEnd={hl ? 'url(#arrowhead-amber)' : 'url(#arrowhead)'} />
              <text x={(e.x1 + e.x2) / 2} y={e.y1 - 10} textAnchor="middle"
                fontSize={11} fill={hl ? AMBER : 'var(--dsa-text-muted)'} fontWeight={hl ? 700 : 400}>
                {e.label}
              </text>
            </g>
          );
        })}

        {/* Reverse edges b→a, c→b */}
        {[
          { x1: 214, y1: 135, x2: 106, y2: 135, label: '0.5', key: 'b→a' },
          { x1: 374, y1: 135, x2: 266, y2: 135, label: '0.33', key: 'c→b' },
        ].map(e => (
          <g key={e.key}>
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="var(--dsa-border)" strokeWidth={1.5}
              markerEnd="url(#arrowhead)" />
            <text x={(e.x1 + e.x2) / 2} y={e.y1 + 14} textAnchor="middle"
              fontSize={11} fill="var(--dsa-text-muted)">
              {e.label}
            </text>
          </g>
        ))}

        {/* Nodes */}
        {nodes.map(n => {
          const isVisited = visitedSet.has(n.id);
          const isCurrent = current.queue[current.queue.length - 1]?.node === n.id;
          const fill = isCurrent ? GREEN : isVisited ? ACCENT2 : 'var(--dsa-surface)';
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={24}
                fill={fill} stroke="var(--dsa-border)" strokeWidth={2} />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={16} fontWeight={700} fill={isVisited ? '#fff' : 'var(--dsa-text-muted)'}>
                {n.label}
              </text>
              {isCurrent && (
                <text x={n.x} y={n.y + 40} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={700}>
                  ={current.queue[current.queue.length - 1].weight.toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* BFS Trace Table */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '12px 16px',
        marginTop: 8,
        fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: AMBER }}>
          BFS Step {step + 1} / {bfsSteps.length}
        </div>
        <div style={{ color: 'var(--dsa-text-muted)', marginBottom: 8 }}>{current.description}</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'var(--dsa-text-muted)' }}>Visited: </span>
            <span style={{ color: ACCENT2, fontWeight: 600 }}>[{current.visited.join(', ')}]</span>
          </div>
          <div>
            <span style={{ color: 'var(--dsa-text-muted)' }}>Result: </span>
            <span style={{ color: step === 2 ? GREEN : 'var(--dsa-text-muted)' }}>
              {step === 2 ? 'a / c = 6.0' : '...'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === 0 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === 0 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>
          ← Prev
        </button>
        <button
          onClick={() => setStep(s => Math.min(bfsSteps.length - 1, s + 1))}
          disabled={step === bfsSteps.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === bfsSteps.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === bfsSteps.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === bfsSteps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>
          Next →
        </button>
        <button
          onClick={() => setStep(0)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)',
            cursor: 'pointer', fontSize: 13,
          }}>
          Reset
        </button>
      </div>
    </div>
  );
}
