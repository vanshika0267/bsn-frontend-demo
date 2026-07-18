import { 
  FiGrid, FiUser, FiUsers, FiSliders, FiShield, FiFileText, FiTrendingUp, 
  FiBell, FiSettings 
} from 'react-icons/fi';

export const platformAdminConfig = {
  roleName: 'Platform Admin',
  sidebar: [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid, tab: 'overview' },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'User Management', path: '/dashboard?tab=user-mgmt', icon: FiUsers, tab: 'user-mgmt' },
    { name: 'College Management', path: '/dashboard?tab=college-mgmt', icon: FiSliders, tab: 'college-mgmt' },
    { name: 'Moderation Queue', path: '/dashboard?tab=moderation', icon: FiShield, tab: 'moderation' },
    { name: 'System Reports', path: '/dashboard?tab=reports', icon: FiFileText, tab: 'reports' },
    { name: 'System Analytics', path: '/dashboard?tab=sys-analytics', icon: FiTrendingUp, tab: 'sys-analytics' },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ],
  quickActions: [
    { id: 'adjust-scoring', label: 'Edit Points Rules', action: 'scoring-rules', variant: 'primary' },
    { id: 'system-snapshot', label: 'View Health Check', action: 'health-snapshot', variant: 'outline' }
  ],
  dashboardWidgets: [
    'welcome-card',
    'platform-kpi-stats',
    'system-load-card',
    'moderation-status-card',
    'storage-utilization-card'
  ],
  settingsTabs: [
    { id: 'profile', name: 'Admin Account' },
    { id: 'scoring-rules', name: 'Scoring Multipliers' },
    { id: 'system-backups', name: 'Database Backups' },
    { id: 'appearance', name: 'Appearance Preferences' }
  ],
  allowedTabs: ['overview', 'user-mgmt', 'college-mgmt', 'moderation', 'reports', 'sys-analytics'],
  recommendations: ['Database Tuning Guide', 'Security Headers OWASP checklist']
};
