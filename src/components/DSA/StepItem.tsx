// src/components/DSA/StepItem.tsx
// Renders a numbered step with bold inline title + description as ONE visual block.
// Usage in MDX:
//   <StepItem title="Initialise visited array">
//     Size `n`, all `false`. Prevents revisiting cities...
//   </StepItem>

import React from 'react';
import styles from './DSA.module.css';

interface Props {
  title: string;
  children: React.ReactNode;
  n?: number; // optional manual number override
}

export default function StepItem({ title, children }: Props) {
  return (
    <div className={styles.stepItem}>
      <div className={styles.stepItemContent}>
        <strong className={styles.stepItemTitle}>{title} — </strong>
        <span className={styles.stepItemBody}>{children}</span>
      </div>
    </div>
  );
}
