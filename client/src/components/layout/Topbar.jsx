import { useAuth } from '../../context/AuthContext.jsx';

export default function Topbar() {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-slate-400">Search coming soon...</div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="text-sm leading-tight">
          <div className="font-semibold text-ink-900">{user?.name}</div>
          <div className="text-xs text-slate-400">{user?.role}</div>
        </div>
      </div>
    </header>
  );
}