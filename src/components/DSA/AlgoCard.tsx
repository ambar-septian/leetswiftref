// src/components/DSA/AlgoCard.tsx
// Clickable card linking to an algorithm sub-page.
// Usage:
//   <AlgoCard title="DFS & BFS" description="..." href="/graph/dfs-bfs" time="O(V+E)" space="O(V)" />

import React from 'react';
import Link from '@docusaurus/Link';
import styles from './DSA.module.css';

interface Props {
  title: string;
  description: string;
  href: string;
  time: string;
  space: string;
}

export default function AlgoCard({ title, description, href, time, space }: Props) {
  return (
    <Link to={href} className={styles.algoCard}>
      <div className={styles.algoCardTitle}>{title}</div>
      <div className={styles.algoCardDesc}>{description}</div>
      <div className={styles.algoCardMeta}>
        <div className={styles.algoCardComplexity}>
          <span className={`${styles.algoCardBadge} ${styles.algoCardBadgeTime}`}>{time}</span>
          <span className={`${styles.algoCardBadge} ${styles.algoCardBadgeSpace}`}>{space}</span>
        </div>
        <span className={styles.algoCardArrow}>→</span>
      </div>
    </Link>
  );
}
