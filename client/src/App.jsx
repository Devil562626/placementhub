import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import LoginPage from './features/auth/pages/LoginPage.jsx';
import StudentDashboard from './features/student/pages/StudentDashboard.jsx';
import DrivesPage from './features/student/pages/DrivesPage.jsx';
import MyApplicationsPage from './features/student/pages/MyApplicationsPage.jsx';
import OffersPage from './features/student/pages/OffersPage.jsx';
import TpoDashboard from './features/tpo/pages/TpoDashboard.jsx';
import TpoDrivesPage from './features/tpo/pages/TpoDrivesPage.jsx';
import ReportsPage from './features/tpo/pages/ReportsPage.jsx';
import RecruiterDashboard from './features/recruiter/pages/RecruiterDashboard.jsx';

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
        <Route path="reports" element={<RoleRoute roles={['TPO', 'ADMIN']}><ReportsPage /></RoleRoute>} />
        <Route path="*" element={<div className="card animate-popIn">This page is coming soon.</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}