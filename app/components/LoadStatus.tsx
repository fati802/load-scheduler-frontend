interface LoadStatusProps {
  active: number;
  scheduled: number;
  inactive: number;
  overloaded: number;
}

export default function LoadStatus({ active, scheduled, inactive, overloaded }: LoadStatusProps) {
  const rows = [
    {
      label: 'Active',
      value: active,
      color: '#7C6FF7',
      bg: '#EEF0FE',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      label: 'Scheduled',
      value: scheduled,
      color: '#F59E0B',
      bg: '#FEF3C7',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      label: 'Inactive',
      value: inactive,
      color: '#6B7280',
      bg: '#F3F4F6',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
    },
    {
      label: 'Overloaded',
      value: overloaded,
      color: '#EF4444',
      bg: '#FEE2E2',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <p style={{
        fontFamily: 'Space Grotesk',
        fontWeight: '600',
        fontSize: '15px',
        color: 'var(--text-primary)',
        marginBottom: '16px',
      }}>
        Load Status
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, index) => (
          <div key={row.label}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  backgroundColor: row.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {row.icon}
                </div>
                <span style={{
                  fontFamily: 'DM Sans',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}>
                  {row.label}
                </span>
              </div>
              <span style={{
                fontFamily: 'Space Grotesk',
                fontSize: '16px',
                fontWeight: '700',
                color: row.color,
              }}>
                {row.value}
              </span>
            </div>
            {index < rows.length - 1 && (
              <div style={{ height: '1px', backgroundColor: '#F3F4F6' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}