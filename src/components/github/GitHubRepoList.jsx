import React from 'react';

const languageColors = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dart: '#00B4AB',
};

export default function GitHubRepoList({ repos, loading }) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-[--color-border-gray] rounded-2xl p-5 bg-white animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-2/3 mb-3"></div>
            <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!repos || !repos.length) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-[--color-border-gray] rounded-2xl bg-slate-50/50">
        <div className="text-3xl mb-2">📦</div>
        <div className="text-slate-600 font-medium">No public repositories found</div>
        <div className="text-xs text-slate-500 mt-1">Push a new public repo on GitHub, then hit Refresh.</div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {repos.map(repo => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="block border border-[--color-border-gray] rounded-2xl p-5 bg-white hover:shadow-sm hover:border-slate-300 transition group"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display font-semibold text-[--color-primary-blue] group-hover:underline truncate">
              {repo.name}
            </h4>
            <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600 border">public</span>
          </div>
          {repo.description && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2 min-h-[40px]">{repo.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColors[repo.language] || '#94a3b8' }} />
                {repo.language}
              </span>
            )}
            <span>⭐ {repo.stargazers_count}</span>
            <span>🍴 {repo.forks_count}</span>
            <span className="ml-auto">
              updated {new Date(repo.updated_at).toLocaleDateString('en-IN')}
            </span>
          </div>
          {!!repo.topics?.length && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {repo.topics.slice(0, 4).map(t => (
                <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-[#EFF6FF] text-[#1D4ED8]">{t}</span>
              ))}
            </div>
          )}
        </a>
      ))}
    </div>
  );
}
