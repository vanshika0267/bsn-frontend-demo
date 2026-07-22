import React, { useState } from 'react';
import { searchCandidates } from '../../../services/api';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import { FiSearch, FiUser, FiAlertCircle, FiLoader } from 'react-icons/fi';

const CandidateSearchTab = () => {
  const [query, setQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [college, setCollege] = useState('');

  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const skillsList = ['React.js', 'Python', 'Node.js', 'C++', 'PyTorch', 'Figma'];

  const runSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await searchCandidates({ skill: selectedSkill, college, q: query });
      setResults(Array.isArray(data?.results) ? data.results : []);
      setCount(typeof data?.count === 'number' ? data.count : (data?.results?.length || 0));
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
      setResults([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Verified Talent Discovery</h2>
          <p className="text-xs text-on-surface-variant">Filter college candidates by real, audited project scores and skill verification records.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card>
        <form onSubmit={runSearch} className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 w-full">
            <SearchBar
              placeholder="Search candidates by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-56">
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="College / institution"
              className="w-full bg-white border border-outline-variant rounded-lg text-xs font-semibold text-on-surface px-3 py-2.5 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-lg text-xs font-semibold text-on-surface px-3 py-2.5 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">All Skills</option>
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <FiLoader className="animate-spin" size={14} /> : <FiSearch size={14} />}
            Search
          </button>
        </form>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-xs font-semibold text-error">
          <FiAlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiLoader className="animate-spin" size={22} />
          <span className="text-xs font-semibold">Searching candidates...</span>
        </div>
      ) : searched && results.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiUser size={26} />
          <span className="text-xs font-semibold">No candidates match your filters.</span>
        </div>
      ) : !searched ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiSearch size={26} />
          <span className="text-xs font-semibold">Enter filters and search to discover verified talent.</span>
        </div>
      ) : (
        <>
          <p className="text-xs text-on-surface-variant font-semibold">
            <span className="text-on-surface font-bold">{count}</span> candidate{count === 1 ? '' : 's'} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map((cand) => (
              <Card key={cand.user_id} hoverable className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center text-xl shrink-0 font-bold">
                    {(cand.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-on-surface text-sm">{cand.name}</h3>
                    <p className="text-xs text-on-surface-variant font-semibold mt-0.5">{cand.email}</p>
                    <p className="text-xs text-on-surface-variant font-semibold mt-0.5">{cand.college || 'College not listed'}</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wide mt-1">
                      {[cand.branch, cand.year].filter(Boolean).join(' • ') || 'Details pending'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-3">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1.5">Verified Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(cand.skills && cand.skills.length > 0) ? (
                      cand.skills.map((skill, idx) => (
                        <Badge key={idx} variant="primary">{skill}</Badge>
                      ))
                    ) : (
                      <span className="text-[10px] text-on-surface-variant font-semibold">No skills listed</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateSearchTab;
