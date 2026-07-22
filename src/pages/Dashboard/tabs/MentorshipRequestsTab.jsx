import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import { dmInbox, approveDmRequest, rejectDmRequest } from '../../../services/api';
import {
  FiCheck,
  FiX,
  FiMail,
  FiClock,
  FiMessageSquare,
  FiAlertCircle,
  FiLoader,
  FiUserCheck,
} from 'react-icons/fi';

const statusVariant = (s) => {
  const v = String(s || '').toLowerCase();
  if (v === 'approved') return 'success';
  if (v === 'rejected') return 'error';
  return 'warning';
};

const MentorshipRequestsTab = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dmInbox();
      setRequests((data && data.requests) || []);
    } catch (err) {
      setError(err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const handleApprove = async (id) => {
    setActingId(id);
    setError('');
    try {
      await approveDmRequest(id);
      await loadInbox();
    } catch (err) {
      setError(err.message || 'Failed to approve request.');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    setActingId(id);
    setError('');
    try {
      await rejectDmRequest(id);
      await loadInbox();
    } catch (err) {
      setError(err.message || 'Failed to reject request.');
    } finally {
      setActingId(null);
    }
  };

  const openChat = (studentId) => navigate(`/dashboard?tab=chat&to=${studentId}`);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Mentorship Connection Requests</h2>
        <p className="text-xs text-on-surface-variant">
          Approve or reject 1-to-1 connection requests from students. Approved students can message you directly.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-error text-xs font-semibold bg-[#fef2f2] border border-[#fca5a5] rounded-lg px-3 py-2">
          <FiAlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-on-surface-variant text-sm">
          <FiLoader className="animate-spin" size={16} />
          <span>Loading requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={FiUserCheck}
          title="No connection requests"
          description="When students request to connect with you, their requests will appear here."
          actionText="Refresh"
          onActionClick={loadInbox}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={loadInbox} className="cursor-pointer">Refresh</Button>
          </div>
          {requests.map((req) => {
            const status = String(req.status || '').toLowerCase();
            const isPending = status === 'pending';
            const isApproved = status === 'approved';
            const busy = actingId === req.request_id;
            return (
              <Card key={req.request_id} className="bg-white border border-outline-variant shadow-sm text-left p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm select-none flex-shrink-0">
                      {String(req.student_name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-on-surface">{req.student_name || 'Student'}</span>
                        <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
                      </div>
                      {req.student_email && (
                        <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1.5">
                          <FiMail size={11} /> {req.student_email}
                        </p>
                      )}
                      {req.message && (
                        <p className="text-xs text-on-surface-variant font-light leading-relaxed pt-1">"{req.message}"</p>
                      )}
                      {req.created_at && (
                        <p className="text-[9px] text-on-surface-variant/70 font-semibold flex items-center gap-1 pt-0.5">
                          <FiClock size={10} /> {new Date(req.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isPending && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          disabled={busy}
                          onClick={() => handleApprove(req.request_id)}
                          className="flex items-center gap-1.5 cursor-pointer"
                        >
                          <FiCheck size={14} />
                          <span>{busy ? '...' : 'Approve'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => handleReject(req.request_id)}
                          className="flex items-center gap-1.5 cursor-pointer text-error hover:text-error"
                        >
                          <FiX size={14} />
                          <span>Reject</span>
                        </Button>
                      </>
                    )}
                    {isApproved && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openChat(req.student_id)}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <FiMessageSquare size={13} />
                        <span>Message</span>
                      </Button>
                    )}
                    {!isPending && !isApproved && (
                      <span className="text-[10px] text-on-surface-variant font-semibold uppercase">{req.status}</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MentorshipRequestsTab;
