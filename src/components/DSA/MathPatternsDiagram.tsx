// src/components/DSA/MathPatternsDiagram.tsx
// Static SVG diagram showing the four core math patterns used in LeetCode:
// modulo, digit extraction, GCD, and palindrome check by reversal.

import React from 'react';
import styles from './DSA.module.css';

const ACCENT  = 'var(--dsa-accent)';
const GREEN   = 'var(--dsa-green)';
const MUTED   = 'var(--dsa-text-muted)';
const TEXT    = 'var(--dsa-text)';
const SURFACE = 'var(--dsa-surface)';
const BORDER  = 'var(--dsa-border)';

function Box({ x, y, w, h, label, sublabel, color = ACCENT }: {
  x: number; y: number; w: number; h: number;
  label: string; sublabel?: string; color?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={SURFACE} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 7 : h / 2 + 1)}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={13} fontFamily="var(--ifm-font-family-monospace)" fontWeight="600" fill={color}>
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 10}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={11} fontFamily="var(--ifm-font-family-monospace)" fill={MUTED}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

function SectionLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} fontSize={11} fontWeight="700" fill={MUTED} textAnchor="middle"
      fontFamily="var(--ifm-font-family-base)" letterSpacing={0.5}>
      {text}
    </text>
  );
}

export default function MathPatternsDiagram() {
  return (
    <div className={styles.diagramWrap} style={{ padding: '12px 0 8px' }}>
      <div className={styles.diagramHeader}>
        <span className={styles.diagramTitle}>Core Math Patterns</span>
      </div>
      <svg viewBox="0 0 420 310" style={{ width: '100%', maxWidth: 440, display: 'block', margin: '0 auto' }}>

        {/* ── Pattern 1: Modulo ── */}
        <SectionLabel x={105} y={22} text="MODULO / REMAINDER" />
        <Box x={20}  y={32} w={60}  h={34} label="17"    sublabel="num"    color={TEXT}   />
        <text x={90} y={52} textAnchor="middle" dominantBaseline="middle" fontSize={14} fill={MUTED}>%</text>
        <Box x={100} y={32} w={40}  h={34} label="3"     sublabel="div"    color={TEXT}   />
        <text x={150} y={52} textAnchor="middle" dominantBaseline="middle" fontSize={14} fill={MUTED}>=</text>
        <Box x={158} y={32} w={40}  h={34} label="2"     sublabel="rem"    color={ACCENT} />
        <text x={210} y={52} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={MUTED}>→ FizzBuzz,</text>
        <text x={220} y={65} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={MUTED}>cycle detection</text>

        {/* ── Pattern 2: Digit extraction ── */}
        <SectionLabel x={105} y={100} text="DIGIT EXTRACTION" />
        <Box x={20}  y={110} w={55} h={34} label="1221"  color={TEXT}   />
        <line x1={85} y1={127} x2={100} y2={127} stroke={MUTED} strokeWidth={1.5} markerEnd="url(#arrow)" />
        <Box x={100} y={110} w={65} h={34} label="% 10 → 1"  color={ACCENT} />
        <line x1={175} y1={127} x2={190} y2={127} stroke={MUTED} strokeWidth={1.5} />
        <Box x={190} y={110} w={65} h={34} label="/ 10 → 122" color={GREEN}  />
        <text x={270} y={120} fontSize={11} fill={MUTED} textAnchor="start">repeat</text>
        <text x={270} y={135} fontSize={11} fill={MUTED} textAnchor="start">until 0</text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={MUTED} />
          </marker>
        </defs>

        {/* ── Pattern 3: GCD ── */}
        <SectionLabel x={105} y={178} text="GCD (EUCLIDEAN)" />
        {/* gcd(12, 8) → gcd(8, 4) → gcd(4, 0) = 4 */}
        <Box x={20}  y={188} w={68} h={34} label="gcd(12,8)" color={TEXT}   />
        <line x1={88} y1={205} x2={100} y2={205} stroke={MUTED} strokeWidth={1.5} />
        <Box x={100} y={188} w={68} h={34} label="gcd(8,4)"  color={ACCENT} />
        <line x1={168} y1={205} x2={180} y2={205} stroke={MUTED} strokeWidth={1.5} />
        <Box x={180} y={188} w={68} h={34} label="gcd(4,0)"  color={ACCENT} />
        <line x1={248} y1={205} x2={260} y2={205} stroke={MUTED} strokeWidth={1.5} />
        <Box x={260} y={188} w={40} h={34} label="= 4"       color={GREEN}  />

        {/* ── Pattern 4: Integer palindrome ── */}
        <SectionLabel x={105} y={256} text="INTEGER PALINDROME" />
        {/* 1221 → reverse half → 12 == 12 */}
        <Box x={20}  y={266} w={55} h={34} label="1221"   color={TEXT}   />
        <text x={84} y={286} textAnchor="middle" dominantBaseline="middle" fontSize={18} fill={MUTED}>→</text>
        <Box x={95}  y={266} w={70} h={34} label="half=12"  sublabel="reversed"  color={ACCENT} />
        <text x={177} y={286} textAnchor="middle" dominantBaseline="middle" fontSize={14} fill={MUTED}>==</text>
        <Box x={185} y={266} w={70} h={34} label="rem=12"   sublabel="remaining" color={ACCENT} />
        <text x={268} y={286} textAnchor="middle" dominantBaseline="middle" fontSize={18} fill={GREEN}>✓</text>
        <text x={290} y={278} fontSize={11} fill={MUTED} textAnchor="start">Palindrome</text>
        <text x={290} y={292} fontSize={11} fill={MUTED} textAnchor="start">(no string)</text>
      </svg>
    </div>
  );
}
