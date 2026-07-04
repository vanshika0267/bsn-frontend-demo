import { 
  FiGrid, FiUser, FiBookOpen, FiAward, FiBriefcase, 
  FiCompass, FiUsers, FiBell, FiSettings, FiStar 
} from 'react-icons/fi';

export const studentConfig = {
  roleName: 'Student',
  sidebar: [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid, tab: 'overview' },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Resources', path: '/dashboard?tab=resources', icon: FiBookOpen, tab: 'resources' },
    { name: 'Leaderboard', path: '/dashboard?tab=leaderboard', icon: FiAward, tab: 'leaderboard' },
    { name: 'Opportunities', path: '/dashboard?tab=opportunities', icon: FiBriefcase, tab: 'opportunities' },
    { name: 'Learning Hub', path: '/dashboard?tab=learning-hub', icon: FiCompass, tab: 'learning-hub' },
    { name: 'Team Finder', path: '/dashboard?tab=team-finder', icon: FiUsers, tab: 'team-finder' },
    { name: 'Skill Gap Finder', path: '/dashboard?tab=skill-gap', icon: FiCompass, tab: 'skill-gap' },
    { name: 'Seniors Connect', path: '/dashboard?tab=seniors', icon: FiUser, tab: 'seniors' },
    { name: 'Verified Reviews', path: '/dashboard?tab=reviews', icon: FiStar, tab: 'reviews' },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ],
  quickActions: [
    { id: 'share-resource', label: 'Share Resource', action: 'upload', variant: 'primary' },
    { id: 'launch-squad', label: 'Create Team', action: 'squad', variant: 'outline' }
  ],
  dashboardWidgets: [
    'welcome-card',
    'student-kpi-stats',
    'verified-skills-card',
    'recent-activity-card',
    'upcoming-opportunities-card'
  ],
  settingsTabs: [
    { id: 'profile', name: 'Profile Information' },
    { id: 'notifications', name: 'Email & Opportunity Alerts' },
    { id: 'privacy', name: 'Profile Privacy Options' },
    { id: 'appearance', name: 'Appearance Preferences' }
  ],
  allowedTabs: ['overview', 'resources', 'upload', 'leaderboard', 'opportunities', 'learning-hub', 'team-finder', 'skill-gap', 'seniors', 'reviews'],
  recommendations: ['Software Engineering Mastery', 'Java Development Essentials']
};
