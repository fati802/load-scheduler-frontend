interface Alert {
  id: number;
  timestamp: string;
  appliance_name: string;
  action: string;
  reason: string;
}

interface RecentAlertsProps {
  events: Alert[];
}

const warningRedIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const warningAmberIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function RecentAlerts({ events }: RecentAlertsProps) {
  const recent = Array.isArray(events) ? events.slice(0, 5) : [];

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      height: '100%',
    }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <p style={{ fontFamily: 'Space Grotesk', fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>
          Recent Alerts
        </p>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '4px',
      }}>
        {['Appliance', 'Reason', 'Time'].map((h) => (
          <p key={h} style={{ fontFamily: 'DM Sans', fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>{h}</p>
        ))}
      </div>

      {recent.length === 0 ? (
        <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          No alerts — all loads within limit.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recent.map((event, index) => {
            const isRed = index % 2 === 0;
            const timeStr = new Date(event.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div key={event.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: index < recent.length - 1 ? '1px solid #F9FAFB' : 'none',
                gap: '12px',
              }}>
                {/* Appliance */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isRed ? warningRedIcon : warningAmberIcon}
                  <div>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {event.appliance_name}
                    </p>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {event.action}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {event.reason}
                </p>

                {/* Time */}
                <span style={{
                  fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '600',
                  color: isRed ? 'var(--alert-red)' : 'var(--alert-amber)',
                  whiteSpace: 'nowrap',
                }}>
                  {timeStr}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* View All */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <p style={{
          fontFamily: 'DM Sans', fontSize: '12px', color: 'var(--primary)',
          fontWeight: '500', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          View All Alerts
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </p>
      </div>
    </div>
  );
}