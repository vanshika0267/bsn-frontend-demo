import { 
  FiGrid, FiUser, FiSearch, FiBriefcase, FiLayers, FiTrendingUp, 
  FiBell, FiSettings 
} from 'react-icons/fi';

export const recruiterConfig = {
  roleName: 'Recruiter',
  sidebar: [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid, tab: 'overview' },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Candidate Search', path: '/dashboard?tab=candidate-search', icon: FiSearch, tab: 'candidate-search' },
    { name: 'Job Postings', path: '/dashboard?tab=job-postings', icon: FiBriefcase, tab: 'job-postings' },
    { name: 'Applications Manager', path: '/dashboard?tab=applications', icon: FiLayers, tab: 'applications' },
    { name: 'Hiring Analytics', path: '/dashboard?tab=hiring-analytics', icon: FiTrendingUp, tab: 'hiring-analytics' },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ],
  quickActions: [
    { id: 'post-job', label: 'Post Opportunity', action: 'post-job', variant: 'primary' },
    { id: 'search-candidates', label: 'Search Candidates', action: 'search-talent', variant: 'outline' }
  ],
  dashboardWidgets: [
    'welcome-card',
    'recruiter-kpi-stats',
    'pipeline-funnel-card',
    'recent-applicants-card',
    'active-postings-card'
  ],
  settingsTabs: [
    { id: 'profile', name: 'Recruiter Bio' },
    { id: 'company', name: 'Company Details' },
    { id: 'hiring-filters', name: 'Smart Filtering Rules' },
    { id: 'appearance', name: 'Appearance Preferences' }
  ],
  allowedTabs: ['overview', 'candidate-search', 'job-postings', 'applications', 'hiring-analytics'],
  recommendations: ['Talent Sourcing Trends', 'Stitch AI Technical Evaluation Kit']
};
