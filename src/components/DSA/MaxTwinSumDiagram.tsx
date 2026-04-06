import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// head = [4,2,2,3]  (length=4, midpoint after index 1)
// Stack gets first half [4, 2]
// Second half: index 2 (val=2) → pop 2 → twin sum=4
//              index 3 (val=3) → pop 4 → twin sum=7  ← max
// Return 7

const VALS = [4, 2, 2, 3];

type Step = {
  slowIdx: number | null;
  fastIdx: number | null;
  stack: number[];
  currIdx: number | null;
  poppedVal: number | null;
  twinSum: number | null;
  maxSum: number;
  phase: 'find-mid' | 'push-half' | 'compare' | 'done';
  desc: string;
};

const steps: Step[] = [
  {
    slowIdx: 0, fastIdx: 0,
    stack: [], currIdx: null, poppedVal: null, twinSum: null, maxSum: 0,
    phase: 'find-mid',
    desc: 'Initialise slow and fast at head. Advance fast two steps per iteration while slow advances one — finds the midpoint.',
  },
  {
    slowIdx: 1, fastIdx: null,
    stack: [], currIdx: null, poppedVal: null, twinSum: null, maxSum: 0,
    phase: 'find-mid',
    desc: 'slow=index 1, fast=index 3 (fast.next is nil → stop). slow is now at the last node of the first half.',
  },
  {
    slowIdx: 1, fastIdx: null,
    stack: [4, 2], currIdx: null, poppedVal: null, twinSum: null, maxSum: 0,
    phase: 'push-half',
    desc: 'Walk from head to slow.next (exclusive). Push first-half values onto the stack: [4, 2]. Stack top = most recent first-half value.',
  },
  {
    slowIdx: null, fastIdx: null,
    stack: [4], currIdx: 2, poppedVal: 2, twinSum: 4, maxSum: 4,
    phase: 'compare',
    desc: 'Second half starts at index 2 (val=2). Pop stack top=2. Twin sum = 2+2 = 4. maxSum=4.',
  },
  {
    slowIdx: null, fastIdx: null,
    stack: [], currIdx: 3, poppedVal: 4, twinSum: 7, maxSum: 7,
    phase: 'compare',
    desc: 'Move to index 3 (val=3). Pop stack top=4. Twin sum = 3+4 = 7. 7 > 4 → maxSum=7.',
  },
  {
    slowIdx: null, fastIdx: null,
    stack: [], currIdx: null, poppedVal: null, twinSum: null, maxSum: 7,
    phase: 'done',
    desc: 'Stack empty. All twin pairs processed. Return maxSum = 7.',
  },
];

function NodeBox({ val, highlight, label }: { val: number; highlight?: string; label?: string }) {
  const bg = highlight ?? 'var(--dsa-surface)';
  const tc = highlight ? '#fff' : 'var(--dsa-text-muted)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6,
        background: bg,
        border: `2px solid ${highlight ?? 'var(--dsa-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: tc,
      }}>{val}</div>
      {label && <div style={{ fontSize: 9, color: 'var(--dsa-text-muted)' }}>{label}</div>}
    </div>
  );
}

export default function MaxTwinSumDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        head = [4,2,2,3] &nbsp;|&nbsp; Twin sums: (4,3)=7 and (2,2)=4 → max=7
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Linked list */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>List:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {VALS.map((val, i) => {
              const isSlow = current.slowIdx === i;
              const isFast = current.fastIdx === i;
              const isCurr = current.currIdx === i;
              const color = isCurr ? GREEN : isSlow ? AMBER : 'var(--dsa-surface)';
              const label = isSlow ? 'slow' : isCurr ? 'curr' : '';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <NodeBox val={val} highlight={color !== 'var(--dsa-surface)' ? color : undefined} label={label || `[${i}]`} />
                  {i < VALS.length - 1 && <div style={{ width: 10, height: 2, background: 'var(--dsa-border)' }} />}
                </div>
              );
            })}
            <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginLeft: 4 }}>null</div>
          </div>

          {/* Stack */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>Stack (first half):</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50 }}>
              {current.stack.length === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)' }}>empty</div>
              ) : (
                current.stack.map((val, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: 4,
                    background: i === current.stack.length - 1 ? ACCENT2 : 'var(--dsa-surface)',
                    border: `2px solid ${i === current.stack.length - 1 ? ACCENT2 : 'var(--dsa-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: i === current.stack.length - 1 ? '#fff' : 'var(--dsa-text-muted)',
                  }}>{val}</div>
                ))
              )}
              {current.stack.length > 0 && (
                <div style={{ fontSize: 9, color: ACCENT2, marginBottom: 2 }}>← top</div>
              )}
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: current.phase === 'done' ? GREEN : AMBER, marginBottom: 6 }}>
              {current.phase === 'find-mid' ? 'Find midpoint' : current.phase === 'push-half' ? 'Build stack' : current.phase === 'compare' ? 'Pair and compare' : 'Complete'}
            </div>
            {current.twinSum !== null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {[
                  ['Twin sum', current.twinSum, current.twinSum === current.maxSum ? GREEN : AMBER],
                  ['Max sum', current.maxSum, GREEN],
                ].map(([label, val, color]) => (
                  <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--dsa-text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: color as string }}>{val as number}</span>
                  </div>
                ))}
              </div>
            )}
            {current.phase === 'done' && (
              <div style={{ fontWeight: 700, color: GREEN, marginBottom: 8 }}>Return 7</div>
            )}
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
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
