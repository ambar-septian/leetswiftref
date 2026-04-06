// src/components/DSA/StepList.tsx
// Wraps a group of StepItems and injects auto-incrementing numbers.
// Usage in MDX:
//   <StepList>
//     <StepItem title="Initialise visited array">...</StepItem>
//     <StepItem title="Outer loop">...</StepItem>
//   </StepList>

import React from 'react';
import styles from './DSA.module.css';

interface Props {
  children: React.ReactNode;
}

export default function StepList({ children }: Props) {
  // Clone each child and inject an auto-incrementing `n` prop
  const numbered = React.Children.map(children, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { n: i + 1 });
    }
    return child;
  });

  return <div className={styles.stepList}>{numbered}</div>;
}
