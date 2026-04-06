// src/components/DSA/NumberOfIslandsDiagram.tsx
// 4×5 grid with two islands. Shows DFS sink-the-island:
// island 1 (top-left cluster) sunk to '0' in amber, island 2 (bottom-right) in accent2.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

// 0=water, 1=island1, 2=island2
const GRID_INITIAL = [
  [1,1,0,0,0],
  [1,1,0,0,0],
  [0,0,0,2,2],
  [0,0,0,2,0],
];

const GRID_AFTER = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
];

const CELL = 36;

function Grid({ label, grid }: { label: string; grid: number[][] }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>{label}</div>
      <div style={{ display:'inline-flex', flexDirection:'column', gap:2 }}>
        {grid.map((row, r) => (
          <div key={r} style={{ display:'flex', gap:2 }}>
            {row.map((cell, c) => {
              const color = cell === 1 ? AMBER : cell === 2 ? ACCENT2 : MUTED;
              const isLand = cell !== 0;
              return (
                <div key={c} style={{
                  width: CELL, height: CELL,
                  border: `2px solid ${isLand ? color : BORDER}`,
                  borderRadius: 6,
                  background: isLand ? `color-mix(in srgb, ${color} 20%, transparent)` : 'var(--dsa-surface2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:13, fontWeight:700, color: isLand ? color : MUTED, opacity: isLand ? 1 : 0.35 }}>
                    {isLand ? '1' : '0'}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NumberOfIslandsDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        DFS sink-the-island · overwrite visited land with 0 · count = 2
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap', alignItems:'flex-start' }}>
        <Grid label="Original grid" grid={GRID_INITIAL} />
        {/* Arrow */}
        <div style={{ display:'flex', alignItems:'center', paddingTop: CELL * 2 }}>
          <svg width={36} height={16} viewBox="0 0 36 16">
            <line x1="0" y1="8" x2="28" y2="8" stroke={MUTED} strokeWidth={1.5} />
            <polygon points="28,4 36,8 28,12" fill={MUTED} />
          </svg>
        </div>
        <Grid label="After sinking both islands" grid={GRID_AFTER} />
        {/* Steps */}
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', display:'flex', flexDirection:'column', gap:5, paddingTop:8 }}>
          <div style={{ color:MUTED, marginBottom:4 }}>DFS trace:</div>
          {[
            { step:'grid[0][0]="1"', action:'island 1 found → dfs sinks cluster', color:AMBER },
            { step:'count = 1',      action:'flood-fill marks 4 cells as "0"',    color:AMBER },
            { step:'grid[2][3]="1"', action:'island 2 found → dfs sinks cluster', color:ACCENT2 },
            { step:'count = 2',      action:'flood-fill marks 3 cells as "0"',    color:ACCENT2 },
            { step:'return 2',       action:'all cells scanned',                   color:MUTED },
          ].map(({ step, action, color }) => (
            <div key={step} style={{ display:'flex', gap:8 }}>
              <span style={{ color, minWidth:130 }}>{step}</span>
              <span style={{ color:MUTED }}>{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
