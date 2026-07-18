// Tiny API helper for talking to the BSN backend.
const API_URL = "https://bsn-deploy.onrender.com";

export const getToken = () => localStorage.getItem("bsn_token");
export const setToken = (t) =>
  t ? localStorage.setItem("bsn_token", t) : localStorage.removeItem("bsn_token");

// helper for authenticated JSON GETs (use this in feature tabs later)
export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
  });
  if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`);
  return res.json();
}

export async function apiRegister({ name, email, password, college }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, college }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.detail || "Registration failed");
  }
  return res.json();
}

export async function apiLogin(email, password) {
  // backend uses an OAuth2 form where "username" = email
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Invalid email or password");
  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function apiGetMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}
