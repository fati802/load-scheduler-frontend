'use client';

import { useEffect, useState } from 'react';

interface ScheduleEvent {
  id: number;
  timestamp: string;
  appliance_name: string;
  action: string;
  reason: string;
}

const actionStyle = (action: string) => {
  if (action === 'SCHEDULED') return { color: '#7C6FF7', bg: '#EEF0FE' };
  if (action === 'DEFERRED')  return { color: '#F59E0B', bg: '#FEF3C7' };
  if (action === 'RUNNING')   return { color: '#10B981', bg: '#D1FAE5' };
  if (action === 'OVERLOAD')  return { color: '#EF4444', bg: '#FEE2E2' };
  return                             { color: '#6B7280', bg: '#F3F4F6' };
};

const applianceIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('air') || n.includes('ac')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="10" rx="2"/><line x1="12" y1="13" x2="12" y2="21"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
    </svg>
  );
  if (n.includes('fridge') || n.includes('refrig')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/>
    </svg>
  );
  if (n.includes('wash')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="4"/>
    </svg>
  );
  if (n.includes('light')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
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
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
};

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetch('https://load-scheduler-backend.onrender.com/api/events')
      .then(r => r.json())
      .then(data => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const actions = ['ALL', 'SCHEDULED', 'DEFERRED', 'RUNNING', 'OVERLOAD'];
  const filtered = filter === 'ALL' ? events : events.filter(e => e.action === filter);

  const counts = {
    SCHEDULED: events.filter(e => e.action === 'SCHEDULED').length,
    DEFERRED:  events.filter(e => e.action === 'DEFERRED').length,
    RUNNING:   events.filter(e => e.action === 'RUNNING').length,
    OVERLOAD:  events.filter(e => e.action === 'OVERLOAD').length,
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans' }}>
      {/* Header */}
      <p style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Schedule</p>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>All appliance scheduling events and deferral reasons</p>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Scheduled', value: counts.SCHEDULED, color: '#7C6FF7', bg: '#EEF0FE' },
          { label: 'Deferred',  value: counts.DEFERRED,  color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Running',   value: counts.RUNNING,   color: '#10B981', bg: '#D1FAE5' },
          { label: 'Overload',  value: counts.OVERLOAD,  color: '#EF4444', bg: '#FEE2E2' },
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
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {actions.map(a => {
          const s = actionStyle(a);
          const active = filter === a;
          return (
            <button key={a} onClick={() => setFilter(a)} style={{
              padding: '6px 14px', borderRadius: '7px', fontSize: '12px', fontWeight: '600',
              fontFamily: 'DM Sans', cursor: 'pointer', border: '1px solid',
              borderColor: active ? s.color : 'var(--border)',
              backgroundColor: active ? s.bg : 'white',
              color: active ? s.color : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>
              {a}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 3fr',
          padding: '12px 20px', borderBottom: '1px solid var(--border)',
          backgroundColor: '#FAFAFA',
        }}>
          {['Appliance', 'Time', 'Action', 'Reason'].map(h => (
            <p key={h} style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>{h}</p>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No events found.</div>
        ) : (
          filtered.map((e, index) => {
            const s = actionStyle(e.action);
            const time = new Date(e.timestamp).toLocaleString('en-PK', {
              month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            });
            return (
              <div key={e.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 3fr',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: index < filtered.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}>
                {/* Appliance */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    backgroundColor: '#EEF0FE', color: '#7C6FF7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {applianceIcon(e.appliance_name)}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{e.appliance_name}</span>
                </div>

                {/* Time */}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Space Grotesk' }}>{time}</span>

                {/* Action badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  backgroundColor: s.bg, color: s.color,
                  borderRadius: '6px', padding: '3px 10px',
                  fontSize: '11px', fontWeight: '600', width: 'fit-content',
                }}>
                  {e.action}
                </div>

                {/* Reason */}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{e.reason}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}