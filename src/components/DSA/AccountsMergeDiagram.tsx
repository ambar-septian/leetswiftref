import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';

// accounts = [
//   ["John", "john@a.com", "john@b.com"],   // account 0
//   ["John", "john@a.com", "john@c.com"],   // account 1 (shares john@a.com → merge with 0)
//   ["Mary", "mary@a.com"],                  // account 2 (standalone)
// ]
// Phase 1: emailToAccIndex: john@a.com→0, john@b.com→0, john@c.com→1 → unite(1,0)
// Phase 2: john@a.com→parent(0)=0, john@b.com→0, john@c.com→parent(1)=0
//   group[0] = [john@a.com, john@b.com, john@c.com] + sorted
// Phase 3: mary@a.com→parent(2)=2
//   group[2] = [mary@a.com]

const steps = [
  {
    label: 'Initial accounts',
    parent: [0, 1, 2],
    emailMap: {} as Record<string, number>,
    groups: {} as Record<number, string[]>,
    highlight: -1,
    desc: 'Three accounts. Account 0 and 1 both belong to "John". Account 2 belongs to "Mary". Goal: merge accounts sharing any email.',
  },
  {
    label: 'Process account 0',
    parent: [0, 1, 2],
    emailMap: { 'john@a.com': 0, 'john@b.com': 0 },
    groups: {} as Record<number, string[]>,
    highlight: 0,
    desc: 'Scan account 0 emails. john@a.com → map to 0. john@b.com → map to 0. No unites yet.',
  },
  {
    label: 'Process account 1 — shared email!',
    parent: [0, 0, 2],
    emailMap: { 'john@a.com': 0, 'john@b.com': 0, 'john@c.com': 1 },
    groups: {} as Record<number, string[]>,
    highlight: 1,
    desc: 'Scan account 1. john@a.com already in map at index 0 → unite(1, 0). parent[1]=0. john@c.com → map to 1.',
  },
  {
    label: 'Process account 2',
    parent: [0, 0, 2],
    emailMap: { 'john@a.com': 0, 'john@b.com': 0, 'john@c.com': 1, 'mary@a.com': 2 },
    groups: {} as Record<number, string[]>,
    highlight: 2,
    desc: 'Scan account 2. mary@a.com → map to 2. No shared emails — account 2 stays separate.',
  },
  {
    label: 'Group emails by root',
    parent: [0, 0, 2],
    emailMap: { 'john@a.com': 0, 'john@b.com': 0, 'john@c.com': 1, 'mary@a.com': 2 },
    groups: { 0: ['john@a.com', 'john@b.com', 'john@c.com'], 2: ['mary@a.com'] },
    highlight: -1,
    desc: 'For each email, find its root via find(). john@c.com → find(1) = 0 (path compressed). All three John emails → root 0. mary@a.com → root 2.',
  },
  {
    label: 'Result',
    parent: [0, 0, 2],
    emailMap: {} as Record<string, number>,
    groups: { 0: ['john@a.com', 'john@b.com', 'john@c.com'], 2: ['mary@a.com'] },
    highlight: -1,
    desc: 'Sort emails per group, prepend account name. Result: [["John","john@a.com","john@b.com","john@c.com"], ["Mary","mary@a.com"]].',
  },
];

export default function AccountsMergeDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  const accounts = [
    { name: 'John', emails: ['john@a.com', 'john@b.com'] },
    { name: 'John', emails: ['john@a.com', 'john@c.com'] },
    { name: 'Mary', emails: ['mary@a.com'] },
  ];

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        3 accounts &nbsp;|&nbsp; Union-Find merges accounts sharing an email
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Accounts panel */}
        <div style={{ flex: '0 0 auto' }}>
          {accounts.map((acc, i) => (
            <div key={i} style={{
              marginBottom: 8,
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${current.highlight === i ? AMBER : 'var(--dsa-border)'}`,
              background: current.highlight === i ? 'rgba(245,158,11,0.08)' : 'var(--dsa-surface)',
              fontSize: 12,
            }}>
              <div style={{ fontWeight: 700, color: current.highlight === i ? AMBER : ACCENT2, marginBottom: 4 }}>
                Account {i}: {acc.name}
                <span style={{ fontWeight: 400, color: 'var(--dsa-text-muted)', marginLeft: 8 }}>
                  parent[{i}]={current.parent[i]}
                </span>
              </div>
              {acc.emails.map(email => (
                <div key={email} style={{
                  color: current.emailMap[email] !== undefined ? GREEN : 'var(--dsa-text-muted)',
                  fontSize: 11,
                }}>
                  {email}
                  {current.emailMap[email] !== undefined && (
                    <span style={{ color: 'var(--dsa-text-muted)', marginLeft: 4 }}>
                      → acc {current.emailMap[email]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Union-Find parent array */}
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--dsa-text-muted)' }}>
            parent: [{current.parent.join(', ')}]
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
            <div style={{ fontWeight: 700, color: AMBER, marginBottom: 6 }}>
              {current.label}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.desc}
            </div>
          </div>

          {Object.keys(current.groups).length > 0 && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--dsa-surface)', border: `1px solid ${GREEN}`, borderRadius: 8, fontSize: 11 }}>
              <div style={{ color: GREEN, fontWeight: 700, marginBottom: 4 }}>Merged groups:</div>
              {Object.entries(current.groups).map(([root, emails]) => {
                const name = accounts[parseInt(root)].name;
                return (
                  <div key={root} style={{ marginBottom: 6 }}>
                    <div style={{ color: GREEN, fontWeight: 700 }}>{name}</div>
                    {emails.sort().map(e => (
                      <div key={e} style={{ color: 'var(--dsa-text-muted)', paddingLeft: 8 }}>{e}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
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
