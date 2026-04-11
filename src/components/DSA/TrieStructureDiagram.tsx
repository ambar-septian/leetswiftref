// src/components/DSA/TrieStructureDiagram.tsx
// Interactive diagram: build a trie by inserting "cat", "car", "care", "dog" step by step.

import React, { useState } from 'react';
import styles from './DSA.module.css';

interface NodeDef {
  id: string;
  char: string;
  x: number;
  y: number;
}

interface EdgeDef {
  id: string;
  from: string;
  to: string;
}

const ALL_NODES: NodeDef[] = [
  { id: 'root', char: '∅',  x: 210, y: 35 },
  { id: 'c',    char: 'c',  x: 125, y: 105 },
  { id: 'd',    char: 'd',  x: 300, y: 105 },
  { id: 'a',    char: 'a',  x: 125, y: 175 },
  { id: 'o',    char: 'o',  x: 300, y: 175 },
  { id: 't',    char: 't',  x: 75,  y: 245 },
  { id: 'r',    char: 'r',  x: 168, y: 245 },
  { id: 'g',    char: 'g',  x: 300, y: 245 },
  { id: 'e',    char: 'e',  x: 168, y: 315 },
];

const ALL_EDGES: EdgeDef[] = [
  { id: 'root-c', from: 'root', to: 'c' },
  { id: 'root-d', from: 'root', to: 'd' },
  { id: 'c-a',    from: 'c',    to: 'a' },
  { id: 'a-t',    from: 'a',    to: 't' },
  { id: 'a-r',    from: 'a',    to: 'r' },
  { id: 'r-e',    from: 'r',    to: 'e' },
  { id: 'd-o',    from: 'd',    to: 'o' },
  { id: 'o-g',    from: 'o',    to: 'g' },
];

interface StepDef {
  label: string;
  desc: string;
  visibleNodes: string[];
  visibleEdges: string[];
  terminalNodes: string[];
  highlightNodes: string[];
  highlightEdges: string[];
}

const STEPS: StepDef[] = [
  {
    label: 'Empty trie',
    desc: 'Start with a root node (no character). Every trie has a single root.',
    visibleNodes: ['root'],
    visibleEdges: [],
    terminalNodes: [],
    highlightNodes: ['root'],
    highlightEdges: [],
  },
  {
    label: 'Insert "cat"',
    desc: 'Create nodes c → a → t. Mark t as a word-end (★).',
    visibleNodes: ['root', 'c', 'a', 't'],
    visibleEdges: ['root-c', 'c-a', 'a-t'],
    terminalNodes: ['t'],
    highlightNodes: ['c', 'a', 't'],
    highlightEdges: ['root-c', 'c-a', 'a-t'],
  },
  {
    label: 'Insert "car"',
    desc: 'Reuse root → c → a (already exist). Add new node r, mark it as a word-end.',
    visibleNodes: ['root', 'c', 'a', 't', 'r'],
    visibleEdges: ['root-c', 'c-a', 'a-t', 'a-r'],
    terminalNodes: ['t', 'r'],
    highlightNodes: ['r'],
    highlightEdges: ['a-r'],
  },
  {
    label: 'Insert "care"',
    desc: 'Reuse root → c → a → r (already exist). Add e as a child of r. Both r (★) and e (★) are word-ends.',
    visibleNodes: ['root', 'c', 'a', 't', 'r', 'e'],
    visibleEdges: ['root-c', 'c-a', 'a-t', 'a-r', 'r-e'],
    terminalNodes: ['t', 'r', 'e'],
    highlightNodes: ['e'],
    highlightEdges: ['r-e'],
  },
  {
    label: 'Insert "dog"',
    desc: 'New prefix d. Create d → o → g under root. Mark g as a word-end.',
    visibleNodes: ['root', 'c', 'a', 't', 'r', 'e', 'd', 'o', 'g'],
    visibleEdges: ['root-c', 'c-a', 'a-t', 'a-r', 'r-e', 'root-d', 'd-o', 'o-g'],
    terminalNodes: ['t', 'r', 'e', 'g'],
    highlightNodes: ['d', 'o', 'g'],
    highlightEdges: ['root-d', 'd-o', 'o-g'],
  },
];

const nodeMap = Object.fromEntries(ALL_NODES.map(n => [n.id, n]));

export default function TrieStructureDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  const visibleNodeSet = new Set(s.visibleNodes);
  const visibleEdgeSet = new Set(s.visibleEdges);
  const terminalSet    = new Set(s.terminalNodes);
  const highlightNodeSet = new Set(s.highlightNodes);
  const highlightEdgeSet = new Set(s.highlightEdges);

  const R = 20; // node radius

  return (
    <div className={styles.diagramWrap}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagramTitle}>Trie — Building step by step</span>
        <span className={styles.diagramStep}>{step + 1} / {STEPS.length}</span>
      </div>

      <div style={{ textAlign: 'center', padding: '6px 16px 2px', fontSize: 13, fontWeight: 600, color: 'var(--dsa-accent)' }}>
        {s.label}
      </div>
      <div style={{ textAlign: 'center', padding: '2px 24px 10px', fontSize: 12, color: 'var(--dsa-text-muted)' }}>
        {s.desc}
      </div>

      <svg viewBox="0 0 420 345" style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }}>
        {/* Edges */}
        {ALL_EDGES.filter(e => visibleEdgeSet.has(e.id)).map(edge => {
          const from = nodeMap[edge.from];
          const to   = nodeMap[edge.to];
          const highlighted = highlightEdgeSet.has(edge.id);
          return (
            <line
              key={edge.id}
              x1={from.x} y1={from.y + R}
              x2={to.x}   y2={to.y - R}
              stroke={highlighted ? 'var(--dsa-accent)' : 'var(--dsa-border)'}
              strokeWidth={highlighted ? 2 : 1.5}
            />
          );
        })}

        {/* Nodes */}
        {ALL_NODES.filter(n => visibleNodeSet.has(n.id)).map(node => {
          const isTerminal  = terminalSet.has(node.id);
          const isHighlight = highlightNodeSet.has(node.id);
          const isRoot = node.id === 'root';
          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r={R}
                fill={isHighlight ? 'var(--dsa-accent)' : isRoot ? 'var(--dsa-surface)' : 'var(--dsa-surface)'}
                stroke={isHighlight ? 'var(--dsa-accent)' : isTerminal ? 'var(--dsa-green)' : 'var(--dsa-border)'}
                strokeWidth={isTerminal || isHighlight ? 2.5 : 1.5}
              />
              <text
                x={node.x} y={node.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={isRoot ? 13 : 14}
                fontFamily="var(--ifm-font-family-monospace)"
                fontWeight="600"
                fill={isHighlight ? '#fff' : 'var(--dsa-text)'}
              >
                {node.char}
              </text>
              {/* Word-end star */}
              {isTerminal && (
                <text
                  x={node.x + R - 4} y={node.y - R + 4}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={10}
                  fill="var(--dsa-green)"
                >
                  ★
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: '4px 0 12px', fontSize: 12, color: 'var(--dsa-text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width={18} height={18} style={{ flexShrink: 0 }}>
            <circle cx={9} cy={9} r={8} fill="var(--dsa-accent)" stroke="var(--dsa-accent)" strokeWidth={2} />
          </svg>
          Newly added
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width={18} height={18} style={{ flexShrink: 0 }}>
            <circle cx={9} cy={9} r={8} fill="var(--dsa-surface)" stroke="var(--dsa-green)" strokeWidth={2.5} />
            <text x={9} y={10} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="var(--dsa-green)">★</text>
          </svg>
          Word end (★)
        </span>
      </div>

      <div className={styles.diagramControls}>
        <button className={styles.diagramBtn} onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Prev</button>
        <button className={styles.diagramBtn} onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>Next →</button>
      </div>
    </div>
  );
}
