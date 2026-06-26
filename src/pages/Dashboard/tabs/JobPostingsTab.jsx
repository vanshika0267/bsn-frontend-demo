import React, { useState } from 'react';
import { recruiterJobPostings } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import InputField from '../../../components/common/InputField';
import { FiPlus, FiBriefcase } from 'react-icons/fi';

const JobPostingsTab = () => {
  const [jobs, setJobs] = useState(recruiterJobPostings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', team: '', stipend: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newJob = {
      id: `job_${jobs.length + 1}`,
      title: form.title,
      team: form.team,
      status: 'Active',
      applicantsCount: 0,
      postedDate: 'Today',
      stipend: form.stipend || 'Unpaid'
    };
    setJobs([newJob, ...jobs]);
    setIsModalOpen(false);
    setForm({ title: '', team: '', stipend: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Your Posted Opportunities</h2>
          <p className="text-xs text-on-surface-variant">Post internships, challenges, and track active applications received.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <FiPlus size={14} /> New Listing
        </button>
      </div>

      <Table 
        headers={['Role / Opportunity', 'Team / Dept', 'Stipend', 'Applicants', 'Status', 'Posted']}
        data={jobs}
        renderRow={(job) => (
          <tr key={job.id} className="hover:bg-surface transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <FiBriefcase className="text-primary shrink-0" size={16} />
                <span className="font-bold text-on-surface">{job.title}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-on-surface-variant">{job.team}</td>
            <td className="px-6 py-4 font-bold text-primary">{job.stipend}</td>
            <td className="px-6 py-4 font-bold">{job.applicantsCount} Candidates</td>
            <td className="px-6 py-4">
              <Badge variant="primary">{job.status}</Badge>
            </td>
            <td className="px-6 py-4 text-on-surface-variant">{job.postedDate}</td>
          </tr>
        )}
      />

      {/* Post Job Modal */}
      {isModalOpen && (
        <Modal 
          title="Post Corporate Opportunity" 
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField 
              label="Role Title"
              placeholder="e.g., Software Engineering Intern"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <InputField 
              label="Department / Team"
              placeholder="e.g., Core API Pipelines"
              value={form.team}
              onChange={(e) => setForm({ ...form, team: e.target.value })}
              required
            />
            <InputField 
              label="Stipend per Month ($)"
              placeholder="e.g., $9,500 / Month"
              value={form.stipend}
              onChange={(e) => setForm({ ...form, stipend: e.target.value })}
              required
            />
            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-outline-variant hover:bg-surface text-on-surface text-xs font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Publish Opportunity
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default JobPostingsTab;
