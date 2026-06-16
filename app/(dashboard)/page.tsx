import { getStats, getLoads, getEvents, getLoadReadings } from '@/lib/api';
import Header from '../components/Header';
import KPICard from '../components/KPICard';
import LoadChart from '../components/LoadChart';
import LoadStatus from '../components/LoadStatus';
import UpcomingSchedule from '../components/UpcomingSchedule';
import RecentAlerts from '../components/RecentAlerts';

export default async function DashboardPage() {
  const [stats, loads, events, readings] = await Promise.all([
    getStats(),
    getLoads(),
    getEvents(),
    getLoadReadings(),
  ]);

  const chartData = Array.isArray(readings) ? readings.map((r: any) => ({
    hour: new Date(r.timestamp).getHours(),
    total_load_w: r.total_load_w,
  })) : [];

  const activeCount = Array.isArray(loads) ? loads.filter((l: any) => l.status === 'ON').length : 0;
  const scheduledCount = Array.isArray(loads) ? loads.filter((l: any) => l.status === 'SCHEDULED').length : 0;
  const inactiveCount = Array.isArray(loads) ? loads.filter((l: any) => l.status === 'OFF').length : 0;
  const overloadedCount = stats.deferred_count ?? 0;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', minHeight: '100%' }}>
      <Header title="Dashboard" subtitle="Overview of home electrical load and automation" />

      <div className="flex gap-3 mb-5">
        <KPICard title="Total Load" value={`${(stats.total_load_w / 1000).toFixed(2)} kW`} subtitle="Live Consumption" iconType="load" />
        <KPICard title="Active Load" value={`${activeCount}`} subtitle="Currently Running" iconType="active" />
        <KPICard title="Scheduled Load" value={`${scheduledCount}`} subtitle="Upcoming" iconType="scheduled" />
        <KPICard title="Overload Alerts" value={`${overloadedCount}`} subtitle="Requires Attention" iconType="alert" alert={overloadedCount > 0} />
      </div>

      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <LoadChart data={chartData} peakLimit={stats.peak_limit_w} />
        </div>
        <div style={{ width: '180px' }}>
          <LoadStatus
            active={activeCount}
            scheduled={scheduledCount}
            inactive={inactiveCount}
            overloaded={overloadedCount}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <UpcomingSchedule loads={loads} />
        </div>
        <div className="flex-1">
          <RecentAlerts events={events} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'var(--text-secondary)' }}>
          © 2025 Automated Home Electrical Load Scheduler
        </p>
        <p style={{ fontFamily: 'DM Sans', fontSize: '11px', color: '#22C55E', fontWeight: '500' }}>
          All systems operational
        </p>
      </div>
    </div>
  );
}