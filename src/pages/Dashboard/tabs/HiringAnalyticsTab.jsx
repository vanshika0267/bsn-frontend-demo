import React, { useState, useEffect } from 'react';
import StatCard from '../../../components/cards/StatCard';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { myOpportunities } from '../../../services/api';
import { FiBriefcase, FiUsers, FiCheckCircle, FiXCircle, FiLoader, FiAlertCircle, FiInbox } from 'react-icons/fi';

const HiringAnalyticsTab = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    myOpportunities()
      .then((data) => { if (active) setPostings(Array.isArray(data) ? data : []); })
      .catch((e) => active && setError(e.message || 'Failed to load your postings.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const totalPostings = postings.length;
  const totalApplicants = postings.reduce((sum, p) => sum + (p.applicant_count || 0), 0);
  const activeCount = postings.filter((p) => p.status === 'active').length;
  const closedCount = totalPostings - activeCount;

  const byCategory = postings.reduce((acc, p) => {
    const key = (p.category || 'other');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const metrics = [];
  const funnel = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Hiring Analytics</h2>
        <p className="text-xs text-on-surface-variant">A snapshot of your postings and applicant volume, computed from your live job data.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiLoader className="animate-spin" size={18} />
          <span className="text-sm font-semibold">Loading your hiring analytics…</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b]">
          <FiAlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {!loading && !error && totalPostings === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-white border border-dashed border-outline-variant rounded-xl">
          <FiInbox size={28} className="text-on-surface-variant mb-3" />
          <h3 className="text-base font-semibold text-on-surface mb-1">No postings yet</h3>
          <p className="text-xs text-on-surface-variant max-w-sm">Analytics will appear here once you create job postings and candidates start applying.</p>
        </div>
      )}

      {!loading && !error && totalPostings > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard title="Total Postings" value={totalPostings} icon={FiBriefcase} color="blue" />
            <StatCard title="Total Applicants" value={totalApplicants} icon={FiUsers} color="indigo" />
            <StatCard title="Active Postings" value={activeCount} icon={FiCheckCircle} color="green" />
            <StatCard title="Closed Postings" value={closedCount} icon={FiXCircle} color="orange" />
          </div>

          <Card>
            <h3 className="text-sm font-bold text-on-surface mb-4">Postings by Category</h3>
            <div className="space-y-3">
              {categoryEntries.map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">{String(cat).replace('_', ' ')}</Badge>
                  </div>
                  <span className="text-sm font-bold text-on-surface">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      <Card className="py-14 text-center border-dashed">
        <h3 className="text-sm font-bold text-on-surface mb-2">Hiring analytics are not available yet</h3>
        <p className="text-xs text-on-surface-variant">This section will display real recruitment metrics once data has been synchronized from the backend.</p>
      </Card>
    </div>
  );
};

export default HiringAnalyticsTab;
