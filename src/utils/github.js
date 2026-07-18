/**
 * Jiya - GitHub Integration
 * Frontend GitHub API client - designed for future backend proxy integration
 */

const GITHUB_API_BASE = 'https://api.github.com';

export function parseGitHubInput(input) {
  if (!input) return null;
  const trimmed = input.trim();

  // Direct username
  if (/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
    return trimmed;
  }

  // URL patterns
  try {
    const urlPatterns = [
      /github\.com\/([a-zA-Z0-9-]{1,39})\/?(?:[?#].*)?$/,
      /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9-]{1,39})/i,
    ];
    for (const pattern of urlPatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) return match[1];
    }
    // If it's a full URL, try URL parsing
    if (trimmed.startsWith('http')) {
      const u = new URL(trimmed);
      if (u.hostname.includes('github.com')) {
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts[0]) return parts[0];
      }
    }
  } catch {}

  return null;
}

export async function fetchGitHubUser(username) {
  const res = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // Future: Authorization token via backend proxy
      // 'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('GitHub user not found');
    if (res.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchGitHubRepos(username, sort = 'updated') {
  // Fetch up to 100 public repos, sorted
  const res = await fetch(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=${sort}&per_page=100&type=owner`,
    {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    }
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error('Repositories not found');
    if (res.status === 403) throw new Error('GitHub API rate limit exceeded');
    throw new Error(`Failed to fetch repos: ${res.status}`);
  }
  const repos = await res.json();
  // Filter out forks optionally? keeping all public for now
  return repos
    .filter(r => !r.private)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

// Local storage helpers for Jiya's GitHub Integration
const GITHUB_STORAGE_KEY = 'biopay_github_username_v1';

export function saveGitHubUsername(username) {
  try {
    localStorage.setItem(GITHUB_STORAGE_KEY, username);
  } catch {}
}

export function getSavedGitHubUsername() {
  try {
    return localStorage.getItem(GITHUB_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearGitHubUsername() {
  try {
    localStorage.removeItem(GITHUB_STORAGE_KEY);
  } catch {}
}

export function getSyncMeta() {
  try {
    const raw = localStorage.getItem('biopay_github_sync_meta');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSyncMeta(meta) {
  try {
    localStorage.setItem('biopay_github_sync_meta', JSON.stringify(meta));
  } catch {}
}
