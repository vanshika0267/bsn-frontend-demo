import { 
  FiGrid, FiUser, FiTrendingUp, FiCheckSquare, FiFileText, 
  FiBell, FiSettings 
} from 'react-icons/fi';

export const collegeAdminConfig = {
  roleName: 'College Admin',
  sidebar: [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid, tab: 'overview' },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Student Analytics', path: '/dashboard?tab=student-analytics', icon: FiTrendingUp, tab: 'student-analytics' },
    { name: 'Verification Requests', path: '/dashboard?tab=verifications', icon: FiCheckSquare, tab: 'verifications' },
    { name: 'Placement Reports', path: '/dashboard?tab=placements', icon: FiFileText, tab: 'placements' },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ],
  quickActions: [
    { id: 'bulk-verify', label: 'Verify Credentials', action: 'bulk-verify', variant: 'primary' },
    { id: 'placement-report', label: 'Export Report', action: 'export-placements', variant: 'outline' }
  ],
  dashboardWidgets: [
    'welcome-card',
    'college-kpi-stats',
    'enrolled-students-card',
    'pending-verifications-card',
    'placement-rates-card'
  ],
  settingsTabs: [
    { id: 'profile', name: 'Institution Info' },
    { id: 'verification-rules', name: 'Domain & Verification Setup' },
    { id: 'faculty', name: 'Faculty Staff Accounts' },
    { id: 'appearance', name: 'Appearance Preferences' }
  ],
  allowedTabs: ['overview', 'student-analytics', 'verifications', 'placements'],
  recommendations: ['AI Accreditation Manual', 'Industry Alignment Strategy']
};
