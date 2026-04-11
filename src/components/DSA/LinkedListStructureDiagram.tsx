// src/components/DSA/LinkedListStructureDiagram.tsx
// Interactive diagram: fast/slow pointer finding the middle of [1→2→3→4→5].

import React, { useState } from 'react';
import styles from './DSA.module.css';

const VALS = [1, 2, 3, 4, 5];
const NODE_X = [50, 130, 210, 290, 370];
const NODE_Y = 90;
const R = 22;

interface StepDef {
  label: string;
  desc: string;
  slowIdx: number;
  fastIdx: number | null; // null = past end (nil)
  done: boolean;
}

const STEPS: StepDef[] = [
  {
    label: 'Initialise',
    desc: 'Both slow and fast start at the head (index 0). Fast will move twice as quickly as slow.',
    slowIdx: 0, fastIdx: 0, done: false,
  },
  {
    label: 'Iteration 1',
    desc: 'slow moves 1 step → node 2. fast moves 2 steps → node 3. fast.next exists, continue.',
    slowIdx: 1, fastIdx: 2, done: false,
  },
  {
    label: 'Iteration 2',
    desc: 'slow moves 1 step → node 3. fast moves 2 steps → node 5. fast.next = nil, loop ends.',
    slowIdx: 2, fastIdx: 4, done: false,
  },
  {
    label: 'Result — middle found',
    desc: 'Loop condition (fast != nil and fast.next != nil) is false. slow is at node 3 — the middle of the list.',
    slowIdx: 2, fastIdx: 4, done: true,
  },
];

export default function LinkedListStructureDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div className={styles.diagramWrap}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagramTitle}>Fast / Slow Pointer — Find Middle Node</span>
        <span className={styles.diagramStep}>{step + 1} / {STEPS.length}</span>
      </div>

      <div style={{ textAlign: 'center', padding: '6px 16px 2px', fontSize: 13, fontWeight: 600, color: 'var(--dsa-accent)' }}>
        {s.label}
      </div>
      <div style={{ textAlign: 'center', padding: '2px 24px 8px', fontSize: 12, color: 'var(--dsa-text-muted)' }}>
        {s.desc}
      </div>

      <svg viewBox="0 0 430 175" style={{ width: '100%', maxWidth: 440, display: 'block', margin: '0 auto' }}>
        {/* Arrows between nodes */}
        {VALS.slice(0, -1).map((_, i) => (
          <g key={i}>
            {/* next pointer box */}
            <rect x={NODE_X[i] + R + 1} y={NODE_Y - 10} width={18} height={20} rx={2}
              fill="var(--dsa-surface)" stroke="var(--dsa-border)" strokeWidth={1.2} />
            <text x={NODE_X[i] + R + 10} y={NODE_Y + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={9} fill="var(--dsa-text-muted)">
              →
            </text>
            {/* Arrow line */}
            <line
              x1={NODE_X[i] + R + 19} y1={NODE_Y}
              x2={NODE_X[i + 1] - R - 1} y2={NODE_Y}
              stroke="var(--dsa-border)" strokeWidth={1.5}
              markerEnd="url(#arrowLL)"
            />
          </g>
        ))}

        {/* nil tail */}
        <rect x={NODE_X[4] + R + 1} y={NODE_Y - 10} width={22} height={20} rx={2}
          fill="var(--dsa-surface)" stroke="var(--dsa-border)" strokeWidth={1.2} />
        <text x={NODE_X[4] + R + 12} y={NODE_Y + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={8} fontFamily="var(--ifm-font-family-monospace)" fill="var(--dsa-text-muted)">
          nil
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrowLL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--dsa-border)" />
          </marker>
          <marker id="arrowSlow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--dsa-green)" />
          </marker>
          <marker id="arrowFast" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--dsa-accent)" />
          </marker>
        </defs>

        {/* Nodes */}
        {VALS.map((val, i) => {
          const isSlow = i === s.slowIdx;
          const isFast = i === s.fastIdx;
          const isDone = s.done && isSlow;
          const fill   = isDone ? 'var(--dsa-green)' : isSlow && isFast ? '#8b5cf6' : isFast ? 'var(--dsa-accent)' : isSlow ? 'var(--dsa-green)' : 'var(--dsa-surface)';
          const stroke = isDone ? 'var(--dsa-green)' : isSlow && isFast ? '#8b5cf6' : isFast ? 'var(--dsa-accent)' : isSlow ? 'var(--dsa-green)' : 'var(--dsa-border)';
          return (
            <g key={i}>
              <circle cx={NODE_X[i]} cy={NODE_Y} r={R}
                fill={fill} stroke={stroke} strokeWidth={2} />
              <text x={NODE_X[i]} y={NODE_Y + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={14} fontFamily="var(--ifm-font-family-monospace)" fontWeight="700"
                fill={isSlow || isFast ? '#fff' : 'var(--dsa-text)'}>
                {val}
              </text>
            </g>
          );
        })}

        {/* Slow label */}
        <text x={NODE_X[s.slowIdx]} y={NODE_Y + R + 16}
          textAnchor="middle" fontSize={11} fontWeight="700"
          fill={s.done ? 'var(--dsa-green)' : 'var(--dsa-green)'}>
          slow{s.done ? ' ★' : ''}
        </text>

        {/* Fast label */}
        {s.fastIdx !== null && s.fastIdx !== s.slowIdx && (
          <text x={NODE_X[s.fastIdx]} y={NODE_Y - R - 8}
            textAnchor="middle" fontSize={11} fontWeight="700" fill="var(--dsa-accent)">
            fast
          </text>
        )}
        {s.fastIdx === s.slowIdx && (
          <text x={NODE_X[s.slowIdx]} y={NODE_Y - R - 8}
            textAnchor="middle" fontSize={11} fontWeight="700" fill="#8b5cf6">
            slow + fast
          </text>
        )}

        {/* Condition check */}
        <text x={215} y={155}
          textAnchor="middle" fontSize={11}
          fill={s.done ? 'var(--dsa-text-muted)' : 'var(--dsa-text-muted)'}>
          {'while fast != nil && fast.next != nil'}
        </text>
      </svg>

      {/* Code snippet */}
      <div style={{ margin: '0 16px 4px', padding: '8px 12px', background: 'var(--dsa-surface)', borderRadius: 6, border: '1px solid var(--dsa-border)', fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', color: 'var(--dsa-text-muted)' }}>
        var slow = head, fast = head<br />
        while fast != nil &amp;&amp; fast!.next != nil {'{'}<br />
        &nbsp;&nbsp;&nbsp;&nbsp;slow = slow!.next<br />
        &nbsp;&nbsp;&nbsp;&nbsp;fast = fast!.next!.next<br />
        {'}'}
      </div>

      <div className={styles.diagramControls}>
        <button className={styles.diagramBtn} onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Prev</button>
        <button className={styles.diagramBtn} onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>Next →</button>
      </div>
    </div>
  );
}
