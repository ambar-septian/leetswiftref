// src/components/DSA/ComplexityTable.tsx
// Usage: <ComplexityTable rows={[{approach:"DFS", time:"O(n²)", space:"O(n)", note:"..."}]} />

import React from 'react';
import styles from './DSA.module.css';

interface Row {
  approach: string;
  time: string;
  space: string;
  note?: string;
  highlight?: boolean; // marks the approach used in the solution
}

interface Props {
  rows: Row[];
}

export default function ComplexityTable({ rows }: Props) {
  return (
    <div className={styles.complexityWrap}>
      <div className={styles.complexityCards}>
        <div className={styles.complexityCard}>
          <div className={styles.complexityLabel}>Time</div>
          <div className={styles.complexityValue} style={{ color: 'var(--dsa-accent)' }}>
            {rows.find(r => r.highlight)?.time ?? rows[0].time}
          </div>
        </div>
        <div className={styles.complexityCard}>
          <div className={styles.complexityLabel}>Space</div>
          <div className={styles.complexityValue} style={{ color: 'var(--dsa-accent2)' }}>
            {rows.find(r => r.highlight)?.space ?? rows[0].space}
          </div>
        </div>
      </div>

      <table className={styles.complexityTable}>
        <thead>
          <tr>
            <th>Approach</th>
            <th>Time</th>
            <th>Space</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.approach} className={row.highlight ? styles.highlightRow : ''}>
              <td>
                {row.highlight && <span className={styles.usedBadge}>used</span>}
                {row.approach}
              </td>
              <td style={{ color: 'var(--dsa-accent)', fontFamily: 'var(--ifm-font-family-monospace)' }}>{row.time}</td>
              <td style={{ color: 'var(--dsa-accent2)', fontFamily: 'var(--ifm-font-family-monospace)' }}>{row.space}</td>
              <td style={{ fontSize: '12px', color: 'var(--dsa-text-muted)', fontStyle: 'italic' }}>{row.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
