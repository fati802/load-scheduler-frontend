'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navSections = [
  {
    label: 'GENERAL',
    items: [
      {
        label: 'Dashboard',
        href: '/',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        ),
      },
      {
        label: 'Loads',
        href: '/loads',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        ),
      },
      {
        label: 'Schedule',
        href: '/schedule',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        ),
      },
      {
        label: 'Devices',
        href: '/devices',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      {
        label: 'Alerts',
        href: '/alerts',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        ),
      },
      {
        label: 'Reports',
        href: '/reports',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'SUPPORT',
    items: [
      {
        label: 'Settings',
        href: '/settings',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        ),
      },
      {
        label: 'Help',
        href: '/help',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const downloadCSV = () => {
    fetch('https://load-scheduler-backend.onrender.com/api/events')
      .then(r => r.json())
      .then(events => {
        const data = Array.isArray(events) ? events : events.events || [];
        const header = ['ID', 'Appliance', 'Action', 'Reason', 'Timestamp'];
        const rows = data.map((e: any) => [e.id, e.appliance_name, e.action, `"${e.reason}"`, e.timestamp]);
        const csv = [header, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'load_scheduler_report.csv';
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  return (
    <aside style={{
      backgroundColor: 'var(--sidebar-bg)',
      width: '220px',
      minHeight: '100vh',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', marginBottom: '24px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          backgroundColor: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4', letterSpacing: '0.04em' }}>AUTO LOAD</p>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '11px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4', letterSpacing: '0.04em' }}>SCHEDULER</p>
        </div>
      </div>

      {/* Nav sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
        {navSections.map((section) => (
          <div key={section.label}>
            <p style={{
              fontFamily: 'DM Sans', fontSize: '11px', fontWeight: '500',
              color: 'var(--sidebar-label)', letterSpacing: '0.06em',
              marginBottom: '6px', padding: '0 8px',
            }}>
              {section.label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {section.items.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      textDecoration: 'none',
                      color: isActive ? 'var(--primary)' : 'var(--sidebar-text)',
                      backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                      fontFamily: 'DM Sans',
                      fontSize: '14px',
                      fontWeight: isActive ? '500' : '400',
                      transition: 'all 0.15s',
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom team card */}
      <div style={{
        marginTop: '16px',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            backgroundColor: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>Smart Residence</p>
            <p style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'var(--text-secondary)' }}>All systems operational</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            onClick={() => router.push('/reports')}
            style={{
              backgroundColor: 'var(--primary)',
              borderRadius: '6px',
              padding: '7px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '600', color: 'white' }}>
              View Full Report
            </p>
          </div>
          <div
            onClick={downloadCSV}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '7px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'var(--page-bg)',
            }}
          >
            <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Download CSV
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}