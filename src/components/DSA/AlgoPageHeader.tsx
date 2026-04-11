// src/components/DSA/AlgoPageHeader.tsx
// Page header for algorithm sub-pages (e.g. DFS & BFS, Union-Find).
// Shows a breadcrumb, title, description, and complexity badges.
// Usage:
//   <AlgoPageHeader
//     title="DFS & BFS"
//     description="..."
//     category="Graph"
//     categoryHref="/graph"
//     time="O(V+E)"
//     space="O(V)"
//     tags={["Stack", "Queue"]}
//   />

import React from 'react';
import Link from '@docusaurus/Link';
import styles from './DSA.module.css';

interface Props {
  title: string;
  description: string;
  category: string;
  categoryHref: string;
  time: string;
  space: string;
  tags?: string[];
}

export default function AlgoPageHeader({
  title,
  description,
  category,
  categoryHref,
  time,
  space,
  tags = [],
}: Props) {
  return (
    <div className={styles.algoPageHeader}>
      <div className={styles.algoPageBreadcrumb}>
        <Link to={categoryHref}>{category}</Link>
        <span>›</span>
        <span>{title}</span>
      </div>
      <h1 className={styles.algoPageTitle}>{title}</h1>
      <p className={styles.algoPageDesc}>{description}</p>
      <div className={styles.algoPageMeta}>
        <span className={`${styles.algoPageBadge} ${styles.algoPageBadgeTime}`}>
          Time {time}
        </span>
        <span className={`${styles.algoPageBadge} ${styles.algoPageBadgeSpace}`}>
          Space {space}
        </span>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
