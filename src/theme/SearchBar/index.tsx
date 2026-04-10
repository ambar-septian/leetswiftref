import React, { useState, useEffect } from 'react';
import SearchModal from '@site/src/components/Search/SearchModal';
import styles from './styles.module.css';

export default function SearchBar(): JSX.Element {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        className={styles.searchButton}
        onClick={() => setOpen(true)}
        aria-label="Search problems"
        type="button"
      >
        <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className={styles.placeholder}>Search…</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </button>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}
