import { 
  FiGrid, FiUser, FiCalendar, FiMessageSquare, FiBookOpen, 
  FiBell, FiSettings, FiStar 
} from 'react-icons/fi';

export const seniorConfig = {
  roleName: 'Senior/Alumni',
  sidebar: [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid, tab: 'overview' },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Mentorship Requests', path: '/dashboard?tab=mentorship-requests', icon: FiCalendar, tab: 'mentorship-requests' },
    { name: 'Student Q&A', path: '/dashboard?tab=questions', icon: FiMessageSquare, tab: 'questions' },
    { name: 'Guidance Resources', path: '/dashboard?tab=resources', icon: FiBookOpen, tab: 'resources' },
    { name: 'Verified Reviews', path: '/dashboard?tab=reviews', icon: FiStar, tab: 'reviews' },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ],
  quickActions: [
    { id: 'set-slots', label: 'Manage Open Slots', action: 'manage-slots', variant: 'primary' },
    { id: 'answer-qa', label: 'Resolve Student Doubts', action: 'answer-doubts', variant: 'outline' }
  ],
  dashboardWidgets: [
    'welcome-card',
    'senior-kpi-stats',
    'mentorship-slots-card',
    'recent-questions-card',
    'guidance-materials-card'
  ],
  settingsTabs: [
    { id: 'profile', name: 'Profile & Experience' },
    { id: 'scheduling', name: 'Availability & Scheduling' },
    { id: 'notifications', name: 'Alumni Alerts' },
    { id: 'appearance', name: 'Appearance Preferences' }
  ],
  allowedTabs: ['overview', 'mentorship-requests', 'questions', 'resources', 'upload', 'reviews'],
  recommendations: ['Vetted Mock Interview Guide', 'System Architecture Best Practices']
};
