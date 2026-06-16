'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface LoadChartProps {
  data: { hour: number; total_load_w: number }[];
  peakLimit: number;
}

const hourLabels: Record<number, string> = {
  0: '12 AM',
  6: '6 AM',
  12: '12 PM',
  18: '6 PM',
  23: '11 PM',
};

function getBarColor(value: number, peak: number): string {
  const ratio = value / peak;
  if (ratio >= 0.75) return '#5B54C5';
  if (ratio >= 0.4) return '#7C6FF7';
  return '#C4C0FB';
}

export default function LoadChart({ data, peakLimit }: LoadChartProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      height: '100%',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ fontFamily: 'Space Grotesk', fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>
          Load Usage Overview
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          border: '1px solid var(--border)', borderRadius: '8px',
          padding: '6px 12px', cursor: 'pointer',
          backgroundColor: 'var(--sidebar-bg)',
        }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--text-secondary)' }}>Today</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={12} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="hour"
            tickFormatter={(h) => hourLabels[h] ?? ''}
            tick={{ fontSize: 11, fill: '#6B7280', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v / 1000} kW`}
            tick={{ fontSize: 11, fill: '#6B7280', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${(value / 1000).toFixed(2)} kW`, 'Load']}
            labelFormatter={(h) => `Hour ${h}:00`}
            contentStyle={{ fontFamily: 'DM Sans', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
          <ReferenceLine y={peakLimit} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} />
          <Bar dataKey="total_load_w" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.total_load_w, peakLimit)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', justifyContent: 'center' }}>
        {[
          { color: '#C4C0FB', label: 'Low Load' },
          { color: '#7C6FF7', label: 'Moderate Load' },
          { color: '#5B54C5', label: 'High Load' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: item.color }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'var(--text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}