import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import LoginPage from './features/auth/pages/LoginPage.jsx';
import RegisterPage from './features/auth/pages/RegisterPage.jsx';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage.jsx';
import StudentDashboard from './features/student/pages/StudentDashboard.jsx';
import DrivesPage from './features/student/pages/DrivesPage.jsx';
import MyApplicationsPage from './features/student/pages/MyApplicationsPage.jsx';
import OffersPage from './features/student/pages/OffersPage.jsx';
import ProfilePage from './features/student/pages/ProfilePage.jsx';
import TpoDashboard from './features/tpo/pages/TpoDashboard.jsx';
import TpoDrivesPage from './features/tpo/pages/TpoDrivesPage.jsx';
import TpoStudentsPage from './features/tpo/pages/TpoStudentsPage.jsx';
import ReportsPage from './features/tpo/pages/ReportsPage.jsx';
import RecruiterDashboard from './features/recruiter/pages/RecruiterDashboard.jsx';
import RecruiterCandidatesPage from './features/recruiter/pages/RecruiterCandidatesPage.jsx';

function HomeRouter() {
  const { user } = useAuth();
  if (user?.role === 'TPO') return <TpoDashboard />;
  if (user?.role === 'RECRUITER') return <RecruiterDashboard />;
  return <StudentDashboard />;
}

function DrivesRouter() {
  const { user } = useAuth();
  if (user?.role === 'TPO') return <TpoDrivesPage />;
  return <DrivesPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRouter />} />
        <Route path="drives" element={<DrivesRouter />} />
        <Route path="applications" element={<RoleRoute roles={['STUDENT']}><MyApplicationsPage /></RoleRoute>} />
        <Route path="offers" element={<RoleRoute roles={['STUDENT']}><OffersPage /></RoleRoute>} />
        <Route path="profile" element={<RoleRoute roles={['STUDENT']}><ProfilePage /></RoleRoute>} />
        <Route path="students" element={<RoleRoute roles={['TPO', 'ADMIN']}><TpoStudentsPage /></RoleRoute>} />
        <Route path="reports" element={<RoleRoute roles={['TPO', 'ADMIN']}><ReportsPage /></RoleRoute>} />
        <Route path="candidates" element={<RoleRoute roles={['RECRUITER']}><RecruiterCandidatesPage /></RoleRoute>} />
        <Route path="*" element={<div className="card animate-popIn">Page not found.</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}