// src/components/DSA/WordDictionaryDiagram.tsx
// Trie with "bad", "dad", "mad". Shows '.' wildcard DFS branching for search(".ad").

import React from 'react';

const AMBER   = '#f59e0b';
const ACCENT2 = 'var(--dsa-accent2)';
const RED     = '#ef4444';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const R = 15;

// root(0), b(1), d(2), m(3), a-under-b(4), a-under-d(5), a-under-m(6), d-end-b(7), d-end-d(8), d-end-m(9)
const NODES = [
  { id:0, label:'·',  x:200, y:25,  isEnd:false, color:'muted' },
  { id:1, label:'b',  x:80,  y:85,  isEnd:false, color:'accent' },
  { id:2, label:'d',  x:200, y:85,  isEnd:false, color:'accent' },
  { id:3, label:'m',  x:320, y:85,  isEnd:false, color:'accent' },
  { id:4, label:'a',  x:80,  y:150, isEnd:false, color:'accent' },
  { id:5, label:'a',  x:200, y:150, isEnd:false, color:'accent' },
  { id:6, label:'a',  x:320, y:150, isEnd:false, color:'accent' },
  { id:7, label:'d',  x:80,  y:215, isEnd:true,  color:'amber' },
  { id:8, label:'d',  x:200, y:215, isEnd:true,  color:'amber' },
  { id:9, label:'d',  x:320, y:215, isEnd:true,  color:'amber' },
];

const EDGES: [number,number,string][] = [
  [0,1,'b'],[0,2,'d'],[0,3,'m'],
  [1,4,'a'],[2,5,'a'],[3,6,'a'],
  [4,7,'d'],[5,8,'d'],[6,9,'d'],
];

export default function WordDictionaryDiagram() {
  return (
    <div style={{ background:'var(--dsa-surface)', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px 16px', margin:'20px 0', overflowX:'auto' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:MUTED, marginBottom:14, textAlign:'center' }}>
        addWord("bad"), addWord("dad"), addWord("mad") · search(".ad") branches at root
      </div>
      <div style={{ display:'flex', gap:32, flexWrap:'wrap', alignItems:'flex-start', justifyContent:'center' }}>
        <svg width={400} height={260} style={{ overflow:'visible' }}>
          {EDGES.map(([a,b,lbl],i) => {
            const na=NODES[a], nb=NODES[b];
            const dx=nb.x-na.x, dy=nb.y-na.y, dist=Math.sqrt(dx*dx+dy*dy);
            const ux=dx/dist, uy=dy/dist;
            const x1=na.x+ux*R, y1=na.y+uy*R, x2=nb.x-ux*R, y2=nb.y-uy*R;
            const mx=(x1+x2)/2, my=(y1+y2)/2;
            const isWild = b<=3; // branching at root level for "."
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={isWild ? AMBER : MUTED} strokeWidth={isWild?2:1.5}
                  opacity={isWild?0.8:0.4}
                  strokeDasharray={isWild?"4 3":undefined}/>
                <text x={mx+6} y={my} fontSize={10} fill={ACCENT2}
                  fontFamily="var(--ifm-font-family-monospace)">{lbl}</text>
              </g>
            );
          })}
          {NODES.map(n => {
            const color = n.color==='amber' ? AMBER : n.color==='muted' ? MUTED : ACCENT2;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={R}
                  fill={`color-mix(in srgb, ${color} ${n.isEnd?28:15}%, transparent)`}
                  stroke={color} strokeWidth={n.isEnd?2.5:1.5}/>
                <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={12} fontWeight={700}
                  fill={color} fontFamily="var(--ifm-font-family-monospace)">{n.label}</text>
              </g>
            );
          })}
          {/* "." wildcard label at root */}
          <text x={200} y={58} textAnchor="middle" fontSize={10} fill={AMBER}
            fontFamily="var(--ifm-font-family-monospace)" fontWeight={700}>
            '.' → branch to ALL children
          </text>
          {/* result labels */}
          {[80,200,320].map((x,i) => (
            <text key={i} x={x} y={242} textAnchor="middle" fontSize={9} fill={AMBER}
              fontFamily="var(--ifm-font-family-monospace)">isEnd ✓</text>
          ))}
        </svg>
        <div style={{ fontSize:11, fontFamily:'var(--ifm-font-family-monospace)', paddingTop:16, display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ color:MUTED, fontWeight:700, marginBottom:4 }}>Search results:</div>
          {[
            { call:'search(".ad")',  result:'true',  note:'branches to b/d/m all reach isEnd' },
            { call:'search("bad")',  result:'true',  note:'exact path b→a→d, isEnd=true' },
            { call:'search("b..")', result:'true',  note:'b→*, *→*, reaches d (isEnd)' },
            { call:'search("bat")',  result:'false', note:'b→a→t: no t child' },
            { call:'search("b")',    result:'false', note:'path exists but isEnd=false' },
          ].map(({ call, result, note }) => (
            <div key={call} style={{ display:'flex', gap:6, alignItems:'baseline', flexWrap:'wrap' }}>
              <span style={{ color:ACCENT2, minWidth:130 }}>{call}</span>
              <span style={{ color:result==='true'?AMBER:MUTED, fontWeight:700 }}>{result}</span>
              <span style={{ color:MUTED, fontSize:10 }}>// {note}</span>
            </div>
          ))}
          <div style={{ marginTop:8, display:'flex', gap:12, flexWrap:'wrap' }}>
            {[{ color:AMBER, label:'isEnd = true' },{ color:ACCENT2, label:'intermediate node' },{ color:AMBER, label:'dashed = wildcard branch', dashed:true }].map(({ color, label, dashed }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                {dashed
                  ? <div style={{ width:14, height:2, background:color, borderTop:`2px dashed ${color}` }}/>
                  : <div style={{ width:10, height:10, borderRadius:'50%', background:color }}/>
                }
                <span style={{ fontSize:10, color:MUTED }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
