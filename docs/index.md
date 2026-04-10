---
slug: /
title: Welcome
sidebar_position: 1
hide_table_of_contents: true
---

import Link from '@docusaurus/Link';
import { LandingStats, LandingSectionHeader, TopicCard, RecentlyAdded } from '@site/src/components/Landing';

<div className="landing-hero">
  <img
    src={require('@site/static/img/hero-banner.png').default}
    alt="DSA Reference Banner"
    className="landing-hero-img"
  />
  <h1>Personal DSA Reference</h1>
  <p>Data structures and algorithms solved, explained, and remembered in Swift.</p>
  <LandingStats />
</div>

<LandingSectionHeader tag="Topics" title="All Topics" />

<div className="topics-grid">
  <TopicCard to="/array"              emoji="🧩" label="Array"               category="array"               accent="var(--dsa-accent)"  />
  <TopicCard to="/two-pointers"       emoji="↔️" label="Two Pointers"        category="two-pointers"        accent="var(--dsa-accent2)" />
  <TopicCard to="/sliding-window"     emoji="🪟" label="Sliding Window"      category="sliding-window"      accent="var(--dsa-accent2)" />
  <TopicCard to="/prefix-sum"         emoji="➕" label="Prefix Sum"          category="prefix-sum"          accent="var(--dsa-accent2)" />
  <TopicCard to="/hash-map-set"       emoji="🗂" label="Hash Map / Set"      category="hash-map-set"        accent="var(--dsa-accent2)" />
  <TopicCard to="/binary-search"      emoji="🔍" label="Binary Search"       category="binary-search"       accent="var(--dsa-accent3)" />
  <TopicCard to="/math"               emoji="🔢" label="Math"                category="math"                accent="var(--dsa-accent3)" />
  <TopicCard to="/string"             emoji="🔤" label="String"              category="string"              accent="var(--dsa-accent2)" />
  <TopicCard to="/linked-list"        emoji="🔗" label="Linked List"         category="linked-list"         accent="var(--dsa-accent)"  />
  <TopicCard to="/stack"              emoji="📚" label="Stack"               category="stack"               accent="var(--dsa-accent3)" />
  <TopicCard to="/queue"              emoji="📬" label="Queue"               category="queue"               accent="var(--dsa-accent3)" />
  <TopicCard to="/heap"               emoji="🏔" label="Heap"                category="heap"                accent="var(--dsa-accent)"  />
  <TopicCard to="/binary-tree"        emoji="🌲" label="Binary Tree"         category="binary-tree"         accent="var(--dsa-accent)"  />
  <TopicCard to="/binary-search-tree" emoji="🔎" label="Binary Search Tree"  category="binary-search-tree"  accent="var(--dsa-accent)"  />
  <TopicCard to="/trie"               emoji="🌳" label="Trie"                category="trie"                accent="var(--dsa-accent)"  />
  <TopicCard to="/graph"              emoji="🕸" label="Graph"               category="graph"               accent="var(--dsa-accent)"  />
  <TopicCard to="/matrix"             emoji="🗃" label="Matrix"              category="matrix"              accent="var(--dsa-accent)"  />
  <TopicCard to="/monotonic-stack"    emoji="📊" label="Monotonic Stack"     category="monotonic-stack"     accent="var(--dsa-accent3)" />
  <TopicCard to="/backtracking"       emoji="🔙" label="Backtracking"        category="backtracking"        accent="var(--dsa-purple)"  />
  <TopicCard to="/dp-1d"              emoji="📈" label="Dynamic Prog. (1D)"  category="dp-1d"               accent="var(--dsa-purple)"  />
  <TopicCard to="/greedy"             emoji="🌿" label="Greedy"              category="greedy"              accent="var(--dsa-accent3)" />
  <TopicCard to="/bit-manipulation"   emoji="⊕"  label="Bit Manipulation"    category="bit-manipulation"    accent="var(--dsa-purple)"  />
</div>

<div className="landing-cta">
  <Link to="/graph">Browse All Problems →</Link>
</div>

<LandingSectionHeader tag="Recent" title="Recently Added" />

<RecentlyAdded />

<LandingSectionHeader tag="Upcoming" title="In Progress" />

<div className="coming-grid">
  <div className="coming-card">
    <div className="coming-card-top">
      <span className="coming-emoji">📉</span>
      <span className="coming-name">DP Multi-dimension</span>
    </div>
    <span className="coming-badge">Coming Soon</span>
  </div>
  <div className="coming-card">
    <div className="coming-card-top">
      <span className="coming-emoji">🗂️</span>
      <span className="coming-name">Sort</span>
    </div>
    <span className="coming-badge">Coming Soon</span>
  </div>
  <div className="coming-card">
    <div className="coming-card-top">
      <span className="coming-emoji">⏱️</span>
      <span className="coming-name">Intervals</span>
    </div>
    <span className="coming-badge">Coming Soon</span>
  </div>
  <div className="coming-card">
    <div className="coming-card-top">
      <span className="coming-emoji">📏</span>
      <span className="coming-name">Segment Tree</span>
    </div>
    <span className="coming-badge">Coming Soon</span>
  </div>
</div>
