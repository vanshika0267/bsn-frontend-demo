import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Table from '../../../components/common/Table';
import { studentsLeaderboard, collegesLeaderboard } from '../../../services/api';
import { FiAward, FiZap, FiAlertCircle } from 'react-icons/fi';

const LeaderboardTab = () => {
  const { user } = useApp();
  const [view, setView] = useState('Students');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const fetcher = view === 'Students' ? studentsLeaderboard() : collegesLeaderboard();
    fetcher
      .then((data) => {
        if (!active) return;
        const rows = Array.isArray(data) ? data : [];
        if (view === 'Students') setStudents(rows);
        else setColleges(rows);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load leaderboard.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [view]);

  const views = ['Students', 'Colleges'];

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#fefce8] text-[#854d0e] border border-[#fef08a] text-xs font-bold">🥇</span>;
    if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant text-xs font-bold">🥈</span>;
    if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5] text-xs font-bold">🥉</span>;
    return <span className="text-on-surface-variant font-semibold">{rank}</span>;
  };

  const filteredStudents = students.filter((s) =>
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelf = (s) => user && (s.id === user.id || s.name === user.name);

  const renderStudentRow = (student) => {
    const self = isSelf(student);
    return (
      <tr
        key={student.id || student.rank}
        className={`transition-colors duration-150 ${
          self
            ? 'bg-[#eff6ff]/40 hover:bg-[#eff6ff]/70 border-y border-primary/20 font-semibold'
            : 'hover:bg-surface'
        }`}
      >
        <td className="px-6 py-4 text-center">{getRankBadge(student.rank)}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg select-none">👨‍💻</span>
            <span className={self ? 'text-primary font-bold' : 'text-on-surface font-semibold'}>
              {student.name}{self ? ' (You)' : ''}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <Badge variant="primary">{student.college || '—'}</Badge>
        </td>
        <td className="px-6 py-4 font-bold text-on-surface font-poppins">
          {(student.score ?? 0).toLocaleString()} XP
        </td>
      </tr>
    );
  };

  const renderCollegeRow = (college) => (
    <tr key={college.college || college.rank} className="transition-colors duration-150 hover:bg-surface">
      <td className="px-6 py-4 text-center">{getRankBadge(college.rank)}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg select-none">🏫</span>
          <span className="text-on-surface font-semibold">{college.college}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-on-surface font-poppins">
        {(college.total_score ?? 0).toLocaleString()} XP
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Batch Leaderboard</h2>
          <p className="text-xs text-on-surface-variant">Compete with your peers, complete achievements, upload resources and climb the ranking ladder.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl flex items-center gap-3 bg-white border border-outline-variant shadow-sm">
            <FiAward className="h-7 w-7 text-amber-500" />
            <div className="text-left">
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Ranking</span>
              <p className="text-base font-black text-on-surface leading-tight">{view}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle Panel */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {view === 'Students' && (
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name..."
              className="sm:max-w-xs"
            />
          )}
        </div>

        {/* View Selector */}
        <div className="flex bg-surface-container border border-outline-variant p-1 rounded-lg self-start lg:self-auto">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                view === v
                  ? 'bg-white text-primary shadow-sm border border-outline-variant/50'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] text-sm font-semibold">
          <FiAlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="w-full rounded-xl border border-outline-variant bg-white shadow-sm p-10 text-center text-sm text-on-surface-variant font-medium animate-pulse">
          Loading leaderboard…
        </div>
      ) : view === 'Students' ? (
        <Table
          headers={['Rank', 'Student Name', 'College', 'Total Score']}
          data={filteredStudents}
          renderRow={renderStudentRow}
          emptyMessage={error ? 'Could not load rankings.' : 'No students on the leaderboard yet.'}
        />
      ) : (
        <Table
          headers={['Rank', 'College', 'Total Score']}
          data={colleges}
          renderRow={renderCollegeRow}
          emptyMessage={error ? 'Could not load rankings.' : 'No colleges on the leaderboard yet.'}
        />
      )}
    </div>
  );
};

export default LeaderboardTab;
