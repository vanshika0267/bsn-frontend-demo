import React, { useState, useEffect, useCallback } from 'react';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import InputField from '../../../components/common/InputField';
import EmptyState from '../../../components/common/EmptyState';
import { FiPlus, FiBriefcase } from 'react-icons/fi';
import { myOpportunities, createOpportunity } from '../../../services/api';

const CATEGORIES = [
  { value: 'internship', label: 'Internship' },
  { value: 'full_time', label: 'Full-time Job' },
  { value: 'hackathon', label: 'Hackathon' },
];

const emptyForm = {
  title: '', company: '', department: '', stipend: '', location: '',
  category: 'internship', description: '',
  starts_at: '', ends_at: '', team_size: '', prize: '',
};

const JobPostingsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setJobs(await myOpportunities());
    } catch (e) {
      setError(e.message || 'Failed to load postings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        company: form.company,
        description: form.description,
        category: form.category,
        department: form.department,
        stipend: form.stipend,
        location: form.location,
      };
      if (form.category === 'hackathon') {
        if (form.starts_at) payload.starts_at = new Date(form.starts_at).toISOString();
        if (form.ends_at) payload.ends_at = new Date(form.ends_at).toISOString();
        if (form.team_size) payload.team_size = Number(form.team_size);
        payload.prize = form.prize;
      }
      await createOpportunity(payload);
      setIsModalOpen(false);
      setForm(emptyForm);
      await load();
    } catch (e2) {
      setError(e2.message || 'Failed to create posting');
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleDateString(); } catch { return '—'; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Your Posted Opportunities</h2>
          <p className="text-xs text-on-surface-variant">Post internships, jobs, hackathons, and track applications received.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <FiPlus size={14} /> New Listing
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading postings…</p>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No postings yet"
          description="Click 'New Listing' to post your first opportunity."
        />
      ) : (
        <Table
          headers={['Role / Opportunity', 'Category', 'Team / Dept', 'Stipend', 'Applicants', 'Status', 'Posted']}
          data={jobs}
          renderRow={(job) => (
            <tr key={job.id} className="hover:bg-surface transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-primary shrink-0" size={16} />
                  <span className="font-bold text-on-surface">{job.title}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-on-surface-variant capitalize">{(job.category || '').replace('_', ' ')}</td>
              <td className="px-6 py-4 text-on-surface-variant">{job.department || '—'}</td>
              <td className="px-6 py-4 font-bold text-primary">{job.category === 'hackathon' ? (job.prize || '—') : (job.stipend || 'Unpaid')}</td>
              <td className="px-6 py-4 font-bold">{job.applicant_count} Candidates</td>
              <td className="px-6 py-4">
                <Badge variant={job.status === 'active' ? 'primary' : 'secondary'}>
                  {(job.status || '').toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4 text-on-surface-variant">{fmtDate(job.created_at)}</td>
            </tr>
          )}
        />
      )}

      <Modal isOpen={isModalOpen} title="Post an Opportunity" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Role / Title" placeholder="e.g., Software Engineering Intern" value={form.title} onChange={set('title')} required />

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <InputField label="Company" placeholder="e.g., Stripe" value={form.company} onChange={set('company')} />
            <InputField label="Department / Team" placeholder="e.g., Core API" value={form.department} onChange={set('department')} />

            {form.category === 'hackathon' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Starts" type="date" value={form.starts_at} onChange={set('starts_at')} />
                  <InputField label="Ends" type="date" value={form.ends_at} onChange={set('ends_at')} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Team size" type="number" placeholder="e.g., 4" value={form.team_size} onChange={set('team_size')} />
                  <InputField label="Prize" placeholder="e.g., $5,000" value={form.prize} onChange={set('prize')} />
                </div>
              </>
            ) : (
              <InputField label="Stipend / month" placeholder="e.g., $9,500 / Month" value={form.stipend} onChange={set('stipend')} />
            )}

            <InputField label="Location" placeholder="e.g., Remote" value={form.location} onChange={set('location')} />

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                placeholder="Role details, requirements…"
                className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-outline-variant hover:bg-surface text-on-surface text-xs font-bold rounded-lg transition-colors">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary hover:bg-primary/95 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors">
                {submitting ? 'Publishing…' : 'Publish Opportunity'}
              </button>
            </div>
          </form>
      </Modal>
    </div>
  );
};

export default JobPostingsTab;
