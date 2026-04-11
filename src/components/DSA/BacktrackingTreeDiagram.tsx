import React, { useState } from 'react';

// Backtracking decision tree for subsets of [1, 2, 3]
// Each step highlights which branch is being explored

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  chosen: number[];  // elements chosen so far
}

interface Edge {
  from: string;
  to: string;
  label: string;  // "pick 1" or "skip 1"
}

const W = 620;
const H = 280;

// Nodes: root, level-1 (pick/skip 1), level-2 (pick/skip 2), level-3 (leaf results)
const NODES: Node[] = [
  { id: 'root', label: '[]', x: 310, y: 30, chosen: [] },
  // After considering 1: pick or skip
  { id: 'p1',   label: '[1]',  x: 160, y: 100, chosen: [1] },
  { id: 's1',   label: '[]',   x: 460, y: 100, chosen: [] },
  // After considering 2: pick or skip (children of p1 and s1)
  { id: 'p1p2', label: '[1,2]', x:  80, y: 175, chosen: [1,2] },
  { id: 'p1s2', label: '[1]',   x: 240, y: 175, chosen: [1] },
  { id: 's1p2', label: '[2]',   x: 380, y: 175, chosen: [2] },
  { id: 's1s2', label: '[]',    x: 540, y: 175, chosen: [] },
  // Leaf results after considering 3
  { id: 'p1p2p3', label: '[1,2,3]', x:  30, y: 250, chosen: [1,2,3] },
  { id: 'p1p2s3', label: '[1,2]',   x: 130, y: 250, chosen: [1,2] },
  { id: 'p1s2p3', label: '[1,3]',   x: 195, y: 250, chosen: [1,3] },
  { id: 'p1s2s3', label: '[1]',     x: 285, y: 250, chosen: [1] },
  { id: 's1p2p3', label: '[2,3]',   x: 345, y: 250, chosen: [2,3] },
  { id: 's1p2s3', label: '[2]',     x: 415, y: 250, chosen: [2] },
  { id: 's1s2p3', label: '[3]',     x: 478, y: 250, chosen: [3] },
  { id: 's1s2s3', label: '[]',      x: 560, y: 250, chosen: [] },
];

const EDGES: Edge[] = [
  { from: 'root', to: 'p1',  label: 'pick 1' },
  { from: 'root', to: 's1',  label: 'skip 1' },
  { from: 'p1',   to: 'p1p2', label: 'pick 2' },
  { from: 'p1',   to: 'p1s2', label: 'skip 2' },
  { from: 's1',   to: 's1p2', label: 'pick 2' },
  { from: 's1',   to: 's1s2', label: 'skip 2' },
  { from: 'p1p2', to: 'p1p2p3', label: 'pick 3' },
  { from: 'p1p2', to: 'p1p2s3', label: 'skip 3' },
  { from: 'p1s2', to: 'p1s2p3', label: 'pick 3' },
  { from: 'p1s2', to: 'p1s2s3', label: 'skip 3' },
  { from: 's1p2', to: 's1p2p3', label: 'pick 3' },
  { from: 's1p2', to: 's1p2s3', label: 'skip 3' },
  { from: 's1s2', to: 's1s2p3', label: 'pick 3' },
  { from: 's1s2', to: 's1s2s3', label: 'skip 3' },
];

// Steps highlight a path through the tree
const STEPS: {
  label: string;
  activeNodes: string[];
  activeEdges: Array<[string,string]>;
  note: string;
}[] = [
  {
    label: 'Start: empty subset',
    activeNodes: ['root'],
    activeEdges: [],
    note: 'Begin at the root. At each level we decide: pick the current number into our subset, or skip it. The tree has 2³ = 8 leaf nodes — one per subset.',
  },
  {
    label: 'Pick 1 → explore left branch',
    activeNodes: ['root', 'p1'],
    activeEdges: [['root','p1']],
    note: 'We include 1 in the current subset. Recurse to decide about 2.',
  },
  {
    label: 'Pick 1, Pick 2',
    activeNodes: ['root', 'p1', 'p1p2'],
    activeEdges: [['root','p1'], ['p1','p1p2']],
    note: 'We include both 1 and 2. Recurse to decide about 3.',
  },
  {
    label: 'Pick 1, Pick 2, Pick 3 → [1,2,3]',
    activeNodes: ['root', 'p1', 'p1p2', 'p1p2p3'],
    activeEdges: [['root','p1'], ['p1','p1p2'], ['p1p2','p1p2p3']],
    note: 'Leaf reached: subset [1,2,3] is recorded. Backtrack.',
  },
  {
    label: 'Pick 1, Pick 2, Skip 3 → [1,2]',
    activeNodes: ['root', 'p1', 'p1p2', 'p1p2s3'],
    activeEdges: [['root','p1'], ['p1','p1p2'], ['p1p2','p1p2s3']],
    note: 'Backtrack from [1,2,3]. Now skip 3. Leaf [1,2] recorded. Backtrack again.',
  },
  {
    label: 'Pick 1, Skip 2 → right side of p1',
    activeNodes: ['root', 'p1', 'p1s2'],
    activeEdges: [['root','p1'], ['p1','p1s2']],
    note: 'Backtrack to p1. Now skip 2. Explore sub-tree with subset containing just 1.',
  },
  {
    label: 'All 8 subsets found',
    activeNodes: NODES.map(n => n.id),
    activeEdges: EDGES.map(e => [e.from, e.to] as [string,string]),
    note: 'After full DFS, all 8 subsets are discovered: [], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3]. The backtracking template: for each candidate, add → recurse → remove.',
  },
];

const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';

export default function BacktrackingTreeDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  const activeNodeSet = new Set(s.activeNodes);
  const activeEdgeSet = new Set(s.activeEdges.map(([a,b]) => `${a}→${b}`));

  const nodeMap = new Map(NODES.map(n => [n.id, n]));

  const isLeaf = (id: string) => !EDGES.some(e => e.from === id);

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        Backtracking Decision Tree — Subsets of [1, 2, 3]
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', marginBottom: 16 }}>
        {/* Edges */}
        {EDGES.map(e => {
          const from = nodeMap.get(e.from)!;
          const to   = nodeMap.get(e.to)!;
          const key  = `${e.from}→${e.to}`;
          const active = activeEdgeSet.has(key);
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          return (
            <g key={key}>
              <line
                x1={from.x} y1={from.y + 14} x2={to.x} y2={to.y - 14}
                stroke={active ? accent : '#374151'}
                strokeWidth={active ? 2 : 1}
              />
              <text x={mx} y={my} textAnchor="middle" fontSize={9} fill={active ? '#a5b4fc' : '#4b5563'}>
                {e.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map(n => {
          const active = activeNodeSet.has(n.id);
          const leaf = isLeaf(n.id);
          return (
            <g key={n.id}>
              <rect
                x={n.x - 28} y={n.y - 14} width={56} height={28}
                rx={leaf ? 6 : 12}
                fill={active ? (leaf ? '#064e3b' : '#1e1b4b') : '#1f2937'}
                stroke={active ? (leaf ? green : accent) : '#374151'}
                strokeWidth={active ? 2 : 1}
              />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={10} fill={active ? (leaf ? '#86efac' : '#a5b4fc') : '#6b7280'}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Note */}
      <div style={{
        background: '#1f2937', borderRadius: 8, padding: '10px 14px',
        fontSize: 13, color: '#d1d5db', lineHeight: 1.5, marginBottom: 16,
        borderLeft: `3px solid ${amber}`,
      }}>
        {s.note}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === 0 ? '#374151' : accent, color: step === 0 ? '#6b7280' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          ← Prev</button>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Step {step + 1} / {STEPS.length} — {s.label}</span>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === STEPS.length - 1 ? '#374151' : accent, color: step === STEPS.length - 1 ? '#6b7280' : '#fff', cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          Next →</button>
      </div>
    </div>
  );
}
