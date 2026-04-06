// src/components/DSA/WalkthroughDiagram.tsx
// Example Walkthrough visual for LC 547
// Matches HTML version: adjacency matrix + step-badge rows with mono state spans

import React, { useState } from 'react';

const steps = [
  {
    badge: 'STEP 1',
    text: 'Check city 0. Not visited → start DFS from city 0. Mark 0 as visited.',
    state: 'visited = {0}',
    highlight: [0],          // matrix cells to highlight (flat index)
  },
  {
    badge: 'STEP 2',
    text: 'DFS explores row 0: isConnected[0][1] = 1, city 1 not visited → recurse into city 1. Mark 1 as visited.',
    state: 'visited = {0, 1}',
    highlight: [1],
  },
  {
    badge: 'STEP 3',
    text: 'DFS explores row 1: isConnected[1][0] = 1 but city 0 already visited. isConnected[1][2] = 0. No new cities. DFS backtracks. Back to row 0: isConnected[0][2] = 0. DFS from city 0 complete.',
    state: 'visited = {0, 1}',
    highlight: [3],
  },
  {
    badge: 'STEP 4',
    text: 'Province count = 1. We just consumed Province 1 — cities 0 and 1.',
    state: 'provinces = 1',
    highlight: [],
  },
  {
    badge: 'STEP 5',
    text: 'Check city 1. Already in visited → skip.',
    state: 'visited = {0, 1}',
    highlight: [],
  },
  {
    badge: 'STEP 6',
    text: 'Check city 2. Not visited → start DFS from city 2. Mark 2 as visited. Row 2: isConnected[2][0] = 0, isConnected[2][1] = 0, isConnected[2][2] = 1 (self). No new cities.',
    state: 'visited = {0, 1, 2}',
    highlight: [8],
  },
  {
    badge: 'RESULT',
    text: 'Province count = 2. Province 1 = {0, 1}, Province 2 = {2}. All n=3 cities visited → done. Return 2.',
    state: 'provinces = 2  ✓',
    highlight: [],
  },
];

const matrix = [1,1,0, 1,1,0, 0,0,1];
const isDiag = (i: number) => i % 4 === 0; // 0,4,8

export default function WalkthroughDiagram() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  const cellStyle = (idx: number): React.CSSProperties => {
    const diag = isDiag(idx);
    const connected = matrix[idx] === 1 && !diag;
    const highlighted = step.highlight.includes(idx);
    return {
      width: '44px', height: '44px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '6px',
      border: `1px solid ${
        highlighted  ? 'rgba(245,158,11,0.6)'  :
        diag         ? 'rgba(34,211,238,0.25)' :
        connected    ? 'rgba(74,222,128,0.35)' :
                       'var(--dsa-border)'
      }`,
      background: highlighted  ? 'rgba(245,158,11,0.15)'  :
                  diag         ? 'rgba(34,211,238,0.08)'  :
                  connected    ? 'rgba(74,222,128,0.10)'  :
                                 'var(--dsa-surface2)',
      color: highlighted  ? '#f59e0b' :
             diag         ? '#22d3ee' :
             connected    ? '#4ade80' :
                            'var(--dsa-text-muted)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '14px', fontWeight: 500,
      transition: 'all 0.2s',
    };
  };

  return (
    <div style={{
      background: 'var(--dsa-surface)',
      border: '1px solid var(--dsa-border)',
      borderRadius: '12px',
      overflow: 'hidden',
      margin: '20px 0',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--dsa-surface2)',
        borderBottom: '1px solid var(--dsa-border)',
        padding: '10px 18px',
        display: 'flex', alignItems: 'center', gap: '12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px', color: 'var(--dsa-text-muted)',
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#f87171','#fbbf24','#4ade80'].map(c => (
            <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span>DFS Simulation — isConnected = [[1,1,0],[1,1,0],[0,0,1]]</span>
      </div>

      <div style={{ padding: '20px', display: 'flex', gap: '28px', flexWrap: 'wrap' }}>

        {/* Adjacency matrix */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 700,
            letterSpacing: '1px', textTransform: 'uppercase',
            color: 'var(--dsa-text-muted)', marginBottom: '10px',
          }}>Adjacency Matrix</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gap: '3px' }}>
            {matrix.map((val, i) => (
              <div key={i} style={cellStyle(i)}>{val}</div>
            ))}
          </div>
          {/* Legend */}
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { color: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.35)', label: 'Direct connection (1)' },
              { color: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.25)', label: 'Self / diagonal' },
              { color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.6)',  label: 'Current step focus' },
            ].map(({ color, border, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '11px', color: 'var(--dsa-text-muted)',
                fontFamily: "'JetBrains Mono', monospace" }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px',
                  background: color, border: `1px solid ${border}`, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>
          {/* Row breakdown */}
          <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--dsa-text-dim)',
            fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.8' }}>
            Row 0 → cities: 0✓, 1✓, 2✗<br/>
            Row 1 → cities: 0✓, 1✓, 2✗<br/>
            Row 2 → cities: 0✗, 1✗, 2✓
          </div>
        </div>

        {/* Step walkthrough */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          {/* Step pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
            {steps.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px', fontWeight: 600,
                color: active === i ? 'var(--dsa-accent)' : 'var(--dsa-text-muted)',
                background: active === i ? 'var(--dsa-accent-dim)' : 'var(--dsa-surface2)',
                border: `1px solid ${active === i ? 'rgba(74,222,128,0.3)' : 'var(--dsa-border)'}`,
                borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', transition: 'all .15s',
              }}>{s.badge}</button>
            ))}
          </div>

          {/* Active step content */}
          <div style={{
            background: 'var(--dsa-surface2)',
            border: '1px solid var(--dsa-border)',
            borderRadius: '8px', padding: '16px',
          }}>
            {/* Step badge */}
            <div style={{
              display: 'inline-block',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px', fontWeight: 600,
              color: 'var(--dsa-accent2)',
              background: 'rgba(34,211,238,0.1)',
              border: '1px solid rgba(34,211,238,0.2)',
              borderRadius: '4px', padding: '2px 8px',
              marginBottom: '10px',
            }}>{step.badge}</div>

            {/* Step text — parse bold markers */}
            <p style={{
              fontSize: '14px', color: 'var(--dsa-text-dim)',
              lineHeight: '1.75', marginBottom: '12px',
            }}
              dangerouslySetInnerHTML={{ __html:
                step.text
                  .replace(/isConnected\[(\d+)\]\[(\d+)\]/g,
                    '<code style="font-family:JetBrains Mono,monospace;font-size:12px;color:#22d3ee;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.15);padding:1px 5px;border-radius:3px;">isConnected[$1][$2]</code>')
                  .replace(/\bvisited\b/g,
                    '<code style="font-family:JetBrains Mono,monospace;font-size:12px;color:#22d3ee;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.15);padding:1px 5px;border-radius:3px;">visited</code>')
                  .replace(/\bprovinces\b/g,
                    '<code style="font-family:JetBrains Mono,monospace;font-size:12px;color:#22d3ee;background:rgba(34,211,238,0.07);border:1px solid rgba(34,211,238,0.15);padding:1px 5px;border-radius:3px;">provinces</code>')
                  .replace(/\bdfs\((\w+)\)/g,
                    '<code style="font-family:JetBrains Mono,monospace;font-size:12px;color:#4ade80;background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.15);padding:1px 5px;border-radius:3px;">dfs($1)</code>')
                  .replace(/Province count = (\d+)/g, '<strong style="color:#f1f5f9;">Province count = $1</strong>')
                  .replace(/Return (\d+)/g, '<strong style="color:#4ade80;">Return $1</strong>')
              }}
            />

            {/* State mono badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--dsa-surface)',
              border: '1px solid var(--dsa-border)',
              borderRadius: '5px', padding: '7px 12px',
            }}>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontSize: '9px',
                fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                color: 'var(--dsa-text-muted)',
              }}>state</span>
              <code style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
                color: 'var(--dsa-accent)', background: 'none', border: 'none', padding: 0,
              }}>{step.state}</code>
            </div>
          </div>

          {/* Prev / Next nav */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginTop: '12px',
          }}>
            <button onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                color: 'var(--dsa-text-muted)', background: 'var(--dsa-surface2)',
                border: '1px solid var(--dsa-border)', borderRadius: '5px',
                padding: '4px 10px', cursor: active === 0 ? 'default' : 'pointer',
                opacity: active === 0 ? 0.3 : 1, transition: 'all .15s',
              }}>← Prev</button>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
              color: 'var(--dsa-text-muted)', flex: 1, textAlign: 'center',
            }}>{active + 1} / {steps.length}</span>
            <button onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
              disabled={active === steps.length - 1}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                color: 'var(--dsa-text-muted)', background: 'var(--dsa-surface2)',
                border: '1px solid var(--dsa-border)', borderRadius: '5px',
                padding: '4px 10px', cursor: active === steps.length - 1 ? 'default' : 'pointer',
                opacity: active === steps.length - 1 ? 0.3 : 1, transition: 'all .15s',
              }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
