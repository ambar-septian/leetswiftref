import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const ZERO_COLOR = '#6366f1';

// head = [0,3,1,0,4,5,2,0]
// Segments: [3,1] → sum=4, [4,5,2] → sum=11
// Output: [4,11]

const INPUT_VALS = [0, 3, 1, 0, 4, 5, 2, 0];

type Step = {
  currIdx: number;
  accum: number;
  resultNodes: number[];
  desc: string;
};

const steps: Step[] = [
  {
    currIdx: 1,
    accum: 0,
    resultNodes: [],
    desc: 'Skip head (always 0). Start at index 1 (val=3). Accumulate values until the next 0.',
  },
  {
    currIdx: 1,
    accum: 3,
    resultNodes: [],
    desc: 'Visit val=3. Not 0 → add to current node: dummy.val += 3 = 3.',
  },
  {
    currIdx: 2,
    accum: 4,
    resultNodes: [],
    desc: 'Visit val=1. Not 0 → dummy.val += 1 = 4.',
  },
  {
    currIdx: 3,
    accum: 4,
    resultNodes: [4],
    desc: 'Visit val=0. Zero found → move to next node. Create new node(0). Accumulated 4 is stored.',
  },
  {
    currIdx: 4,
    accum: 4,
    resultNodes: [4],
    desc: 'Visit val=4. Not 0 → new dummy.val += 4 = 4.',
  },
  {
    currIdx: 5,
    accum: 9,
    resultNodes: [4],
    desc: 'Visit val=5. Not 0 → dummy.val += 5 = 9.',
  },
  {
    currIdx: 6,
    accum: 11,
    resultNodes: [4],
    desc: 'Visit val=2. Not 0 → dummy.val += 2 = 11.',
  },
  {
    currIdx: 7,
    accum: 11,
    resultNodes: [4, 11],
    desc: 'Visit val=0 (last). current.next == nil → loop ends. Result list is [4, 11].',
  },
  {
    currIdx: -1,
    accum: 0,
    resultNodes: [4, 11],
    desc: 'Return result head. Output: [4, 11].',
  },
];

function NodeBox({ val, color, label }: { val: number | string; color?: string; label?: string }) {
  const bg = color ?? 'var(--dsa-surface)';
  const tc = color ? '#fff' : 'var(--dsa-text-muted)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6,
        background: bg,
        border: `2px solid ${color ?? 'var(--dsa-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: tc,
      }}>{val}</div>
      {label && <div style={{ fontSize: 9, color: 'var(--dsa-text-muted)' }}>{label}</div>}
    </div>
  );
}

export default function MergeNodesBetweenZerosDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        head = [0,3,1,0,4,5,2,0] &nbsp;|&nbsp; Sum values between each pair of zeros
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Input list */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>Input list:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {INPUT_VALS.map((val, i) => {
              const isCurr = current.currIdx === i;
              const isZero = val === 0;
              const color = isCurr
                ? (isZero ? ZERO_COLOR : AMBER)
                : isZero
                  ? `${ZERO_COLOR}66`
                  : 'var(--dsa-surface)';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <NodeBox
                    val={val}
                    color={isCurr ? (isZero ? ZERO_COLOR : AMBER) : undefined}
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

        {/* Current accumulation */}
        {current.currIdx > 0 && current.currIdx < INPUT_VALS.length - 1 && (
          <div style={{ fontSize: 11, color: AMBER }}>
            Accumulating: dummy.val = <strong>{current.accum}</strong>
          </div>
        )}

        {/* Result list */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>Result list:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {current.resultNodes.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)' }}>building...</div>
            ) : (
              current.resultNodes.map((val, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <NodeBox val={val} color={step === steps.length - 1 ? GREEN : ACCENT2} />
                  {i < current.resultNodes.length - 1 && (
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                  )}
                </div>
              ))
            )}
            <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginLeft: 4 }}>null</div>
          </div>
        </div>

        {/* Info panel */}
        <div style={{
          background: 'var(--dsa-surface)',
          border: '1px solid var(--dsa-border)',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 12,
        }}>
          <div style={{ fontWeight: 700, color: step === steps.length - 1 ? GREEN : AMBER, marginBottom: 4 }}>
            {step === 0 ? 'Start' : step === steps.length - 1 ? 'Complete' : `Index ${current.currIdx} (val=${INPUT_VALS[current.currIdx]})`}
          </div>
          {step === steps.length - 1 && (
            <div style={{ fontWeight: 700, color: GREEN, marginBottom: 6 }}>Return [4, 11]</div>
          )}
          <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
            {current.desc}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
          {[
            { color: AMBER,      label: 'Current node (non-zero)' },
            { color: ZERO_COLOR, label: 'Zero separator' },
            { color: ACCENT2,    label: 'Result node (being built)' },
            { color: GREEN,      label: 'Final result' },
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
