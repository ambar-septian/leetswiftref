import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// Input: [5,2,13,3,8]
// Monotonic decreasing stack
// Output: [13,8]

const INPUT_VALS = [5, 2, 13, 3, 8];

type Step = {
  currIdx: number;          // -1 = done rebuilding
  stackVals: number[];
  poppedVals: number[];     // vals just popped this step (to show removal)
  outputVals: number[];     // final output (only last step)
  desc: string;
};

const steps: Step[] = [
  {
    currIdx: 0,
    stackVals: [],
    poppedVals: [],
    outputVals: [],
    desc: 'Start. Stack is empty. Process curr = 5.',
  },
  {
    currIdx: 0,
    stackVals: [5],
    poppedVals: [],
    outputVals: [],
    desc: 'Stack empty — push 5. Stack: [5].',
  },
  {
    currIdx: 1,
    stackVals: [5],
    poppedVals: [],
    outputVals: [],
    desc: 'curr = 2. 2 is not greater than top (5) — push directly.',
  },
  {
    currIdx: 1,
    stackVals: [5, 2],
    poppedVals: [],
    outputVals: [],
    desc: 'Push 2. Stack: [5, 2].',
  },
  {
    currIdx: 2,
    stackVals: [5, 2],
    poppedVals: [],
    outputVals: [],
    desc: 'curr = 13. 13 > top (2) — pop 2 (a smaller node to its right exists).',
  },
  {
    currIdx: 2,
    stackVals: [5],
    poppedVals: [2],
    outputVals: [],
    desc: 'Popped 2. Now top = 5. 13 > 5 — pop 5 too.',
  },
  {
    currIdx: 2,
    stackVals: [],
    poppedVals: [2, 5],
    outputVals: [],
    desc: 'Popped 5. Stack empty — push 13. Stack: [13].',
  },
  {
    currIdx: 2,
    stackVals: [13],
    poppedVals: [],
    outputVals: [],
    desc: 'Push 13. Stack: [13].',
  },
  {
    currIdx: 3,
    stackVals: [13],
    poppedVals: [],
    outputVals: [],
    desc: 'curr = 3. 3 is not greater than top (13) — push directly.',
  },
  {
    currIdx: 3,
    stackVals: [13, 3],
    poppedVals: [],
    outputVals: [],
    desc: 'Push 3. Stack: [13, 3].',
  },
  {
    currIdx: 4,
    stackVals: [13, 3],
    poppedVals: [],
    outputVals: [],
    desc: 'curr = 8. 8 > top (3) — pop 3.',
  },
  {
    currIdx: 4,
    stackVals: [13],
    poppedVals: [3],
    outputVals: [],
    desc: 'Popped 3. Now top = 13. 8 is not greater than 13 — push 8.',
  },
  {
    currIdx: 4,
    stackVals: [13, 8],
    poppedVals: [],
    outputVals: [],
    desc: 'Push 8. All nodes processed. Stack: [13, 8].',
  },
  {
    currIdx: -1,
    stackVals: [13, 8],
    poppedVals: [],
    outputVals: [13, 8],
    desc: 'Rebuild linked list from stack. Return head. Output: [13, 8].',
  },
];

function NodeBox({ val, color, label }: { val: number | string; color?: string; label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6,
        background: color ?? 'var(--dsa-surface)',
        border: `2px solid ${color ?? 'var(--dsa-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        color: color ? '#fff' : 'var(--dsa-text-muted)',
      }}>{val}</div>
      {label && <div style={{ fontSize: 9, color: 'var(--dsa-text-muted)' }}>{label}</div>}
    </div>
  );
}

export default function RemoveNodesLinkedListDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        head = [5,2,13,3,8] &nbsp;|&nbsp; Remove nodes with a greater value to their right
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Input list */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>Input list:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {INPUT_VALS.map((val, i) => {
              const isCurr = current.currIdx === i;
              const isPopped = current.poppedVals.includes(val);
              const color = isCurr ? AMBER : isPopped ? RED : undefined;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <NodeBox
                    val={val}
                    color={color}
                    label={isCurr ? 'curr' : `[${i}]`}
                  />
                  {i < INPUT_VALS.length - 1 && (
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stack */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>
            Monotonic stack (decreasing, left=bottom):
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)' }}>bottom →</div>
            {current.stackVals.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', fontStyle: 'italic' }}>empty</div>
            ) : (
              current.stackVals.map((val, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <NodeBox
                    val={val}
                    color={i === current.stackVals.length - 1 ? ACCENT2 : undefined}
                    label={i === current.stackVals.length - 1 ? 'top' : undefined}
                  />
                  {i < current.stackVals.length - 1 && (
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Output list (final step only) */}
        {current.outputVals.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: GREEN, marginBottom: 4 }}>Output list:</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {current.outputVals.map((val, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <NodeBox val={val} color={GREEN} />
                  {i < current.outputVals.length - 1 && (
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                  )}
                </div>
              ))}
              <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginLeft: 4 }}>null</div>
            </div>
          </div>
        )}

        {/* Info panel */}
        <div style={{
          background: 'var(--dsa-surface)',
          border: '1px solid var(--dsa-border)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 12,
        }}>
          <div style={{ fontWeight: 700, color: step === steps.length - 1 ? GREEN : AMBER, marginBottom: 4 }}>
            {step === 0 ? 'Start' : step === steps.length - 1 ? 'Complete' : `Node val=${INPUT_VALS[Math.max(0, current.currIdx)]}`}
          </div>
          {step === steps.length - 1 && (
            <div style={{ fontWeight: 700, color: GREEN, marginBottom: 6 }}>Return [13, 8]</div>
          )}
          <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
            {current.desc}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
          {[
            { color: AMBER,   label: 'Current node' },
            { color: RED,     label: 'Just popped (removed)' },
            { color: ACCENT2, label: 'Stack top' },
            { color: GREEN,   label: 'Final output' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
              <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
            </div>
          ))}
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
