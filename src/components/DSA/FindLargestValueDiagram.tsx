import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// Tree: [1, 3, 2, 5, 3, null, 9]
//        1
//       / \
//      3   2
//     / \   \
//    5   3   9

interface NodeDef {
  id: string;
  val: number;
  x: number;
  y: number;
  level: number;
  left?: string;
  right?: string;
}

const nodes: NodeDef[] = [
  { id: 'n1', val: 1, x: 220, y: 40,  level: 0, left: 'n3', right: 'n2' },
  { id: 'n3', val: 3, x: 120, y: 110, level: 1, left: 'n5', right: 'n3b' },
  { id: 'n2', val: 2, x: 320, y: 110, level: 1, right: 'n9' },
  { id: 'n5', val: 5, x: 60,  y: 180, level: 2 },
  { id: 'n3b',val: 3, x: 180, y: 180, level: 2 },
  { id: 'n9', val: 9, x: 380, y: 180, level: 2 },
];

const levelInfo = [
  { level: 0, nodes: ['n1'], max: 1 },
  { level: 1, nodes: ['n3', 'n2'], max: 3 },
  { level: 2, nodes: ['n5', 'n3b', 'n9'], max: 9 },
];

export default function FindLargestValueDiagram() {
  const [step, setStep] = useState(0);

  const currentLevel = levelInfo[step];
  const activeSet = new Set(currentLevel.nodes);
  const nodeMap = new Map<string, NodeDef>(nodes.map(n => [n.id, n] as [string, NodeDef]));

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Tree: [1, 3, 2, 5, 3, null, 9] &nbsp;|&nbsp; Find max value in each level
      </div>

      <svg width="100%" viewBox="0 0 440 230" style={{ maxWidth: 440, display: 'block', overflow: 'visible' }}>
        <defs>
          <marker id="flv-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill="var(--dsa-border)" />
          </marker>
        </defs>

        {/* Edges */}
        {nodes.map(n => {
          const left = n.left ? nodeMap.get(n.left) : null;
          const right = n.right ? nodeMap.get(n.right) : null;
          return (
            <g key={n.id + '-e'}>
              {left && <line x1={n.x} y1={n.y} x2={left.x} y2={left.y} stroke="var(--dsa-border)" strokeWidth={1.5} />}
              {right && <line x1={n.x} y1={n.y} x2={right.x} y2={right.y} stroke="var(--dsa-border)" strokeWidth={1.5} />}
            </g>
          );
        })}

        {/* Level highlight band */}
        <rect
          x={0} y={currentLevel.level * 70 + 18}
          width={440} height={50}
          fill={ACCENT2} fillOpacity={0.08} rx={6}
        />

        {/* Nodes */}
        {nodes.map(n => {
          const isActive = activeSet.has(n.id);
          const isMax = isActive && n.val === currentLevel.max;
          const fill = isMax ? AMBER : isActive ? ACCENT2 : 'var(--dsa-surface)';
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={20}
                fill={fill} stroke="var(--dsa-border)" strokeWidth={2} />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={14} fontWeight={700}
                fill={isActive ? '#fff' : 'var(--dsa-text-muted)'}>
                {n.val}
              </text>
            </g>
          );
        })}

        {/* Level labels on left */}
        {levelInfo.map((l, i) => (
          <text key={i} x={8} y={l.level * 70 + 44} fontSize={11}
            fill={i === step ? AMBER : 'var(--dsa-text-muted)'} fontWeight={i === step ? 700 : 400}>
            L{i}
          </text>
        ))}
      </svg>

      {/* Info panel */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '10px 16px',
        marginTop: 4,
        fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, color: AMBER, marginBottom: 4 }}>
          Level {step} — {currentLevel.nodes.length} node{currentLevel.nodes.length > 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'var(--dsa-text-muted)' }}>Values: </span>
            <span style={{ color: ACCENT2 }}>
              [{currentLevel.nodes.map(id => nodeMap.get(id)!.val).join(', ')}]
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--dsa-text-muted)' }}>Max: </span>
            <span style={{ color: AMBER, fontWeight: 700 }}>{currentLevel.max}</span>
          </div>
        </div>
      </div>

      {/* Result so far */}
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginTop: 8 }}>
        Result so far:{' '}
        <span style={{ color: GREEN, fontWeight: 700 }}>
          [{levelInfo.slice(0, step + 1).map(l => l.max).join(', ')}]
        </span>
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
          onClick={() => setStep(s => Math.min(levelInfo.length - 1, s + 1))}
          disabled={step === levelInfo.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === levelInfo.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === levelInfo.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === levelInfo.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
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
