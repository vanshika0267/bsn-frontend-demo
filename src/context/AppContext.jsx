import React, { createContext, useContext, useState } from 'react';
import { 
  currentUser as initialUser, 
  notificationsList as initialNotifications, 
  opportunities as initialOpportunities,
  learningResources as initialResources,
  teamFinderPosts as initialTeams
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for the prototype, can be set to false
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

  const login = (email, password, role = 'Student') => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUser({
      ...initialUser,
      role: role,
      email: email || initialUser.email
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const updateSettings = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
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
