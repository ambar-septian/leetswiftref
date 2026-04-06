// src/components/DSA/Walkthrough.tsx
// Usage: <Walkthrough steps={[{label:"Step 1", text:"..."}]} />

import React, { useState } from 'react';
import styles from './DSA.module.css';

interface Step {
  label: string;
  text: string;        // supports simple HTML via dangerouslySetInnerHTML
  state?: string;      // e.g. "visited = {0, 1}"
}

interface Props {
  input: string;
  expected: string;
  steps: Step[];
}

export default function Walkthrough({ input, expected, steps }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.walkthrough}>
      <div className={styles.walkthroughHeader}>
        <div className={styles.wdots}>
          <span className={styles.wr} /><span className={styles.wy} /><span className={styles.wg} />
        </div>
        <span>
          Input: <code>{input}</code> &nbsp;→&nbsp; Expected: <strong style={{color:'var(--dsa-accent)'}}>{expected}</strong>
        </span>
      </div>

      {/* Step pills */}
      <div className={styles.stepPills}>
        {steps.map((s, i) => (
          <button
            key={i}
            className={`${styles.stepPill} ${active === i ? styles.stepPillActive : ''}`}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active step */}
      <div className={styles.walkthroughBody}>
        <p dangerouslySetInnerHTML={{ __html: steps[active].text }} />
        {steps[active].state && (
          <div className={styles.stateBox}>
            <span className={styles.stateLabel}>state</span>
            <code>{steps[active].state}</code>
          </div>
        )}

        <div className={styles.stepNav}>
          <button
            className={styles.stepNavBtn}
            onClick={() => setActive(Math.max(0, active - 1))}
            disabled={active === 0}
          >← Prev</button>
          <span className={styles.stepCounter}>{active + 1} / {steps.length}</span>
          <button
            className={styles.stepNavBtn}
            onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
            disabled={active === steps.length - 1}
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
