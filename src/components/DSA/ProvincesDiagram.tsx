// src/components/DSA/ProvincesDiagram.tsx
// Problem Overview visual — node graph showing 2 provinces + caption
// Matches HTML .province-diagram exactly

import React from 'react';

export default function ProvincesDiagram() {
  return (
    <div style={{
      background: 'var(--dsa-surface)',
      border: '1px solid var(--dsa-border)',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px 0',
    }}>
      {/* Province groups + answer count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap',
      }}>

        {/* Province 1 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '1px', textTransform: 'uppercase',
            color: 'var(--dsa-text-muted)', marginBottom: '12px',
          }}>Province 1</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {/* Node 1 */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(74,222,128,0.15)',
              border: '2px solid var(--dsa-accent)',
              color: 'var(--dsa-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '15px', fontWeight: 600,
            }}>0</div>
            {/* Edge */}
            <div style={{ position: 'relative', width: '32px', height: '2px', background: 'var(--dsa-accent)' }}>
              <div style={{ position: 'absolute', left: '-3px', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--dsa-accent)' }} />
              <div style={{ position: 'absolute', right: '-3px', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--dsa-accent)' }} />
            </div>
            {/* Node 2 */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(74,222,128,0.15)',
              border: '2px solid var(--dsa-accent)',
              color: 'var(--dsa-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '15px', fontWeight: 600,
            }}>1</div>
          </div>
        </div>

        {/* Answer count */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '52px', fontWeight: 800,
            color: 'var(--dsa-accent)', lineHeight: 1,
          }}>2</div>
          <div style={{ fontSize: '13px', color: 'var(--dsa-text-muted)', marginTop: '4px' }}>
            Provinces (answer)
          </div>
        </div>

        {/* Province 2 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '1px', textTransform: 'uppercase',
            color: 'var(--dsa-text-muted)', marginBottom: '12px',
          }}>Province 2</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(34,211,238,0.15)',
              border: '2px solid var(--dsa-accent2)',
              color: 'var(--dsa-accent2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '15px', fontWeight: 600,
            }}>2</div>
          </div>
        </div>
      </div>

      {/* Input / output caption */}
      <p style={{
        fontSize: '13px',
        color: 'var(--dsa-text-muted)',
        textAlign: 'center',
        marginTop: '20px',
        marginBottom: '0',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]] → Output: 2
      </p>
    </div>
  );
}