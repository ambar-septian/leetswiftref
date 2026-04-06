import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// 6-bucket hash set, hash(key) = key % 6
// Operations: add(1), add(7), add(13), contains(7)→true, remove(7), contains(7)→false

type BucketNode = { val: number; highlight?: 'active' | 'found' | 'removed' };
type BucketState = (BucketNode[] | null);

const steps: {
  label: string;
  op: string;
  opResult?: string;
  buckets: BucketState[];
  description: string;
}[] = [
  {
    label: 'Initial state',
    op: '',
    buckets: [null, null, null, null, null, null],
    description: 'Empty hash set. 6 buckets, each is null (no linked list yet). hash(key) = key % 6.',
  },
  {
    label: 'add(1)',
    op: 'add(1)',
    buckets: [null, [{ val: 1, highlight: 'active' }], null, null, null, null],
    description: 'hash(1)=1%6=1. Bucket 1 is empty → create dummy head, append node(1). Bucket 1: [dummy]→1',
  },
  {
    label: 'add(7)',
    op: 'add(7)',
    buckets: [null, [{ val: 1 }, { val: 7, highlight: 'active' }], null, null, null, null],
    description: 'hash(7)=7%6=1. Bucket 1 already has a chain. Scan to end — no duplicate — append node(7). Bucket 1: [dummy]→1→7',
  },
  {
    label: 'add(13)',
    op: 'add(13)',
    buckets: [null, [{ val: 1 }, { val: 7 }, { val: 13, highlight: 'active' }], null, null, null, null],
    description: 'hash(13)=13%6=1. Scan chain — no duplicate — append node(13). Bucket 1: [dummy]→1→7→13',
  },
  {
    label: 'contains(7) → true',
    op: 'contains(7)',
    opResult: 'true',
    buckets: [null, [{ val: 1 }, { val: 7, highlight: 'found' }, { val: 13 }], null, null, null, null],
    description: 'hash(7)=1. Scan bucket 1: skip dummy, skip 1, find 7 → return true.',
  },
  {
    label: 'remove(7)',
    op: 'remove(7)',
    buckets: [null, [{ val: 1 }, { val: 7, highlight: 'removed' }, { val: 13 }], null, null, null, null],
    description: 'hash(7)=1. Find predecessor of 7 (node 1), splice out 7: prev.next = node(7).next. Bucket 1: [dummy]→1→13',
  },
  {
    label: 'contains(7) → false',
    op: 'contains(7)',
    opResult: 'false',
    buckets: [null, [{ val: 1 }, { val: 13 }], null, null, null, null],
    description: 'hash(7)=1. Scan bucket 1: 1, 13 — 7 not found → return false.',
  },
];

const BUCKET_COUNT = 6;

export default function DesignHashSetDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  function nodeColor(h: BucketNode['highlight']): string {
    if (h === 'active') return ACCENT2;
    if (h === 'found') return GREEN;
    if (h === 'removed') return RED;
    return 'var(--dsa-surface)';
  }

  function nodeTextColor(h: BucketNode['highlight']): string {
    if (h) return '#fff';
    return 'var(--dsa-text-muted)';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        MyHashSet &nbsp;|&nbsp; 6-bucket chaining — hash(key) = key % 6
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Bucket visualisation */}
        <div style={{ flex: '0 0 auto' }}>
          {Array.from({ length: BUCKET_COUNT }, (_, b) => {
            const chain = current.buckets[b];
            return (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                {/* Bucket index */}
                <div style={{
                  width: 28, height: 28, borderRadius: 4,
                  background: 'var(--dsa-surface)',
                  border: '1px solid var(--dsa-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'var(--dsa-text-muted)', fontWeight: 700,
                }}>
                  [{b}]
                </div>
                {/* Dummy head */}
                {chain && (
                  <>
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                    <div style={{
                      width: 36, height: 28, borderRadius: 4,
                      background: 'var(--dsa-surface)',
                      border: '1px dashed var(--dsa-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: 'var(--dsa-text-muted)',
                    }}>
                      dummy
                    </div>
                  </>
                )}
                {/* Chain nodes */}
                {chain && chain.map((node, i) => (
                  <React.Fragment key={i}>
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                    <div style={{
                      width: 32, height: 28, borderRadius: 4,
                      background: nodeColor(node.highlight),
                      border: `1px solid ${node.highlight === 'found' ? GREEN : node.highlight === 'removed' ? RED : node.highlight === 'active' ? ACCENT2 : 'var(--dsa-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                      color: nodeTextColor(node.highlight),
                      textDecoration: node.highlight === 'removed' ? 'line-through' : undefined,
                    }}>
                      {node.val}
                    </div>
                  </React.Fragment>
                ))}
                {!chain && (
                  <>
                    <div style={{ width: 8, height: 2, background: 'var(--dsa-border)' }} />
                    <span style={{ fontSize: 11, color: 'var(--dsa-text-muted)' }}>null</span>
                  </>
                )}
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
              {current.op ? (
                <>
                  <span style={{ color: ACCENT2 }}>{current.op}</span>
                  {current.opResult && (
                    <span style={{ color: current.opResult === 'true' ? GREEN : RED }}>
                      {' '}→ {current.opResult}
                    </span>
                  )}
                </>
              ) : current.label}
            </div>
            <div style={{ color: 'var(--dsa-text-muted)', lineHeight: 1.6 }}>
              {current.description}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 11 }}>
            {[
              { color: ACCENT2, label: 'Newly inserted node' },
              { color: GREEN, label: 'Node found (contains)' },
              { color: RED, label: 'Node being removed' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                <span style={{ color: 'var(--dsa-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === 0 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === 0 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>← Prev</button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: step === steps.length - 1 ? 'var(--dsa-surface)' : ACCENT2,
            color: step === steps.length - 1 ? 'var(--dsa-text-muted)' : '#fff',
            cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13,
          }}>Next →</button>
        <button onClick={() => setStep(0)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid var(--dsa-border)',
            background: 'var(--dsa-surface)', color: 'var(--dsa-text-muted)',
            cursor: 'pointer', fontSize: 13,
          }}>Reset</button>
      </div>
    </div>
  );
}
