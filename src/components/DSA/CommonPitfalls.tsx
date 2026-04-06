// src/components/DSA/CommonPitfalls.tsx
// Reusable pitfalls section. Each pitfall has a title, description, and fix.
// Usage:
//   <CommonPitfalls pitfalls={[{ title, body, fix }]} />

import React from 'react';
import styles from './DSA.module.css';

interface Pitfall {
  title: string;
  body: string;       // supports innerHTML
  fix: string;        // supports innerHTML
}

interface Props {
  pitfalls: Pitfall[];
}

export default function CommonPitfalls({ pitfalls }: Props) {
  return (
    <div className={styles.pitfallList}>
      {pitfalls.map((p, i) => (
        <div key={i} className={styles.pitfall}>
          <div className={styles.pitfallIcon}>✕{String(i + 1).padStart(2, '0')}</div>
          <div className={styles.pitfallContent}>
            <div className={styles.pitfallTitle}>{p.title}</div>
            <div
              className={styles.pitfallBody}
              dangerouslySetInnerHTML={{ __html: p.body }}
            />
            <div
              className={styles.pitfallFix}
              dangerouslySetInnerHTML={{ __html: `<strong>Fix:</strong> ${p.fix}` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
