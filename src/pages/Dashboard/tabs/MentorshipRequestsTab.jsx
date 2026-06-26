import React, { useState } from 'react';
import { seniorMentorshipRequests } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import { FiCheck, FiX, FiCalendar } from 'react-icons/fi';

const MentorshipRequestsTab = () => {
  const [requests, setRequests] = useState(seniorMentorshipRequests);

  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Mentorship Consultation Invites</h2>
        <p className="text-xs text-on-surface-variant">Approve or reject student calendar requests for 1-on-1 career consulting.</p>
      </div>

      <Table 
        headers={['Student', 'Discussion Topic', 'Requested Slot', 'Status', 'Actions']}
        data={requests}
        renderRow={(req) => (
          <tr key={req.id} className="hover:bg-surface transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{req.avatar}</span>
                <span className="font-bold text-on-surface">{req.studentName}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-on-surface-variant">{req.topic}</td>
            <td className="px-6 py-4 font-semibold text-primary flex items-center gap-1.5 mt-0.5">
              <FiCalendar size={13} /> {req.dateTime}
            </td>
            <td className="px-6 py-4">
              <Badge variant={req.status === 'Confirmed' ? 'success' : 'primary'}>
                {req.status}
              </Badge>
            </td>
            <td className="px-6 py-4">
              {req.status === 'Pending Approval' ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleStatusChange(req.id, 'Confirmed')}
                    className="p-1 hover:bg-success/10 rounded-lg text-success transition-colors"
                    title="Confirm Slot"
                  >
                    <FiCheck size={16} />
                  </button>
                  <button 
                    onClick={() => handleStatusChange(req.id, 'Rejected')}
                    className="p-1 hover:bg-error/10 rounded-lg text-error transition-colors"
                    title="Decline"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-on-surface-variant font-semibold">Scheduled</span>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default MentorshipRequestsTab;
