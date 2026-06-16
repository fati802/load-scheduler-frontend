'use client';

import { useEffect, useState } from 'react';

interface Appliance {
  id: number;
  name: string;
  power_w: number;
  priority: number;
  is_deferrable: boolean;
}

const priorityLabel = (p: number) => {
  if (p === 0) return { label: 'Critical', color: '#EF4444', bg: '#FEE2E2' };
  if (p === 1) return { label: 'High',     color: '#F59E0B', bg: '#FEF3C7' };
  if (p === 2) return { label: 'Medium',   color: '#7C6FF7', bg: '#EEF0FE' };
  if (p === 3) return { label: 'Low',      color: '#10B981', bg: '#D1FAE5' };
  if (p === 4) return { label: 'Low',      color: '#10B981', bg: '#D1FAE5' };
  return             { label: 'Minimal',   color: '#6B7280', bg: '#F3F4F6' };
};

const applianceIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('air') || n.includes('ac')) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="10" rx="2"/><line x1="12" y1="13" x2="12" y2="21"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
    </svg>
  );
  if (n.includes('fridge') || n.includes('refrig')) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/>
      <line x1="9" y1="6" x2="9" y2="8"/>
    </svg>
  );
  if (n.includes('wash')) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="4"/>
      <circle cx="8" cy="6" r="1"/>
    </svg>
  );
  if (n.includes('light')) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>
  );
  if (n.includes('pump') || n.includes('water')) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
};

export default function LoadsPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://load-scheduler-backend.onrender.com/api/loads')
      .then(r => r.json())
      .then(data => { setAppliances(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalWatts = appliances.reduce((sum, a) => sum + a.power_w, 0);
  const deferrable = appliances.filter(a => a.is_deferrable).length;
  const nonDeferrable = appliances.filter(a => !a.is_deferrable).length;

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans' }}>
      {/* Header */}
      <p style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Loads</p>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>All registered appliances and their power profiles</p>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Appliances', value: appliances.length, color: '#7C6FF7', bg: '#EEF0FE' },
          { label: 'Total Power', value: `${(totalWatts / 1000).toFixed(1)} kW`, color: '#7C6FF7', bg: '#EEF0FE' },
          { label: 'Deferrable', value: `${deferrable} / ${appliances.length}`, color: '#F59E0B', bg: '#FEF3C7' },
        ].map(k => (
          <div key={k.label} style={{
            backgroundColor: 'white', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{k.label}</p>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: '700', color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          padding: '12px 20px', borderBottom: '1px solid var(--border)',
          backgroundColor: '#FAFAFA',
        }}>
          {['Appliance', 'Power (W)', 'Power (kW)', 'Priority', 'Deferrable'].map(h => (
            <p key={h} style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>{h}</p>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>Loading...</div>
        ) : appliances.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No appliances found.</div>
        ) : (
          appliances.map((a, index) => {
            const p = priorityLabel(a.priority);
            return (
              <div key={a.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: index < appliances.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}>
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    backgroundColor: '#EEF0FE', color: '#7C6FF7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {applianceIcon(a.name)}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{a.name}</span>
                </div>

                {/* Power W */}
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{a.power_w} W</span>

                {/* Power kW */}
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'Space Grotesk' }}>{(a.power_w / 1000).toFixed(2)} kW</span>

                {/* Priority badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  backgroundColor: p.bg, color: p.color,
                  borderRadius: '6px', padding: '3px 10px',
                  fontSize: '12px', fontWeight: '600', width: 'fit-content',
                }}>
                  {p.label}
                </div>

                {/* Deferrable */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px',
                  color: a.is_deferrable ? '#10B981' : '#6B7280',
                }}>
                  {a.is_deferrable ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  )}
                  {a.is_deferrable ? 'Yes' : 'No'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}