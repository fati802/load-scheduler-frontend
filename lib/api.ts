const API_BASE = 'https://load-scheduler-backend.onrender.com';

async function safeFetch(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getStats() {
  const data = await safeFetch(`${API_BASE}/api/stats`);
  return data ?? { total_load_w: 0, peak_limit_w: 4000, within_limit: true, deferred_count: 0 };
}

export async function getLoads() {
  const data = await safeFetch(`${API_BASE}/api/loads`);
  return data ?? [];
}

export async function getEvents() {
  const data = await safeFetch(`${API_BASE}/api/events`);
  return data ?? [];
}

export async function getLoadReadings() {
  const data = await safeFetch(`${API_BASE}/api/readings`);
  return data ?? [];
}