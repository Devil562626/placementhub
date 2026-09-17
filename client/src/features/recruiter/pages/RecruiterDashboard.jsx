import { Link } from 'react-router-dom';
import { getDrives } from '../../../api/drives.api.js';
import StatCard from '../../../components/common/StatCard.jsx';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import useFetch from '../../../hooks/useFetch.js';

export default function RecruiterDashboard() {
  const { data, loading, error } = useFetch(getDrives, []);
  const drives = data?.data || [];
  const totalApps = drives.reduce((sum, d) => sum + (d._count?.applications || 0), 0);
  const published = drives.filter((d) => d.status === 'PUBLISHED').length;

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-bold mb-1">Recruiter Dashboard</h1>
      <p className="text-sm text-slate-400 mb-6">Your company drives and candidate activity.</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="My Drives" value={drives.length} />
        <StatCard label="Total Applicants" value={totalApps} />
        <StatCard label="Published" value={published} />
      </div>

      {loading && <div className="text-sm text-slate-400">Loading drives...</div>}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400">
              <th className="pb-3">Role</th>
              <th className="pb-3">CTC</th>
              <th className="pb-3">Deadline</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Applicants</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((d) => (
              <tr key={d.id} className="border-t border-slate-100 hover:bg-primary-50/40">
                <td className="py-3 font-medium text-ink-900">{d.jobRole}</td>
                <td className="py-3">{d.ctcMin}-{d.ctcMax}L</td>
                <td className="py-3">{new Date(d.lastDateToApply).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td className="py-3"><StatusBadge status={d.status} /></td>
                <td className="py-3">{d._count?.applications ?? 0}</td>
                <td className="py-3 text-right">
                  <Link to={`/candidates?drive=${d.id}`} className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold">View Candidates</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && drives.length === 0 && (
          <div className="py-6 text-center text-slate-400 text-sm">No drives for your company yet. The TPO creates them.</div>
        )}
      </div>
    </div>
  );
}