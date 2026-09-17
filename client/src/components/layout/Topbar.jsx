import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getNotifications, markAllRead } from '../../api/notifications.api.js';
import useFetch from '../../hooks/useFetch.js';

export default function Topbar() {
  const { user } = useAuth();
  const { data, reload } = useFetch(getNotifications, []);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const notifications = data?.data?.notifications || [];
  const unread = data?.data?.unreadCount || 0;

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleMarkAll() {
    await markAllRead();
    reload();
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-20">
      <div className="text-sm text-slate-400">Search coming soon...</div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(!open)} className="relative text-xl">🔔</button>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-popIn">
              {unread}
            </span>
          )}
          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-card-hover animate-popIn overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-semibold text-sm">Notifications</span>
                {unread > 0 && <button onClick={handleMarkAll} className="text-xs text-primary-600 font-semibold">Mark all read</button>}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">Nothing yet.</div>}
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 text-sm border-b border-slate-50 ${n.isRead ? '' : 'bg-primary-50/50'}`}>
                    <div className="text-ink-900">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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