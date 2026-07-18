import React from 'react';

export default function GitHubProfileCard({ user, onDisconnect }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[--color-border-gray]">
      <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-2xl" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display font-semibold text-[--color-secondary-navy] text-lg">
              {user.name || user.login}
            </div>
            <a href={user.html_url} target="_blank" rel="noreferrer"
               className="text-[--color-primary-blue] text-sm hover:underline">
              @{user.login}
            </a>
            {user.bio && <p className="text-sm text-slate-600 mt-1.5 max-w-xl">{user.bio}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
              {user.company && <span>🏢 {user.company}</span>}
              {user.location && <span>📍 {user.location}</span>}
              {user.blog && <span>🔗 {user.blog}</span>}
            </div>
          </div>
          {onDisconnect && (
            <button
              onClick={onDisconnect}
              className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 whitespace-nowrap"
            >
              Disconnect
            </button>
          )}
        </div>
        <div className="flex gap-5 mt-3 text-sm">
          <span><b className="text-[--color-secondary-navy]">{user.public_repos}</b> <span className="text-slate-500">repos</span></span>
          <span><b className="text-[--color-secondary-navy]">{user.followers}</b> <span className="text-slate-500">followers</span></span>
          <span><b className="text-[--color-secondary-navy]">{user.following}</b> <span className="text-slate-500">following</span></span>
        </div>
      </div>
    </div>
  );
}
