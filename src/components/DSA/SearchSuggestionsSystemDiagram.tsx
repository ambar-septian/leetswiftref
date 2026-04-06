import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// products = ["mobile","mouse","moneypot","monitor","mousepad"]
// sorted   = ["mobile","moneypot","monitor","mouse","mousepad"]
// searchWord = "mouse"
// For each prefix, trie returns up to 3 lexicographically smallest matches

const SORTED = ['mobile', 'moneypot', 'monitor', 'mouse', 'mousepad'];

type Step = {
  prefix: string;
  activeChar: string;
  matchIndices: number[];   // indices in SORTED that start with prefix
  suggestions: string[];
  desc: string;
};

const steps: Step[] = [
  {
    prefix: '',
    activeChar: '',
    matchIndices: [0, 1, 2, 3, 4],
    suggestions: [],
    desc: 'Trie built from sorted products. Each node stores up to 3 lexicographic suggestions. Start traversing searchWord "mouse" character by character.',
  },
  {
    prefix: 'm',
    activeChar: 'm',
    matchIndices: [0, 1, 2, 3, 4],
    suggestions: ['mobile', 'moneypot', 'monitor'],
    desc: 'Prefix "m" — all 5 products match. Take first 3: ["mobile","moneypot","monitor"].',
  },
  {
    prefix: 'mo',
    activeChar: 'o',
    matchIndices: [0, 1, 2, 3, 4],
    suggestions: ['mobile', 'moneypot', 'monitor'],
    desc: 'Prefix "mo" — all 5 still match (all start with "mo"). Suggestions unchanged: ["mobile","moneypot","monitor"].',
  },
  {
    prefix: 'mou',
    activeChar: 'u',
    matchIndices: [3, 4],
    suggestions: ['mouse', 'mousepad'],
    desc: 'Prefix "mou" — only "mouse" and "mousepad" match. Suggestions: ["mouse","mousepad"].',
  },
  {
    prefix: 'mous',
    activeChar: 's',
    matchIndices: [3, 4],
    suggestions: ['mouse', 'mousepad'],
    desc: 'Prefix "mous" — same two products match. Suggestions: ["mouse","mousepad"].',
  },
  {
    prefix: 'mouse',
    activeChar: 'e',
    matchIndices: [3, 4],
    suggestions: ['mouse', 'mousepad'],
    desc: 'Prefix "mouse" — "mouse" (exact match) and "mousepad" both qualify. Return ["mouse","mousepad"].',
  },
];

const SEARCH_WORD = 'mouse';

export default function SearchSuggestionsSystemDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const matchSet = new Set(current.matchIndices);

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        products = ["mobile","mouse","moneypot","monitor","mousepad"] &nbsp;|&nbsp; searchWord = "mouse"
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Left: sorted list + trie char path */}
        <div style={{ flex: '0 0 auto', minWidth: 200 }}>
          {/* Search word with current prefix highlighted */}
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 6,
            padding: '6px 10px',
            marginBottom: 10,
            fontSize: 13,
            letterSpacing: 2,
          }}>
            {SEARCH_WORD.split('').map((ch, i) => (
              <span key={i} style={{
                color: i < current.prefix.length
                  ? (i === current.prefix.length - 1 ? AMBER : GREEN)
                  : 'var(--dsa-text-muted)',
                fontWeight: i < current.prefix.length ? 700 : 400,
              }}>{ch}</span>
            ))}
            <span style={{ fontSize: 10, color: 'var(--dsa-text-muted)', marginLeft: 8 }}>
              prefix: "{current.prefix || '—'}"
            </span>
          </div>

          {/* Sorted products */}
          <div style={{ fontSize: 11, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>Sorted products:</div>
          {SORTED.map((p, i) => {
            const isMatch = matchSet.has(i);
            const isSuggestion = current.suggestions.includes(p);
            return (
              <div key={p} style={{
                padding: '4px 10px',
                borderRadius: 4,
                marginBottom: 3,
                fontSize: 12,
                fontWeight: isMatch ? 700 : 400,
                background: isSuggestion ? `${GREEN}22` : isMatch ? `${AMBER}18` : 'var(--dsa-surface)',
                border: `1px solid ${isSuggestion ? GREEN : isMatch ? AMBER : 'var(--dsa-border)'}`,
                color: isSuggestion ? GREEN : isMatch ? AMBER : 'var(--dsa-text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>
                  {/* highlight matched prefix inside product */}
                  <span style={{ color: isSuggestion ? GREEN : isMatch ? AMBER : 'var(--dsa-text-muted)' }}>
                    {p.slice(0, current.prefix.length)}
                  </span>
                  <span style={{ opacity: 0.6 }}>{p.slice(current.prefix.length)}</span>
                </span>
                {isSuggestion && (
                  <span style={{ fontSize: 9, marginLeft: 6, background: GREEN, color: '#fff', borderRadius: 3, padding: '1px 4px' }}>
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: info panel */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{
            background: 'var(--dsa-surface)',
            border: '1px solid var(--dsa-border)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {step === 0 ? 'Trie built — start search' : `After typing "${current.prefix}"`}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6, fontSize: 11 }}>
              {current.desc}
            </div>
            {current.suggestions.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--dsa-text-muted)', marginBottom: 4 }}>Suggestions:</div>
                {current.suggestions.map((s, i) => (
                  <div key={s} style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: GREEN,
                    padding: '2px 0',
                    borderBottom: i < current.suggestions.length - 1 ? '1px solid var(--dsa-border)' : 'none',
                  }}>
                    [{i}] {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: GREEN, label: 'Returned as suggestion' },
              { color: AMBER, label: 'Matches current prefix' },
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
