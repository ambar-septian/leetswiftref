/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { useCodeBlockContext } from '@docusaurus/theme-common/internal';
import Button from '@theme/CodeBlock/Buttons/Button';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

// SVG identical to LeetCode's style floating overlapping documents
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.copyButtonIcon}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 5C9 4.44772 9.44772 4 10 4H19C19.5523 4 20 4.44772 20 5V14C20 14.5523 19.5523 15 19 15H17V10C17 8.34315 15.6569 7 14 7H9V5ZM15 9C15.5523 9 16 9.44772 16 10V19C16 19.5523 15.5523 20 15 20H5C4.44772 20 4 19.5523 4 19V10C4 9.44772 4.44772 9 5 9H15Z"
      fill="currentColor"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.toastIcon}>
    <path
      fill="currentColor"
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
    />
  </svg>
);

export default function CopyButton({ className }: { className?: string }): JSX.Element {
  const {
    metadata: { code },
  } = useCodeBlockContext();
  const [isCopied, setIsCopied] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const copyTimeout = useRef<number | undefined>(undefined);
  const exitTimeout = useRef<number | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setIsExiting(false);

      if (copyTimeout.current) window.clearTimeout(copyTimeout.current);
      if (exitTimeout.current) window.clearTimeout(exitTimeout.current);

      copyTimeout.current = window.setTimeout(() => {
        setIsExiting(true);
        exitTimeout.current = window.setTimeout(() => {
          setIsCopied(false);
          setIsExiting(false);
        }, 200);
      }, 2000);
    });
  }, [code]);

  useEffect(() => () => {
    window.clearTimeout(copyTimeout.current);
    window.clearTimeout(exitTimeout.current);
  }, []);

  return (
    <>
      <Button
        aria-label={
          isCopied
            ? translate({
                id: 'theme.CodeBlock.copied',
                message: 'Copied',
                description: 'The copied button label on code blocks',
              })
            : translate({
                id: 'theme.CodeBlock.copyButtonAriaLabel',
                message: 'Copy code to clipboard',
                description: 'The ARIA label for copy code blocks button',
              })
        }
        title={translate({
          id: 'theme.CodeBlock.copy',
          message: 'Copy',
          description: 'The copy button label on code blocks',
        })}
        className={clsx('clean-btn', className, styles.copyButton, isCopied && styles.copyButtonCopied)}
        onClick={copyCode}
      >
        <CopyIcon />
      </Button>
      {mounted && isCopied && typeof document !== 'undefined'
        ? createPortal(
            <div className={clsx(styles.toast, isExiting && styles.toastExiting)}>
              <SuccessIcon />
              <span>Copied!</span>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
