import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';

const NAV = {
  STUDENT: [
    { to: '/', label: 'Dashboard', icon: 'D', end: true },
    { to: '/drives', label: 'Drives', icon: 'W' },
    { to: '/applications', label: 'My Applications', icon: 'N' },
    { to: '/offers', label: 'Offers', icon: 'O' },
    { to: '/profile', label: 'Profile', icon: 'U' },
  ],
  TPO: [
    { to: '/', label: 'Dashboard', icon: 'S', end: true },
    { to: '/drives', label: 'Drives', icon: 'W' },
    { to: '/students', label: 'Students', icon: 'G' },
    { to: '/reports', label: 'Reports', icon: 'R' },
  ],
  RECRUITER: [
    { to: '/', label: 'Dashboard', icon: 'S', end: true },
    { to: '/drives', label: 'My Drives', icon: 'W' },
    { to: '/candidates', label: 'Candidates', icon: 'P' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { open, setOpen, isMobile } = useSidebar();
  const items = NAV[user?.role] || [];

  const content = (
    <>
      <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10 shrink-0">
        <span className="text-2xl">🎓</span>
        <span className="font-display font-bold text-lg">PlacementHub</span>
        {isMobile && (
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="ml-auto w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-lg"
          >
            ✕
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => isMobile && setOpen(false)}
            className={({ isActive }) =>
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
              (isActive ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-white/10')
            }
          >
            <span>{item.icon}</span> {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 shrink-0">
        <div className="px-3 pb-2 text-xs text-slate-400 truncate">{user?.email}</div>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors"
        >
          ← Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* mobile: slide-in drawer */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {content}
      </aside>

      {/* desktop: static sidebar (collapses fully when toggled) */}
      <aside className={`hidden lg:flex flex-col bg-ink-900 text-white shrink-0 transition-all duration-300 overflow-hidden ${open ? 'w-60' : 'w-0'}`}>
        <div className="w-60 flex flex-col h-full">
          {content}
        </div>
      </aside>
    </>
  );
}