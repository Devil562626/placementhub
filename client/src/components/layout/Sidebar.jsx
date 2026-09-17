import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = {
  STUDENT: [
    { to: '/', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/drives', label: 'Drives', icon: '💼' },
    { to: '/applications', label: 'My Applications', icon: '📝' },
    { to: '/offers', label: 'Offers', icon: '🎯' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ],
  TPO: [
    { to: '/', label: 'Dashboard', icon: '📊', end: true },
    { to: '/drives', label: 'Drives', icon: '💼' },
    { to: '/students', label: 'Students', icon: '🎓' },
    { to: '/reports', label: 'Reports', icon: '📈' },
  ],
  RECRUITER: [
    { to: '/', label: 'Dashboard', icon: '📊', end: true },
    { to: '/drives', label: 'My Drives', icon: '💼' },
    { to: '/candidates', label: 'Candidates', icon: '👥' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = NAV[user?.role] || [];

  return (
    <aside className="w-60 bg-ink-900 text-white flex flex-col shrink-0">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
        <span className="text-2xl">🎓</span>
        <span className="font-display font-bold text-lg">PlacementHub</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
              (isActive ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-white/10')
            }
          >
            <span>{item.icon}</span> {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="px-3 pb-2 text-xs text-slate-400 truncate">{user?.email}</div>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors"
        >
          ↩ Logout
        </button>
      </div>
    </aside>
  );
}