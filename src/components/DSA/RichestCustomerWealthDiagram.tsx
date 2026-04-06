import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// accounts = [[1,5],[7,3],[3,5]]
// Row sums: [6, 10, 8]  → max = 10 (customer 1)

const ACCOUNTS = [[1, 5], [7, 3], [3, 5]];
const ROW_SUMS = [6, 10, 8];

type Step = {
  activeRow: number;
  completedRows: number[];
  maxRow: number;
  desc: string;
};

const steps: Step[] = [
  {
    activeRow: -1,
    completedRows: [],
    maxRow: -1,
    desc: 'accounts = [[1,5],[7,3],[3,5]]. Map each customer\'s row to its sum, then take the max.',
  },
  {
    activeRow: 0,
    completedRows: [],
    maxRow: -1,
    desc: 'Customer 0: accounts[0] = [1, 5]. Sum = 1 + 5 = 6. Current max = 6.',
  },
  {
    activeRow: 1,
    completedRows: [0],
    maxRow: 0,
    desc: 'Customer 1: accounts[1] = [7, 3]. Sum = 7 + 3 = 10. 10 > 6 → new max = 10.',
  },
  {
    activeRow: 2,
    completedRows: [0, 1],
    maxRow: 1,
    desc: 'Customer 2: accounts[2] = [3, 5]. Sum = 3 + 5 = 8. 8 < 10 → no update.',
  },
  {
    activeRow: -1,
    completedRows: [0, 1, 2],
    maxRow: 1,
    desc: 'All customers processed. Maximum wealth = 10. Return 10.',
  },
];

const CELL = 44;

export default function RichestCustomerWealthDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const completedSet = new Set(current.completedRows);

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        accounts = [[1,5],[7,3],[3,5]] &nbsp;|&nbsp; Sum each row, return the maximum
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Matrix grid */}
        <div style={{ flex: '0 0 auto' }}>
          {/* Column header */}
          <div style={{ display: 'flex', marginBottom: 2 }}>
            <div style={{ width: 70, fontSize: 10, color: 'var(--dsa-text-muted)' }}>Customer</div>
            {[0, 1].map(c => (
              <div key={c} style={{ width: CELL, textAlign: 'center', fontSize: 10, color: 'var(--dsa-text-muted)' }}>
                Bank {c}
              </div>
            ))}
            <div style={{ width: 60, textAlign: 'center', fontSize: 10, color: 'var(--dsa-text-muted)' }}>Sum</div>
          </div>

          {ACCOUNTS.map((row, r) => {
            const isActive    = r === current.activeRow;
            const isCompleted = completedSet.has(r);
            const isMax       = r === current.maxRow;
            const rowColor = isActive ? AMBER : isMax ? GREEN : isCompleted ? `${GREEN}55` : 'var(--dsa-surface)';
            const borderColor = isActive ? AMBER : isMax ? GREEN : isCompleted ? GREEN : 'var(--dsa-border)';
            return (
              <div key={r} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ width: 70, fontSize: 11, color: isActive || isMax ? (isMax ? GREEN : AMBER) : 'var(--dsa-text-muted)' }}>
                  Customer {r}
                </div>
                {row.map((val, c) => (
                  <div key={c} style={{
                    width: CELL - 2, height: CELL - 2, marginRight: 2, borderRadius: 4,
                    background: rowColor,
                    border: `2px solid ${borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: isActive ? '#fff' : isMax ? '#fff' : isCompleted ? GREEN : 'var(--dsa-text-muted)',
                  }}>
                    {val}
                  </div>
                ))}
                <div style={{
                  width: 54, height: CELL - 2, marginLeft: 6, borderRadius: 4,
                  background: isActive ? AMBER : isMax ? GREEN : 'var(--dsa-surface)',
                  border: `2px solid ${isActive ? AMBER : isMax ? GREEN : 'var(--dsa-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: isActive || isMax ? '#fff' : 'var(--dsa-text-muted)',
                }}>
                  {isActive || isCompleted || isMax ? ROW_SUMS[r] : '?'}
                </div>
              </div>
            );
          })}
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
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {step === 0 ? 'Start' : step === steps.length - 1 ? 'Complete' : `Customer ${current.activeRow}`}
            </div>
            {current.maxRow >= 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--dsa-text-muted)' }}>Max wealth</span>
                <span style={{ fontWeight: 700, color: GREEN }}>{ROW_SUMS[current.maxRow]}</span>
              </div>
            )}
            {step === steps.length - 1 && (
              <div style={{ fontWeight: 700, color: GREEN, marginBottom: 8 }}>Return 10</div>
            )}
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: AMBER, label: 'Current customer (being summed)' },
              { color: GREEN, label: 'Richest customer (max so far)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
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
