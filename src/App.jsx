import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { RoleProvider } from './context/RoleContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import SkillsEditPage from './pages/Profile/SkillsEditPage';
import InterestsEditPage from './pages/Profile/InterestsEditPage';
import SyllabusEditPage from './pages/Syllabus/SyllabusEditPage';
import SettingsPage from './pages/Settings/SettingsPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';

function App() {
  return (
    <AppProvider>
      <RoleProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
            <Route path="/profile/edit/skills" element={<ProtectedRoute><SkillsEditPage /></ProtectedRoute>} />
            <Route path="/profile/edit/interests" element={<ProtectedRoute><InterestsEditPage /></ProtectedRoute>} />
            <Route path="/syllabus/edit" element={<ProtectedRoute><SyllabusEditPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Floating FAQ chatbot — shows on every page */}
          <ChatbotWidget />
        </Router>
      </RoleProvider>
    </AppProvider>
  );
}

export default App;
