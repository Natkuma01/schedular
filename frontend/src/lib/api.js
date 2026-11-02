const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const ACCESS = 'planner-access-token';
const REFRESH = 'planner-refresh-token';

function save(tokens) {
  localStorage.setItem(ACCESS, tokens.access);
  if (tokens.refresh) localStorage.setItem(REFRESH, tokens.refresh);
}

export function hasSession() {
  return Boolean(localStorage.getItem(REFRESH));
}

export async function login(username, password) {
  const response = await fetch(`${base}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Invalid username or password');
  save(await response.json());
}

export async function register(username, email, password) {
  const response = await fetch(`${base}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Unable to create account');
  save(body);
}

async function refreshAccess() {
  const refresh = localStorage.getItem(REFRESH);
  if (!refresh) return false;
  const response = await fetch(`${base}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) { clearSession(); return false; }
  save(await response.json());
  return true;
}

let refreshing = null;
export async function api(path, options = {}, retry = true) {
  const access = localStorage.getItem(ACCESS);
  const response = await fetch(`${base}/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 401 && retry) {
    refreshing ||= refreshAccess().finally(() => { refreshing = null; });
    if (await refreshing) return api(path, options, false);
  }
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.status === 204 ? null : response.json();
}

export function clearSession() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

export async function logout() {
  const refresh = localStorage.getItem(REFRESH);
  if (refresh) await api('/auth/logout/', { method: 'POST', body: JSON.stringify({ refresh }) }).catch(() => null);
  clearSession();
}
