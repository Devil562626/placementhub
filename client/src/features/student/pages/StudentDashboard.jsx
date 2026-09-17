import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getDrives } from '../../../api/drives.api.js';
import { myApplications } from '../../../api/applications.api.js';
import { myOffers } from '../../../api/offers.api.js';
import StatCard from '../../../components/common/StatCard.jsx';
import DriveBrowser from '../components/DriveBrowser.jsx';
import useFetch from '../../../hooks/useFetch.js';

export default function StudentDashboard() {
  const { user } = useAuth();
  const drives = useFetch(getDrives, []);
  const apps = useFetch(myApplications, []);
  const offers = useFetch(myOffers, []);

  const driveCount = drives.data?.data?.length;
  const activeApps = (apps.data?.data || []).filter((a) => !['REJECTED', 'WITHDRAWN'].includes(a.status)).length;
  const pendingOffers = (offers.data?.data || []).filter((o) => o.status === 'OFFERED').length;

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-bold">Hi {user?.name?.split(' ')[0]} 👋</h1>
      <p className="text-sm text-slate-400 mb-6">Here are your eligible drives.</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Eligible Drives" value={driveCount ?? '-'} icon="💼" />
        <StatCard label="Active Applications" value={apps.data ? activeApps : '-'} icon="📝" />
        <StatCard label="Offers" value={offers.data ? offers.data.data.length : '-'} icon="🎯" />
      </div>

      {pendingOffers > 0 && (
        <Link to="/offers" className="block mb-6 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium animate-popIn hover:bg-emerald-100 transition">
          🎉 You have {pendingOffers} offer{pendingOffers > 1 ? 's' : ''} waiting! Click here to respond.
        </Link>
      )}

      <DriveBrowser />
    </div>
  );
}