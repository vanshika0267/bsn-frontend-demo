import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAward, FiBookOpen, FiDownload, FiHeart, FiPlus, 
  FiShare2, FiStar, FiTrendingUp, FiUsers, FiClock,
  FiCheckSquare, FiShield, FiGrid, FiDatabase, FiCpu, FiHardDrive,
  FiMessageSquare, FiBriefcase
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useRole } from '../../context/RoleContext';
import { 
  leaderboard as initialLeaderboard, 
  learningResources as initialLearningResources, 
  teamFinderPosts as initialTeamPosts, 
  recentActivity as initialActivity 
} from '../../data/mockData';
import { 
  recruiterCandidates, recruiterJobPostings, recruiterApplications, 
  seniorMentorshipRequests, seniorQuestions, 
  collegeStudents, collegeVerifications, 
  platformUsers, platformSystemLogs 
} from '../../data/roleMockData';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/cards/StatCard';
import ActivityCard from '../../components/cards/ActivityCard';
import OpportunityCard from '../../components/cards/OpportunityCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import InputField from '../../components/common/InputField';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';

// Modular features components ported from teammate implementation
import ResourceRepository from './tabs/ResourceRepository';
import UploadResource from './tabs/UploadResource';
import LeaderboardTab from './tabs/LeaderboardTab';
import OpportunitiesTab from './tabs/OpportunitiesTab';
import LearningHubTab from './tabs/LearningHubTab';
import TeamFinderTab from './tabs/TeamFinderTab';
import SkillGapFinderTab from './tabs/SkillGapFinderTab';
import SeniorsMentorshipTab from './tabs/SeniorsMentorshipTab';
import AdminDashboardTab from './tabs/AdminDashboardTab';

// New personalized role components
import CandidateSearchTab from './tabs/CandidateSearchTab';
import JobPostingsTab from './tabs/JobPostingsTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import HiringAnalyticsTab from './tabs/HiringAnalyticsTab';
import MentorshipRequestsTab from './tabs/MentorshipRequestsTab';
import StudentQuestionsTab from './tabs/StudentQuestionsTab';
import StudentAnalyticsTab from './tabs/StudentAnalyticsTab';
import VerificationRequestsTab from './tabs/VerificationRequestsTab';
import PlacementReportsTab from './tabs/PlacementReportsTab';
import UserManagementTab from './tabs/UserManagementTab';
import CollegeManagementTab from './tabs/CollegeManagementTab';
import SystemReportsTab from './tabs/SystemReportsTab';
import SystemAnalyticsTab from './tabs/SystemAnalyticsTab';
import VerifiedReviewsTab from './tabs/VerifiedReviewsTab';

const DashboardPage = () => {
  const { user, updateProfile, opportunitiesList, searchQuery } = useApp();
  const { isAllowedTab, dashboardWidgets } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State syncing with query param
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get('tab') || 'overview';

  // If user accesses a tab that is not allowed for their persona, redirect them to overview
  useEffect(() => {
    if (currentTab !== 'overview' && !isAllowedTab(currentTab)) {
      navigate('/dashboard?tab=overview', { replace: true });
    }
  }, [currentTab, isAllowedTab, navigate]);

  // Local States for Interactive Widgets
  const [leaderboard] = useState(initialLeaderboard);
  const [resources, setResources] = useState(initialLearningResources);
  const [teamPosts] = useState(initialTeamPosts);
  const [activities, setActivities] = useState(initialActivity);

  // Upload Resource Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceCat, setNewResourceCat] = useState('Notes');
  const [newResourceSize, setNewResourceSize] = useState('1.5 MB');

  // Search filter local states
  const [resourceFilter, setResourceFilter] = useState('All');
  const [opportunityFilter, setOpportunityFilter] = useState('All');

  // Request to Join Team Finder state tracker
  const [requestedTeams, setRequestedTeams] = useState({});

  // Sync state if user query-searches in the header
  const filteredResources = resources.filter(res => 
    (res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     res.author.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (resourceFilter === 'All' || res.category === resourceFilter)
  );

  const filteredOpportunities = opportunitiesList.filter(opp => 
    (opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     opp.host.toLowerCase().includes(searchQuery.toLowerCase() ||
     opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) &&
    (opportunityFilter === 'All' || opp.type === opportunityFilter)
  );

  // Handle resource upload submission
  const handleUploadResource = (e) => {
    e.preventDefault();
    if (!newResourceTitle.trim()) return;

    const newRes = {
      id: `lr_${resources.length + 1}`,
      title: newResourceTitle,
      author: user.name,
      role: "Student (You)",
      category: newResourceCat,
      downloads: 0,
      likes: 0,
      rating: 5.0,
      college: user.college,
      fileSize: newResourceSize
    };

    setResources([newRes, ...resources]);
    
    // Add to activity feed
    const newAct = {
      id: `act_${activities.length + 1}`,
      type: "upload",
      title: `Uploaded '${newResourceTitle}'`,
      timestamp: "Just now",
      icon: "📄"
    };
    setActivities([newAct, ...activities]);

    // Increase student impact score!
    updateProfile({
      impactScore: user.impactScore + 40,
      impactProgress: Math.min(100, user.impactProgress + 4)
    });

    // Reset and Close Modal
    setNewResourceTitle('');
    setIsUploadOpen(false);
  };

  const handleLikeResource = (id) => {
    setResources(prev => 
      prev.map(res => res.id === id ? { ...res, likes: res.likes + 1 } : res)
    );
  };

  const handleDownloadResource = (id) => {
    setResources(prev => 
      prev.map(res => res.id === id ? { ...res, downloads: res.downloads + 1 } : res)
    );
  };

  const handleRequestTeam = (id) => {
    setRequestedTeams(prev => ({
      ...prev,
      [id]: true
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Render Tab Views */}
        <AnimatePresence mode="wait">
          {currentTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left & Middle Column (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Welcome Card */}
                {dashboardWidgets.includes('welcome-card') && (
                  <div className="relative rounded-xl bg-primary-container text-white p-6 overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/95">Welcome Back, {user.role || 'Student'}</span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-poppins">{user.name}</h2>
                        <p className="text-xs text-white/90 font-medium mt-0.5">{user.college}</p>
                      </div>
                      <p className="text-xs text-white/80 italic max-w-md mt-1 leading-relaxed">
                        {user.role === 'Student' && "Your academic network holds the passport to the future. Keep sharing resources, verification scores will update shortly."}
                        {user.role === 'Senior/Alumni' && "Help guide the next generation of engineers. Answer pending doubts or configure your availability slots."}
                        {user.role === 'Recruiter' && "Discover vetted campus talent, inspect candidate portfolios, and manage active job applications."}
                        {user.role === 'College Admin' && "Monitor department statistics, verify student badges, and export regional recruitment reports."}
                        {user.role === 'Platform Admin' && "Oversee global platform operations, database diagnostics, and resolve user moderation queues."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grid of Stats Cards - Student */}
                {dashboardWidgets.includes('student-kpi-stats') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard 
                      title="Impact Score" 
                      value={user.impactScore} 
                      subtitle={`${user.badge} Badge`} 
                      icon={FiTrendingUp} 
                      progress={user.impactProgress} 
                      color="blue"
                    />
                    <StatCard 
                      title="Rank Position" 
                      value={`#${user.rank}`} 
                      subtitle="In college community" 
                      icon={FiAward} 
                      color="purple"
                    />
                    <StatCard 
                      title="Resource Statistics" 
                      value="2 Shared" 
                      subtitle="1,194 Total Downloads" 
                      icon={FiBookOpen} 
                      color="green"
                    />
                  </div>
                )}

                {/* Grid of Stats Cards - Senior */}
                {dashboardWidgets.includes('senior-kpi-stats') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard 
                      title="Consulted Hours" 
                      value="12 Hours" 
                      subtitle="2 sessions booked" 
                      icon={FiClock} 
                      color="blue"
                    />
                    <StatCard 
                      title="Doubts Answered" 
                      value="28 Solved" 
                      subtitle="Top 5% contributor" 
                      icon={FiMessageSquare} 
                      color="purple"
                    />
                    <StatCard 
                      title="Resource Uploads" 
                      value="4 Guides" 
                      subtitle="1,200 total downloads" 
                      icon={FiBookOpen} 
                      color="green"
                    />
                  </div>
                )}

                {/* Grid of Stats Cards - Recruiter */}
                {dashboardWidgets.includes('recruiter-kpi-stats') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard 
                      title="Active Postings" 
                      value="2 Listings" 
                      subtitle="Stripe Checkout & Infra" 
                      icon={FiBriefcase} 
                      color="blue"
                    />
                    <StatCard 
                      title="Applications" 
                      value="42 Candidates" 
                      subtitle="14 under review" 
                      icon={FiUsers} 
                      color="purple"
                    />
                    <StatCard 
                      title="Hiring Conversion" 
                      value="18.4%" 
                      subtitle="Offers accepted" 
                      icon={FiTrendingUp} 
                      color="green"
                    />
                  </div>
                )}

                {/* Grid of Stats Cards - College Admin */}
                {dashboardWidgets.includes('college-kpi-stats') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard 
                      title="Verified Students" 
                      value="1,842" 
                      subtitle="94% verification rate" 
                      icon={FiUsers} 
                      color="blue"
                    />
                    <StatCard 
                      title="Pending Badges" 
                      value="2 Requests" 
                      subtitle="Awaiting credential sign" 
                      icon={FiCheckSquare} 
                      color="purple"
                    />
                    <StatCard 
                      title="Placement Rate" 
                      value="84.2%" 
                      subtitle="Top recruiting term" 
                      icon={FiTrendingUp} 
                      color="green"
                    />
                  </div>
                )}

                {/* Grid of Stats Cards - Platform Admin */}
                {dashboardWidgets.includes('platform-kpi-stats') && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard 
                      title="Total Users" 
                      value="2,410" 
                      subtitle="+24% new signups" 
                      icon={FiUsers} 
                      color="blue"
                    />
                    <StatCard 
                      title="Accredited Colleges" 
                      value="3 Active" 
                      subtitle="Domain verified" 
                      icon={FiGrid} 
                      color="purple"
                    />
                    <StatCard 
                      title="Pending Moderation" 
                      value="6 Listings" 
                      subtitle="Jobs & posts vetting" 
                      icon={FiShield} 
                      color="green"
                    />
                  </div>
                )}

                {/* Verified Skills Card */}
                {dashboardWidgets.includes('verified-skills-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-3.5 flex items-center gap-2">
                      <FiAward className="text-primary" size={16} /> Verified Skills (Credentials)
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {user.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant">
                          <span className="text-xs font-semibold text-on-surface">{skill.name}</span>
                          <Badge variant="primary">Verified</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recruiting Funnel Card */}
                {dashboardWidgets.includes('pipeline-funnel-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-3.5 flex items-center gap-2">
                      <FiTrendingUp className="text-primary" size={16} /> Recruiting Pipeline Conversion
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Vetted Candidates &rarr; Interviewed</span>
                        <span className="text-primary font-bold">33% Conversion</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '33%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mentorship Booking Slots Card */}
                {dashboardWidgets.includes('mentorship-slots-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-3.5 flex items-center gap-2">
                      <FiClock className="text-primary" size={16} /> Open Mentorship Slots
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      <div className="px-3.5 py-2 rounded-lg bg-surface border border-outline-variant text-xs font-semibold">
                        Friday, 4:00 PM - 5:00 PM (1 Slot left)
                      </div>
                      <div className="px-3.5 py-2 rounded-lg bg-surface border border-outline-variant text-xs font-semibold">
                        Monday, 10:00 AM - 11:30 AM (Open)
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Student Roster Card */}
                {dashboardWidgets.includes('enrolled-students-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-3.5 flex items-center gap-2">
                      <FiUsers className="text-primary" size={16} /> Active Student Roster
                    </h3>
                    <div className="divide-y divide-outline-variant">
                      {collegeStudents.slice(0, 2).map((stud) => (
                        <div key={stud.id} className="py-2.5 flex items-center justify-between text-xs font-semibold">
                          <div>
                            <p className="text-on-surface">{stud.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{stud.branch} | {stud.year}</p>
                          </div>
                          <Badge variant="primary">{stud.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* API Health Load Card */}
                {dashboardWidgets.includes('system-load-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-3.5 flex items-center gap-2">
                      <FiCpu className="text-primary" size={16} /> API Health & Latency Core
                    </h3>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Stitch AI API Nodes</span>
                      <span className="text-success font-bold">99.98% Uptime</span>
                    </div>
                  </div>
                )}

                {/* Recent Activity Feed */}
                {dashboardWidgets.includes('recent-activity-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiUsers className="text-primary" size={16} /> Recent Activity Feed
                    </h3>
                    <div className="space-y-3">
                      {activities.map((act) => (
                        <ActivityCard 
                          key={act.id}
                          icon={act.icon}
                          title={act.title}
                          timestamp={act.timestamp}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recruiter Recent Candidates applied */}
                {dashboardWidgets.includes('recent-applicants-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiUsers className="text-primary" size={16} /> Recent Candidates Applied
                    </h3>
                    <div className="space-y-3.5">
                      {recruiterApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between text-xs font-semibold border-b border-outline-variant pb-2.5 last:border-b-0 last:pb-0">
                          <div>
                            <p className="text-on-surface font-bold">{app.candidateName}</p>
                            <p className="text-[10px] text-on-surface-variant">{app.jobTitle}</p>
                          </div>
                          <Badge variant="primary">{app.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Open Student Questions */}
                {dashboardWidgets.includes('recent-questions-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiMessageSquare className="text-primary" size={16} /> Open Student Doubts
                    </h3>
                    <div className="space-y-3">
                      {seniorQuestions.slice(0, 2).map((q) => (
                        <div key={q.id} className="text-xs border-b border-outline-variant pb-3 last:border-b-0 last:pb-0 font-medium">
                          <p className="font-bold text-on-surface">{q.question}</p>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-on-surface-variant font-semibold">
                            <span>By: {q.studentName}</span>
                            <span className="text-primary">{q.topic}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Verification Requests */}
                {dashboardWidgets.includes('pending-verifications-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiCheckSquare className="text-primary" size={16} /> Pending Badge Requests
                    </h3>
                    <div className="space-y-3">
                      {collegeVerifications.map((req) => (
                        <div key={req.id} className="flex items-center justify-between text-xs font-semibold border-b border-outline-variant pb-2.5 last:border-b-0 last:pb-0">
                          <div>
                            <p className="text-on-surface font-bold">{req.studentName}</p>
                            <p className="text-[10px] text-on-surface-variant">{req.badgeName}</p>
                          </div>
                          <span className="text-[10px] text-primary">{req.submittedDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platform Moderation logs alert */}
                {dashboardWidgets.includes('moderation-status-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiShield className="text-primary" size={16} /> Audit & Integrity Scan Alerts
                    </h3>
                    <div className="space-y-3">
                      {platformSystemLogs.slice(0, 2).map((log) => (
                        <div key={log.id} className="flex items-center justify-between text-xs font-semibold">
                          <div>
                            <p className="text-on-surface font-bold">{log.event}</p>
                            <p className="text-[10px] text-on-surface-variant">{log.resource}</p>
                          </div>
                          <Badge variant={log.status === 'Passed' ? 'success' : 'primary'}>{log.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column (1 col) - Dynamic widgets */}
              <div className="space-y-6">
                
                {/* Upcoming Opportunities widget */}
                {dashboardWidgets.includes('upcoming-opportunities-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between pb-3.5 border-b border-outline-variant mb-4">
                      <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                        <FiAward className="text-primary" size={16} /> Upcoming Opportunities
                      </h3>
                      <button 
                        onClick={() => navigate('/dashboard?tab=opportunities')}
                        className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4 overflow-y-auto max-h-[580px] pr-1 no-scrollbar">
                      {opportunitiesList.slice(0, 3).map((opp) => (
                        <div key={opp.id} className="p-3.5 bg-surface rounded-lg border border-outline-variant hover:border-primary transition-all flex flex-col gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-base shrink-0 select-none">
                              {opp.logo}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-on-surface hover:text-primary transition-colors cursor-pointer line-clamp-1">
                                {opp.title}
                              </h4>
                              <p className="text-[10px] text-on-surface-variant font-semibold">{opp.host}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant text-[10px] text-on-surface-variant/70">
                            <span>Deadline: <strong className="text-error font-semibold">{opp.deadline}</strong></span>
                            <span className="font-bold text-primary uppercase tracking-wide">{opp.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Senior Guidance Materials list */}
                {dashboardWidgets.includes('guidance-materials-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiBookOpen className="text-primary" size={16} /> Guidance Guides Uploaded
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-surface rounded-lg border border-outline-variant">
                        <h4 className="text-xs font-bold text-on-surface">Vetted Mock Interview Guide</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">84 downloads today</p>
                      </div>
                      <div className="p-3 bg-surface rounded-lg border border-outline-variant">
                        <h4 className="text-xs font-bold text-on-surface">System Architecture Cheat Sheet</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">142 downloads today</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recruiter Active Listings widget */}
                {dashboardWidgets.includes('active-postings-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiBriefcase className="text-primary" size={16} /> Active Listings
                    </h3>
                    <div className="space-y-3">
                      {recruiterJobPostings.map((job) => (
                        <div key={job.id} className="p-3 bg-surface rounded-lg border border-outline-variant">
                          <h4 className="text-xs font-bold text-on-surface">{job.title}</h4>
                          <p className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">{job.applicantsCount} Applicants</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* College Admin top recruiting partners */}
                {dashboardWidgets.includes('placement-rates-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiTrendingUp className="text-primary" size={16} /> Top Corporate Partners
                    </h3>
                    <div className="divide-y divide-outline-variant">
                      <div className="py-2.5 flex items-center justify-between text-xs font-semibold">
                        <span>Stripe</span>
                        <span className="text-primary font-bold">6 Hires</span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between text-xs font-semibold">
                        <span>Amazon Web Services</span>
                        <span className="text-primary font-bold">4 Hires</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Platform Admin Storage Utilization */}
                {dashboardWidgets.includes('storage-utilization-card') && (
                  <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                      <FiHardDrive className="text-primary" size={16} /> Disk Usage Storage
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Database Pool</span>
                        <span>12% Used</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* Resources Tab View */}
          {currentTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ResourceRepository />
            </motion.div>
          )}

          {/* Upload Resource Tab View */}
          {currentTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <UploadResource />
            </motion.div>
          )}

          {/* Leaderboard Tab View */}
          {currentTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LeaderboardTab />
            </motion.div>
          )}

          {/* Sourced Reviews Tab View */}
          {currentTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <VerifiedReviewsTab />
            </motion.div>
          )}

          {/* Opportunities Tab View */}
          {currentTab === 'opportunities' && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <OpportunitiesTab />
            </motion.div>
          )}

          {/* Learning Hub Tab View */}
          {currentTab === 'learning-hub' && (
            <motion.div
              key="learning-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LearningHubTab />
            </motion.div>
          )}

          {/* Team Finder Tab View */}
          {currentTab === 'team-finder' && (
            <motion.div
              key="team-finder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TeamFinderTab />
            </motion.div>
          )}

          {/* Skill Gap Finder Tab View */}
          {currentTab === 'skill-gap' && (
            <motion.div
              key="skill-gap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SkillGapFinderTab />
            </motion.div>
          )}

          {/* Seniors Connect Tab View */}
          {currentTab === 'seniors' && (
            <motion.div
              key="seniors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SeniorsMentorshipTab />
            </motion.div>
          )}

          {/* Admin Control Hub Tab View */}
          {currentTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboardTab />
            </motion.div>
          )}

          {/* Recruiter Candidate Search Tab */}
          {currentTab === 'candidate-search' && (
            <motion.div
              key="candidate-search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CandidateSearchTab />
            </motion.div>
          )}

          {/* Recruiter Job Postings Tab */}
          {currentTab === 'job-postings' && (
            <motion.div
              key="job-postings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <JobPostingsTab />
            </motion.div>
          )}

          {/* Recruiter Applications Manager Tab */}
          {currentTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ApplicationsTab />
            </motion.div>
          )}

          {/* Recruiter Hiring Analytics Tab */}
          {currentTab === 'hiring-analytics' && (
            <motion.div
              key="hiring-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HiringAnalyticsTab />
            </motion.div>
          )}

          {/* Senior Mentorship Requests Tab */}
          {currentTab === 'mentorship-requests' && (
            <motion.div
              key="mentorship-requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MentorshipRequestsTab />
            </motion.div>
          )}

          {/* Senior Student Q&A Tab */}
          {currentTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StudentQuestionsTab />
            </motion.div>
          )}

          {/* College Admin Student Analytics Tab */}
          {currentTab === 'student-analytics' && (
            <motion.div
              key="student-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StudentAnalyticsTab />
            </motion.div>
          )}

          {/* College Admin Verification Requests Tab */}
          {currentTab === 'verifications' && (
            <motion.div
              key="verifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <VerificationRequestsTab />
            </motion.div>
          )}

          {/* College Admin Placement Reports Tab */}
          {currentTab === 'placements' && (
            <motion.div
              key="placements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PlacementReportsTab />
            </motion.div>
          )}

          {/* Platform Admin User Management Tab */}
          {currentTab === 'user-mgmt' && (
            <motion.div
              key="user-mgmt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <UserManagementTab />
            </motion.div>
          )}

          {/* Platform Admin College Management Tab */}
          {currentTab === 'college-mgmt' && (
            <motion.div
              key="college-mgmt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CollegeManagementTab />
            </motion.div>
          )}

          {/* Platform Admin Moderation Queue (Reuses Admin Control Hub Vetting Queue) */}
          {currentTab === 'moderation' && (
            <motion.div
              key="moderation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboardTab />
            </motion.div>
          )}

          {/* Platform Admin System Reports Tab */}
          {currentTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SystemReportsTab />
            </motion.div>
          )}

          {/* Platform Admin System Analytics Tab */}
          {currentTab === 'sys-analytics' && (
            <motion.div
              key="sys-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SystemAnalyticsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
