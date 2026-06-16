interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  alert?: boolean;
  iconType: 'load' | 'active' | 'scheduled' | 'alert';
}

const icons = {
  load: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  active: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  scheduled: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  alert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

export default function KPICard({ title, value, subtitle, alert = false, iconType }: KPICardProps) {
  const iconBg = alert ? '#FEE2E2' : '#EEF0FE';
  const valueColor = alert ? '#EF4444' : 'var(--text-primary)';

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      {/* Icon circle */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        backgroundColor: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icons[iconType]}
      </div>

      {/* Text */}
      <div>
        <p style={{
          fontFamily: 'DM Sans',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          marginBottom: '4px',
        }}>
          {title}
        </p>
        <p style={{
          fontFamily: 'Space Grotesk',
          fontSize: '26px',
          fontWeight: '700',
          color: valueColor,
          lineHeight: '1',
          marginBottom: '4px',
        }}>
          {value}
        </p>
        <p style={{
          fontFamily: 'DM Sans',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}