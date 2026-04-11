// src/components/DSA/AlgoCardGrid.tsx
// Wrapper that applies the CSS module algoGrid layout to AlgoCard children.
// Usage in MDX:
//   <AlgoCardGrid>
//     <AlgoCard ... />
//     <AlgoCard ... />
//   </AlgoCardGrid>

import React from 'react';
import styles from './DSA.module.css';

interface Props {
  children: React.ReactNode;
}

export default function AlgoCardGrid({ children }: Props) {
  return <div className={styles.algoGrid}>{children}</div>;
}
