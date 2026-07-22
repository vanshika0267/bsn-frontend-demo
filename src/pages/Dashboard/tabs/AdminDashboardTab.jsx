import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/cards/StatCard';
import { adminStats } from '../../../services/api';
import {
  FiUsers, FiUserCheck, FiUserX, FiBookOpen, FiClock, FiBriefcase,
  FiUserPlus, FiCalendar, FiShield, FiAlertCircle, FiRefreshCw
} from 'react-icons/fi';

const AdminDashboardTab = () => {
  const { user } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    let active = true;
    setLoading(true);
    setError(null);
    adminStats()
      .then((data) => {
        if (active) setStats(data || null);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load admin statistics.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  };

  useEffect(() => {
    return load();
  }, []);

  const roles = (stats && stats.roles) || {};

  const cards = stats
    ? [
        { title: 'Total Users', value: stats.total_users ?? 0, icon: FiUsers, color: 'blue' },
        { title: 'Verified Users', value: stats.verified_users ?? 0, icon: FiUserCheck, color: 'green' },
        { title: 'Unverified Users', value: stats.unverified_users ?? 0, icon: FiUserX, color: 'orange' },
        { title: 'Students', value: roles.student ?? 0, icon: FiUsers, color: 'indigo' },
        { title: 'Recruiters', value: roles.recruiter ?? 0, icon: FiBriefcase, color: 'purple' },
        { title: 'Faculty', value: roles.faculty ?? 0, icon: FiUsers, color: 'blue' },
        { title: 'Admins', value: roles.admin ?? 0, icon: FiShield, color: 'orange' },
        { title: 'New Users (7d)', value: stats.new_users_last_7_days ?? 0, icon: FiUserPlus, color: 'green' },
        { title: 'New Users (30d)', value: stats.new_users_last_30_days ?? 0, icon: FiCalendar, color: 'indigo' },
        { title: 'Total Resources', value: stats.total_resources ?? 0, icon: FiBookOpen, color: 'purple' },
        { title: 'Resources Pending Review', value: stats.resources_pending_review ?? 0, icon: FiClock, color: 'orange' },
        { title: 'Total Opportunities', value: stats.total_opportunities ?? 0, icon: FiBriefcase, color: 'blue' },
      ]
    : [];

  return (
    <div className="space-y-6 text-left">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-on-surface">Administrative Control Hub</h1>
          <p className="text-xs text-on-surface-variant">Review network metrics across users, resources, and opportunities.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] text-sm font-semibold">
          <FiAlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm h-28 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, idx) => (
            <StatCard
              key={idx}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardTab;
