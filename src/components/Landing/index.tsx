import React from 'react';
import Link from '@docusaurus/Link';
import solvedData from '@site/configs/leetcode_solved.json';

type Problem = {
  id: number;
  title: string;
  category: string;
  slug: string;
  difficulty: string;
  status: string;
  submittedAt?: string;
};

const doneProblems = (solvedData.problems as Problem[]).filter(p => p.status === 'done');

const stats = {
  total: doneProblems.length,
  categories: new Set(doneProblems.map(p => p.category)).size,
  easy: doneProblems.filter(p => p.difficulty === 'Easy').length,
  medium: doneProblems.filter(p => p.difficulty === 'Medium').length,
  hard: doneProblems.filter(p => p.difficulty === 'Hard').length,
};

const categoryCounts = doneProblems.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});

export function LandingStats() {
  return (
    <div className="landing-stats">
      <span className="ls-block">
        <span className="ls-num">{stats.total}</span>
        <span className="ls-label"> problems</span>
      </span>
      <span className="ls-sep">·</span>
      <span className="ls-block">
        <span className="ls-num">{stats.categories}</span>
        <span className="ls-label"> categories</span>
      </span>
      <span className="ls-sep">·</span>
      <span className="ls-easy">{stats.easy} Easy</span>
      <span className="ls-sep">·</span>
      <span className="ls-medium">{stats.medium} Medium</span>
      <span className="ls-sep">·</span>
      <span className="ls-hard">{stats.hard} Hard</span>
    </div>
  );
}

export function LandingSectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="lsh-root">
      <span className="lsh-tag">{tag}</span>
      <h2 className="lsh-title">{title}</h2>
    </div>
  );
}

export function TopicCard({
  to,
  emoji,
  label,
  category,
  accent,
}: {
  to: string;
  emoji: string;
  label: string;
  category: string;
  accent: string;
}) {
  const count = categoryCounts[category] ?? 0;
  return (
    <Link to={to} className="topic-card" style={{ borderTopColor: accent }}>
      <div className="topic-card-top">
        <span className="topic-emoji">{emoji}</span>
        <span className="topic-name">{label}</span>
      </div>
      <span className="topic-count">{count} problems</span>
    </Link>
  );
}

export function RecentlyAdded() {
  const recent = [...doneProblems]
    .filter(p => Boolean(p.submittedAt))
    .sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime())
    .slice(0, 6);

  const diffColor = (d: string) => {
    if (d === 'Easy') return 'var(--dsa-accent)';
    if (d === 'Medium') return 'var(--dsa-accent3)';
    return 'var(--dsa-red)';
  };

  return (
    <div className="recent-list">
      {recent.map(p => (
        <Link
          key={p.id}
          to={`/${p.category}/${p.id}-${p.slug}`}
          className="recent-item"
        >
          <span className="recent-id">#{p.id}</span>
          <span className="recent-title">{p.title}</span>
          <span className="recent-diff" style={{ color: diffColor(p.difficulty) }}>
            {p.difficulty}
          </span>
          <span className="recent-cat">{p.category}</span>
        </Link>
      ))}
    </div>
  );
}
