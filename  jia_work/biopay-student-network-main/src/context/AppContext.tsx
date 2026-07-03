import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, AuthContextType, RegisterData } from '../types';
import { detectRoleFromEmail } from '../utils/roleDetection';
import { getSavedGitHubUsername } from '../utils/github';

interface AppContextValue extends AuthContextType {
  githubUsername: string | null;
  setGithubUsername: (u: string | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [detectedRole, setDetectedRole] = useState<UserRole>(null);
  const [githubUsername, setGithubUsernameState] = useState<string | null>(null);

  // Load persisted session
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('biopay_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const gh = getSavedGitHubUsername();
      if (gh) setGithubUsernameState(gh);
    } catch {}
  }, []);

  const login = async (email: string, _password: string): Promise<{ success: boolean; role: UserRole }> => {
    // Jiya - Role-Based Login Flow
    // NOTE: Password validation is Shivam's module - keeping basic here intentionally
    const detection = detectRoleFromEmail(email);
    const role = detection.role || 'student';
    
    // Mock user - future backend integration point
    const mockUser: User = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`
    };

    setUser(mockUser);
    setDetectedRole(role);
    try {
      localStorage.setItem('biopay_user', JSON.stringify(mockUser));
      localStorage.setItem('biopay_role', role || '');
    } catch {}
    return { success: true, role };
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Jiya - Role-specific registration flow
    const detection = detectRoleFromEmail(data.email);
    const role = data.role || detection.role || 'student';
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: data.name,
      email: data.email,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`
    };
    setUser(newUser);
    setDetectedRole(role);
    try {
      localStorage.setItem('biopay_user', JSON.stringify(newUser));
    } catch {}
    return true;
  };

  const logout = () => {
    setUser(null);
    setDetectedRole(null);
    try {
      localStorage.removeItem('biopay_user');
      localStorage.removeItem('biopay_role');
    } catch {}
  };

  const setGithubUsername = (u: string | null) => {
    setGithubUsernameState(u);
  };

  const value: AppContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    detectedRole: detectedRole || user?.role || null,
    setDetectedRole,
    githubUsername,
    setGithubUsername,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// Also export as useAuth for compatibility
export const useAuth = useApp;
