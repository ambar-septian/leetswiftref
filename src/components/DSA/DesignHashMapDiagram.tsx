import React, { useState } from 'react';

const AMBER = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const GREEN = '#22c55e';
const RED = '#ef4444';

// 6-bucket hash map, hash(key) = key % 6
// Operations: put(1,10), put(7,70), get(1)→10, put(1,20) [update], get(1)→20, remove(7), get(7)→-1

type KVNode = { key: number; val: number; highlight?: 'active' | 'found' | 'updated' | 'removed' };
type BucketState = (KVNode[] | null);

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
    description: 'Empty hash map. 6 buckets, each is null. hash(key) = key % 6. Each node stores key and value.',
  },
  {
    label: 'put(1, 10)',
    op: 'put(1, 10)',
    buckets: [null, [{ key: 1, val: 10, highlight: 'active' }], null, null, null, null],
    description: 'hash(1)=1. Bucket 1 empty → create dummy, append (1:10). Bucket 1: [dummy]→(1:10)',
  },
  {
    label: 'put(7, 70)',
    op: 'put(7, 70)',
    buckets: [null, [{ key: 1, val: 10 }, { key: 7, val: 70, highlight: 'active' }], null, null, null, null],
    description: 'hash(7)=1. Scan bucket 1 — key 7 not found — append (7:70). Bucket 1: [dummy]→(1:10)→(7:70)',
  },
  {
    label: 'get(1) → 10',
    op: 'get(1)',
    opResult: '10',
    buckets: [null, [{ key: 1, val: 10, highlight: 'found' }, { key: 7, val: 70 }], null, null, null, null],
    description: 'hash(1)=1. Scan bucket 1 — find key=1 → return val=10.',
  },
  {
    label: 'put(1, 20) — update',
    op: 'put(1, 20)',
    buckets: [null, [{ key: 1, val: 20, highlight: 'updated' }, { key: 7, val: 70 }], null, null, null, null],
    description: 'hash(1)=1. Scan bucket 1 — find key=1 (already exists) — update val to 20 in place. Return.',
  },
  {
    label: 'get(1) → 20',
    op: 'get(1)',
    opResult: '20',
    buckets: [null, [{ key: 1, val: 20, highlight: 'found' }, { key: 7, val: 70 }], null, null, null, null],
    description: 'hash(1)=1. Scan bucket 1 — find key=1 → return updated val=20.',
  },
  {
    label: 'remove(7)',
    op: 'remove(7)',
    buckets: [null, [{ key: 1, val: 20 }, { key: 7, val: 70, highlight: 'removed' }], null, null, null, null],
    description: 'hash(7)=1. Find predecessor of key=7 (node 1), splice out: prev.next = node.next. Bucket 1: [dummy]→(1:20)',
  },
  {
    label: 'get(7) → -1',
    op: 'get(7)',
    opResult: '-1',
    buckets: [null, [{ key: 1, val: 20 }], null, null, null, null],
    description: 'hash(7)=1. Scan bucket 1 — only key=1, not 7 → return -1 (not found).',
  },
];

const BUCKET_COUNT = 6;

export default function DesignHashMapDiagram() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  function nodeColor(h: KVNode['highlight']): string {
    if (h === 'active') return ACCENT2;
    if (h === 'found') return GREEN;
    if (h === 'updated') return AMBER;
    if (h === 'removed') return RED;
    return 'var(--dsa-surface)';
  }

  function nodeTextColor(h: KVNode['highlight']): string {
    if (h) return '#fff';
    return 'var(--dsa-text-muted)';
  }

  function borderColor(h: KVNode['highlight']): string {
    if (h === 'active') return ACCENT2;
    if (h === 'found') return GREEN;
    if (h === 'updated') return AMBER;
    if (h === 'removed') return RED;
    return 'var(--dsa-border)';
  }

  return (
    <div style={{ fontFamily: 'monospace', margin: '16px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--dsa-text-muted)', marginBottom: 8 }}>
        MyHashMap &nbsp;|&nbsp; 6-bucket chaining — hash(key) = key % 6
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
                      width: 40, height: 28, borderRadius: 4,
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
                      minWidth: 50, height: 28, borderRadius: 4,
                      background: nodeColor(node.highlight),
                      border: `1px solid ${borderColor(node.highlight)}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, paddingInline: 4,
                      color: nodeTextColor(node.highlight),
                      textDecoration: node.highlight === 'removed' ? 'line-through' : undefined,
                    }}>
                      {node.key}:{node.val}
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
                    <span style={{ color: current.opResult === '-1' ? RED : GREEN }}>
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
              { color: GREEN, label: 'Node found (get)' },
              { color: AMBER, label: 'Node updated in place (put)' },
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
