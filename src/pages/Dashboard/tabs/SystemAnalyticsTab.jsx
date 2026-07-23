import React, { useState, useEffect } from 'react';
import StatCard from '../../../components/cards/StatCard';
import { adminStats } from '../../../services/api';
import {
  FiUsers, FiUserCheck, FiUserX, FiUserPlus, FiBookOpen,
  FiClock, FiBriefcase, FiShield, FiLoader, FiAlertCircle
} from 'react-icons/fi';

const SystemAnalyticsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    adminStats()
      .then((data) => { if (active) setStats(data); })
      .catch((e) => active && setError(e.message || 'Failed to load platform statistics.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const roles = (stats && stats.roles) || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Platform Infrastructure Analytics</h2>
        <p className="text-xs text-on-surface-variant">Live usage metrics across users, resources, and opportunities pulled from the platform database.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiLoader className="animate-spin" size={18} />
          <span className="text-sm font-semibold">Loading platform statistics…</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b]">
          <FiAlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard title="Total Users" value={stats.total_users ?? 0} icon={FiUsers} color="blue" />
            <StatCard title="Verified Users" value={stats.verified_users ?? 0} icon={FiUserCheck} color="green" />
            <StatCard title="Unverified Users" value={stats.unverified_users ?? 0} icon={FiUserX} color="orange" />
            <StatCard title="Total Resources" value={stats.total_resources ?? 0} icon={FiBookOpen} color="purple" />
            <StatCard title="Resources Pending Review" value={stats.resources_pending_review ?? 0} icon={FiClock} color="orange" />
            <StatCard title="Total Opportunities" value={stats.total_opportunities ?? 0} icon={FiBriefcase} color="indigo" />
            <StatCard title="New Users (7 days)" value={stats.new_users_last_7_days ?? 0} icon={FiUserPlus} color="green" />
            <StatCard title="New Users (30 days)" value={stats.new_users_last_30_days ?? 0} icon={FiUserPlus} color="blue" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <FiShield size={16} className="text-primary" /> Users by Role
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Students" value={roles.student ?? 0} icon={FiUsers} color="blue" />
              <StatCard title="Recruiters" value={roles.recruiter ?? 0} icon={FiUsers} color="indigo" />
              <StatCard title="Faculty" value={roles.faculty ?? 0} icon={FiUsers} color="purple" />
              <StatCard title="Admins" value={roles.admin ?? 0} icon={FiUsers} color="green" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemAnalyticsTab;
