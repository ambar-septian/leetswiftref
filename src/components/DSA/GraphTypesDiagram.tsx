// src/components/DSA/GraphTypesDiagram.tsx
// 2x2 grid showing the four key graph type combinations:
// directed vs undirected, connected vs disconnected.

import React from 'react';

const ACCENT  = '#4ade80';
const ACCENT2 = '#22d3ee';
const AMBER   = '#f59e0b';
const PURPLE  = '#a78bfa';
const MUTED   = '#6b7280';
const BORDER  = '#1e2330';
const SURFACE = '#111318';
const SURFACE2 = '#181c24';

interface NodePos { x: number; y: number; }

function arrowPath(n1: NodePos, n2: NodePos, r: number) {
  const dx = n2.x - n1.x, dy = n2.y - n1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  return {
    x1: n1.x + ux * r, y1: n1.y + uy * r,
    x2: n2.x - ux * r, y2: n2.y - uy * r,
  };
}

interface GraphProps {
  nodes: NodePos[];
  edges: [number, number][];
  directed: boolean;
  color: string;
  markerId: string;
  labels?: string[];
}

function MiniGraph({ nodes, edges, directed, color, markerId, labels }: GraphProps) {
  const r = 12;
  return (
    <>
      <defs>
        <marker id={markerId} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={color} opacity={0.6} />
        </marker>
      </defs>
      {edges.map(([a, b]) => {
        const { x1, y1, x2, y2 } = arrowPath(nodes[a], nodes[b], r);
        return (
          <line key={`${a}-${b}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={1.5} opacity={0.6}
            markerEnd={directed ? `url(#${markerId})` : undefined}
          />
        );
      })}
      {nodes.map((pos, i) => (
        <g key={i}>
          <circle cx={pos.x} cy={pos.y} r={r}
            fill={`${color}18`} stroke={color} strokeWidth={1.5} />
          <text x={pos.x} y={pos.y + 4} textAnchor="middle"
            fontFamily="var(--ifm-font-family-monospace)"
            fontSize={11} fontWeight={700} fill={color}>
            {labels ? labels[i] : i}
          </text>
        </g>
      ))}
    </>
  );
}

// Layout for each quadrant
const CONNECTED_NODES: NodePos[] = [
  { x: 55, y: 20 },
  { x: 95, y: 55 },
  { x: 55, y: 90 },
  { x: 15, y: 55 },
];
const CONNECTED_EDGES: [number, number][] = [[0,1],[1,2],[2,3],[3,0],[0,2]];

const DISCONNECTED_NODES: NodePos[] = [
  { x: 25, y: 30 }, { x: 55, y: 55 }, { x: 25, y: 80 }, // component 1
  { x: 85, y: 30 }, { x: 85, y: 75 },                   // component 2
];
const DISCONNECTED_EDGES: [number, number][] = [[0,1],[1,2],[3,4]];

interface QuadrantProps {
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

function Quadrant({ title, subtitle, color, children, width = 120, height = 120 }: QuadrantProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {children}
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 10, color: MUTED, lineHeight: 1.5 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default function GraphTypesDiagram() {
  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '20px 16px',
      margin: '20px 0',
      overflowX: 'auto',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 20, textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)' }}>
        Graph Types — direction and connectivity
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 500, margin: '0 auto' }}>

        {/* Directed Connected */}
        <Quadrant title="Directed" subtitle={"Edges have direction\n(one-way)"} color={ACCENT}>
          <MiniGraph
            nodes={CONNECTED_NODES}
            edges={CONNECTED_EDGES}
            directed={true}
            color={ACCENT}
            markerId="arr-dc"
          />
        </Quadrant>

        {/* Undirected Connected */}
        <Quadrant title="Undirected" subtitle={"Edges are bidirectional\n(two-way)"} color={ACCENT2}>
          <MiniGraph
            nodes={CONNECTED_NODES}
            edges={CONNECTED_EDGES}
            directed={false}
            color={ACCENT2}
            markerId="arr-uc"
          />
        </Quadrant>

        {/* Directed Disconnected */}
        <Quadrant title="Disconnected" subtitle={"Not all nodes reachable\nfrom a single source"} color={AMBER}>
          <MiniGraph
            nodes={DISCONNECTED_NODES}
            edges={DISCONNECTED_EDGES}
            directed={true}
            color={AMBER}
            markerId="arr-dd"
          />
          {/* Dashed box around each component */}
          <rect x={5} y={10} width={60} height={80} rx={6}
            fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4,3" opacity={0.35} />
          <rect x={70} y={10} width={30} height={80} rx={6}
            fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4,3" opacity={0.35} />
          <text x={17} y={105} fontFamily="var(--ifm-font-family-monospace)" fontSize={9} fill={AMBER} opacity={0.6}>comp 1</text>
          <text x={72} y={105} fontFamily="var(--ifm-font-family-monospace)" fontSize={9} fill={AMBER} opacity={0.6}>comp 2</text>
        </Quadrant>

        {/* Weighted */}
        <Quadrant title="Weighted" subtitle={"Edges carry a cost\n(distance, time, etc.)"} color={PURPLE}>
          {/* Simple weighted triangle */}
          {(() => {
            const wNodes: NodePos[] = [{ x: 55, y: 15 }, { x: 95, y: 80 }, { x: 15, y: 80 }];
            const wEdges: [number, number, number][] = [[0,1,4],[1,2,6],[2,0,3]];
            const r = 12;
            return (
              <>
                {wEdges.map(([a, b, w]) => {
                  const n1 = wNodes[a], n2 = wNodes[b];
                  const { x1, y1, x2, y2 } = arrowPath(n1, n2, r);
                  const mx = (n1.x + n2.x) / 2 + (n2.y - n1.y) * 0.18;
                  const my = (n1.y + n2.y) / 2 - (n2.x - n1.x) * 0.18;
                  return (
                    <g key={`${a}-${b}`}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={PURPLE} strokeWidth={1.5} opacity={0.6} />
                      <text x={mx} y={my} textAnchor="middle"
                        fontFamily="var(--ifm-font-family-monospace)"
                        fontSize={11} fontWeight={700} fill={PURPLE}>
                        {w}
                      </text>
                    </g>
                  );
                })}
                {wNodes.map((pos, i) => (
                  <g key={i}>
                    <circle cx={pos.x} cy={pos.y} r={r}
                      fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth={1.5} />
                    <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                      fontFamily="var(--ifm-font-family-monospace)"
                      fontSize={11} fontWeight={700} fill={PURPLE}>
                      {i}
                    </text>
                  </g>
                ))}
              </>
            );
          })()}
        </Quadrant>
      </div>

      {/* Property cheat-sheet */}
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxWidth: 500, margin: '20px auto 0' }}>
        {[
          { label: 'Directed + Connected', example: 'Course prerequisites', color: ACCENT },
          { label: 'Undirected + Connected', example: 'Social network, road map', color: ACCENT2 },
          { label: 'Directed + Disconnected', example: 'Multiple dependency trees', color: AMBER },
          { label: 'Weighted', example: 'Flight distances, latency', color: PURPLE },
        ].map(({ label, example, color }) => (
          <div key={label} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${color}`, borderRadius: '0 6px 6px 0', padding: '8px 12px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: 'var(--ifm-font-family-monospace)', fontSize: 11, color: MUTED }}>{example}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
