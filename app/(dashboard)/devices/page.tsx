'use client';

import { useState, useEffect } from 'react';

const API_BASE = 'https://load-scheduler-backend.onrender.com';

interface Load {
  id: number;
  name: string;
  power_w: number;
  priority: string;
  deferrable: boolean;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconZap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Priority config ────────────────────────────────────────────────────────
const priorityConfig: Record<string, { bg: string; color: string }> = {
  Critical: { bg: 'var(--alert-red-light)', color: 'var(--alert-red)' },
  High:     { bg: 'var(--alert-amber-light)', color: 'var(--alert-amber)' },
  Medium:   { bg: 'var(--primary-light)', color: 'var(--primary)' },
  Low:      { bg: 'var(--success-light)', color: 'var(--success)' },
  Minimal:  { bg: 'var(--border)', color: 'var(--text-secondary)' },
};

const priorities = ['All', 'Critical', 'High', 'Medium', 'Low', 'Minimal'];

export default function DevicesPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deferFilter, setDeferFilter] = useState<'all' | 'deferrable' | 'non-deferrable'>('all');

  useEffect(() => {
    fetch(`${API_BASE}/api/loads`)
      .then(r => r.json())
      .then(d => { setLoads(Array.isArray(d) ? d : d.loads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────
  const filtered = loads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === 'All' || l.priority === priorityFilter;
    const matchDefer =
      deferFilter === 'all' ? true :
      deferFilter === 'deferrable' ? l.deferrable : !l.deferrable;
    return matchSearch && matchPriority && matchDefer;
  });

  const totalWatts = loads.reduce((s, l) => s + l.power_w, 0);
  const deferrableCount = loads.filter(l => l.deferrable).length;
  const deferrableWatts = loads.filter(l => l.deferrable).reduce((s, l) => s + l.power_w, 0);

  if (loading) return (
    <div style={{ padding: '28px 32px', color: 'var(--text-secondary)', fontSize: 14 }}>Loading devices…</div>
  );

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
          Devices
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
          All registered appliances and their load profiles.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Devices', value: loads.length, sub: 'registered appliances' },
          { label: 'Total Load', value: `${(totalWatts / 1000).toFixed(2)} kW`, sub: 'combined power', color: 'var(--primary)' },
          { label: 'Deferrable', value: deferrableCount, sub: 'shiftable devices', color: 'var(--success)' },
          { label: 'Deferrable Load', value: `${(deferrableWatts / 1000).toFixed(2)} kW`, sub: 'shiftable power', color: 'var(--alert-amber)' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{
            backgroundColor: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: color || 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
            <IconSearch />
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search devices…"
            style={{
              width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8,
              border: '1px solid var(--border)', fontSize: 13,
              color: 'var(--text-primary)', backgroundColor: 'var(--page-bg)',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {priorities.map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              border: '1px solid var(--border)', cursor: 'pointer',
              backgroundColor: priorityFilter === p ? 'var(--primary)' : 'var(--page-bg)',
              color: priorityFilter === p ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>{p}</button>
          ))}
        </div>

        {/* Deferrable filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'deferrable', 'non-deferrable'] as const).map(d => (
            <button key={d} onClick={() => setDeferFilter(d)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              border: '1px solid var(--border)', cursor: 'pointer',
              backgroundColor: deferFilter === d ? 'var(--primary)' : 'var(--page-bg)',
              color: deferFilter === d ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.15s', textTransform: 'capitalize',
            }}>{d}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--page-bg)', borderBottom: '1px solid var(--border)' }}>
              {['#', 'Device Name', 'Power (W)', 'Priority', 'Deferrable'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '12px 16px',
                  color: 'var(--text-secondary)', fontWeight: 500, fontSize: 12,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No devices match your filters.
                </td>
              </tr>
            ) : filtered.map((l, i) => {
              const pc = priorityConfig[l.priority] || priorityConfig['Minimal'];
              return (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--page-bg)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--primary)' }}><IconZap /></span>
                    {l.name}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {l.power_w} W
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      backgroundColor: pc.bg, color: pc.color,
                    }}>{l.priority}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {l.deferrable
                      ? <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}><IconCheck /> Yes</span>
                      : <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><IconX /> No</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)' }}>
          Showing {filtered.length} of {loads.length} devices
        </div>
      </div>

    </div>
  );
}