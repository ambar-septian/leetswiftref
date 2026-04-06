import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// Input:  [18, 6, 10, 3]
// Output: [18, 6, 6, 2, 10, 1, 3]

type Step = {
  listVals: number[];
  currIdx: number;   // -1 = done
  nextIdx: number;   // -1 = done
  gcdIdx: number;    // -1 = not yet inserted / no GCD step
  gcdVal: number;    // value of inserted GCD node (0 if none)
  desc: string;
};

const steps: Step[] = [
  {
    listVals: [18, 6, 10, 3],
    currIdx: -1, nextIdx: -1, gcdIdx: -1, gcdVal: 0,
    desc: 'Initial list. Walk adjacent pairs and insert a GCD node between each.',
  },
  {
    listVals: [18, 6, 10, 3],
    currIdx: 0, nextIdx: 1, gcdIdx: -1, gcdVal: 0,
    desc: 'curr=18, next=6. Compute GCD(18, 6): 18 % 6 = 0 → GCD = 6.',
  },
  {
    listVals: [18, 6, 6, 10, 3],
    currIdx: 0, nextIdx: 2, gcdIdx: 1, gcdVal: 6,
    desc: 'Insert node(6) between 18 and 6. Advance curr to the original node(6) at index 2.',
  },
  {
    listVals: [18, 6, 6, 10, 3],
    currIdx: 2, nextIdx: 3, gcdIdx: -1, gcdVal: 0,
    desc: 'curr=6 (original), next=10. Compute GCD(6, 10): 10 % 6 = 4; 6 % 4 = 2; 4 % 2 = 0 → GCD = 2.',
  },
  {
    listVals: [18, 6, 6, 2, 10, 3],
    currIdx: 2, nextIdx: 4, gcdIdx: 3, gcdVal: 2,
    desc: 'Insert node(2) between 6 and 10. Advance curr to the original node(10) at index 4.',
  },
  {
    listVals: [18, 6, 6, 2, 10, 3],
    currIdx: 4, nextIdx: 5, gcdIdx: -1, gcdVal: 0,
    desc: 'curr=10, next=3. Compute GCD(10, 3): 10 % 3 = 1; 3 % 1 = 0 → GCD = 1.',
  },
  {
    listVals: [18, 6, 6, 2, 10, 1, 3],
    currIdx: 4, nextIdx: 6, gcdIdx: 5, gcdVal: 1,
    desc: 'Insert node(1) between 10 and 3. curr.next.next = nil — no more pairs.',
  },
  {
    listVals: [18, 6, 6, 2, 10, 1, 3],
    currIdx: -1, nextIdx: -1, gcdIdx: -1, gcdVal: 0,
    desc: 'All pairs processed. Return head. Output: [18, 6, 6, 2, 10, 1, 3].',
  },
];

function NodeBox({ val, color, label }: { val: number; color?: string; label?: string }) {
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

export default function InsertGCDLinkedListDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isDone = step === steps.length - 1;

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        head = [18,6,10,3] &nbsp;|&nbsp; Insert GCD node between every adjacent pair
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* List */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>List:</div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
            {current.listVals.map((val, i) => {
              const isCurr = i === current.currIdx;
              const isNext = i === current.nextIdx;
              const isGcd  = i === current.gcdIdx;
              const isDoneFinal = isDone;
              const color = isDoneFinal
                ? GREEN
                : isGcd
                  ? GREEN
                  : isCurr
                    ? AMBER
                    : isNext
                      ? ACCENT2
                      : undefined;
              const label = isGcd
                ? `GCD=${current.gcdVal}`
                : isCurr
                  ? 'curr'
                  : isNext
                    ? 'next'
                    : `[${i}]`;
              return (
                <div key={`${step}-${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                  <NodeBox val={val} color={color} label={isDoneFinal ? undefined : label} />
                  {i < current.listVals.length - 1 && (
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                  )}
                </div>
              );
            })}
            <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginLeft: 4 }}>null</div>
          </div>
        </div>

        {/* GCD computation highlight */}
        {current.gcdIdx !== -1 && (
          <div style={{ fontSize: 11, color: GREEN }}>
            Inserted node(<strong>{current.gcdVal}</strong>) — GCD of pair
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
          <div style={{ fontWeight: 700, color: isDone ? GREEN : AMBER, marginBottom: 4 }}>
            {step === 0 ? 'Start' : isDone ? 'Complete' : current.currIdx !== -1 ? `curr=${current.listVals[current.currIdx]}, next=${current.listVals[current.nextIdx]}` : ''}
          </div>
          {isDone && (
            <div style={{ fontWeight: 700, color: GREEN, marginBottom: 6 }}>Return [18, 6, 6, 2, 10, 1, 3]</div>
          )}
          <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
            {current.desc}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
          {[
            { color: AMBER,   label: 'curr node' },
            { color: ACCENT2, label: 'next node' },
            { color: GREEN,   label: 'GCD node inserted / final output' },
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
