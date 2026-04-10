import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import solvedData from '@site/configs/leetcode_solved.json';
import styles from './SearchModal.module.css';

type Problem = {
  id: number;
  title: string;
  category: string;
  slug: string;
  difficulty: string;
  status: string;
};

type CategoryResult = {
  type: 'category';
  category: string;
  label: string;
  url: string;
};

type ProblemResult = {
  type: 'problem';
  problem: Problem;
  url: string;
};

type SearchResult = CategoryResult | ProblemResult;

const CATEGORY_LABELS: Record<string, string> = {
  'sliding-window': 'Sliding Window',
  'linked-list': 'Linked List',
  'trie': 'Trie',
  'backtracking': 'Backtracking',
  'dp-multidimension': 'Dynamic Programming (Multi)',
  'dp-1d': 'Dynamic Programming (1D)',
  'heap': 'Heap',
  'binary-search': 'Binary Search',
  'monotonic-stack': 'Monotonic Stack',
  'intervals': 'Intervals',
  'bit-manipulation': 'Bit Manipulation',
  'binary-search-tree': 'Binary Search Tree',
  'binary-tree': 'Binary Tree',
  'graph': 'Graph',
  'stack': 'Stack',
  'queue': 'Queue',
  'hash-map-set': 'Hash Map / Set',
  'two-pointers': 'Two Pointers',
  'greedy': 'Greedy',
  'prefix-sum': 'Prefix Sum',
  'matrix': 'Matrix',
  'array': 'Array',
  'math': 'Math',
  'string': 'String',
  'general': 'General',
};

function difficultyColor(d: string): string {
  if (d === 'Easy') return '#4ade80';
  if (d === 'Medium') return '#f59e0b';
  return '#f87171';
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const history = useHistory();
  const { siteConfig: { baseUrl } } = useDocusaurusContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const base = baseUrl.replace(/\/$/, '');

  const doneProblems = useMemo(
    () => (solvedData.problems as Problem[]).filter(p => p.status === 'done'),
    []
  );

  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    const cats: string[] = [];
    for (const p of doneProblems) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        cats.push(p.category);
      }
    }
    return cats.sort();
  }, [doneProblems]);

  const results = useMemo((): SearchResult[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const categoryResults: CategoryResult[] = [];
    const problemResults: ProblemResult[] = [];

    // Category matches
    for (const cat of uniqueCategories) {
      const label = CATEGORY_LABELS[cat] ?? cat;
      if (cat.includes(q) || label.toLowerCase().includes(q)) {
        categoryResults.push({
          type: 'category',
          category: cat,
          label,
          url: `${base}/${cat}`,
        });
      }
    }

    // Problem matches: by id or title
    const isNumeric = /^\d+$/.test(q);
    for (const p of doneProblems) {
      const idMatch = isNumeric && String(p.id).startsWith(q);
      const titleMatch = p.title.toLowerCase().includes(q);
      if (idMatch || titleMatch) {
        problemResults.push({
          type: 'problem',
          problem: p,
          url: `${base}/${p.category}/${p.id}-${p.slug}`,
        });
      }
    }

    return [...categoryResults, ...problemResults].slice(0, 25);
  }, [query, doneProblems, uniqueCategories, base]);

  useEffect(() => { setSelectedIndex(0); }, [results]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const navigate = useCallback((url: string) => {
    history.push(url);
    onClose();
  }, [history, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) navigate(results[selectedIndex].url);
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  useEffect(() => {
    const item = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className={styles.inputRow}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search by title, ID, or category…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className={styles.escKey} onClick={onClose}>esc</kbd>
        </div>

        {results.length > 0 && (
          <div className={styles.results} ref={listRef}>
            {results.some(r => r.type === 'category') && (
              <div className={styles.groupLabel}>Categories</div>
            )}
            {results.map((r, i) => {
              const isSelected = i === selectedIndex;
              if (r.type === 'category') {
                return (
                  <React.Fragment key={r.url}>
                    <div
                      data-idx={i}
                      className={`${styles.result} ${isSelected ? styles.resultSelected : ''}`}
                      onClick={() => navigate(r.url)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <span className={styles.resultCategoryIcon}>◈</span>
                      <span className={styles.resultTitle}>{r.label}</span>
                      <span className={styles.resultBadge}>category</span>
                    </div>
                    {/* Divider before first problem */}
                    {i === results.filter(x => x.type === 'category').length - 1 &&
                      results.some(x => x.type === 'problem') && (
                        <div className={styles.groupLabel}>Problems</div>
                      )}
                  </React.Fragment>
                );
              }
              return (
                <div
                  key={r.url}
                  data-idx={i}
                  className={`${styles.result} ${isSelected ? styles.resultSelected : ''}`}
                  onClick={() => navigate(r.url)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span className={styles.resultId}>#{r.problem.id}</span>
                  <span className={styles.resultTitle}>{r.problem.title}</span>
                  <span className={styles.resultDifficulty} style={{ color: difficultyColor(r.problem.difficulty) }}>
                    {r.problem.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {query.trim() !== '' && results.length === 0 && (
          <div className={styles.empty}>No results for "{query}"</div>
        )}

        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKey}>↑↓</kbd> navigate
          </span>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKey}>↵</kbd> open
          </span>
          <span className={styles.footerHint}>
            <kbd className={styles.footerKey}>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
