import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// head = [1,3,4,7,1,2,6]
// Middle index = 3 (val=7), delete it → [1,3,4,1,2,6]
// Fast/slow: slow stops one BEFORE middle so we can splice

const VALS = [1, 3, 4, 7, 1, 2, 6];

type Step = {
  slowIdx: number;
  fastIdx: number | null;
  deletedIdx: number | null;
  desc: string;
};

const steps: Step[] = [
  {
    slowIdx: 0,
    fastIdx: 1,
    deletedIdx: null,
    desc: 'Initialise: slow=head (index 0), fast=head.next (index 1).',
  },
  {
    slowIdx: 1,
    fastIdx: 3,
    deletedIdx: null,
    desc: 'Advance: fast=fast.next.next (index 3). fast!=nil → slow=slow.next (index 1).',
  },
  {
    slowIdx: 2,
    fastIdx: 5,
    deletedIdx: null,
    desc: 'Advance: fast=fast.next.next (index 5). fast!=nil → slow=slow.next (index 2).',
  },
  {
    slowIdx: 2,
    fastIdx: null,
    deletedIdx: 3,
    desc: 'Advance: fast=fast.next.next = nil. fast==nil → splice! slow.next = slow.next.next. Remove index 3 (val=7).',
  },
  {
    slowIdx: -1,
    fastIdx: null,
    deletedIdx: 3,
    desc: 'Done. Return head. Result: [1,3,4,1,2,6].',
  },
];

function NodeBox({ val, status, isLast }: {
  val: number;
  status: 'normal' | 'slow' | 'fast' | 'both' | 'deleted' | 'result';
  isLast: boolean;
}) {
  const bg: Record<string, string> = {
    normal: 'var(--dsa-surface)',
    slow: AMBER,
    fast: ACCENT2,
    both: AMBER,
    deleted: RED,
    result: GREEN,
  };
  const tc: Record<string, string> = {
    normal: 'var(--dsa-text-muted)',
    slow: '#fff', fast: '#fff', both: '#fff', deleted: '#fff', result: '#fff',
  };
  const bc: Record<string, string> = {
    normal: 'var(--dsa-border)',
    slow: AMBER, fast: ACCENT2, both: AMBER, deleted: RED, result: GREEN,
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6,
        background: bg[status],
        border: `2px solid ${bc[status]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        color: tc[status],
        opacity: status === 'deleted' ? 0.4 : 1,
        textDecoration: status === 'deleted' ? 'line-through' : 'none',
      }}>
        {val}
      </div>
      {!isLast && status !== 'deleted' && (
        <div style={{ width: 10, height: 2, background: 'var(--dsa-border)' }} />
      )}
      {!isLast && status === 'deleted' && (
        <div style={{ width: 10, height: 2, background: RED, opacity: 0.3 }} />
      )}
    </div>
  );
}

export default function DeleteMiddleNodeDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        head = [1,3,4,7,1,2,6] &nbsp;|&nbsp; Fast/slow pointer — find and delete middle node
      </div>

      {/* List */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {VALS.map((val, i) => {
            const isDeleted = current.deletedIdx === i;
            const isSlow    = current.slowIdx === i && !isDeleted && step < steps.length - 1;
            const isFast    = current.fastIdx === i && !isDeleted;
            const isResult  = step === steps.length - 1 && !isDeleted;
            const status = isDeleted ? 'deleted'
              : isResult ? 'result'
              : isSlow && isFast ? 'both'
              : isSlow ? 'slow'
              : isFast ? 'fast'
              : 'normal';
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <NodeBox val={val} status={status} isLast={i === VALS.length - 1} />
                <div style={{ fontSize: 9, color: 'var(--dsa-text-muted)', marginTop: 3 }}>
                  {isSlow && !isFast ? 'slow' : isFast && !isSlow ? 'fast' : isSlow && isFast ? 'slow/fast' : `[${i}]`}
                </div>
              </div>
            );
          })}
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginLeft: 4, marginTop: 10 }}>null</div>
        </div>
      </div>

      {/* Info panel */}
      <div style={{
        background: 'var(--dsa-surface)',
        border: '1px solid var(--dsa-border)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        marginBottom: 8,
      }}>
        <div style={{ fontWeight: 700, color: step === steps.length - 1 ? GREEN : AMBER, marginBottom: 4 }}>
          {step === 0 ? 'Initialise' : step === steps.length - 1 ? 'Done' : `Step ${step}`}
        </div>
        {current.slowIdx >= 0 && step < steps.length - 1 && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 6, fontSize: 11 }}>
            <span style={{ color: AMBER }}>slow → index {current.slowIdx} (val={VALS[current.slowIdx]})</span>
            {current.fastIdx !== null && (
              <span style={{ color: ACCENT2 }}>fast → index {current.fastIdx} (val={VALS[current.fastIdx]})</span>
            )}
          </div>
        )}
        <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
          {current.desc}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, marginBottom: 10 }}>
        {[
          { color: AMBER,    label: 'slow pointer' },
          { color: ACCENT2,  label: 'fast pointer' },
          { color: RED,      label: 'deleted node' },
          { color: GREEN,    label: 'result list' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
            <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
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
