import { myApplications } from '../../../api/applications.api.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import Stepper from '../../../components/common/Stepper.jsx';
import useFetch from '../../../hooks/useFetch.js';

export default function MyApplicationsPage() {
  const { data, loading, error } = useFetch(myApplications, []);
  const apps = data?.data || [];

  return (
    <div className="animate-fadeUp">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">My Applications</h1>
      {loading && <div className="text-sm text-slate-400">Loading...</div>}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
      <div className="space-y-4">
        {apps.map((a, i) => (
          <div key={a.id} className="card animate-fadeUp" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center font-display font-bold text-primary-600 shrink-0">
                  {a.drive?.company?.name?.[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-ink-900 truncate">{a.drive?.company?.name}</div>
                  <div className="text-xs text-slate-400 truncate">{a.drive?.jobTitle}</div>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <Stepper status={a.status} />
            {(a.roundResults || []).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {a.roundResults.map((rr) => (
                  <span key={rr.id} className={`badge ${rr.result === 'PASS' ? 'bg-emerald-100 text-emerald-700' : rr.result === 'FAIL' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                    {rr.round?.name}: {rr.result}
                  </span>
                ))}
              </div>
            )}
            {a.offer && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-emerald-50 text-sm text-emerald-700">
                Offer: INR {a.offer.ctc} LPA · {a.offer.jobRole} · <b>{a.offer.status}</b>
              </div>
            )}
          </div>
        ))}
        {!loading && apps.length === 0 && (
          <div className="card text-center text-slate-400">No applications yet. Apply from the Drives page!</div>
        )}
      </div>
    </div>
  );
}