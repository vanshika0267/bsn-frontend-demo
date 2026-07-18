import {
  FiGrid, FiUser, FiMessageSquare, FiCalendar, FiBookOpen,
  FiUpload, FiBell, FiSettings
} from 'react-icons/fi';

export const facultyConfig = {
  roleName: 'Faculty',
  sidebar: [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid, tab: 'overview' },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Student Q&A', path: '/dashboard?tab=questions', icon: FiMessageSquare, tab: 'questions' },
    { name: 'Mentorship Requests', path: '/dashboard?tab=mentorship-requests', icon: FiCalendar, tab: 'mentorship-requests' },
    { name: 'Resource Repository', path: '/dashboard?tab=resources', icon: FiBookOpen, tab: 'resources' },
    { name: 'Upload Material', path: '/dashboard?tab=upload', icon: FiUpload, tab: 'upload' },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ],
  quickActions: [
    { id: 'answer-doubts', label: 'Answer Student Questions', action: 'answer-doubts', variant: 'primary' },
    { id: 'upload-material', label: 'Upload Course Material', action: 'upload-material', variant: 'outline' }
  ],
  dashboardWidgets: [
    'welcome-card',
    'senior-kpi-stats',
    'recent-questions-card',
    'guidance-materials-card'
  ],
  settingsTabs: [
    { id: 'profile', name: 'Profile & Department' },
    { id: 'notifications', name: 'Faculty Alerts' },
    { id: 'appearance', name: 'Appearance Preferences' }
  ],
  allowedTabs: ['overview', 'questions', 'mentorship-requests', 'resources', 'upload', 'reviews'],
  recommendations: ['Curriculum Planning Toolkit', 'Student Assessment Best Practices']
};