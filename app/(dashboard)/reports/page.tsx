'use client';

import { useState, useEffect } from 'react';

const API_BASE = 'https://load-scheduler-backend.onrender.com';

// ── Types ──────────────────────────────────────────────────────────────────
interface Load {
  id: number;
  name: string;
  power_w: number;
  priority: string;
  deferrable: boolean;
}

interface Event {
  id: number;
  appliance_name: string;
  action: string;
  reason: string;
  timestamp: string;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconBarChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);
const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{
      backgroundColor: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '18px 20px',
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: color || 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────
function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--white)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--primary)' }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

// ── Bar ───────────────────────────────────────────────────────────────────
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 8, backgroundColor: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: 4, transition: 'width 0.4s' }} />
    </div>
  );
}

// ── Export CSV ────────────────────────────────────────────────────────────
function exportCSV(events: Event[]) {
  const header = ['ID', 'Appliance', 'Action', 'Reason', 'Timestamp'];
  const rows = events.map(e => [e.id, e.appliance_name, e.action, `"${e.reason}"`, e.timestamp]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'load_scheduler_report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/loads`).then(r => r.json()),
      fetch(`${API_BASE}/api/events`).then(r => r.json()),
    ]).then(([l, e]) => {
      setLoads(Array.isArray(l) ? l : l.loads || []);
      setEvents(Array.isArray(e) ? e : e.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────
  const totalWatts = loads.reduce((s, l) => s + l.power_w, 0);
  const estimatedKwh = ((totalWatts * 8) / 1000).toFixed(1); // assume 8h/day
  const peakLoads = loads.filter(l => !l.deferrable);
  const peakWatts = peakLoads.reduce((s, l) => s + l.power_w, 0);
  const offPeakWatts = totalWatts - peakWatts;

  const actionCounts = events.reduce((acc, e) => {
    acc[e.action] = (acc[e.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const scheduled = actionCounts['SCHEDULED'] || 0;
  const deferred = actionCounts['DEFERRED'] || 0;
  const running = actionCounts['RUNNING'] || 0;
  const overload = actionCounts['OVERLOAD'] || 0;

  const applianceEvents = events.reduce((acc, e) => {
    acc[e.appliance_name] = (acc[e.appliance_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAppliances = Object.entries(applianceEvents)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxAppEvents = topAppliances[0]?.[1] || 1;

  const sortedLoads = [...loads].sort((a, b) => b.power_w - a.power_w).slice(0, 8);
  const maxPower = sortedLoads[0]?.power_w || 1;

  const overloadEvents = events.filter(e => e.action === 'DEFERRED' || e.action === 'OVERLOAD')
    .slice(0, 10);

  const priorityColor: Record<string, string> = {
    Critical: 'var(--alert-red)',
    High: 'var(--alert-amber)',
    Medium: 'var(--primary)',
    Low: 'var(--success)',
    Minimal: 'var(--text-secondary)',
  };

  const actionColor: Record<string, string> = {
    SCHEDULED: 'var(--primary)',
    DEFERRED: 'var(--alert-amber)',
    RUNNING: 'var(--success)',
    OVERLOAD: 'var(--alert-red)',
  };

  if (loading) return (
    <div style={{ padding: '28px 32px', color: 'var(--text-secondary)', fontSize: 14 }}>Loading report data…</div>
  );

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Reports</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>Energy usage, schedule history, and incident overview.</p>
        </div>
        <button
          onClick={() => exportCSV(events)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
            backgroundColor: 'var(--white)', color: 'var(--text-primary)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          <IconDownload /> Export CSV
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Energy Summary KPIs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <KpiCard label="Total Load" value={`${(totalWatts / 1000).toFixed(2)} kW`} sub={`${loads.length} appliances`} />
          <KpiCard label="Est. Daily Usage" value={`${estimatedKwh} kWh`} sub="Based on 8h runtime" color="var(--primary)" />
          <KpiCard label="Non-Deferrable" value={`${(peakWatts / 1000).toFixed(2)} kW`} sub="Always-on load" color="var(--alert-red)" />
          <KpiCard label="Deferrable" value={`${(offPeakWatts / 1000).toFixed(2)} kW`} sub="Shiftable load" color="var(--success)" />
        </div>

        {/* ── Schedule History ── */}
        <SectionCard icon={<IconCalendar />} title="Schedule History">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Scheduled', value: scheduled, color: 'var(--primary)' },
              { label: 'Running', value: running, color: 'var(--success)' },
              { label: 'Deferred', value: deferred, color: 'var(--alert-amber)' },
              { label: 'Overload', value: overload, color: 'var(--alert-red)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                backgroundColor: 'var(--page-bg)', borderRadius: 10,
                padding: '14px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'Space Grotesk, sans-serif' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Total events recorded: <strong style={{ color: 'var(--text-primary)' }}>{events.length}</strong>
          </div>
        </SectionCard>

        {/* ── Appliance Breakdown ── */}
        <SectionCard icon={<IconBarChart />} title="Appliance Power Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedLoads.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 160, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {l.name}
                </div>
                <Bar pct={(l.power_w / maxPower) * 100} color={priorityColor[l.priority] || 'var(--primary)'} />
                <div style={{ width: 70, textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {l.power_w} W
                </div>
                <div style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 20,
                  backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 500,
                }}>
                  {l.priority}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Most Active Appliances ── */}
        <SectionCard icon={<IconBarChart />} title="Most Active Appliances (by Events)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topAppliances.map(([name, count]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 160, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {name}
                </div>
                <Bar pct={(count / maxAppEvents) * 100} color="var(--primary)" />
                <div style={{ width: 70, textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {count} events
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Overload Incidents ── */}
        <SectionCard icon={<IconAlert />} title="Overload & Deferred Incidents">
          {overloadEvents.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No incidents recorded.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Appliance', 'Action', 'Reason', 'Timestamp'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overloadEvents.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px', color: 'var(--text-primary)', fontWeight: 500 }}>{e.appliance_name}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                        backgroundColor: e.action === 'OVERLOAD' ? 'var(--alert-red-light)' : 'var(--alert-amber-light)',
                        color: actionColor[e.action] || 'var(--text-secondary)',
                      }}>
                        {e.action}
                      </span>
                    </td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{e.reason}</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>

      </div>
    </div>
  );
}