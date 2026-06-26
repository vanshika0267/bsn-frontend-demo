import React, { useState } from 'react';
import { recruiterApplications } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const ApplicationsTab = () => {
  const [apps, setApps] = useState(recruiterApplications);

  const handleStatusChange = (id, newStatus) => {
    setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Candidate Applications Manager</h2>
        <p className="text-xs text-on-surface-variant">Review resumes, verify technical match index, and pipeline candidates.</p>
      </div>

      <Table 
        headers={['Candidate', 'Applied Role', 'Match Index', 'Status', 'Applied', 'Actions']}
        data={apps}
        renderRow={(app) => (
          <tr key={app.id} className="hover:bg-surface transition-colors">
            <td className="px-6 py-4 font-bold text-on-surface">{app.candidateName}</td>
            <td className="px-6 py-4 text-on-surface-variant">{app.jobTitle}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-1.5">
                <div className="w-12 bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${app.matchScore}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-primary">{app.matchScore}% Match</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <Badge variant={app.status === 'Shortlisted' ? 'success' : 'primary'}>
                {app.status}
              </Badge>
            </td>
            <td className="px-6 py-4 text-on-surface-variant">{app.appliedDate}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                  className="p-1 hover:bg-success/10 rounded-lg text-success transition-colors"
                  title="Shortlist"
                >
                  <FiCheckCircle size={15} />
                </button>
                <button 
                  onClick={() => handleStatusChange(app.id, 'Rejected')}
                  className="p-1 hover:bg-error/10 rounded-lg text-error transition-colors"
                  title="Reject"
                >
                  <FiXCircle size={15} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default ApplicationsTab;
