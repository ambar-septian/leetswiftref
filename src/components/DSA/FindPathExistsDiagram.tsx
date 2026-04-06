import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// n=6, edges=[[0,1],[0,2],[3,5],[5,4],[4,3]]
// source=0, destination=5
// Two disconnected components: {0,1,2} and {3,4,5}
// DFS from 0 → visits 1, 2 but never reaches 5 → return false

type NodePos = { id: number; x: number; y: number };

const nodePositions: NodePos[] = [
  { id: 0, x: 60,  y: 100 },
  { id: 1, x: 140, y: 50  },
  { id: 2, x: 140, y: 150 },
  { id: 3, x: 240, y: 100 },
  { id: 4, x: 320, y: 150 },
  { id: 5, x: 320, y: 50  },
];

const edges: [number, number][] = [
  [0, 1], [0, 2],
  [3, 5], [5, 4], [4, 3],
];

type Step = {
  visitedIds: number[];
  currentId: number;
  found: boolean | null;
  desc: string;
};

const steps: Step[] = [
  {
    visitedIds: [],
    currentId: -1,
    found: null,
    desc: 'Graph with 6 nodes. Source=0, Destination=5. Build adjacency list from edges. Note: {0,1,2} and {3,4,5} are two separate components.',
  },
  {
    visitedIds: [0],
    currentId: 0,
    found: null,
    desc: 'DFS from source=0. Mark 0 visited.',
  },
  {
    visitedIds: [0, 1],
    currentId: 1,
    found: null,
    desc: 'Explore neighbor 1 from 0. 1 != destination(5). Mark 1 visited. Recurse.',
  },
  {
    visitedIds: [0, 1, 2],
    currentId: 2,
    found: null,
    desc: 'Back at 0. Explore neighbor 2. 2 != destination(5). Mark 2 visited. Recurse into 2 — no unvisited neighbors.',
  },
  {
    visitedIds: [0, 1, 2],
    currentId: -1,
    found: false,
    desc: 'All neighbors of 0,1,2 exhausted. Destination 5 was never reached. Nodes 3,4,5 are in a separate component. Return false.',
  },
];

const posMap = new Map<number, NodePos>(nodePositions.map(n => [n.id, n] as [number, NodePos]));

export default function FindPathExistsDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const visitedSet = new Set(current.visitedIds);

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        n=6, edges=[[0,1],[0,2],[3,5],[5,4],[4,3]] &nbsp;|&nbsp; source=0, destination=5
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="380" height="210" viewBox="0 0 380 210" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {edges.map(([a, b]) => {
            const pa = posMap.get(a)!, pb = posMap.get(b)!;
            const bothVisited = visitedSet.has(a) && visitedSet.has(b);
            return (
              <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke={bothVisited ? AMBER : 'var(--dsa-border)'}
                strokeWidth={bothVisited ? 2 : 1.5} />
            );
          })}

          {/* Dashed separator between components */}
          <line x1={190} y1={20} x2={190} y2={190}
            stroke="var(--dsa-border)" strokeWidth={1} strokeDasharray="4 4" />
          <text x={195} y={15} fontSize={9} fill="var(--dsa-text-muted)">disconnected</text>

          {nodePositions.map(n => {
            const isVisited = visitedSet.has(n.id);
            const isCurrent = n.id === current.currentId;
            const isSource = n.id === 0;
            const isDest   = n.id === 5;
            const fill = isCurrent ? AMBER
              : isDest ? `${RED}33`
              : isVisited ? `${GREEN}33`
              : 'var(--dsa-surface)';
            const stroke = isCurrent ? AMBER
              : isDest ? RED
              : isVisited ? GREEN
              : 'var(--dsa-border)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={18}
                  fill={fill} stroke={stroke} strokeWidth={isCurrent || isDest ? 2 : 1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={12} fontWeight={700}
                  fill={isCurrent ? '#fff' : isDest ? RED : isVisited ? GREEN : 'var(--dsa-text-muted)'}>
                  {n.id}
                </text>
                {(isSource || isDest) && (
                  <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize={9}
                    fill={isSource ? GREEN : RED}>
                    {isSource ? 'src' : 'dest'}
                  </text>
                )}
              </g>
            );
          })}
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
              {step === 0 ? 'Build graph' : current.found === false ? 'Complete' : `Visit node ${current.currentId}`}
            </div>
            {current.found === false && (
              <div style={{ fontWeight: 700, color: RED, marginBottom: 8 }}>Return false</div>
            )}
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: GREEN, label: 'Visited during DFS' },
              { color: AMBER, label: 'Currently visiting' },
              { color: RED,   label: 'Destination (unreached)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color }} />
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
