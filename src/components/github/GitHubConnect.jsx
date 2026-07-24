import React, { useState, useEffect } from 'react';
import { parseGitHubInput, fetchGitHubUser, fetchGitHubRepos, saveGitHubUsername, getSavedGitHubUsername, clearGitHubUsername, saveSyncMeta, getSyncMeta } from '../../utils/github';
import GitHubProfileCard from './GitHubProfileCard';
import GitHubRepoList from './GitHubRepoList';
import { useApp } from '../../context/AppContext';

export default function GitHubConnect() {
  const { setGithubUsername } = useApp();
  const [input, setInput] = useState('');
  const [username, setUsername] = useState(null);
  const [ghUser, setGhUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncMeta, setSyncMeta] = useState(() => getSyncMeta());

  useEffect(() => {
    const saved = getSavedGitHubUsername();
    if (saved && !username) {
      setInput(saved);
      handleConnect(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async (rawInput) => {
    const toParse = rawInput ?? input;
    setError(null);
    const parsed = parseGitHubInput(toParse);
    if (!parsed) {
      setError('Enter a valid GitHub username or https://github.com/username URL');
      return;
    }
    setLoading(true);
    try {
      const [user, repoList] = await Promise.all([
        fetchGitHubUser(parsed),
        fetchGitHubRepos(parsed)
      ]);
      setGhUser(user);
      setRepos(repoList);
      setUsername(parsed);
      saveGitHubUsername(parsed);
      setGithubUsername(parsed);
      const meta = {
        lastSyncedAt: new Date().toISOString(),
        repoCount: repoList.length,
        username: parsed
      };
      saveSyncMeta(meta);
      setSyncMeta(meta);
    } catch (e) {
      setError(e.message || 'Failed to connect GitHub');
      setGhUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (username) handleConnect(username);
  };

  const handleDisconnect = () => {
    clearGitHubUsername();
    setUsername(null);
    setGhUser(null);
    setRepos([]);
    setInput('');
    setGithubUsername(null);
    setSyncMeta(null);
    try { localStorage.removeItem('biopay_github_sync_meta'); } catch {}
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          </div>
          <div className="text-left">
            <h3 className="font-display text-[18px] font-semibold text-[--color-secondary-navy]">GitHub Profile</h3>
            <p className="text-[12px] text-slate-500">Connect repositories • auto-sync</p>
          </div>
        </div>
        {username && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 hidden sm:block">
              {syncMeta ? `Synced ${new Date(syncMeta.lastSyncedAt).toLocaleString()}` : ''}
            </span>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="text-[12px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Syncing…' : '↻ Refresh'}
            </button>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {!username ? (
          <div className="bg-[#F8FAFC] github-inner-card border border-slate-200 rounded-[18px] p-5 text-left">
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              GitHub username or profile URL
            </label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleConnect()}
                placeholder="torvalds or https://github.com/vercel"
                className="flex-1 px-4 py-[12px] rounded-xl border border-slate-200 focus:outline-none focus:ring-[3px] focus:ring-slate-900/8 focus:border-slate-800 text-[14px] bg-white text-on-surface github-username-input transition-all"
              />
              <button
                onClick={() => handleConnect()}
                disabled={loading || !input.trim()}
                className="px-5 py-[12px] rounded-xl bg-slate-900 text-white text-[14px] font-[500] hover:bg-black transition disabled:opacity-50 whitespace-nowrap cursor-pointer github-connect-button"
              >
                {loading ? 'Connecting…' : 'Connect'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 github-helper-text">
              Public repositories only. New repos appear after refresh.
            </p>
          </div>
        ) : (
          ghUser && <GitHubProfileCard user={ghUser} onDisconnect={handleDisconnect} />
        )}

        {error && (
          <div className="text-[13px] px-4 py-3 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-left">
            {error}
          </div>
        )}

        {username && (
          <div className="text-left">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-semibold text-[--color-secondary-navy]">
                Repositories <span className="text-slate-500 font-sans font-normal text-[14px]">({repos.length})</span>
              </h4>
              <div className="text-[11px] text-slate-500">auto-updates on refresh</div>
            </div>
            <GitHubRepoList repos={repos} loading={loading && !repos.length} />
          </div>
        )}
      </div>
    </div>
  );
}
