import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// tree1: [3, 5, 1, 6, 2]
//          3
//        /   \
//       5     1
//      / \
//     6   2
// leaves: [6, 2, 1]
//
// tree2: [3, 5, 1, 6, 2]  (same structure)
// leaves: [6, 2, 1]
// → leafSimilar = true

type TreeNode2 = { id: string; val: number; x: number; y: number; isLeaf: boolean };

const tree1Nodes: TreeNode2[] = [
  { id: 't1-3',  val: 3, x: 80,  y: 30,  isLeaf: false },
  { id: 't1-5',  val: 5, x: 40,  y: 90,  isLeaf: false },
  { id: 't1-1',  val: 1, x: 120, y: 90,  isLeaf: true  },
  { id: 't1-6',  val: 6, x: 18,  y: 150, isLeaf: true  },
  { id: 't1-2',  val: 2, x: 62,  y: 150, isLeaf: true  },
];
const tree1Edges = [
  { from: 't1-3', to: 't1-5' },
  { from: 't1-3', to: 't1-1' },
  { from: 't1-5', to: 't1-6' },
  { from: 't1-5', to: 't1-2' },
];

const tree2Nodes: TreeNode2[] = [
  { id: 't2-3',  val: 3, x: 80+220,  y: 30,  isLeaf: false },
  { id: 't2-5',  val: 5, x: 40+220,  y: 90,  isLeaf: false },
  { id: 't2-1',  val: 1, x: 120+220, y: 90,  isLeaf: true  },
  { id: 't2-6',  val: 6, x: 18+220,  y: 150, isLeaf: true  },
  { id: 't2-2',  val: 2, x: 62+220,  y: 150, isLeaf: true  },
];
const tree2Edges = [
  { from: 't2-3', to: 't2-5' },
  { from: 't2-3', to: 't2-1' },
  { from: 't2-5', to: 't2-6' },
  { from: 't2-5', to: 't2-2' },
];

const leafSequences = [
  { t1: [] as string[], t2: [] as string[], desc: 'Run DFS on both trees to collect leaf sequences.' },
  { t1: ['t1-6'],       t2: [],             desc: 'tree1 DFS: reached leaf 6. Add to sequence 1.' },
  { t1: ['t1-6','t1-2'],t2: [],             desc: 'tree1 DFS: reached leaf 2. Sequence 1 = [6,2].' },
  { t1: ['t1-6','t1-2','t1-1'], t2: [],     desc: 'tree1 DFS: reached leaf 1. Sequence 1 = [6,2,1]. Done.' },
  { t1: ['t1-6','t1-2','t1-1'], t2: ['t2-6'], desc: 'tree2 DFS: reached leaf 6. Add to sequence 2.' },
  { t1: ['t1-6','t1-2','t1-1'], t2: ['t2-6','t2-2'], desc: 'tree2 DFS: reached leaf 2. Sequence 2 = [6,2].' },
  { t1: ['t1-6','t1-2','t1-1'], t2: ['t2-6','t2-2','t2-1'], desc: 'tree2 DFS: reached leaf 1. Sequence 2 = [6,2,1]. Compare sequences: [6,2,1] == [6,2,1] → return true.' },
];

const allNodes = [...tree1Nodes, ...tree2Nodes];
const nodeMap = new Map<string, TreeNode2>(allNodes.map(n => [n.id, n] as [string, TreeNode2]));

export default function LeafSimilarTreesDiagram() {
  const [step, setStep] = useState(0);
  const current = leafSequences[step];
  const t1Set = new Set(current.t1);
  const t2Set = new Set(current.t2);

  function nodeColor(n: TreeNode2): string {
    if (n.isLeaf && t1Set.has(n.id)) return GREEN;
    if (n.isLeaf && t2Set.has(n.id)) return GREEN;
    if (n.isLeaf) return AMBER;
    return 'var(--dsa-surface)';
  }

  function renderTree(nodes: TreeNode2[], edges: typeof tree1Edges, leafSet: Set<string>) {
    return (
      <>
        {edges.map(e => {
          const from = nodeMap.get(e.from)!;
          const to = nodeMap.get(e.to)!;
          return (
            <line key={`${e.from}-${e.to}`}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="var(--dsa-border)" strokeWidth={1.5} />
          );
        })}
        {nodes.map(n => {
          const fill = nodeColor(n);
          const isGreen = n.isLeaf && leafSet.has(n.id);
          const isAmber = n.isLeaf && !leafSet.has(n.id) && step > 0;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={16}
                fill={fill}
                stroke={isGreen ? GREEN : n.isLeaf ? AMBER : 'var(--dsa-border)'}
                strokeWidth={n.isLeaf ? 2 : 1.5} />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={12} fontWeight={700}
                fill={isGreen || (n.isLeaf && step > 0) ? '#fff' : 'var(--dsa-text-muted)'}>
                {n.val}
              </text>
            </g>
          );
        })}
      </>
    );
  }

  const t1Vals = current.t1.map(id => nodeMap.get(id)!.val);
  const t2Vals = current.t2.map(id => nodeMap.get(id)!.val);
  const finalMatch = step === leafSequences.length - 1;

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Two identical trees [3,5,1,6,2] &nbsp;|&nbsp; DFS collects leaves left-to-right
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg width="420" height="190" viewBox="0 0 420 190" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {renderTree(tree1Nodes, tree1Edges, t1Set)}
          {renderTree(tree2Nodes, tree2Edges, t2Set)}
          {/* Labels */}
          <text x={80} y={178} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT2}>tree1</text>
          <text x={300} y={178} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT2}>tree2</text>
          {/* Divider */}
          <line x1={190} y1={10} x2={190} y2={180} stroke="var(--dsa-border)" strokeDasharray="4 3" strokeWidth={1} />
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
              Step {step + 1} / {leafSequences.length}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.desc}
            </div>
            {t1Vals.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 11 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>seq1: </span>
                <span style={{ color: GREEN, fontWeight: 700 }}>[{t1Vals.join(',')}]</span>
              </div>
            )}
            {t2Vals.length > 0 && (
              <div style={{ fontSize: 11 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>seq2: </span>
                <span style={{ color: GREEN, fontWeight: 700 }}>[{t2Vals.join(',')}]</span>
              </div>
            )}
            {finalMatch && (
              <div style={{ marginTop: 8, fontWeight: 700, color: GREEN }}>
                [6,2,1] == [6,2,1] → true
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === 0 ? 'var(--dsa-surface)' : ACCENT2, color: step === 0 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(leafSequences.length - 1, s + 1))} disabled={step === leafSequences.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: step === leafSequences.length - 1 ? 'var(--dsa-surface)' : ACCENT2, color: step === leafSequences.length - 1 ? 'var(--dsa-text-muted)' : '#fff', cursor: step === leafSequences.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)', background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)', cursor: 'pointer', fontSize: 13 }}>Reset</button>
      </div>
    </div>
  );
}
