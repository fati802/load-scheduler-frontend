'use client';

import { useEffect, useState } from 'react';

interface AlertEvent {
  id: number;
  timestamp: string;
  appliance_name: string;
  action: string;
  reason: string;
}

const severityStyle = (reason: string) => {
  if (reason.toLowerCase().includes('exceeded')) return { label: 'Overload', color: '#EF4444', bg: '#FEE2E2', dot: '#EF4444' };
  if (reason.toLowerCase().includes('deferred'))  return { label: 'Warning',  color: '#F59E0B', bg: '#FEF3C7', dot: '#F59E0B' };
  return                                                  { label: 'Info',     color: '#7C6FF7', bg: '#EEF0FE', dot: '#7C6FF7' };
};

const applianceIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('wash')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="4"/>
    </svg>
  );
  if (n.includes('air') || n.includes('ac')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="10" rx="2"/><line x1="12" y1="13" x2="12" y2="21"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
    </svg>
  );
  if (n.includes('pump') || n.includes('water')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetch('https://load-scheduler-backend.onrender.com/api/events')
      .then(r => r.json())
      .then(data => {
        const overloads = data.filter((e: AlertEvent) => e.action === 'DEFERRED');
        setAlerts(overloads);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueAppliances = [...new Set(alerts.map(a => a.appliance_name))];
  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.appliance_name === filter);

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans', maxWidth: '960px' }}>
      {/* Header */}
      <p style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Alerts</p>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>Overload warnings and deferred appliance events</p>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Alerts',        value: alerts.length,                                            color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Appliances Affected', value: uniqueAppliances.length,                                  color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Most Affected',       value: uniqueAppliances[0] ?? '—',                               color: '#7C6FF7', bg: '#EEF0FE' },
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

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['ALL', ...uniqueAppliances].map(name => {
          const active = filter === name;
          return (
            <button key={name} onClick={() => setFilter(name)} style={{
              padding: '6px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: '600',
              fontFamily: 'DM Sans', cursor: 'pointer', border: '1px solid',
              borderColor: active ? '#EF4444' : 'var(--border)',
              backgroundColor: active ? '#FEE2E2' : 'white',
              color: active ? '#EF4444' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>
              {name}
            </button>
          );
        })}
      </div>

      {/* Alerts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No alerts found.</div>
        ) : (
          filtered.map(alert => {
            const s = severityStyle(alert.reason);
            const time = new Date(alert.timestamp).toLocaleString('en-PK', {
              month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            });
            return (
              <div key={alert.id} style={{
                backgroundColor: 'white', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: '14px',
              }}>
                {/* Icon */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                  backgroundColor: s.bg, color: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {applianceIcon(alert.appliance_name)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {alert.appliance_name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '600', fontFamily: 'Space Grotesk',
                        color: s.color, backgroundColor: s.bg,
                        borderRadius: '5px', padding: '2px 8px',
                      }}>
                        {s.label}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'Space Grotesk' }}>{time}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{alert.reason}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}