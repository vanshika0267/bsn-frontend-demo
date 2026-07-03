import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../components/layout/DashboardLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={
          <PublicOnlyRoute>
            <AuthPage />
          </PublicOnlyRoute>
        } />
        <Route path="/register" element={
          <PublicOnlyRoute>
            <AuthPage />
          </PublicOnlyRoute>
        } />

        {/* Protected */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="student" element={<DashboardPage />} />
          <Route path="faculty" element={<DashboardPage />} />
          <Route path="recruiter" element={<DashboardPage />} />
          <Route path="admin" element={<DashboardPage />} />
        </Route>

        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout><ProfilePage /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/community" element={<ProtectedRoute><DashboardLayout>
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="font-display text-2xl text-[--color-secondary-navy] mb-2">Community Hub</h2>
            <p className="text-slate-500">Senior chatrooms, mentorship & team finder — launching soon.</p>
            <div className="mt-6 inline-flex gap-2 text-[12px]">
              <span className="px-3 py-1.5 rounded-full bg-slate-100">Company rooms</span>
              <span className="px-3 py-1.5 rounded-full bg-slate-100">1:1 mentorship</span>
              <span className="px-3 py-1.5 rounded-full bg-slate-100">Team finder</span>
            </div>
          </div>
        </DashboardLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
