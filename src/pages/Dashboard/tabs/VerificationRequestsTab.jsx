import React, { useState } from 'react';
import { collegeVerifications } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import { FiCheck, FiX, FiShield } from 'react-icons/fi';

const VerificationRequestsTab = () => {
  const [requests, setRequests] = useState(collegeVerifications);

  const handleVerify = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Verified Academic Badge Queue</h2>
        <p className="text-xs text-on-surface-variant">Review cryptographic certificates uploaded by students to award the official **Verified Profile Badge**.</p>
      </div>

      <Table 
        headers={['Student Name', 'Certificate / Badge Name', 'Cryptographic Hash', 'Status', 'Submitted', 'Actions']}
        data={requests}
        renderRow={(req) => (
          <tr key={req.id} className="hover:bg-surface transition-colors">
            <td className="px-6 py-4 font-bold text-on-surface">{req.studentName}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-1.5">
                <FiShield className="text-primary shrink-0" size={14} />
                <span className="font-semibold">{req.badgeName}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <code className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant font-mono text-on-surface-variant">
                {req.hash}
              </code>
            </td>
            <td className="px-6 py-4">
              <Badge variant={req.status === 'Verified' ? 'success' : req.status === 'Rejected' ? 'error' : 'primary'}>
                {req.status}
              </Badge>
            </td>
            <td className="px-6 py-4 text-on-surface-variant">{req.submittedDate}</td>
            <td className="px-6 py-4">
              {req.status === 'Pending' ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleVerify(req.id, 'Verified')}
                    className="p-1 hover:bg-success/10 rounded-lg text-success transition-colors"
                    title="Verify"
                  >
                    <FiCheck size={16} />
                  </button>
                  <button 
                    onClick={() => handleVerify(req.id, 'Rejected')}
                    className="p-1 hover:bg-error/10 rounded-lg text-error transition-colors"
                    title="Reject"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-on-surface-variant font-semibold">Done</span>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default VerificationRequestsTab;
