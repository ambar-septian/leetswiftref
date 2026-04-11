// src/components/DSA/ProblemList.tsx
// Compact problem list replacing Docusaurus generated-index cards.
// Usage:
//   <ProblemList problems={[{ id: 133, title: "Clone Graph", slug: "clone-graph", category: "graph", difficulty: "Medium" }]} />

import React from 'react';
import Link from '@docusaurus/Link';
import styles from './DSA.module.css';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Problem {
  id: number;
  title: string;
  slug: string;      // e.g. 'clone-graph'
  category: string;  // e.g. 'graph'
  difficulty: Difficulty;
}

interface Props {
  problems: Problem[];
}

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy:   'var(--dsa-accent)',
  Medium: 'var(--dsa-accent3)',
  Hard:   'var(--dsa-red)',
};

export default function ProblemList({ problems }: Props) {
  return (
    <div className={styles.problemList}>
      {problems.map(p => (
        <Link
          key={p.id}
          to={`/${p.category}/${p.id}-${p.slug}`}
          className={styles.problemListItem}
        >
          <span className={styles.problemListNum}>{p.id}</span>
          <span className={styles.problemListTitle}>{p.title}</span>
          <span
            className={styles.problemListDiff}
            style={{ color: DIFF_COLOR[p.difficulty] }}
          >
            {p.difficulty}
          </span>
        </Link>
      ))}
    </div>
  );
}
