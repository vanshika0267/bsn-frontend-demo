import React, { useState, useEffect, useCallback } from 'react';
import { myOpportunities, getApplicants, setApplicationStatus } from '../../../services/api';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import { FiInbox, FiAlertCircle, FiLoader } from 'react-icons/fi';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'Accepted', 'Rejected'];

const statusVariant = (status) => {
  switch (status) {
    case 'Accepted': return 'success';
    case 'Shortlisted': return 'primary';
    case 'Rejected': return 'error';
    default: return 'default';
  }
};

const ApplicationsTab = () => {
  const [opps, setOpps] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [oppTitle, setOppTitle] = useState('');

  const [loadingOpps, setLoadingOpps] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  // Load the recruiter's own postings on mount.
  useEffect(() => {
    let active = true;
    setLoadingOpps(true);
    setError('');
    myOpportunities()
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setOpps(list);
        if (list.length > 0) setSelectedOppId(String(list[0].id));
      })
      .catch((e) => active && setError(e.message || 'Failed to load your postings.'))
      .finally(() => active && setLoadingOpps(false));
    return () => { active = false; };
  }, []);

  // Fetch applicants for the currently selected posting.
  const loadApplicants = useCallback((oppId) => {
    if (!oppId) { setApplicants([]); setOppTitle(''); return; }
    setLoadingApplicants(true);
    setError('');
    getApplicants(oppId)
      .then((data) => {
        setApplicants(Array.isArray(data?.applicants) ? data.applicants : []);
        setOppTitle(data?.title || '');
      })
      .catch((e) => setError(e.message || 'Failed to load applicants.'))
      .finally(() => setLoadingApplicants(false));
  }, []);

  useEffect(() => {
    loadApplicants(selectedOppId);
  }, [selectedOppId, loadApplicants]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setSavingId(applicationId);
    setError('');
    try {
      await setApplicationStatus(applicationId, newStatus);
      loadApplicants(selectedOppId);
    } catch (e) {
      setError(e.message || 'Failed to update status.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Candidate Applications Manager</h2>
        <p className="text-xs text-on-surface-variant">Review resumes, verify technical match index, and pipeline candidates.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-xs font-semibold text-error">
          <FiAlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Posting selector */}
      <Card className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1.5">Select Posting</label>
          {loadingOpps ? (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-semibold py-2.5">
              <FiLoader className="animate-spin" size={14} /> Loading your postings...
            </div>
          ) : opps.length === 0 ? (
            <p className="text-xs text-on-surface-variant font-semibold py-2.5">You have no postings yet.</p>
          ) : (
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-lg text-xs font-semibold text-on-surface px-3 py-2.5 focus:outline-none focus:border-primary cursor-pointer"
            >
              {opps.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.applicant_count ?? 0} applicants)
                </option>
              ))}
            </select>
          )}
        </div>
        {oppTitle && !loadingApplicants && (
          <div className="text-xs text-on-surface-variant font-semibold md:text-right">
            <span className="text-on-surface font-bold">{applicants.length}</span> applicant{applicants.length === 1 ? '' : 's'} for <span className="text-on-surface font-bold">{oppTitle}</span>
          </div>
        )}
      </Card>

      {loadingApplicants ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiLoader className="animate-spin" size={22} />
          <span className="text-xs font-semibold">Loading applicants...</span>
        </div>
      ) : (!selectedOppId && !loadingOpps) ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiInbox size={26} />
          <span className="text-xs font-semibold">Select a posting to view applicants.</span>
        </div>
      ) : (
        <Table
          headers={['Candidate', 'Email', 'College', 'CV', 'Status', 'Applied', 'Actions']}
          data={applicants}
          emptyMessage="No applicants for this posting yet."
          renderRow={(app) => (
            <tr key={app.application_id} className="hover:bg-surface transition-colors">
              <td className="px-6 py-4 font-bold text-on-surface">{app.name}</td>
              <td className="px-6 py-4 text-on-surface-variant">{app.email}</td>
              <td className="px-6 py-4 text-on-surface-variant">{app.college || '-'}</td>
              <td className="px-6 py-4">
                {app.resume_url ? (
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View CV
                  </a>
                ) : (
                  <span className="text-xs text-on-surface-variant">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
              </td>
              <td className="px-6 py-4 text-on-surface-variant">
                {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <select
                    value={app.status}
                    disabled={savingId === app.application_id}
                    onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                    className="bg-white border border-outline-variant rounded-lg text-xs font-semibold text-on-surface px-2 py-1.5 focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {savingId === app.application_id && <FiLoader className="animate-spin text-primary" size={14} />}
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
};

export default ApplicationsTab;
