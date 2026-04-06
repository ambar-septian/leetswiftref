// src/components/DSA/Callout.tsx
// Replicates the HTML .callout exactly — dark surface bg, colored left border,
// label color matches border color. Replaces Docusaurus :::tip / :::info admonitions
// which can't be reliably styled to match.
//
// Usage:
//   <Callout type="green" label="Core Insight">...</Callout>
//   <Callout type="cyan" label="Why DFS works">...</Callout>
//   <Callout type="amber" label="Key Constraint">...</Callout>
//   <Callout type="purple" label="Note">...</Callout>

import React from 'react';
import styles from './DSA.module.css';

type CalloutType = 'green' | 'cyan' | 'amber' | 'purple' | 'red';

interface Props {
  type?: CalloutType;
  label: string;
  children: React.ReactNode;
}

export default function Callout({ type = 'green', label, children }: Props) {
  const typeClass = {
    green:  styles.calloutGreen,
    cyan:   styles.calloutCyan,
    amber:  styles.calloutAmber,
    purple: styles.calloutPurple,
    red:    styles.calloutRed,
  }[type];

  return (
    <div className={`${styles.callout} ${typeClass}`}>
      <div className={styles.calloutLabel}>{label}</div>
      <div className={styles.calloutBody}>{children}</div>
    </div>
  );
}
