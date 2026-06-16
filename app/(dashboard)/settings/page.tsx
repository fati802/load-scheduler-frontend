'use client';

import { useState } from 'react';

const API_BASE = 'https://load-scheduler-backend.onrender.com';

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconServer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="5" rx="1"/><rect x="2" y="10" width="20" height="5" rx="1"/><rect x="2" y="17" width="20" height="5" rx="1"/>
    <circle cx="6" cy="5.5" r="1" fill="currentColor"/><circle cx="6" cy="12.5" r="1" fill="currentColor"/><circle cx="6" cy="19.5" r="1" fill="currentColor"/>
  </svg>
);
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconWifi = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
  </svg>
);
const IconXMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        backgroundColor: checked ? 'var(--primary)' : 'var(--border)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', backgroundColor: 'white',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        display: 'block',
      }} />
    </button>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: 'var(--white)', borderRadius: 12,
      border: '1px solid var(--border)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 24px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ color: 'var(--primary)' }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <label style={{ width: 160, flexShrink: 0, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 8,
  border: '1px solid var(--border)', fontSize: 13,
  color: 'var(--text-primary)', backgroundColor: 'var(--page-bg)',
  outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
};

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@loadscheduler.io' });
  const [profileSaved, setProfileSaved] = useState(false);

  const [peakStart, setPeakStart] = useState('08:00');
  const [peakEnd, setPeakEnd] = useState('22:00');
  const [maxLoad, setMaxLoad] = useState('3500');
  const [timezone, setTimezone] = useState('Asia/Karachi');
  const [schedSaved, setSchedSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    overload: true, deferred: true, critical: true, high: false, medium: false,
  });

  const [pingStatus, setPingStatus] = useState<'idle' | 'loading' | 'ok' | 'fail'>('idle');
  const [darkMode, setDarkMode] = useState(false);
  const handleTheme = (val: boolean) => {
  setDarkMode(val);
  if (val) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

  const saveProfile = () => { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2500); };
  const saveSched = () => { setSchedSaved(true); setTimeout(() => setSchedSaved(false), 2500); };

  const pingBackend = async () => {
    setPingStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/loads`);
      setPingStatus(res.ok ? 'ok' : 'fail');
    } catch {
      setPingStatus('fail');
    }
    setTimeout(() => setPingStatus('idle'), 4000);
  };

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const btnPrimary: React.CSSProperties = {
    padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
    backgroundColor: 'var(--primary)', color: 'white', fontSize: 13, fontWeight: 600,
    fontFamily: 'Space Grotesk, sans-serif',
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 780, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
          Settings
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
          Manage your profile, schedule config, and preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Profile */}
        <SectionCard icon={<IconUser />} title="Profile">
          <FieldRow label="Display name">
            <input style={inputStyle} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          </FieldRow>
          <FieldRow label="Email">
            <input style={inputStyle} type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
          </FieldRow>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={saveProfile} style={btnPrimary}>Save changes</button>
            {profileSaved && (
              <span style={{ fontSize: 13, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconCheck /> Saved
              </span>
            )}
          </div>
        </SectionCard>

        {/* Schedule Config */}
        <SectionCard icon={<IconClock />} title="Schedule Configuration">
          <FieldRow label="Peak hours start">
            <input type="time" style={inputStyle} value={peakStart} onChange={e => setPeakStart(e.target.value)} />
          </FieldRow>
          <FieldRow label="Peak hours end">
            <input type="time" style={inputStyle} value={peakEnd} onChange={e => setPeakEnd(e.target.value)} />
          </FieldRow>
          <FieldRow label="Max load (W)">
            <input type="number" style={inputStyle} value={maxLoad} onChange={e => setMaxLoad(e.target.value)} min={500} max={20000} step={100} />
          </FieldRow>
          <FieldRow label="Timezone">
            <select style={inputStyle} value={timezone} onChange={e => setTimezone(e.target.value)}>
              <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
              <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
              <option value="America/New_York">America/New_York (EST, UTC-5)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8)</option>
            </select>
          </FieldRow>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={saveSched} style={btnPrimary}>Save changes</button>
            {schedSaved && (
              <span style={{ fontSize: 13, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconCheck /> Saved
              </span>
            )}
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={<IconBell />} title="Notification Preferences">
          {([
            { key: 'overload', label: 'Overload alerts', desc: 'Notify when total load exceeds max threshold' },
            { key: 'deferred', label: 'Deferred load alerts', desc: 'Notify when appliances are deferred during peak hours' },
            { key: 'critical', label: 'Critical priority loads', desc: 'Notify for all critical-priority appliance events' },
            { key: 'high', label: 'High priority loads', desc: 'Notify for high-priority appliance events' },
            { key: 'medium', label: 'Medium priority loads', desc: 'Notify for medium-priority appliance events' },
          ] as { key: keyof typeof notifs; label: string; desc: string }[]).map(({ key, label, desc }, i, arr) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{desc}</div>
              </div>
              <Toggle checked={notifs[key]} onChange={() => toggleNotif(key)} />
            </div>
          ))}
        </SectionCard>

        {/* Backend Connection */}
        <SectionCard icon={<IconServer />} title="Backend Connection">
          <FieldRow label="API base URL">
            <div style={{ ...inputStyle, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{API_BASE}</span>
            </div>
          </FieldRow>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={pingBackend}
              disabled={pingStatus === 'loading'}
              style={{
                ...btnPrimary, backgroundColor: 'transparent',
                border: '1px solid var(--primary)', color: 'var(--primary)',
                cursor: pingStatus === 'loading' ? 'wait' : 'pointer',
              }}
            >
              {pingStatus === 'loading' ? 'Pinging…' : 'Test connection'}
            </button>
            {pingStatus === 'ok' && (
              <span style={{ fontSize: 13, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconWifi /> Connected
              </span>
            )}
            {pingStatus === 'fail' && (
              <span style={{ fontSize: 13, color: 'var(--alert-red)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconXMark /> Unreachable
              </span>
            )}
          </div>
        </SectionCard>

        {/* Theme */}
        <SectionCard icon={<IconSun />} title="Appearance">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Dark mode</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Switch between light and dark interface
              </div>
            </div>
            <Toggle checked={darkMode} onChange={handleTheme} />
          </div>
          {darkMode && (
            <p style={{
              marginTop: 12, fontSize: 12, color: 'var(--text-secondary)',
              backgroundColor: 'var(--primary-light)', padding: '8px 12px', borderRadius: 8,
            }}>
              Dark mode enabled.
            </p>
          )}
        </SectionCard>

      </div>
    </div>
  );
}