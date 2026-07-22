import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import EmptyState from '../../../components/common/EmptyState';
import Modal from '../../../components/common/Modal';
import {
  listCompanies,
  listCompanyAlumni,
  sendDmRequest,
  dmOutbox,
  askCompanyQuestion,
  listCompanyQuestions,
} from '../../../services/api';
import {
  FiMessageSquare,
  FiUsers,
  FiSend,
  FiMail,
  FiCheckCircle,
  FiUserCheck,
  FiAlertCircle,
  FiLoader,
  FiPlus,
  FiClock,
} from 'react-icons/fi';

const statusVariant = (s) => {
  const v = String(s || '').toLowerCase();
  if (v === 'approved') return 'success';
  if (v === 'rejected') return 'error';
  return 'warning';
};

const Spinner = ({ label }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-on-surface-variant text-sm">
    <FiLoader className="animate-spin" size={16} />
    <span>{label || 'Loading...'}</span>
  </div>
);

const ErrorNote = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3 py-8 text-center">
    <div className="flex items-center gap-2 text-error text-sm font-semibold">
      <FiAlertCircle size={16} />
      <span>{message || 'Something went wrong.'}</span>
    </div>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
    )}
  </div>
);

const SeniorsMentorshipTab = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('browse');

  // Companies
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Alumni for selected company
  const [alumniData, setAlumniData] = useState(null);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const [alumniError, setAlumniError] = useState('');

  // Request-to-connect modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  // Sent requests (outbox)
  const [outbox, setOutbox] = useState([]);
  const [outboxLoading, setOutboxLoading] = useState(false);
  const [outboxError, setOutboxError] = useState('');

  // Company Q&A
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);

  const loadCompanies = useCallback(async () => {
    setCompaniesLoading(true);
    setCompaniesError('');
    try {
      const data = await listCompanies();
      const list = Array.isArray(data) ? data : [];
      setCompanies(list);
      setSelectedCompany((prev) => prev || (list[0] ? list[0].id : null));
    } catch (err) {
      setCompaniesError(err.message || 'Failed to load companies.');
    } finally {
      setCompaniesLoading(false);
    }
  }, []);

  const loadAlumni = useCallback(async (companyId) => {
    if (!companyId) return;
    setAlumniLoading(true);
    setAlumniError('');
    try {
      const data = await listCompanyAlumni(companyId);
      setAlumniData(data || null);
    } catch (err) {
      setAlumniError(err.message || 'Failed to load alumni.');
    } finally {
      setAlumniLoading(false);
    }
  }, []);

  const loadOutbox = useCallback(async () => {
    setOutboxLoading(true);
    setOutboxError('');
    try {
      const data = await dmOutbox();
      setOutbox((data && data.requests) || []);
    } catch (err) {
      setOutboxError(err.message || 'Failed to load your requests.');
    } finally {
      setOutboxLoading(false);
    }
  }, []);

  const loadQuestions = useCallback(async (companyId) => {
    if (!companyId) return;
    setQuestionsLoading(true);
    setQuestionsError('');
    try {
      const data = await listCompanyQuestions(companyId);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setQuestionsError(err.message || 'Failed to load questions.');
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
    loadOutbox();
  }, [loadCompanies, loadOutbox]);

  useEffect(() => {
    if (selectedCompany) {
      loadAlumni(selectedCompany);
      loadQuestions(selectedCompany);
    }
  }, [selectedCompany, loadAlumni, loadQuestions]);

  const openRequestModal = (alum) => {
    setSelectedAlumnus(alum);
    setRequestMessage('');
    setSendError('');
    setIsRequestModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim() || !selectedAlumnus) return;
    setSending(true);
    setSendError('');
    try {
      await sendDmRequest({
        alumni_id: selectedAlumnus.user_id,
        company_id: selectedCompany,
        message: requestMessage.trim(),
      });
      setIsRequestModalOpen(false);
      setRequestMessage('');
      await loadOutbox();
      setActiveSubTab('requests');
    } catch (err) {
      setSendError(err.message || 'Failed to send request.');
    } finally {
      setSending(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !selectedCompany) return;
    setAskingQuestion(true);
    setQuestionsError('');
    try {
      await askCompanyQuestion({ question: newQuestion.trim(), company_id: selectedCompany });
      setNewQuestion('');
      await loadQuestions(selectedCompany);
    } catch (err) {
      setQuestionsError(err.message || 'Failed to post question.');
    } finally {
      setAskingQuestion(false);
    }
  };

  const openChat = (otherUserId) => navigate(`/dashboard?tab=chat&to=${otherUserId}`);

  const currentCompany = companies.find((c) => c.id === selectedCompany);
  const alumni = (alumniData && alumniData.alumni) || [];

  const subTabs = [
    { id: 'browse', label: 'Browse Alumni', icon: FiUsers },
    { id: 'requests', label: 'My Requests', icon: FiUserCheck },
    { id: 'qa', label: 'Company Q&A', icon: FiMessageSquare },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Intro */}
      <div>
        <h2 className="text-2xl font-bold font-poppins text-on-surface">Seniors Connect</h2>
        <p className="text-xs text-on-surface-variant">
          Browse companies, discover verified alumni, request a 1-to-1 connection, and ask company-specific questions.
        </p>
      </div>

      {/* Sub-Navigation */}
      <div className="flex border-b border-outline-variant gap-6">
        {subTabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`pb-3 text-sm font-extrabold tracking-wide uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeSubTab === t.id
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant/70 border-transparent hover:text-on-surface'
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Browse Alumni */}
      {activeSubTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Company sidebar */}
          <div className="lg:col-span-1 bg-white border border-outline-variant rounded-xl p-4 flex flex-col gap-2 shadow-sm max-h-[560px] overflow-y-auto">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2 block font-poppins">
              Companies
            </span>
            {companiesLoading ? (
              <Spinner label="Loading companies..." />
            ) : companiesError ? (
              <ErrorNote message={companiesError} onRetry={loadCompanies} />
            ) : companies.length === 0 ? (
              <p className="text-xs text-on-surface-variant/70 italic py-4 text-center">No companies yet.</p>
            ) : (
              companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompany(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border cursor-pointer ${
                    selectedCompany === c.id
                      ? 'bg-primary-container text-white border-primary shadow-sm font-semibold'
                      : 'bg-transparent text-on-surface border-transparent hover:bg-surface-container'
                  }`}
                >
                  <span className="h-8 w-8 rounded-md bg-white text-primary flex items-center justify-center font-extrabold text-xs shadow-sm select-none flex-shrink-0">
                    {String(c.name || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate ${selectedCompany === c.id ? 'text-white' : 'text-on-surface'}`}>
                      {c.name}
                    </h4>
                    {c.website && (
                      <p className={`text-[9px] truncate ${selectedCompany === c.id ? 'text-white/80' : 'text-on-surface-variant'}`}>
                        {c.website}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Alumni panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
              <h3 className="text-sm font-extrabold text-on-surface font-poppins">
                {currentCompany ? `${currentCompany.name} Alumni` : 'Select a company'}
              </h3>
              <p className="text-[10px] text-on-surface-variant font-medium">
                {alumniData ? `${alumniData.total_alumni} verified alumni` : 'Verified alumni placed here will appear below.'}
              </p>
            </div>

            {alumniLoading ? (
              <Spinner label="Loading alumni..." />
            ) : alumniError ? (
              <ErrorNote message={alumniError} onRetry={() => loadAlumni(selectedCompany)} />
            ) : !selectedCompany ? (
              <EmptyState icon={FiUsers} title="No company selected" description="Pick a company from the list to browse its alumni." />
            ) : alumni.length === 0 ? (
              <EmptyState icon={FiUsers} title="No alumni yet" description="This company has no verified alumni available to connect with right now." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {alumni.map((alum) => (
                  <Card key={alum.user_id} className="flex flex-col justify-between h-full bg-white text-left p-5 border border-outline-variant shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-[#10b981] flex items-center justify-center font-extrabold text-white text-sm shadow-sm select-none">
                          {String(alum.name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="text-left min-w-0">
                          <h3 className="text-sm font-extrabold text-on-surface leading-tight font-poppins flex items-center gap-1.5">
                            <span className="truncate">{alum.name}</span>
                            {alum.verified && <FiCheckCircle className="text-primary flex-shrink-0" size={13} title="Verified" />}
                          </h3>
                          {alum.title && (
                            <p className="text-[10px] text-on-surface-variant leading-normal truncate">{alum.title}</p>
                          )}
                          {alum.college && (
                            <p className="text-[9px] text-on-surface-variant/70 font-semibold truncate">{alum.college}</p>
                          )}
                        </div>
                      </div>
                      {alum.email && (
                        <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1.5 truncate">
                          <FiMail size={11} /> {alum.email}
                        </p>
                      )}
                    </div>
                    <div className="border-t border-outline-variant/60 pt-3.5 mt-5 flex justify-between items-center">
                      {alum.verified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="default">Alumnus</Badge>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        className="py-1 flex items-center gap-1.5 cursor-pointer"
                        onClick={() => openRequestModal(alum)}
                      >
                        <FiUserCheck size={13} />
                        <span>Request to Connect</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Requests */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-on-surface font-poppins">My Connection Requests</h3>
            <Button variant="outline" size="sm" onClick={loadOutbox} className="cursor-pointer">Refresh</Button>
          </div>

          {outboxLoading ? (
            <Spinner label="Loading your requests..." />
          ) : outboxError ? (
            <ErrorNote message={outboxError} onRetry={loadOutbox} />
          ) : outbox.length === 0 ? (
            <EmptyState
              icon={FiSend}
              title="No requests sent yet"
              description="Browse alumni and send a connection request to start a 1-to-1 conversation."
              actionText="Browse Alumni"
              onActionClick={() => setActiveSubTab('browse')}
            />
          ) : (
            <div className="space-y-3">
              {outbox.map((r) => {
                const approved = String(r.status || '').toLowerCase() === 'approved';
                return (
                  <Card key={r.request_id} className="bg-white border border-outline-variant shadow-sm text-left p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-on-surface">{r.alumni_name || 'Alumnus'}</span>
                          <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                        </div>
                        {r.alumni_email && (
                          <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1.5">
                            <FiMail size={11} /> {r.alumni_email}
                          </p>
                        )}
                        {r.message && (
                          <p className="text-xs text-on-surface-variant font-light leading-relaxed pt-1">"{r.message}"</p>
                        )}
                        {r.created_at && (
                          <p className="text-[9px] text-on-surface-variant/70 font-semibold flex items-center gap-1 pt-0.5">
                            <FiClock size={10} /> {new Date(r.created_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      {approved && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                          onClick={() => openChat(r.alumni_id)}
                        >
                          <FiMessageSquare size={13} />
                          <span>Message</span>
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Company Q&A */}
      {activeSubTab === 'qa' && (
        <div className="space-y-6">
          <Card className="bg-white p-5 border border-outline-variant shadow-sm text-left">
            <h3 className="text-sm font-extrabold text-on-surface font-poppins mb-3">
              Ask {currentCompany ? currentCompany.name : 'the company'}
            </h3>
            <form onSubmit={handleAskQuestion} className="space-y-3">
              <textarea
                rows="2"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. What does the interview loop look like for new grads?"
                className="w-full px-4 py-2 border border-outline-variant focus:border-primary rounded-lg text-sm text-on-surface focus:outline-none transition-all placeholder-on-surface-variant"
                required
                disabled={!selectedCompany || askingQuestion}
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="sm" disabled={!selectedCompany || askingQuestion} className="flex items-center gap-1 cursor-pointer">
                  <FiPlus size={14} />
                  <span>{askingQuestion ? 'Posting...' : 'Post Question'}</span>
                </Button>
              </div>
            </form>
          </Card>

          {questionsLoading ? (
            <Spinner label="Loading questions..." />
          ) : questionsError ? (
            <ErrorNote message={questionsError} onRetry={() => loadQuestions(selectedCompany)} />
          ) : questions.length === 0 ? (
            <EmptyState icon={FiMessageSquare} title="No questions yet" description="Be the first to ask this company's alumni a question." />
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <Card key={q.id} className="bg-white border border-outline-variant shadow-sm text-left p-4">
                  <h4 className="text-sm font-bold text-on-surface leading-snug">{q.question}</h4>
                  {q.created_at && (
                    <p className="text-[9px] text-on-surface-variant/70 font-semibold flex items-center gap-1 pt-1">
                      <FiClock size={10} /> {new Date(q.created_at).toLocaleString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Request to Connect Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={selectedAlumnus ? `Request to connect with ${selectedAlumnus.name}` : 'Request to connect'}
        size="md"
      >
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div className="bg-surface p-4 border border-outline-variant rounded-xl space-y-1.5 text-left">
            <p className="text-xs font-bold text-on-surface font-poppins">1-to-1 Connection Request</p>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Once the alumnus approves, a "Message" button unlocks so you can chat directly.
            </p>
          </div>

          <div className="flex flex-col space-y-1.5 text-left">
            <label htmlFor="req-message" className="text-xs font-bold text-on-surface tracking-wide uppercase">
              Your message
            </label>
            <textarea
              id="req-message"
              rows="3"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Introduce yourself and say what you'd like to discuss..."
              className="w-full px-4 py-2 bg-white border border-outline-variant focus:border-primary rounded-lg text-sm text-on-surface placeholder-on-surface-variant focus:outline-none transition-all font-sans"
              required
            />
          </div>

          {sendError && (
            <div className="flex items-center gap-2 text-error text-xs font-semibold">
              <FiAlertCircle size={14} />
              <span>{sendError}</span>
            </div>
          )}

          <div className="border-t border-outline-variant pt-4 flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={sending} className="cursor-pointer">
              {sending ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SeniorsMentorshipTab;
