// src/components/DSA/SectionHeader.tsx
// Renders the numbered green badge + section title, matching the HTML version's
// .section-header / .section-num / .section-title pattern.
//
// Usage in MDX (replaces plain ## headings for main sections):
//   <SectionHeader n={1} title="Problem Overview" />

import React from 'react';
import styles from './DSA.module.css';

interface Props {
  n: number;    // section number e.g. 1 → "01"
  title: string;
}

export default function SectionHeader({ n, title }: Props) {
  const num = String(n).padStart(2, '0');
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionNum}>{num}</div>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  );
}
