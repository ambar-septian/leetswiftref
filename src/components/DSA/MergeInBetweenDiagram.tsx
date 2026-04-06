import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';
const BLUE = '#38bdf8';

// list1 = [1,2,3,4,5,6], a=2, b=3, list2 = [10,11,12]
// Remove nodes at indices 2 and 3 (vals 3,4)
// Connect: nodeBeforeA.next = list2.head, list2.tail.next = nodeAfterB
// Result: 1 → 2 → 10 → 11 → 12 → 5 → 6

const LIST1 = [1, 2, 3, 4, 5, 6];
const LIST2 = [10, 11, 12];
const A = 2, B = 3;

type Step = {
  list1Status: Array<'normal' | 'active' | 'removed' | 'result'>;
  list2Status: Array<'normal' | 'active' | 'result'>;
  pointerLabel: string;
  desc: string;
};

const steps: Step[] = [
  {
    list1Status: ['normal','normal','normal','normal','normal','normal'],
    list2Status: ['normal','normal','normal'],
    pointerLabel: '',
    desc: 'list1=[1,2,3,4,5,6], a=2, b=3, list2=[10,11,12]. Goal: replace nodes at indices 2..3 with list2.',
  },
  {
    list1Status: ['normal','active','normal','normal','normal','normal'],
    list2Status: ['normal','normal','normal'],
    pointerLabel: 'nodeBeforeA (index a-1=1)',
    desc: 'Walk list1 to index a-1=1. This is "nodeBeforeA" — the connection point for list2 head.',
  },
  {
    list1Status: ['normal','active','normal','normal','active','normal'],
    list2Status: ['normal','normal','normal'],
    pointerLabel: 'nodeAfterB (index b+1=4)',
    desc: 'Continue walking from nodeBeforeA forward b-(a-1)=2 steps to index b+1=4. This is "nodeAfterB" — where list2 tail reconnects.',
  },
  {
    list1Status: ['normal','active','removed','removed','active','normal'],
    list2Status: ['active','normal','normal'],
    pointerLabel: 'nodeBeforeA.next = list2.head',
    desc: 'Connect nodeBeforeA.next to list2.head. Nodes at indices 2 and 3 (vals 3,4) are now detached.',
  },
  {
    list1Status: ['normal','active','removed','removed','active','normal'],
    list2Status: ['normal','normal','active'],
    pointerLabel: 'find list2 tail',
    desc: 'Walk list2 to its tail (val=12).',
  },
  {
    list1Status: ['result','result','removed','removed','result','result'],
    list2Status: ['result','result','result'],
    pointerLabel: 'list2.tail.next = nodeAfterB',
    desc: 'Connect list2.tail.next to nodeAfterB. Result: 1→2→10→11→12→5→6. Return head of list1.',
  },
];

function NodeBox({ val, status, isLast }: { val: number; status: string; isLast: boolean }) {
  const fill: Record<string, string> = {
    normal: 'var(--dsa-surface)',
    active: AMBER,
    removed: RED,
    result: GREEN,
  };
  const textColor: Record<string, string> = {
    normal: 'var(--dsa-text-muted)',
    active: '#fff',
    removed: '#fff',
    result: '#fff',
  };
  const border: Record<string, string> = {
    normal: 'var(--dsa-border)',
    active: AMBER,
    removed: RED,
    result: GREEN,
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6,
        background: fill[status] ?? fill.normal,
        border: `2px solid ${border[status] ?? border.normal}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        color: textColor[status] ?? textColor.normal,
        position: 'relative',
      }}>
        {val}
      </div>
      {!isLast && (
        <div style={{ width: 12, height: 2, background: status === 'removed' ? RED : 'var(--dsa-border)' }} />
      )}
    </div>
  );
}

export default function MergeInBetweenDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        list1=[1,2,3,4,5,6], a=2, b=3 &nbsp;|&nbsp; list2=[10,11,12]
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* List 1 */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>list1:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {LIST1.map((val, i) => (
              <NodeBox key={i} val={val} status={current.list1Status[i]} isLast={i === LIST1.length - 1} />
            ))}
            <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginLeft: 4 }}>null</div>
          </div>
          {/* Index labels */}
          <div style={{ display: 'flex', marginTop: 2 }}>
            {LIST1.map((_, i) => (
              <div key={i} style={{ width: 48, fontSize: 9, color: 'var(--dsa-text-muted)', textAlign: 'center' }}>
                {i === A ? `a=${i}` : i === B ? `b=${i}` : i === A-1 ? `a-1` : i === B+1 ? `b+1` : `${i}`}
              </div>
            ))}
          </div>
        </div>

        {/* List 2 */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>list2:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {LIST2.map((val, i) => (
              <NodeBox key={i} val={val} status={current.list2Status[i]} isLast={i === LIST2.length - 1} />
            ))}
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
          {current.pointerLabel && (
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6, fontSize: 11 }}>
              → {current.pointerLabel}
            </div>
          )}
          <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
            {current.desc}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
          {[
            { color: AMBER, label: 'Active pointer' },
            { color: RED,   label: 'Removed nodes' },
            { color: GREEN, label: 'Final result path' },
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
