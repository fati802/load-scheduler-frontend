'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Date + Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-secondary)' }}>{time}</span>
        </div>

        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--sidebar-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            backgroundColor: 'var(--alert-red)', color: 'white',
            fontSize: '9px', fontWeight: '700', fontFamily: 'DM Sans',
            borderRadius: '50%', width: '15px', height: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>3</span>
        </div>

        {/* Avatar */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          backgroundColor: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    </div>
  );
}