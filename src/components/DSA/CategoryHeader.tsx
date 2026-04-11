// src/components/DSA/CategoryHeader.tsx
// Page header for category index pages (e.g. Graph, Sliding Window).
// Usage:
//   <CategoryHeader emoji="🕸" title="Graph" description="..." tags={[...]} />

import React from 'react';
import styles from './DSA.module.css';

interface Props {
  emoji: string;
  title: string;
  description: string;
  tags?: string[];
}

export default function CategoryHeader({ emoji, title, description, tags = [] }: Props) {
  return (
    <div className={styles.categoryHeader}>
      <div className={styles.categoryMeta}>
        <span className={styles.categoryEmoji}>{emoji}</span>
        <h1 className={styles.categoryTitle}>{title}</h1>
      </div>
      <p className={styles.categoryDesc}>{description}</p>
      {tags.length > 0 && (
        <div className={styles.categoryTagsRow}>
          {tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
