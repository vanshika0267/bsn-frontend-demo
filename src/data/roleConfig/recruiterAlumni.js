import { 
  FiGrid, FiUser, FiSearch, FiBriefcase, FiLayers, FiTrendingUp, 
  FiBell, FiSettings, FiMessageSquare, FiCalendar, FiBookOpen, FiStar 
} from 'react-icons/fi';

export const recruiterAlumniConfig = {
  roleName: 'Recruiter + Alumni',
  sidebar: [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid, tab: 'overview' },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Candidate Search', path: '/dashboard?tab=candidate-search', icon: FiSearch, tab: 'candidate-search' },
    { name: 'Job Postings', path: '/dashboard?tab=job-postings', icon: FiBriefcase, tab: 'job-postings' },
    { name: 'Applications Manager', path: '/dashboard?tab=applications', icon: FiLayers, tab: 'applications' },
    { name: 'Hiring Analytics', path: '/dashboard?tab=hiring-analytics', icon: FiTrendingUp, tab: 'hiring-analytics' },
    { name: 'Mentorship Requests', path: '/dashboard?tab=mentorship-requests', icon: FiCalendar, tab: 'mentorship-requests' },
    { name: 'Student Q&A', path: '/dashboard?tab=questions', icon: FiMessageSquare, tab: 'questions' },
    { name: 'Guidance Resources', path: '/dashboard?tab=resources', icon: FiBookOpen, tab: 'resources' },
    { name: 'Verified Reviews', path: '/dashboard?tab=reviews', icon: FiStar, tab: 'reviews' },
    { name: 'Messages', path: '/dashboard?tab=chat', icon: FiMessageSquare, tab: 'chat' },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ],
  quickActions: [
    { id: 'post-job', label: 'Post Opportunity', action: 'post-job', variant: 'primary' },
    { id: 'search-candidates', label: 'Search Candidates', action: 'search-talent', variant: 'outline' },
    { id: 'set-slots', label: 'Manage Open Slots', action: 'manage-slots', variant: 'primary' },
    { id: 'answer-qa', label: 'Resolve Student Doubts', action: 'answer-doubts', variant: 'outline' }
  ],
  dashboardWidgets: [
    'welcome-card',
    'recruiter-kpi-stats',
    'pipeline-funnel-card',
    'recent-applicants-card',
    'active-postings-card',
    'senior-kpi-stats',
    'mentorship-slots-card',
    'recent-questions-card',
    'guidance-materials-card'
  ],
  settingsTabs: [
    { id: 'profile', name: 'Recruiter Bio' },
    { id: 'company', name: 'Company Details' },
    { id: 'hiring-filters', name: 'Smart Filtering Rules' },
    { id: 'scheduling', name: 'Availability & Scheduling' },
    { id: 'appearance', name: 'Appearance Preferences' }
  ],
  allowedTabs: [
    'overview', 'candidate-search', 'job-postings', 'applications', 'hiring-analytics', 'chat',
    'mentorship-requests', 'questions', 'resources', 'upload', 'reviews'
  ],
  recommendations: [
    'Talent Sourcing Trends', 'Stitch AI Technical Evaluation Kit', 'Vetted Mock Interview Guide'
  ]
};
