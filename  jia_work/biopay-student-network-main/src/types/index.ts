export type UserRole = 'student' | 'faculty' | 'recruiter' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  private: boolean;
}

export interface RoleDetectionResult {
  role: UserRole;
  confidence: 'high' | 'medium' | 'low';
  matchedRule: string;
  domain: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role: UserRole }>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  detectedRole: UserRole;
  setDetectedRole: (role: UserRole) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // role-specific
  university?: string;
  graduationYear?: string;
  major?: string;
  department?: string;
  institution?: string;
  designation?: string;
  company?: string;
  position?: string;
  industry?: string;
}
