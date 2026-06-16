'use client'
import React from 'react';
interface Load {
  id: number;
  name: string;
  power_w: number;
  priority: number;
  is_deferrable: boolean;
}

interface UpcomingScheduleProps {
  loads: Load[];
}

const scheduleData: Record<string, { time: string; duration: string; priority: string }> = {
  'AC':      { time: '12:00 PM', duration: '11h 00m', priority: 'High' },
  'Fridge':  { time: '12:00 AM', duration: '24h 00m', priority: 'High' },
  'Washer':  { time: '06:00 PM', duration: '2h 00m',  priority: 'Medium' },
  'Lights':  { time: '06:00 PM', duration: '5h 00m',  priority: 'Medium' },
  'Pump':    { time: '07:00 AM', duration: '1h 00m',  priority: 'Low' },
};

const priorityStyles: Record<string, { color: string; border: string; bg: string }> = {
  High:   { color: '#EF4444', border: '#FCA5A5', bg: '#FEF2F2' },
  Medium: { color: '#F59E0B', border: '#FCD34D', bg: '#FFFBEB' },
  Low:    { color: '#22C55E', border: '#86EFAC', bg: '#F0FDF4' },
};

const applianceIcons: Record<string, React.ReactElement> = {const applianceIcons: Record<string, React.ReactElement> = {
  AC: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="10" rx="2"/><line x1="7" y1="17" x2="7" y2="21"/>
      <line x1="17" y1="17" x2="17" y2="21"/><line x1="7" y1="11" x2="7" y2="13"/>
      <line x1="12" y1="11" x2="12" y2="13"/><line x1="17" y1="11" x2="17" y2="13"/>
    </svg>
  ),
  Fridge: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="5" y1="10" x2="19" y2="10"/>
      <line x1="9" y1="6" x2="9" y2="8"/><line x1="9" y1="14" x2="9" y2="18"/>
    </svg>
  ),
  Washer: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="4"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
    </svg>
  ),
  Lights: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>
  ),
  Pump: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5v3H7V7a5 5 0 0 1 5-5z"/><rect x="5" y="10" width="14" height="10" rx="2"/>
      <line x1="12" y1="14" x2="12" y2="16"/>
    </svg>
  ),
};

const defaultIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

export default function UpcomingSchedule({ loads }: UpcomingScheduleProps) {
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
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p style={{ fontFamily: 'Space Grotesk', fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>
          Upcoming Schedule
        </p>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '4px',
      }}>
        {['Appliance', 'Scheduled Time', 'Duration', 'Priority'].map((h) => (
          <p key={h} style={{ fontFamily: 'DM Sans', fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Array.isArray(loads) && loads.map((load, index) => {
          const info = scheduleData[load.name];
          if (!info) return null;
          const p = priorityStyles[info.priority];
          const icon = applianceIcons[load.name] ?? defaultIcon;
          return (
            <div key={load.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: index < loads.length - 1 ? '1px solid #F9FAFB' : 'none',
            }}>
              {/* Appliance */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  backgroundColor: '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {load.name}
                </span>
              </div>

              {/* Time */}
              <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {info.time}
              </span>

              {/* Duration */}
              <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {info.duration}
              </span>

              {/* Priority badge */}
              <span style={{
                fontFamily: 'DM Sans', fontSize: '12px', fontWeight: '500',
                color: p.color,
                backgroundColor: p.bg,
                border: `1px solid ${p.border}`,
                borderRadius: '6px',
                padding: '2px 10px',
                display: 'inline-block',
                width: 'fit-content',
              }}>
                {info.priority}
              </span>
            </div>
          );
        })}
      </div>

      {/* View Full Schedule */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <p style={{
          fontFamily: 'DM Sans', fontSize: '12px', color: 'var(--primary)',
          fontWeight: '500', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          View Full Schedule
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </p>
      </div>
    </div>
  );
}