import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// n=6, connections=[[0,1],[1,3],[2,3],[4,0],[4,5]]
// DFS from city 0. Original edges (pointing away from 0) cost 1 reversal each.
// 0→1 original → reverse (cost +1)
// 1→3 original → reverse (cost +1)
// 2→3 reversed → 3→2 needed? No, from 3's perspective we go backward to 2 for free
// 4→0 reversed → 0 can already reach 4 for free
// 4→5 original → reverse (cost +1)
// Total: 3 reversals

type NodePos = { id: number; x: number; y: number };

const nodePositions: NodePos[] = [
  { id: 0, x: 150, y: 100 },
  { id: 1, x: 240, y: 50  },
  { id: 2, x: 270, y: 150 },
  { id: 3, x: 310, y: 100 },
  { id: 4, x: 60,  y: 100 },
  { id: 5, x: 60,  y: 170 },
];

// edges: [from, to, isOriginal]
const allEdges: [number, number, boolean][] = [
  [0, 1, true],
  [1, 3, true],
  [2, 3, false],  // original is 2→3, so from 3's view it's reversed (free)
  [4, 0, false],  // original is 4→0, reversed means 0→4 is free
  [4, 5, true],
];

type Step = {
  visitedIds: number[];
  currentId: number;
  activeEdge: [number, number] | null;
  edgeCost: boolean | null; // true = costs reversal, false = free
  result: number;
  desc: string;
};

const steps: Step[] = [
  {
    visitedIds: [0],
    currentId: 0,
    activeEdge: null,
    edgeCost: null,
    result: 0,
    desc: 'Start DFS from city 0 (the destination). Build adjacency: store each edge in both directions, labelling original vs reversed.',
  },
  {
    visitedIds: [0, 1],
    currentId: 1,
    activeEdge: [0, 1],
    edgeCost: true,
    result: 1,
    desc: 'From 0: visit 1 via edge 0→1 (original). Edge points away from 0, so needs reversal. result=1.',
  },
  {
    visitedIds: [0, 1, 3],
    currentId: 3,
    activeEdge: [1, 3],
    edgeCost: true,
    result: 2,
    desc: 'From 1: visit 3 via edge 1→3 (original). Needs reversal. result=2.',
  },
  {
    visitedIds: [0, 1, 3, 2],
    currentId: 2,
    activeEdge: [3, 2],
    edgeCost: false,
    result: 2,
    desc: 'From 3: visit 2 via edge 2→3 (reversed — stored as 3→2 in adjacency). Edge already points toward 0. No reversal needed. result=2.',
  },
  {
    visitedIds: [0, 1, 3, 2, 4],
    currentId: 4,
    activeEdge: [0, 4],
    edgeCost: false,
    result: 2,
    desc: 'Back at 0: visit 4 via edge 4→0 (reversed — stored as 0→4 in adjacency). Already points toward 0. No reversal needed. result=2.',
  },
  {
    visitedIds: [0, 1, 3, 2, 4, 5],
    currentId: 5,
    activeEdge: [4, 5],
    edgeCost: true,
    result: 3,
    desc: 'From 4: visit 5 via edge 4→5 (original). Needs reversal. result=3.',
  },
  {
    visitedIds: [0, 1, 3, 2, 4, 5],
    currentId: -1,
    activeEdge: null,
    edgeCost: null,
    result: 3,
    desc: 'All nodes visited. 3 edges needed reversal to point toward city 0. Return 3.',
  },
];

const posMap = new Map<number, NodePos>(nodePositions.map(n => [n.id, n] as [number, NodePos]));

function Arrow({ x1, y1, x2, y2, color, dashed }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const r = 18;
  const ax = x1 + ux * r;
  const ay = y1 + uy * r;
  const bx = x2 - ux * r;
  const by = y2 - uy * r;
  return (
    <line x1={ax} y1={ay} x2={bx} y2={by}
      stroke={color} strokeWidth={2}
      strokeDasharray={dashed ? '4 3' : undefined}
      markerEnd={`url(#arrow-${color.replace('#', '').replace('(', '').replace(')', '')})`} />
  );
}

export default function ReorderRoutesDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const visitedSet = new Set(current.visitedIds);
  const [ae0, ae1] = current.activeEdge ?? [-1, -1];

  const arrowColors: Record<string, string> = {
    'dsa-border': 'var(--dsa-border)',
    amber: AMBER,
    green: GREEN,
    red: RED,
  };

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        n=6, connections=[[0,1],[1,3],[2,3],[4,0],[4,5]] &nbsp;|&nbsp; DFS from city 0
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="360" height="220" viewBox="0 0 360 220" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          <defs>
            {[AMBER, GREEN, RED, 'var(--dsa-border)'].map(color => {
              const id = color.replace('#', '').replace(/[()]/g, '');
              return (
                <marker key={id} id={`arrow-${id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill={color} />
                </marker>
              );
            })}
          </defs>

          {allEdges.map(([from, to, isOriginal]) => {
            const fp = posMap.get(from)!;
            const tp = posMap.get(to)!;
            const isActive = current.activeEdge && ((ae0 === from && ae1 === to) || (ae0 === to && ae1 === from));
            const color = isActive
              ? (current.edgeCost ? RED : GREEN)
              : visitedSet.has(from) && visitedSet.has(to)
                ? 'var(--dsa-border)'
                : 'var(--dsa-border)';
            const strokeWidth = isActive ? 2.5 : 1.5;
            const dx = tp.x - fp.x;
            const dy = tp.y - fp.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len, uy = dy / len;
            const r = 18;
            const ax = fp.x + ux * r, ay = fp.y + uy * r;
            const bx = tp.x - ux * r, by = tp.y - uy * r;
            return (
              <line key={`${from}-${to}`} x1={ax} y1={ay} x2={bx} y2={by}
                stroke={color} strokeWidth={strokeWidth}
                markerEnd={`url(#arrow-${color.replace('#','').replace(/[()]/g,'')})`} />
            );
          })}

          {nodePositions.map(n => {
            const isVisited = visitedSet.has(n.id);
            const isCurrent = n.id === current.currentId;
            const isStart = n.id === 0;
            const fill = isCurrent ? AMBER : isVisited ? `${GREEN}33` : 'var(--dsa-surface)';
            const stroke = isCurrent ? AMBER : isVisited ? GREEN : 'var(--dsa-border)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={18}
                  fill={fill} stroke={stroke} strokeWidth={isCurrent ? 2.5 : 1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={12} fontWeight={700}
                  fill={isCurrent ? '#fff' : isVisited ? GREEN : 'var(--dsa-text-muted)'}>
                  {n.id}
                </text>
                {isStart && (
                  <text x={n.x} y={n.y + 28} textAnchor="middle" fontSize={9} fill={GREEN}>dest</text>
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
              {step === 0 ? 'Build adjacency' : step === steps.length - 1 ? 'Complete' : `Visit city ${current.currentId}`}
            </div>
            {step > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>Reversals needed</span>
                <span style={{ fontWeight: 700, color: step === steps.length - 1 ? GREEN : AMBER }}>{current.result}</span>
              </div>
            )}
            {current.activeEdge && (
              <div style={{ marginBottom: 8, padding: '4px 8px', borderRadius: 4, background: current.edgeCost ? `${RED}22` : `${GREEN}22`, border: `1px solid ${current.edgeCost ? RED : GREEN}` }}>
                <span style={{ color: current.edgeCost ? RED : GREEN, fontSize: 11, fontWeight: 700 }}>
                  Edge {ae0}→{ae1}: {current.edgeCost ? 'original (reverse it) +1' : 'already correct (free)'}
                </span>
              </div>
            )}
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: RED,   label: 'Original edge (needs reversal)' },
              { color: GREEN, label: 'Reversed edge (already correct)' },
              { color: AMBER, label: 'Currently visiting' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
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
