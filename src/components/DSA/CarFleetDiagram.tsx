// src/components/DSA/CarFleetDiagram.tsx
// Visualises the car fleet algorithm for:
//   target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]
// Shows cars on a road colored by fleet, and the stack trace at each step.

import React, { useState } from 'react';

const AMBER   = '#f59e0b';
const TEAL    = '#2dd4bf';
const ACCENT2 = 'var(--dsa-accent2)';
const MUTED   = 'var(--dsa-text-muted)';
const BORDER  = 'var(--dsa-border)';
const RED     = '#f87171';

const TARGET = 12;
const FLEET_COLOR: Record<number, string> = { 1: AMBER, 2: TEAL, 3: ACCENT2 };

// Cars sorted by position descending (processing order), with fleet assignments.
const CARS = [
  { pos: 10, speed: 2, time: 1.0,  fleet: 1 },
  { pos: 8,  speed: 4, time: 1.0,  fleet: 1 },
  { pos: 5,  speed: 1, time: 7.0,  fleet: 2 },
  { pos: 3,  speed: 3, time: 3.0,  fleet: 2 },
  { pos: 0,  speed: 1, time: 12.0, fleet: 3 },
];

const STEPS = [
  {
    carIdx: 0,
    stack: [1.0],
    note: 'push 1.0 — first car, stack empty',
    merged: false,
  },
  {
    carIdx: 1,
    stack: [1.0],
    note: '1.0 ≤ 1.0 → car at pos 8 catches fleet 1 — pop, merge',
    merged: true,
  },
  {
    carIdx: 2,
    stack: [1.0, 7.0],
    note: '7.0 > 1.0 → new fleet (too slow to catch fleet 1)',
    merged: false,
  },
  {
    carIdx: 3,
    stack: [1.0, 7.0],
    note: '3.0 ≤ 7.0 → car at pos 3 catches fleet 2 — pop, merge',
    merged: true,
  },
  {
    carIdx: 4,
    stack: [1.0, 7.0, 12.0],
    note: '12.0 > 7.0 → new fleet · return stack.count = 3',
    merged: false,
  },
];

// Road layout
const ROAD_W = 360;
const ROAD_PAD = 24;
const ROAD_SCALE = (ROAD_W - ROAD_PAD * 2) / TARGET;
const ROAD_Y = 50;
const CAR_R   = 10;

function roadX(pos: number) {
  return ROAD_PAD + pos * ROAD_SCALE;
}

export default function CarFleetDiagram() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const activeIdx = s.carIdx;

  // Which car indices are "active" up to this step (processed so far)
  const processedIdxs = new Set(STEPS.slice(0, step + 1).map(st => st.carIdx));

  return (
    <div style={{ background: 'var(--dsa-surface)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 16px', margin: '20px 0', overflowX: 'auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 14, textAlign: 'center' }}>
        target = 12 · position = [10,8,0,5,3] · speed = [2,4,1,1,3] · 3 fleets
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Road + cars */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <svg width={ROAD_W} height={ROAD_Y * 2 + 30} style={{ overflow: 'visible' }}>

            {/* Road line */}
            <line x1={ROAD_PAD} y1={ROAD_Y} x2={ROAD_W - ROAD_PAD} y2={ROAD_Y}
              stroke={BORDER} strokeWidth={2} />

            {/* Position ticks */}
            {[0, 3, 5, 8, 10, 12].map(p => (
              <g key={p}>
                <line x1={roadX(p)} y1={ROAD_Y - 5} x2={roadX(p)} y2={ROAD_Y + 5}
                  stroke={MUTED} strokeWidth={1} />
                <text x={roadX(p)} y={ROAD_Y + 17}
                  textAnchor="middle" fontSize={9} fill={MUTED}
                  fontFamily="var(--ifm-font-family-monospace)">{p}</text>
              </g>
            ))}

            {/* Target finish line */}
            <line x1={roadX(TARGET)} y1={ROAD_Y - 20} x2={roadX(TARGET)} y2={ROAD_Y + 8}
              stroke={AMBER} strokeWidth={2} strokeDasharray="4 3" />
            <text x={roadX(TARGET)} y={ROAD_Y - 24}
              textAnchor="middle" fontSize={9} fontWeight={700}
              fill={AMBER} fontFamily="var(--ifm-font-family-monospace)">target=12</text>

            {/* Cars */}
            {CARS.map((car, i) => {
              const cx    = roadX(car.pos);
              const cy    = ROAD_Y - CAR_R - 4;
              const color = FLEET_COLOR[car.fleet];
              const isActive = i === activeIdx;
              const isProcessed = processedIdxs.has(i);
              const opacity = isProcessed ? 1 : 0.3;

              return (
                <g key={i} opacity={opacity}>
                  {/* Fleet bracket under car */}
                  <circle cx={cx} cy={cy} r={CAR_R}
                    fill={`color-mix(in srgb, ${color} 25%, transparent)`}
                    stroke={color} strokeWidth={isActive ? 2.5 : 1.5} />
                  <text x={cx} y={cy + 4}
                    textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={color} fontFamily="var(--ifm-font-family-monospace)">{car.pos}</text>
                  {/* Arrival time below road */}
                  <text x={cx} y={ROAD_Y + 30}
                    textAnchor="middle" fontSize={8}
                    fill={isActive ? color : MUTED}
                    fontFamily="var(--ifm-font-family-monospace)">
                    {car.time.toFixed(1)}h
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Fleet legend under road */}
          <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[1, 2, 3].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: FLEET_COLOR[f], opacity: 0.85 }} />
                <span style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>fleet {f}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)' }}>number = position · label below = arrival time</span>
            </div>
          </div>
        </div>

        {/* Stack trace table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4, minWidth: 280 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)', color: MUTED, fontWeight: 700, marginBottom: 4 }}>
            Sort by pos desc → process front to back:
          </div>

          <div style={{ fontSize: 11, fontFamily: 'var(--ifm-font-family-monospace)' }}>
            <div style={{ display: 'flex', gap: 8, color: MUTED, paddingBottom: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 2 }}>
              <span style={{ minWidth: 36 }}>pos</span>
              <span style={{ minWidth: 36 }}>time</span>
              <span style={{ minWidth: 50 }}>action</span>
              <span>stack</span>
            </div>
            {STEPS.map((st, i) => {
              const car   = CARS[st.carIdx];
              const color = FLEET_COLOR[car.fleet];
              return (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  color: i === step ? AMBER : MUTED,
                  fontWeight: i === step ? 700 : 400,
                  background: i === step ? `color-mix(in srgb, ${AMBER} 8%, transparent)` : 'transparent',
                  borderRadius: 4, padding: '2px 4px',
                  cursor: 'pointer',
                }} onClick={() => setStep(i)}>
                  <span style={{ minWidth: 36, color: i === step ? color : MUTED }}>{car.pos}</span>
                  <span style={{ minWidth: 36 }}>{car.time.toFixed(1)}</span>
                  <span style={{ minWidth: 50, color: st.merged ? RED : (i === step ? AMBER : MUTED) }}>
                    {st.merged ? 'merge' : 'push'}
                  </span>
                  <span style={{ color: i === step ? ACCENT2 : MUTED }}>
                    [{st.stack.map(t => t.toFixed(1)).join(', ')}]
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)', fontStyle: 'italic' }}>
            click a row to highlight that step
          </div>
          <div style={{
            fontSize: 11, color: MUTED, fontFamily: 'var(--ifm-font-family-monospace)',
            background: `color-mix(in srgb, ${AMBER} 6%, transparent)`,
            borderRadius: 6, padding: '6px 8px', marginTop: 2,
          }}>
            {s.note}
          </div>
        </div>
      </div>
    </div>
  );
}
