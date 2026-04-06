// src/components/DSA/GenerateParenthesesDiagram.tsx
// Backtracking decision tree for n=2.
// Each node shows (open, close, path). Green = add "(", Cyan = add ")". Amber = valid leaf.

import React from 'react';

const OPEN_COLOR  = 'var(--dsa-accent)';   // green — add "("
const CLOSE_COLOR = 'var(--dsa-accent2)';  // cyan  — add ")"
const LEAF_COLOR  = '#f59e0b';             // amber — complete result
const MUTED       = 'var(--dsa-text-muted)';
const BORDER      = 'var(--dsa-border)';

interface NodeData {
  label: string;
  sublabel?: string;
  color: string;
  leaf?: boolean;
  children?: NodeData[];
}

const tree: NodeData = {
  label: '""',
  sublabel: 'o=0 c=0',
  color: MUTED,
  children: [
    {
      label: '"("',
      sublabel: 'o=1 c=0',
      color: OPEN_COLOR,
      children: [
        {
          label: '"(("',
          sublabel: 'o=2 c=0',
          color: OPEN_COLOR,
          children: [
            {
              label: '"(()"',
              sublabel: 'o=2 c=1',
              color: CLOSE_COLOR,
              children: [
                { label: '"(())"', sublabel: '✓ result', color: LEAF_COLOR, leaf: true },
              ],
            },
          ],
        },
        {
          label: '"()"',
          sublabel: 'o=1 c=1',
          color: CLOSE_COLOR,
          children: [
            {
              label: '"()("',
              sublabel: 'o=2 c=1',
              color: OPEN_COLOR,
              children: [
                { label: '"()()"', sublabel: '✓ result', color: LEAF_COLOR, leaf: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function TreeNode({ node, depth = 0 }: { node: NodeData; depth?: number }) {
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
      {/* Node box */}
      <div style={{
        border: `2px solid ${node.color}`,
        borderRadius: 8,
        background: `color-mix(in srgb, ${node.color} 12%, transparent)`,
        padding: '6px 10px',
        textAlign: 'center',
        minWidth: 68,
      }}>
        <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 13, fontWeight: 700, color: node.color }}>
          {node.label}
        </div>
        {node.sublabel && (
          <div style={{ fontSize: 10, color: node.leaf ? node.color : MUTED, marginTop: 2 }}>
            {node.sublabel}
          </div>
        )}
      </div>

      {/* Connector + children */}
      {hasChildren && (
        <>
          <div style={{ width: 2, height: 16, background: BORDER }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {node.children!.map((child, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 2, height: 8, background: BORDER }} />
                <TreeNode node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GenerateParenthesesDiagram() {
  return (
    <div style={{
      background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 16, textAlign: 'center' }}>
        Decision tree  ·  n = 2  ·  o = open count, c = close count
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TreeNode node={tree} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
        {[
          { color: OPEN_COLOR,  label: 'add "("  (when o < n)' },
          { color: CLOSE_COLOR, label: 'add ")"  (when c < o)' },
          { color: LEAF_COLOR,  label: 'complete  (o == c == n)' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
