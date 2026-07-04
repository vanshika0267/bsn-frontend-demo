import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  currentUser as initialUser,
  notificationsList as initialNotifications,
  opportunities as initialOpportunities,
  learningResources as initialResources,
  teamFinderPosts as initialTeams
} from '../data/mockData';
import { apiLogin, apiRegister, apiGetMe, setToken, getToken } from '../services/api';
import { getSavedGitHubUsername, saveGitHubUsername as storageSaveGitHubUsername } from '../utils/github';
import { detectRoleFromEmail } from '../utils/roleDetection';

const AppContext = createContext();

// Map the backend's role (admin | recruiter | student) to the frontend role
// labels that RoleContext uses to pick which portal to show.
const ROLE_LABELS = {
  admin: 'Platform Admin',     // change to 'College Admin' if you prefer that portal
  recruiter: 'Recruiter',
  student: 'Student',
  faculty: 'Senior/Alumni',
};
const roleLabel = (backendRole) => ROLE_LABELS[String(backendRole || '').toLowerCase()] || 'Student';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bsn_user');
    return saved ? JSON.parse(saved) : initialUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false); // real auth now
  const [authReady, setAuthReady] = useState(false);             // session-restore done?
  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem('bsn_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.role || 'Student';
    }
    return 'Student';
  }); // Student, Senior/Alumni, Recruiter, College Admin, Platform Admin
  const [notifications, setNotifications] = useState(initialNotifications);
  const [opportunitiesList, setOpportunitiesList] = useState(initialOpportunities);
  const [resourcesList, setResourcesList] = useState(initialResources);
  const [teamsList, setTeamsList] = useState(initialTeams);
  const [bookedSessionsCount, setBookedSessionsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('bsn_courses');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Software Engineering Mastery',
        track: 'Software Engineering',
        description: 'Master React, Tailwind CSS, Advanced Hooks, Redux Toolkit, and performance optimizations.',
        modules: [
          { id: 'fe-1', name: 'HTML5 Semantic Structure & SEO Best Practices', completed: true },
          { id: 'fe-2', name: 'CSS Flexbox, Grid, & Advanced Tailwind Patterns', completed: true },
          { id: 'fe-3', name: 'React Fundamentals & Component Lifecycle', completed: true },
          { id: 'fe-4', name: 'Hooks Deep Dive: useEffect, custom hooks, and memoization', completed: false },
          { id: 'fe-5', name: 'State Management: Context API & Redux Toolkit', completed: false },
          { id: 'fe-6', name: 'Vite Compilation, Bundlers, & Production Deployments', completed: false },
        ],
        xpReward: 300,
      },
      {
        id: 2,
        title: 'Discrete Mathematics Foundation',
        track: 'Discrete Mathematics',
        description: 'Learn MVC, RESTful APIs, Node.js, Express, Postgres Database, and JWT authentications.',
        modules: [
          { id: 'be-1', name: 'Node.js Event Loop & Non-blocking I/O', completed: false },
          { id: 'be-2', name: 'Express Server setup and Routing controllers', completed: false },
          { id: 'be-3', name: 'Database schema design & migrations (Postgres)', completed: false },
          { id: 'be-4', name: 'Authentication flow: JWT tokens and sessions', completed: false },
        ],
        xpReward: 400,
      },
      {
        id: 3,
        title: 'Java Development Essentials',
        track: 'Java',
        description: 'Understand Figma layouts, design systems, harmony of typography, and contrast rules.',
        modules: [
          { id: 'ui-1', name: 'Figma Auto layouts & component variant sets', completed: true },
          { id: 'ui-2', name: 'Color harmonies (HSL) and dark-mode guidelines', completed: false },
          { id: 'ui-3', name: 'Typography scales and layouts guidelines', completed: false },
        ],
        xpReward: 250,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bsn_courses', JSON.stringify(courses));
  }, [courses]);

  // Jiya's GitHub integration state
  const [githubUsername, setGithubUsernameState] = useState(null);

  // Settings States
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('bsn_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      profileVisibility: 'public',
      emailNotifications: true,
      opportunityAlerts: true,
      rankUpdates: true,
      darkMode: true,
      autoBackup: false
    };
  });

  // Sync dark mode class and save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bsn_settings', JSON.stringify(settings));
    } catch (e) {}
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const setGithubUsername = (username) => {
    setGithubUsernameState(username);
    if (username) {
      storageSaveGitHubUsername(username);
    } else {
      try {
        localStorage.removeItem('biopay_github_username_v1');
      } catch {}
    }
  };

  // On load: if a token exists, restore the session by fetching the real user.
  useEffect(() => {
    const token = getToken();
    const savedUser = localStorage.getItem('bsn_user');
    
    // Load persisted GitHub username
    const gh = getSavedGitHubUsername();
    if (gh) setGithubUsernameState(gh);

    if (!token) {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setAuthReady(true);
      return;
    }
    apiGetMe()
      .then((me) => {
        const label = roleLabel(me.role);
        const fetched = { ...initialUser, ...me, role: label };
        if (savedUser) {
          const parsedSaved = JSON.parse(savedUser);
          if (parsedSaved.id === fetched.id || parsedSaved.email === fetched.email) {
            setUser({ ...fetched, ...parsedSaved });
            setUserRole(parsedSaved.role || label);
            setIsAuthenticated(true);
            return;
          }
        }
        setUser(fetched);
        setUserRole(label);
        setIsAuthenticated(true);
      })
      .catch(() => setToken(null))
      .finally(() => setAuthReady(true));
  }, []);

  // REAL login against the backend. Role comes from the backend (me.role),
  // so a @connectbiopay.com user lands on the admin portal automatically.
  const login = async (email, password) => {
    try {
      await apiLogin(email, password);           // stores JWT
      const me = await apiGetMe();               // fetch the real user (includes role)
      const label = roleLabel(me.role);
      const loggedUser = { ...initialUser, ...me, role: label, email: me.email || email };
      setUser(loggedUser);
      setUserRole(label);
      setIsAuthenticated(true);
      localStorage.setItem('bsn_user', JSON.stringify(loggedUser));
      return label;
    } catch (err) {
      console.warn("Backend connection failed, falling back to client-side authentication simulation:", err);
      const detectedRole = detectRoleFromEmail(email); // student, recruiter, faculty, admin
      const label = roleLabel(detectedRole?.role || detectedRole);
      const loggedUser = {
        ...initialUser,
        name: email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
        email,
        role: label,
        college: email.includes('@') ? email.split('@')[1].split('.')[0].toUpperCase() + ' University' : 'Massachusetts Institute of Technology'
      };
      setUser(loggedUser);
      setUserRole(label);
      setIsAuthenticated(true);
      localStorage.setItem('bsn_user', JSON.stringify(loggedUser));
      return label;
    }
  };

  // REAL register, then auto-login
  const register = async (regData) => {
    const { name, email, password, university, college } = regData;
    const collegeName = university || college || 'BioPay University';
    try {
      await apiRegister({ name, email, password, college: collegeName });
      await login(email, password);
    } catch (err) {
      console.warn("Backend registration failed, simulating client-side registration:", err);
      const detectedRole = detectRoleFromEmail(email);
      const label = roleLabel(detectedRole?.role || detectedRole);
      const loggedUser = {
        ...initialUser,
        ...regData,
        role: label,
        college: collegeName
      };
      setUser(loggedUser);
      setUserRole(label);
      setIsAuthenticated(true);
      localStorage.setItem('bsn_user', JSON.stringify(loggedUser));
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUser(initialUser);
    setUserRole('Student');
    localStorage.removeItem('bsn_user');
  };

  const markNotificationAsRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearNotification = (id) =>
    setNotifications(prev => prev.filter(n => n.id !== id));
  const updateProfile = (updatedFields) =>
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('bsn_user', JSON.stringify(updated));
      return updated;
    });
  const updateSettings = (key, value) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      authReady,
      userRole,
      notifications,
      opportunitiesList,
      resourcesList,
      teamsList,
      bookedSessionsCount,
      searchQuery,
      settings,
      githubUsername,
      courses,
      setCourses,
      setGithubUsername,
      setSearchQuery,
      setOpportunitiesList,
      setResourcesList,
      setTeamsList,
      setBookedSessionsCount,
      login,
      register,
      logout,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotification,
      updateProfile,
      updateSettings,
      setIsAuthenticated,
      setUserRole
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

