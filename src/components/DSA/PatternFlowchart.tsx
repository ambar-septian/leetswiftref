// src/components/DSA/PatternFlowchart.tsx
// Usage: <PatternFlowchart steps={[...]} answer="Graph · DFS" />

import React, { useState } from 'react';
import styles from './DSA.module.css';

interface Step {
  question: string;
  verdict: 'no' | 'yes';
  reason: string;
}

interface Props {
  steps: Step[];
  answer: string;
}

export default function PatternFlowchart({ steps, answer }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={styles.flowchart}>
      <div className={styles.flowchartTitle}>→ Pattern Decision Tree</div>
      {steps.map((step, i) => (
        <div key={i} className={styles.flowStep}>
          <div className={styles.flowConnector}>
            <div className={styles.flowNodeQ}>?</div>
            {i < steps.length - 1 && <div className={styles.flowLine} />}
          </div>
          <div className={styles.flowContent}>
            <strong>{step.question}</strong>
            <br />
            <span className={step.verdict === 'no' ? styles.verdictNo : styles.verdictYes}>
              {step.verdict === 'no' ? '✗ No' : '✓ Yes'}
            </span>
            {' — '}{step.reason}
          </div>
        </div>
      ))}

      <div
        className={styles.flowAnswer}
        onClick={() => setRevealed(true)}
        style={{ cursor: revealed ? 'default' : 'pointer' }}
      >
        {revealed ? (
          <>
            <span className={styles.flowAnswerLabel}>Pattern</span>
            <span className={styles.flowAnswerValue}>{answer}</span>
          </>
        ) : (
          <span className={styles.flowAnswerReveal}>Tap to reveal pattern →</span>
        )}
      </div>
    </div>
  );
}
