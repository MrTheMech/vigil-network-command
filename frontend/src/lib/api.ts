const API_BASE = import.meta.env.VITE_API_BASE || 'http://13.200.105.135:4000';

export async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error('Bad status');
    const json = await res.json();
    if (json && json.success) return json.data as T;
    return fallback;
  } catch {
    return fallback;
  }
}

