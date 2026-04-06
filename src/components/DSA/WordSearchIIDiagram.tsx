// src/components/DSA/WordSearchIIDiagram.tsx
// board = [["a","b","c"],["d","e","f"],["g","h","i"]], words = ["abc","bef","cfi"]
// Shows board with highlighted DFS paths + trie structure.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';

const BOARD = [
  ['a','b','c'],
  ['d','e','f'],
  ['g','h','i'],
];

// paths for each word: list of [row, col]
const WORD_PATHS: Record<string, [number,number][]> = {
  abc:  [[0,0],[0,1],[0,2]],
  bef:  [[0,1],[1,1],[1,2]],
  cfi:  [[0,2],[1,2],[2,2]],
};

const WORDS = ['abc','bef','cfi'];
const COLORS = [AMBER, ACCENT2, '#a78bfa'];

const CELL = 44;
const PAD  = 16;

export default function WordSearchIIDiagram() {
  const [active, setActive] = useState(0);

  const word   = WORDS[active];
  const color  = COLORS[active];
  const path   = WORD_PATHS[word];
  const pathSet = new Set(path.map(([r,c]) => `${r},${c}`));

  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        Trie + DFS backtracking · prune dead trie branches after match
      </div>
      <div style={{ display:'flex', gap:36, flexWrap:'wrap', justifyContent:'center', alignItems:'flex-start' }}>

        {/* Board */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)', marginBottom:4 }}>board</div>
          <div style={{ display:'inline-flex', flexDirection:'column', gap:4 }}>
            {BOARD.map((row, r) => (
              <div key={r} style={{ display:'flex', gap:4 }}>
                {row.map((cell, c) => {
                  const inPath = pathSet.has(`${r},${c}`);
                  const pathIdx = path.findIndex(([pr,pc]) => pr===r && pc===c);
                  return (
                    <div key={c} style={{
                      width:CELL, height:CELL, borderRadius:8,
                      border:`2px solid ${inPath ? color : BORDER}`,
                      background: inPath ? `color-mix(in srgb, ${color} 20%, transparent)` : 'var(--dsa-surface2)',
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                    }}>
                      <span style={{ fontFamily:'var(--ifm-font-family-monospace)', fontSize:16, fontWeight:700,
                        color: inPath ? color : MUTED }}>{cell}</span>
                      {inPath && (
                        <span style={{ fontSize:9, color, fontFamily:'var(--ifm-font-family-monospace)' }}>
                          {pathIdx+1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Word selector */}
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            {WORDS.map((w,i) => (
              <div key={w} onClick={() => setActive(i)} style={{
                cursor:'pointer', padding:'4px 10px', borderRadius:6,
                border:`2px solid ${COLORS[i]}`,
                background: active===i ? `color-mix(in srgb, ${COLORS[i]} 20%, transparent)` : 'transparent',
                fontSize:12, fontFamily:'var(--ifm-font-family-monospace)',
                fontWeight: active===i ? 700 : 400,
                color: COLORS[i],
              }}>{w}</div>
            ))}
          </div>
          <div style={{ fontSize:10, color:MUTED, fontFamily:'var(--ifm-font-family-monospace)' }}>
            click word to highlight path
          </div>
        </div>

        {/* Info panel */}
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', paddingTop:4, display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ color:MUTED, fontWeight:700 }}>Algorithm:</div>
          {[
            { step:'1. Build trie',    desc:'insert all target words into trie' },
            { step:'2. DFS each cell', desc:'start DFS at every board position' },
            { step:'3. Follow trie',   desc:'advance trie node with board[r][c]' },
            { step:'4. Mark visited',  desc:'board[r][c]="#" during DFS, restore after' },
            { step:'5. Collect word',  desc:'node.word found → append to results, nil it' },
            { step:'6. Prune trie',    desc:'remove leaf trie nodes after all words found' },
          ].map(({ step, desc }) => (
            <div key={step} style={{ display:'flex', gap:8 }}>
              <span style={{ color:ACCENT2, minWidth:95 }}>{step}</span>
              <span style={{ color:MUTED }}>{desc}</span>
            </div>
          ))}
          <div style={{ marginTop:8, padding:'8px 10px', borderRadius:8,
            background:`color-mix(in srgb, ${AMBER} 8%, transparent)`,
            border:`1px solid ${BORDER}` }}>
            <div style={{ color:AMBER, fontWeight:700, marginBottom:4 }}>Result: ["abc","bef","cfi"]</div>
            <div style={{ color:MUTED, fontSize:10 }}>
              Pruning spent trie branches stops revisiting<br/>words already found — critical for performance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
