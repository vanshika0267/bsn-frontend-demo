import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import InputField from '../../../components/common/InputField';
import Modal from '../../../components/common/Modal';
import { 
  companies, 
  companyChats as initialCompanyChats, 
  publicDiscussion as initialPublicDiscussion, 
  seniors 
} from '../../../data/mockCommunityData';
import { 
  FiMessageSquare, 
  FiUsers, 
  FiSend, 
  FiPlus, 
  FiClock, 
  FiCheckCircle, 
  FiUserCheck, 
  FiLock,
  FiMail,
  FiBriefcase,
  FiX
} from 'react-icons/fi';

const SeniorsMentorshipTab = () => {
  const { user, userRole } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('company-rooms'); // 'company-rooms' | 'public-discussions' | 'one-to-one'
  
  // 1. Company Chatrooms States
  const [selectedCompany, setSelectedCompany] = useState(companies[0].id);
  const [companyChats, setCompanyChats] = useState(initialCompanyChats);
  const [newChatMessage, setNewChatMessage] = useState('');
  const chatBottomRef = useRef(null);

  // 2. Public Discussion States
  const [discussions, setDiscussions] = useState(initialPublicDiscussion);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionTopic, setNewQuestionTopic] = useState('General');
  const [newAnswers, setNewAnswers] = useState({}); // questionId -> answerText

  // 3. One-to-One Mentorship States
  // Tracks request status: { seniorId: 'None' | 'Pending' | 'Accepted' }
  const [mentorshipRequests, setMentorshipRequests] = useState({
    'sen_1': 'Pending', // Pre-populate one pending for demo
    'sen_2': 'None',
    'sen_3': 'Accepted', // Pre-populate one accepted to show chat immediately
    'sen_4': 'None'
  });
  const [mentorshipTopics, setMentorshipTopics] = useState({
    'sen_1': 'Next.js Architecture Review',
    'sen_3': 'WebGL Shader Optimizations'
  });
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedSeniorForRequest, setSelectedSeniorForRequest] = useState(null);
  const [requestTopicText, setRequestTopicText] = useState('');
  const [activeDirectChatSenior, setActiveDirectChatSenior] = useState(null);
  const [directMessages, setDirectMessages] = useState({
    'sen_3': [
      { id: 1, sender: 'Amara Lopez', text: 'Hey Alex! Glad to connect. How can I help you with WebGL configurations?', time: 'Yesterday', isUser: false },
      { id: 2, sender: 'Alex Rivera', text: 'Hi Amara! I am trying to build a mobile-first scanning shader and hitting some performance limits.', time: 'Yesterday', isUser: true },
      { id: 3, sender: 'Amara Lopez', text: 'Ah, make sure you are not compiling shaders dynamically in the render loop. Always pre-compile and reuse programs. Let\'s review code.', time: '10:00 AM', isUser: false }
    ]
  });
  const [newDirectMessage, setNewDirectMessage] = useState('');
  const directChatBottomRef = useRef(null);

  // Automatically scroll chats
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [companyChats, selectedCompany]);

  useEffect(() => {
    if (directChatBottomRef.current) {
      directChatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [directMessages, activeDirectChatSenior]);

  // --- Handlers: Company Chatrooms ---
  const handleSendCompanyMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const messagePayload = {
      id: Date.now(),
      sender: `${user.name} (You)`,
      role: 'Student',
      text: newChatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '👨‍💻'
    };

    setCompanyChats(prev => ({
      ...prev,
      [selectedCompany]: [...(prev[selectedCompany] || []), messagePayload]
    }));

    const userMsg = newChatMessage;
    setNewChatMessage('');

    // Simulate real-time replies from seniors at the company room
    setTimeout(() => {
      const companySeniors = seniors.filter(s => s.company.toLowerCase() === selectedCompany.toLowerCase());
      const respondingSenior = companySeniors.length > 0 ? companySeniors[0] : { name: 'Alumni Bot', role: 'Senior', avatar: '🤖' };

      const replyPayload = {
        id: Date.now() + 1,
        sender: respondingSenior.name,
        role: respondingSenior.role,
        company: respondingSenior.company,
        text: `Hey Alex, that's an interesting point about "${userMsg.slice(0, 20)}...". Let me sync up with the internal team and share the specific internal roadmap reference here.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: respondingSenior.avatar || '🎓'
      };

      setCompanyChats(prev => ({
        ...prev,
        [selectedCompany]: [...(prev[selectedCompany] || []), replyPayload]
      }));
    }, 2000);
  };

  // --- Handlers: Public Discussion ---
  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const questionPayload = {
      id: `pub_q_${Date.now()}`,
      author: `${user.name} (You)`,
      role: 'Student',
      question: newQuestion,
      votes: 1,
      topic: newQuestionTopic,
      timestamp: 'Just now',
      replies: []
    };

    setDiscussions(prev => [questionPayload, ...prev]);
    setNewQuestion('');
    setNewQuestionTopic('General');
  };

  const handleUpvoteQuestion = (qId, e) => {
    e.stopPropagation();
    setDiscussions(prev => prev.map(q => q.id === qId ? { ...q, votes: q.votes + 1 } : q));
  };

  const handlePostAnswer = (qId, e) => {
    e.preventDefault();
    const answerText = newAnswers[qId];
    if (!answerText || !answerText.trim()) return;

    // Use current active persona/role details
    const isSenior = userRole === 'Senior/Alumni';
    const authorName = isSenior ? `${user.name} (Senior)` : `${user.name} (You)`;

    const answerPayload = {
      id: `pub_a_${Date.now()}`,
      author: authorName,
      role: isSenior ? 'Senior/Alumni' : 'Student',
      company: isSenior ? 'Partner Company' : undefined,
      text: answerText,
      timestamp: 'Just now'
    };

    setDiscussions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          replies: [...q.replies, answerPayload]
        };
      }
      return q;
    }));

    setNewAnswers(prev => ({ ...prev, [qId]: '' }));
  };

  // --- Handlers: One-to-One Mentorship ---
  const handleOpenMentorshipRequest = (senior) => {
    setSelectedSeniorForRequest(senior);
    setRequestTopicText('');
    setIsRequestModalOpen(true);
  };

  const handleConfirmMentorshipRequest = (e) => {
    e.preventDefault();
    if (!requestTopicText.trim() || !selectedSeniorForRequest) return;

    const seniorId = selectedSeniorForRequest.id;

    setMentorshipRequests(prev => ({
      ...prev,
      [seniorId]: 'Pending'
    }));
    setMentorshipTopics(prev => ({
      ...prev,
      [seniorId]: requestTopicText
    }));

    setIsRequestModalOpen(false);

    // Simulate senior accepting the request after 6 seconds for testing
    setTimeout(() => {
      setMentorshipRequests(prev => {
        if (prev[seniorId] === 'Pending') {
          // Initialize direct messages list
          setDirectMessages(msgs => ({
            ...msgs,
            [seniorId]: [
              { id: 1, sender: selectedSeniorForRequest.name, text: `Hello Alex! I accepted your mentorship request about "${requestTopicText}". Feel free to drop your questions here.`, time: 'Just now', isUser: false }
            ]
          }));
          return {
            ...prev,
            [seniorId]: 'Accepted'
          };
        }
        return prev;
      });
    }, 6000);
  };

  const handleAcceptRequestSenior = (seniorId) => {
    setMentorshipRequests(prev => ({
      ...prev,
      [seniorId]: 'Accepted'
    }));
    setDirectMessages(msgs => ({
      ...msgs,
      [seniorId]: [
        { id: 1, sender: seniors.find(s => s.id === seniorId)?.name || 'Senior', text: 'Thanks for reaching out! Let\'s chat.', time: 'Just now', isUser: false }
      ]
    }));
  };

  const handleDeclineRequestSenior = (seniorId) => {
    setMentorshipRequests(prev => ({
      ...prev,
      [seniorId]: 'None'
    }));
  };

  const handleSendDirectMessage = (e) => {
    e.preventDefault();
    if (!newDirectMessage.trim() || !activeDirectChatSenior) return;

    const seniorId = activeDirectChatSenior.id;
    const isSenior = userRole === 'Senior/Alumni';

    const msgPayload = {
      id: Date.now(),
      sender: user.name,
      text: newDirectMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setDirectMessages(prev => ({
      ...prev,
      [seniorId]: [...(prev[seniorId] || []), msgPayload]
    }));

    setNewDirectMessage('');

    // Simulate senior response after 2 seconds
    if (!isSenior) {
      setTimeout(() => {
        const replyPayload = {
          id: Date.now() + 1,
          sender: activeDirectChatSenior.name,
          text: `Got your message. Let's set up a call slot for tomorrow. I will share a calendar link here.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false
        };

        setDirectMessages(prev => ({
          ...prev,
          [seniorId]: [...(prev[seniorId] || []), replyPayload]
        }));
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Intro */}
      <div>
        <h2 className="text-2xl font-bold font-poppins text-on-surface">Seniors Connect</h2>
        <p className="text-xs text-on-surface-variant">
          Connect with alumni, enter company chatrooms, ask public questions, or launch direct 1-to-1 mentorship sessions.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-outline-variant gap-6">
        <button
          onClick={() => setActiveSubTab('company-rooms')}
          className={`pb-3 text-sm font-extrabold tracking-wide uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'company-rooms'
              ? 'text-primary border-primary'
              : 'text-on-surface-variant/70 border-transparent hover:text-on-surface'
          }`}
        >
          <FiMessageSquare size={16} />
          <span>Company Chatrooms</span>
        </button>

        <button
          onClick={() => setActiveSubTab('public-discussions')}
          className={`pb-3 text-sm font-extrabold tracking-wide uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'public-discussions'
              ? 'text-primary border-primary'
              : 'text-on-surface-variant/70 border-transparent hover:text-on-surface'
          }`}
        >
          <FiUsers size={16} />
          <span>Public Q&A Discussions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('one-to-one')}
          className={`pb-3 text-sm font-extrabold tracking-wide uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'one-to-one'
              ? 'text-primary border-primary'
              : 'text-on-surface-variant/70 border-transparent hover:text-on-surface'
          }`}
        >
          <FiUserCheck size={16} />
          <span>1-to-1 Mentorship Connect</span>
        </button>
      </div>

      {/* Tab Contents: Company Chatrooms */}
      {activeSubTab === 'company-rooms' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
          {/* Company List Sidebar */}
          <div className="lg:col-span-1 bg-white border border-outline-variant rounded-xl p-4 flex flex-col gap-2 overflow-y-auto shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2 block font-poppins">
              Enterprise Hubs
            </span>
            {companies.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCompany(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border cursor-pointer ${
                  selectedCompany === c.id
                    ? 'bg-primary-container text-white border-primary shadow-sm font-semibold'
                    : 'bg-transparent text-on-surface border-transparent hover:bg-surface-container'
                }`}
              >
                <span className="text-xl bg-white p-1 rounded-md shadow-sm select-none">{c.logo}</span>
                <div>
                  <h4 className={`text-xs font-bold ${selectedCompany === c.id ? 'text-white' : 'text-on-surface'}`}>
                    {c.name}
                  </h4>
                  <p className={`text-[9px] ${selectedCompany === c.id ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    {c.seniorsCount} alumni placed
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Chat Panel */}
          <div className="lg:col-span-3 bg-white border border-outline-variant rounded-xl flex flex-col justify-between shadow-sm overflow-hidden h-full">
            {/* Chat Room Header */}
            {(() => {
              const currentComp = companies.find(c => c.id === selectedCompany);
              return (
                <div className="bg-surface-container p-4 border-b border-outline-variant flex items-center gap-3">
                  <span className="text-2xl bg-white p-1.5 rounded-lg shadow-sm">{currentComp?.logo}</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface font-poppins">{currentComp?.name} Room</h3>
                    <p className="text-[10px] text-on-surface-variant font-medium">{currentComp?.tagline}</p>
                  </div>
                </div>
              );
            })()}

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {(companyChats[selectedCompany] || []).map((msg) => {
                const isUser = msg.sender.includes('(You)');
                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-[#10b981] flex items-center justify-center font-bold text-white text-xs select-none shadow-sm flex-shrink-0">
                      {msg.avatar || msg.sender.charAt(0)}
                    </div>
                    <div>
                      <div className={`flex items-baseline gap-1.5 mb-1 ${isUser ? 'justify-end' : ''}`}>
                        <span className="text-[10px] font-extrabold text-on-surface leading-tight">{msg.sender}</span>
                        {msg.company && (
                          <span className="text-[8px] bg-primary/10 border border-primary/20 text-primary px-1.5 rounded font-bold uppercase">
                            {msg.company}
                          </span>
                        )}
                        <span className="text-[8px] text-on-surface-variant/70 font-semibold">{msg.time}</span>
                      </div>
                      <div className={`p-3 rounded-2xl text-xs shadow-sm ${
                        isUser 
                          ? 'bg-primary-container text-white rounded-tr-none' 
                          : 'bg-white text-on-surface border border-outline-variant rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendCompanyMessage} className="p-3 border-t border-outline-variant bg-white flex gap-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                placeholder={`Type a message to the ${companies.find(c => c.id === selectedCompany)?.name} alumni room...`}
                className="flex-1 px-4 py-2 border border-outline-variant focus:border-primary rounded-xl text-sm focus:outline-none transition-all placeholder-on-surface-variant text-on-surface"
              />
              <Button type="submit" variant="primary" className="py-2 px-3 rounded-xl flex items-center justify-center cursor-pointer">
                <FiSend size={16} />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Tab Contents: Public Discussions */}
      {activeSubTab === 'public-discussions' && (
        <div className="space-y-6">
          {/* Ask Question Widget */}
          <Card className="bg-white p-5 border border-outline-variant shadow-sm text-left">
            <h3 className="text-sm font-extrabold text-on-surface font-poppins mb-3">Ask the Seniors Forum</h3>
            <form onSubmit={handleAskQuestion} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. How early should we start preparing DSA sheets for placement loops?"
                    className="w-full px-4 py-2 border border-outline-variant focus:border-primary rounded-lg text-sm text-on-surface focus:outline-none transition-all placeholder-on-surface-variant"
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <select
                    value={newQuestionTopic}
                    onChange={(e) => setNewQuestionTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-outline-variant focus:border-primary rounded-lg text-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="DSA & Coding">DSA & Coding</option>
                    <option value="System Architecture">Architecture</option>
                    <option value="Web Performance">Web Perf</option>
                    <option value="Resume Review">Resumes</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1 cursor-pointer">
                  <FiPlus size={14} />
                  <span>Post Question</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Q&A Thread Stack */}
          <div className="space-y-4">
            {discussions.map(q => {
              const isExpanded = expandedDiscussion === q.id;
              return (
                <Card 
                  key={q.id} 
                  className="bg-white border border-outline-variant hover:border-primary/50 shadow-sm transition-all text-left overflow-hidden cursor-pointer"
                  onClick={() => setExpandedDiscussion(isExpanded ? null : q.id)}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="primary">{q.topic}</Badge>
                          <span className="text-[9px] text-on-surface-variant/70 font-semibold">{q.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface leading-snug">{q.question}</h4>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase">
                          Asked by {q.author} ({q.role})
                        </p>
                      </div>
                      
                      {/* Vote/Upvote Column */}
                      <button
                        onClick={(e) => handleUpvoteQuestion(q.id, e)}
                        className="flex flex-col items-center justify-center border border-outline-variant hover:border-primary hover:bg-primary-container/10 p-2.5 rounded-xl min-w-[50px] transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] font-extrabold text-on-surface-variant">▲</span>
                        <span className="text-xs font-black text-on-surface leading-none mt-0.5">{q.votes}</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-xs text-on-surface-variant font-bold pt-2 border-t border-outline-variant/60">
                      <span className="flex items-center gap-1">
                        <FiMessageSquare size={13} />
                        {q.replies.length} replies
                      </span>
                      <span className="text-primary text-[11px] font-extrabold uppercase tracking-wide">
                        {isExpanded ? 'Hide replies' : 'Read replies'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Replies Section */}
                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-outline-variant p-4 space-y-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                      {/* Replies loop */}
                      {q.replies.length === 0 ? (
                        <p className="text-xs text-on-surface-variant/70 text-center py-2 italic font-light">
                          No replies yet. {userRole === 'Senior/Alumni' ? 'Be the first to answer!' : 'A senior will reply soon!'}
                        </p>
                      ) : (
                        <div className="space-y-3.5">
                          {q.replies.map(reply => (
                            <div key={reply.id} className="flex gap-2.5 items-start bg-white p-3.5 border border-outline-variant rounded-xl shadow-sm">
                              <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-[#10b981] to-[#3b82f6] flex items-center justify-center font-extrabold text-white text-xs select-none shadow-sm flex-shrink-0">
                                {reply.author.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-baseline gap-1.5 mb-1.5">
                                  <span className="text-xs font-black text-on-surface">{reply.author}</span>
                                  {reply.role === 'Senior/Alumni' && (
                                    <span className="text-[8px] bg-green-100 border border-green-200 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">
                                      Senior Alumnus
                                    </span>
                                  )}
                                  <span className="text-[9px] text-on-surface-variant/60 font-semibold">{reply.timestamp}</span>
                                </div>
                                <p className="text-xs text-on-surface-variant font-light leading-relaxed">{reply.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Form */}
                      <form onSubmit={(e) => handlePostAnswer(q.id, e)} className="flex gap-2.5 pt-3 border-t border-outline-variant/60">
                        <input
                          type="text"
                          placeholder={userRole === 'Senior/Alumni' ? 'Write an answer to guide this student...' : 'Write a follow-up query...'}
                          value={newAnswers[q.id] || ''}
                          onChange={(e) => setNewAnswers({ ...newAnswers, [q.id]: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-outline-variant focus:border-primary rounded-lg text-xs bg-white text-on-surface focus:outline-none"
                          required
                        />
                        <Button type="submit" variant="primary" size="sm" className="cursor-pointer">
                          Submit
                        </Button>
                      </form>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Contents: One-to-One Mentorship */}
      {activeSubTab === 'one-to-one' && (
        <div className="space-y-6">
          {/* Senior role specific dashboard widget if user is logged in as Senior */}
          {userRole === 'Senior/Alumni' && (
            <Card className="bg-white border-2 border-primary/20 p-5 rounded-xl text-left shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎓</span>
                <h3 className="text-sm font-extrabold text-on-surface font-poppins">Alumni Dashboard: Mentorship Requests</h3>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">
                Students request 1-on-1 chats to ask specific career validation questions. Accepting will unlock a private chat window.
              </p>
              
              <div className="space-y-2.5">
                {Object.entries(mentorshipRequests).filter(([_, status]) => status === 'Pending').map(([sId, _]) => {
                  const targetSenior = seniors.find(s => s.id === sId);
                  // We simulate incoming requests from students to this senior
                  return (
                    <div key={sId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-container rounded-xl border border-outline-variant gap-3">
                      <div>
                        <p className="text-xs font-bold text-on-surface">Request from <span className="text-primary font-black">Alex Rivera</span></p>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Topic: {mentorshipTopics[sId] || 'Portfolio & Resume Review'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequestSenior(sId)}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequestSenior(sId)}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
                {Object.values(mentorshipRequests).filter(status => status === 'Pending').length === 0 && (
                  <p className="text-xs text-on-surface-variant/70 italic text-center py-2">
                    No pending student requests.
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Active Direct Chats Area */}
          {activeDirectChatSenior && (
            <div className="bg-white border-2 border-primary/20 rounded-xl shadow-lg flex flex-col justify-between overflow-hidden h-[450px] animate-fade-in text-left">
              {/* Header */}
              <div className="bg-primary/5 p-4 border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center font-bold text-white text-xs select-none">
                    {activeDirectChatSenior.avatar || '🎓'}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface leading-tight font-poppins">{activeDirectChatSenior.name}</h3>
                    <p className="text-[10px] text-on-surface-variant">
                      Direct Mentorship Chat &bull; <span className="text-primary font-bold">{activeDirectChatSenior.company}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDirectChatSenior(null)}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
                  title="Close Chat"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                {(directMessages[activeDirectChatSenior.id] || []).map((msg) => {
                  // Direct message styling
                  const isSenderUser = msg.isUser;
                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] ${isSenderUser ? 'ml-auto flex-row-reverse' : ''}`}>
                      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold select-none shadow-sm flex-shrink-0">
                        {isSenderUser ? 'Alex' : activeDirectChatSenior.avatar}
                      </div>
                      <div>
                        <div className={`flex items-baseline gap-1.5 mb-1 ${isSenderUser ? 'justify-end' : ''}`}>
                          <span className="text-[9px] font-extrabold text-on-surface leading-tight">{isSenderUser ? 'You' : activeDirectChatSenior.name}</span>
                          <span className="text-[8px] text-on-surface-variant/70 font-semibold">{msg.time}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs shadow-sm ${
                          isSenderUser 
                            ? 'bg-primary-container text-white rounded-tr-none' 
                            : 'bg-white text-on-surface border border-outline-variant rounded-tl-none'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={directChatBottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendDirectMessage} className="p-3 border-t border-outline-variant bg-white flex gap-2">
                <input
                  type="text"
                  value={newDirectMessage}
                  onChange={(e) => setNewDirectMessage(e.target.value)}
                  placeholder={`Send a private message to ${activeDirectChatSenior.name}...`}
                  className="flex-1 px-4 py-2 border border-outline-variant focus:border-primary rounded-xl text-sm focus:outline-none transition-all placeholder-on-surface-variant text-on-surface"
                />
                <Button type="submit" variant="primary" className="py-2 px-3 rounded-xl cursor-pointer">
                  <FiSend size={16} />
                </Button>
              </form>
            </div>
          )}

          {/* Grid of Alumni / Seniors */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {seniors.map((senior) => {
              const reqStatus = mentorshipRequests[senior.id] || 'None';
              
              return (
                <Card key={senior.id} hoverable={true} className="flex flex-col justify-between h-full bg-white text-left p-5 border border-outline-variant shadow-sm relative">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-[#10b981] flex items-center justify-center font-extrabold text-white text-sm shadow-sm select-none">
                        {senior.avatar || senior.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-extrabold text-on-surface leading-tight font-poppins">{senior.name}</h3>
                        <p className="text-[10px] text-on-surface-variant leading-normal">
                          {senior.role} at <span className="text-primary font-black">{senior.company}</span>
                        </p>
                        <p className="text-[9px] text-on-surface-variant/70 font-semibold">Alumnus Class of {senior.gradYear}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-on-surface-variant font-light leading-relaxed min-h-[50px]">
                      {senior.bio}
                    </p>

                    {/* Skill chips */}
                    <div className="space-y-1.5 pt-3 border-t border-outline-variant/60">
                      <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Expertise</span>
                      <div className="flex flex-wrap gap-1">
                        {senior.skills.map(skill => (
                          <span key={skill} className="text-[9px] bg-surface border border-outline-variant text-on-surface-variant px-2.5 py-0.5 rounded font-bold uppercase">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-outline-variant/60 pt-3.5 mt-5 flex justify-between items-center mt-auto">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1">
                      <FiClock className="text-on-surface-variant" size={12} />
                      {senior.slots.length} open slots
                    </span>

                    {reqStatus === 'Accepted' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="py-1 flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setActiveDirectChatSenior(senior)}
                      >
                        <FiMessageSquare size={13} />
                        <span>Chat Now</span>
                      </Button>
                    ) : reqStatus === 'Pending' ? (
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                        <FiMail size={13} className="animate-pulse" />
                        <span>Requested</span>
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="py-1 cursor-pointer"
                        onClick={() => handleOpenMentorshipRequest(senior)}
                      >
                        Request Mentorship
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Mentorship request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={`Request mentorship with ${selectedSeniorForRequest?.name}`}
        size="md"
      >
        <form onSubmit={handleConfirmMentorshipRequest} className="space-y-4">
          <div className="bg-surface p-4 border border-outline-variant rounded-xl space-y-1.5 text-left">
            <p className="text-xs font-bold text-on-surface font-poppins">Session Focus: 1-on-1 Mentorship Request</p>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Once approved, a direct messaging window will unlock inside this page allowing you to chat.
            </p>
          </div>

          <div className="flex flex-col space-y-1.5 text-left">
            <label htmlFor="req-topic" className="text-xs font-bold text-on-surface tracking-wide uppercase">
              What topic or questions would you like to cover?
            </label>
            <textarea
              id="req-topic"
              rows="3"
              value={requestTopicText}
              onChange={(e) => setRequestTopicText(e.target.value)}
              placeholder="e.g. Seeking resume feedback for front-end role at Vercel..."
              className="w-full px-4 py-2 bg-white border border-outline-variant focus:border-primary rounded-lg text-sm text-on-surface placeholder-on-surface-variant focus:outline-none transition-all font-sans"
              required
            />
          </div>

          <div className="border-t border-outline-variant pt-4 flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="cursor-pointer">
              Send Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SeniorsMentorshipTab;
