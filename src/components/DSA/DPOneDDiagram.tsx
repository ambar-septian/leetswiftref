import React, { useState } from 'react';

// 1D Dynamic Programming — Climbing Stairs (n=6)
// dp[i] = dp[i-1] + dp[i-2]; base cases dp[0]=1, dp[1]=1

const N = 6;
const DP_FINAL = [1, 1, 2, 3, 5, 8, 13]; // dp[0..6]

// Each step reveals one more dp cell and shows which cells contributed
const STEPS: {
  label: string;
  revealed: number;     // how many dp cells revealed (0..N+1)
  highlighted: number[]; // cells actively being used in current computation
  arrow: [number, number] | null;  // [from, to] — which cells contributed
  note: string;
}[] = [
  {
    label: 'Define base cases',
    revealed: 2, highlighted: [0, 1], arrow: null,
    note: 'Base cases: dp[0] = 1 (one way to reach step 0: stand still), dp[1] = 1 (one way to reach step 1: take one step). These seed the recurrence.',
  },
  {
    label: 'Compute dp[2]',
    revealed: 3, highlighted: [0, 1, 2], arrow: [1, 2],
    note: 'dp[2] = dp[1] + dp[0] = 1 + 1 = 2. From step 2 you could have come from step 1 (one-step) or step 0 (two-step).',
  },
  {
    label: 'Compute dp[3]',
    revealed: 4, highlighted: [1, 2, 3], arrow: [2, 3],
    note: 'dp[3] = dp[2] + dp[1] = 2 + 1 = 3. The pattern is identical to Fibonacci: every stair combines the ways from the previous two stairs.',
  },
  {
    label: 'Compute dp[4]',
    revealed: 5, highlighted: [2, 3, 4], arrow: [3, 4],
    note: 'dp[4] = dp[3] + dp[2] = 3 + 2 = 5.',
  },
  {
    label: 'Compute dp[5]',
    revealed: 6, highlighted: [3, 4, 5], arrow: [4, 5],
    note: 'dp[5] = dp[4] + dp[3] = 5 + 3 = 8.',
  },
  {
    label: 'Compute dp[6] — answer',
    revealed: 7, highlighted: [4, 5, 6], arrow: [5, 6],
    note: 'dp[6] = dp[5] + dp[4] = 8 + 5 = 13. There are 13 distinct ways to climb 6 stairs. Space can be optimised to O(1) by keeping only the last two values.',
  },
];

const accent = '#6366f1';
const green = '#22c55e';
const amber = '#f59e0b';

export default function DPOneDDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  const highlightSet = new Set(s.highlighted);

  const cellBg = (i: number) => {
    if (i >= s.revealed) return '#111827';
    if (i === s.revealed - 1) return '#1e1b4b';
    return '#1f2937';
  };

  const cellBorder = (i: number) => {
    if (i >= s.revealed) return '2px dashed #374151';
    if (highlightSet.has(i) && i === s.revealed - 1) return `2px solid ${accent}`;
    if (highlightSet.has(i)) return `2px solid ${green}`;
    return '2px solid #374151';
  };

  const cellText = (i: number) => {
    if (i >= s.revealed) return '?';
    return String(DP_FINAL[i]);
  };

  const cellTextColor = (i: number) => {
    if (i >= s.revealed) return '#374151';
    if (i === s.revealed - 1) return '#a5b4fc';
    if (highlightSet.has(i)) return '#86efac';
    return '#9ca3af';
  };

  return (
    <div style={{ fontFamily: 'monospace', background: '#111827', borderRadius: 12, padding: 24, margin: '16px 0', color: '#f9fafb' }}>
      <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
        1D Dynamic Programming — Climbing Stairs (n = 6)
      </div>

      {/* DP table */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>dp[i] = number of ways to reach stair i</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Array.from({ length: N + 1 }, (_, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 10,
                background: cellBg(i),
                border: cellBorder(i),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700,
                color: cellTextColor(i),
                transition: 'all 0.3s',
              }}>{cellText(i)}</div>
              <div style={{ fontSize: 11, color: '#4b5563', marginTop: 4 }}>dp[{i}]</div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow showing contribution */}
      {s.arrow && (
        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16, marginTop: 8 }}>
          <span style={{ color: '#86efac' }}>dp[{s.arrow[0] - 1}]</span>
          <span style={{ color: '#6b7280' }}> + </span>
          <span style={{ color: '#86efac' }}>dp[{s.arrow[0]}]</span>
          <span style={{ color: '#6b7280' }}> → </span>
          <span style={{ color: '#a5b4fc' }}>dp[{s.arrow[1]}] = {DP_FINAL[s.arrow[1]]}</span>
        </div>
      )}

      {/* Recurrence */}
      <div style={{
        background: '#1f2937', borderRadius: 8, padding: '10px 14px',
        fontSize: 13, color: '#d1d5db', lineHeight: 1.6, marginBottom: 16,
        fontFamily: 'monospace',
      }}>
        <span style={{ color: '#6b7280' }}>// Recurrence: </span>
        <span style={{ color: '#a5b4fc' }}>dp[i] = dp[i-1] + dp[i-2]</span>
        <br />
        <span style={{ color: '#6b7280' }}>// Base cases: </span>
        <span style={{ color: '#86efac' }}>dp[0] = 1, dp[1] = 1</span>
      </div>

      {/* Note */}
      <div style={{
        background: '#1f2937', borderRadius: 8, padding: '10px 14px',
        fontSize: 13, color: '#d1d5db', lineHeight: 1.5, marginBottom: 16,
        borderLeft: `3px solid ${amber}`,
      }}>
        {s.note}
      </div>

      {/* Space optimisation hint */}
      {step === STEPS.length - 1 && (
        <div style={{
          background: '#064e3b', border: `1px solid ${green}`,
          borderRadius: 8, padding: '8px 14px', fontSize: 12,
          color: '#86efac', marginBottom: 16,
        }}>
          Space optimised: keep only <code style={{ background: 'transparent' }}>prev2</code> and <code style={{ background: 'transparent' }}>prev1</code>, update each iteration — O(1) space.
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === 0 ? '#374151' : accent, color: step === 0 ? '#6b7280' : '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          ← Prev</button>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Step {step + 1} / {STEPS.length} — {s.label}</span>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: step === STEPS.length - 1 ? '#374151' : accent, color: step === STEPS.length - 1 ? '#6b7280' : '#fff', cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 13 }}>
          Next →</button>
      </div>
    </div>
  );
}
