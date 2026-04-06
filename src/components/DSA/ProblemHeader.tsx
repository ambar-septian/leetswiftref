// src/components/DSA/ProblemHeader.tsx

import React from 'react';
import styles from './DSA.module.css';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Props {
  number: number;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  tags: string[];
  leetcodeUrl: string;
}

export default function ProblemHeader({ number, title, difficulty, pattern, tags, leetcodeUrl }: Props) {
  const diffClass = { Easy: styles.diffEasy, Medium: styles.diffMedium, Hard: styles.diffHard }[difficulty];
  const words = title.split(' ');
  const firstWord = words[0];
  const rest = words.slice(1).join(' ');

  return (
    <div className={styles.problemHeader}>
      <div className={styles.metaRow}>
        <span className={styles.problemNumber}>#{number}</span>
        <span className={`${styles.diffBadge} ${diffClass}`}>{difficulty}</span>
        <span className={styles.patternBadge}>{pattern}</span>
        <a
          href={leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.leetcodeLink}
        >
          LeetCode ↗
        </a>
      </div>
      <h1 className={styles.problemTitle}>
        <span className={styles.problemTitleAccent}>{firstWord}</span>
        {rest ? ` ${rest}` : ''}
      </h1>
      <div className={styles.tagsRow}>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
