import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  currentUser as initialUser,
  notificationsList as initialNotifications,
  opportunities as initialOpportunities,
  learningResources as initialResources,
  teamFinderPosts as initialTeams
} from '../data/mockData';
import { apiLogin, apiRegister, apiGetMe, setToken, getToken } from '../services/api';

const AppContext = createContext();

// Map the backend's role (admin | recruiter | student) to the frontend role
// labels that RoleContext uses to pick which portal to show.
const ROLE_LABELS = {
  admin: 'Platform Admin',     // change to 'College Admin' if you prefer that portal
  recruiter: 'Recruiter',
  student: 'Student',
};
const roleLabel = (backendRole) => ROLE_LABELS[String(backendRole || '').toLowerCase()] || 'Student';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // real auth now
  const [authReady, setAuthReady] = useState(false);             // session-restore done?
  const [userRole, setUserRole] = useState('Student'); // Student, Senior/Alumni, Recruiter, College Admin, Platform Admin
  const [notifications, setNotifications] = useState(initialNotifications);
  const [opportunitiesList, setOpportunitiesList] = useState(initialOpportunities);
  const [resourcesList, setResourcesList] = useState(initialResources);
  const [teamsList, setTeamsList] = useState(initialTeams);
  const [bookedSessionsCount, setBookedSessionsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Settings States
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    emailNotifications: true,
    opportunityAlerts: true,
    rankUpdates: true,
    darkMode: true,
    autoBackup: false
  });

  // On load: if a token exists, restore the session by fetching the real user.
  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthReady(true); return; }
    apiGetMe()
      .then((me) => {
        const label = roleLabel(me.role);
        setUser({ ...initialUser, ...me, role: label });
        setUserRole(label);
        setIsAuthenticated(true);
      })
      .catch(() => setToken(null))
      .finally(() => setAuthReady(true));
  }, []);

  // REAL login against the backend. Role comes from the backend (me.role),
  // so a @connectbiopay.com user lands on the admin portal automatically.
  const login = async (email, password) => {
    await apiLogin(email, password);           // stores JWT
    const me = await apiGetMe();               // fetch the real user (includes role)
    const label = roleLabel(me.role);
    setUser({ ...initialUser, ...me, role: label, email: me.email || email });
    setUserRole(label);
    setIsAuthenticated(true);
    return label;
  };

  // REAL register, then auto-login
  const register = async ({ name, email, password, college }) => {
    await apiRegister({ name, email, password, college });
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUser(initialUser);
    setUserRole('Student');
  };

  const markNotificationAsRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearNotification = (id) =>
    setNotifications(prev => prev.filter(n => n.id !== id));
  const updateProfile = (updatedFields) =>
    setUser(prev => ({ ...prev, ...updatedFields }));
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
