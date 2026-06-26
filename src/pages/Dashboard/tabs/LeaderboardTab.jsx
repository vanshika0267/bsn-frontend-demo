import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Table from '../../../components/common/Table';
import { FiAward, FiTrendingUp, FiCheck, FiZap } from 'react-icons/fi';

const LeaderboardTab = () => {
  const { user } = useApp();
  const [track, setTrack] = useState('All');
  const [period, setPeriod] = useState('Monthly');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data showing rankings of interns
  const leaderboardData = [
    { rank: 1, name: 'Sarah Connor', college: 'Stanford University', track: 'Discrete Mathematics', xp: 2450, contributions: 24, badges: 8, streak: 12, avatar: '👩‍💻' },
    { rank: 2, name: 'Kabir Mehta', college: 'IIT Bombay', track: 'Java', xp: 2120, contributions: 18, badges: 6, streak: 8, avatar: '👨‍💻' },
    { rank: 3, name: 'Emily Watson', college: 'Oxford University', track: 'Software Engineering', xp: 1890, contributions: 15, badges: 5, streak: 15, avatar: '👩‍💻' },
    { rank: 4, name: 'David Chen', college: 'Tsinghua University', track: 'DevOps', xp: 1180, contributions: 9, badges: 3, streak: 2, avatar: '👨‍💻' },
    { rank: 14, name: 'Alex Rivera (You)', college: 'MIT', track: 'Software Engineering', xp: 840, contributions: 11, badges: 4, streak: 5, avatar: '👨‍💻', isSelf: true },
    { rank: 15, name: 'Zoe Jenkins', college: 'UC Berkeley', track: 'Applied Machine Learning', xp: 825, contributions: 5, badges: 2, streak: 3, avatar: '👩‍💻' }
  ];

  const tracks = ['All', 'Software Engineering', 'Discrete Mathematics', 'Java', 'DevOps', 'Applied Machine Learning'];
  const periods = ['Weekly', 'Monthly', 'All-Time'];

  const filteredData = leaderboardData.filter(student => {
    const matchesTrack = track === 'All' || student.track === track;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#fefce8] text-[#854d0e] border border-[#fef08a] text-xs font-bold">🥇</span>;
    if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant text-xs font-bold">🥈</span>;
    if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5] text-xs font-bold">🥉</span>;
    return <span className="text-on-surface-variant font-semibold">{rank}</span>;
  };

  const getTrackBadgeVariant = (t) => {
    switch (t) {
      case 'Software Engineering': return 'primary';
      case 'Discrete Mathematics': return 'secondary';
      case 'Java': return 'success';
      case 'DevOps': return 'warning';
      default: return 'default';
    }
  };

  const renderRow = (student, index) => {
    return (
      <tr 
        key={student.rank} 
        className={`transition-colors duration-150 ${
          student.isSelf || student.name.includes('(You)')
            ? 'bg-[#eff6ff]/40 hover:bg-[#eff6ff]/70 border-y border-primary/20 font-semibold' 
            : 'hover:bg-surface'
        }`}
      >
        <td className="px-6 py-4 text-center">
          {getRankBadge(student.rank)}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg select-none">{student.avatar || '👨‍💻'}</span>
            <span className={student.isSelf || student.name.includes('(You)') ? 'text-primary font-bold' : 'text-on-surface font-semibold'}>{student.name}</span>
            {student.streak > 5 && (
              <FiZap className="h-4 w-4 text-amber-500 fill-current animate-pulse" title={`${student.streak} day streak!`} />
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <Badge variant={getTrackBadgeVariant(student.track)}>
            {student.track}
          </Badge>
        </td>
        <td className="px-6 py-4 font-bold text-on-surface font-poppins">
          {student.xp.toLocaleString()} XP
        </td>
        <td className="px-6 py-4 text-on-surface-variant text-xs">
          {student.contributions} uploads
        </td>
        <td className="px-6 py-4 text-on-surface-variant text-xs">
          {student.badges} badges
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Batch Leaderboard</h2>
          <p className="text-xs text-on-surface-variant">Compete with your peers, complete achievements, upload resources and climb the ranking ladder.</p>
        </div>

        {/* Level Stats Cards */}
        <div className="flex items-center gap-3 shrink-0">
          <Card className="px-4 py-2.5 rounded-xl flex items-center gap-3 bg-white border border-outline-variant">
            <FiAward className="h-7 w-7 text-amber-500" />
            <div className="text-left">
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Your Rank</span>
              <p className="text-base font-black text-on-surface leading-tight">#14 of 48</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters and Search Panel */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name..."
            className="sm:max-w-xs"
          />

          {/* Track selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {tracks.map(t => (
              <button
                key={t}
                onClick={() => setTrack(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
                  track === t 
                    ? 'bg-primary-container text-white border-primary' 
                    : 'bg-transparent hover:bg-surface-container text-on-surface-variant border-outline-variant'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex bg-surface-container border border-outline-variant p-1 rounded-lg self-start lg:self-auto">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                period === p 
                  ? 'bg-white text-primary shadow-sm border border-outline-variant/50' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Grid */}
      <Table 
        headers={['Rank', 'Student Name', 'Primary Track', 'Total XP', 'Contributions', 'Badges']}
        data={filteredData}
        renderRow={renderRow}
        emptyMessage="No students match your current filters."
      />
    </div>
  );
};

export default LeaderboardTab;
