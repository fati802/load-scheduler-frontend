'use client';

import { useState } from 'react';

const faqs = [
  { q: 'What is the peak load limit?', a: 'The peak load limit is the maximum total power (in watts) allowed at any given time. It is set to 4000W by default. When total load exceeds this, deferrable appliances are automatically postponed.' },
  { q: 'What does "Deferred" mean?', a: 'Deferred means the appliance was scheduled to run but was postponed because the total load at that hour exceeded the peak limit. The scheduler automatically defers lower-priority deferrable appliances first.' },
  { q: 'How is priority determined?', a: 'Priority is a number from 0 to 4. 0 = Critical (never deferred), 1 = High, 2 = Medium, 3 = Low, 4 = Minimal. Lower numbers mean higher priority.' },
  { q: 'How do I run the scheduler?', a: 'Send a POST request to /api/schedule/run from your FastAPI backend (available at the /docs endpoint). This regenerates all schedule events based on current appliance data.' },
  { q: 'Why does the chart show bars above the peak line?', a: 'Bars above the red dashed peak line represent overload hours — times when total load exceeded the limit. Deferrable appliances during those hours will show as DEFERRED in the Schedule page.' },
];

const guideSteps = [
  { title: 'Dashboard', desc: 'View real-time KPIs — total load, active appliances, upcoming schedules, and overload alerts.' },
  { title: 'Loads', desc: 'See all registered appliances with their power consumption, priority level, and deferrable status.' },
  { title: 'Schedule', desc: 'Browse all scheduling events. Filter by action type — Scheduled, Deferred, Running, or Overload.' },
  { title: 'Devices', desc: 'Monitor connected smart devices and their live connection status.' },
  { title: 'Alerts', desc: 'View overload warnings and system notifications with timestamps and severity.' },
  { title: 'Reports', desc: 'Analyze energy usage trends and consumption analytics over time.' },
  { title: 'Settings', desc: 'Configure your peak load limit, billing rate, and timezone.' },
];

const shortcuts = [
  { keys: 'Alt + D', action: 'Go to Dashboard' },
  { keys: 'Alt + L', action: 'Go to Loads' },
  { keys: 'Alt + S', action: 'Go to Schedule' },
  { keys: 'Alt + A', action: 'Go to Alerts' },
  { keys: 'Alt + R', action: 'Go to Reports' },
];

type Section = 'faq' | 'guide' | 'shortcuts' | 'contact' | null;

const sections = [
  {
    id: 'guide' as Section,
    title: 'How to Use the App',
    desc: 'Step-by-step guide for each page',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    color: '#7C6FF7', bg: '#EEF0FE',
  },
  {
    id: 'faq' as Section,
    title: 'FAQ',
    desc: 'Frequently asked questions',
    icon: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z',
    color: '#F59E0B', bg: '#FEF3C7',
  },
  {
    id: 'shortcuts' as Section,
    title: 'Keyboard Shortcuts',
    desc: 'Quick navigation shortcuts',
    icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18',
    color: '#10B981', bg: '#D1FAE5',
  },
  {
    id: 'contact' as Section,
    title: 'Contact & Support',
    desc: 'GitHub, email, and project info',
    icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
    color: '#EF4444', bg: '#FEE2E2',
  },
];

export default function HelpPage() {
  const [active, setActive] = useState<Section>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ padding: '32px', fontFamily: 'DM Sans', maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        {active && (
          <button onClick={() => setActive(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#7C6FF7', fontFamily: 'DM Sans', fontSize: '13px', fontWeight: '500', padding: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
        )}
      </div>
      <p style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
        {active ? sections.find(s => s.id === active)?.title : 'Help'}
      </p>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
        {active ? sections.find(s => s.id === active)?.desc : 'Documentation, FAQs, and support resources'}
      </p>

      {/* Landing — 4 cards */}
      {!active && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              backgroundColor: 'white', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '24px',
              display: 'flex', alignItems: 'flex-start', gap: '16px',
              cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = s.color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon}/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{s.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Guide */}
      {active === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {guideSteps.map((step, i) => (
            <div key={step.title} style={{
              display: 'flex', gap: '14px', alignItems: 'flex-start',
              backgroundColor: 'white', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                backgroundColor: '#EEF0FE', color: '#7C6FF7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: '700',
              }}>{i + 1}</div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '3px' }}>{step.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ */}
      {active === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', textAlign: 'left',
              }}>
                {faq.q}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 14px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ paddingTop: '12px' }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Shortcuts */}
      {active === 'shortcuts' && (
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
          {shortcuts.map((s, i) => (
            <div key={s.keys} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px',
              borderBottom: i < shortcuts.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.action}</span>
              <kbd style={{
                fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: '600',
                backgroundColor: '#F3F4F6', color: 'var(--text-primary)',
                border: '1px solid var(--border)', borderRadius: '5px', padding: '3px 8px',
              }}>{s.keys}</kbd>
            </div>
          ))}
        </div>
      )}

      {/* Contact */}
      {active === 'contact' && (
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'GitHub', value: 'github.com/fati802', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
            { label: 'Email', value: 'fatihasheikh235@gmail.com', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
            { label: 'Project', value: 'Load Scheduler — NUST EE Class of 2028', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: '#EEF0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={c.icon}/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>{c.label}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}