import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// Trie built from dictionary: ["cat", "bat", "rat"]
// Sentence words: ["the", "cattle", "was", "rattled"]
// Results:        ["the", "cat",    "was", "rat"]

const trieNodes = [
  { id: 'root', label: 'root', x: 200, y: 30 },
  { id: 'c', label: 'c', x: 80,  y: 100 },
  { id: 'b', label: 'b', x: 200, y: 100 },
  { id: 'r', label: 'r', x: 320, y: 100 },
  { id: 'ca', label: 'a', x: 80,  y: 170 },
  { id: 'ba', label: 'a', x: 200, y: 170 },
  { id: 'ra', label: 'a', x: 320, y: 170 },
  { id: 'cat', label: 't*', x: 80,  y: 240 },
  { id: 'bat', label: 't*', x: 200, y: 240 },
  { id: 'rat', label: 't*', x: 320, y: 240 },
];

const trieEdges = [
  { from: 'root', to: 'c', label: 'c' },
  { from: 'root', to: 'b', label: 'b' },
  { from: 'root', to: 'r', label: 'r' },
  { from: 'c', to: 'ca', label: 'a' },
  { from: 'b', to: 'ba', label: 'a' },
  { from: 'r', to: 'ra', label: 'a' },
  { from: 'ca', to: 'cat', label: 't' },
  { from: 'ba', to: 'bat', label: 't' },
  { from: 'ra', to: 'rat', label: 't' },
];

const words = [
  { word: 'the',     root: null,  path: [] as string[],                   note: 'No prefix in trie → keep "the"' },
  { word: 'cattle',  root: 'cat', path: ['root', 'c', 'ca', 'cat'],       note: 'Prefix "cat" found (isEnd=true) → replace' },
  { word: 'was',     root: null,  path: [] as string[],                   note: 'No prefix in trie → keep "was"' },
  { word: 'rattled', root: 'rat', path: ['root', 'r', 'ra', 'rat'],       note: 'Prefix "rat" found (isEnd=true) → replace' },
];

export default function ReplaceWordsDiagram() {
  const [step, setStep] = useState(0);
  const current = words[step];
  const activeSet = new Set(current.path);
  const nodeMap = new Map<string, typeof trieNodes[0]>(trieNodes.map(n => [n.id, n] as [string, typeof trieNodes[0]]));

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        Trie: ["cat","bat","rat"] &nbsp;|&nbsp; Sentence: "the cattle was rattled"
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Trie SVG */}
        <svg width="400" height="275" viewBox="0 0 400 275" style={{ flex: '0 0 auto', overflow: 'visible' }}>
          {/* Edges */}
          {trieEdges.map(e => {
            const from = nodeMap.get(e.from)!;
            const to = nodeMap.get(e.to)!;
            const isActive = activeSet.has(e.from) && activeSet.has(e.to);
            return (
              <g key={e.from + '-' + e.to}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isActive ? AMBER : 'var(--dsa-border)'}
                  strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={(from.x + to.x) / 2 + 6} y={(from.y + to.y) / 2}
                  fontSize={10} fill={isActive ? AMBER : 'var(--dsa-text-muted)'}>
                  {e.label}
                </text>
              </g>
            );
          })}
          {/* Nodes */}
          {trieNodes.map(n => {
            const isActive = activeSet.has(n.id);
            const isEnd = n.label.endsWith('*');
            const fill = isActive ? (isEnd ? GREEN : AMBER) : 'var(--dsa-surface)';
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={16}
                  fill={fill}
                  stroke={isEnd ? GREEN : 'var(--dsa-border)'}
                  strokeWidth={isEnd ? 2.5 : 1.5} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fontWeight={700}
                  fill={isActive ? '#fff' : 'var(--dsa-text-muted)'}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Word panel */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
            Word {step + 1} of {words.length}
          </div>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 4 }}>
              "{current.word}"
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', fontSize: 12, marginBottom: 8 }}>
              {current.note}
            </div>
            <div>
              <span style={{ color: 'var(--dsa-text-muted)' }}>Result: </span>
              <span style={{
                fontWeight: 700,
                color: current.root ? GREEN : ACCENT2,
              }}>
                "{current.root ?? current.word}"
              </span>
            </div>
          </div>

          {/* Result so far */}
          <div style={{ marginTop: 12, fontSize: 12 }}>
            <div style={{ color: 'var(--dsa-text-muted)', marginBottom: 4 }}>Output so far:</div>
            <div style={{ color: GREEN, fontWeight: 700 }}>
              "{words.slice(0, step + 1).map(w => w.root ?? w.word).join(' ')}"
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, flexWrap: 'wrap' }}>
        {[
          { color: AMBER, label: 'Active path' },
          { color: GREEN, label: 'End of root (isEnd=true)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
            <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
          </div>
        ))}
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
        <button onClick={() => setStep(s => Math.min(words.length - 1, s + 1))} disabled={step === words.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === words.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === words.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === words.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
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
