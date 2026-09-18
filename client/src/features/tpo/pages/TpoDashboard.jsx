import { summary } from '../../../api/reports.api.js';
import StatCard from '../../../components/common/StatCard.jsx';
import { SkeletonCard } from '../../../components/common/Skeleton.jsx';
import useFetch from '../../../hooks/useFetch.js';

export default function TpoDashboard() {
  const { data, loading, error } = useFetch(summary, []);
  const s = data?.data;

  return (
    <div className="animate-fadeUp">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">Placement Dashboard</h1>
      <p className="text-sm text-slate-400 mb-6">Live placement analytics.</p>

      {loading && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} className="h-24 sm:h-28" />)}
        </div>
      )}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

      {s && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard label="Placement Rate" value={s.placementRate} suffix="%" />
            <StatCard label="Placed" value={`${s.placed}/${s.totalStudents}`} />
            <StatCard label="Avg CTC" value={`INR ${s.avgCtc}L`} />
            <StatCard label="Highest" value={`INR ${s.highestCtc}L`} />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card">
              <h2 className="font-semibold mb-4">Branch-wise Placement</h2>
              <div className="space-y-3">
                {s.branchWise.map((b) => (
                  <div key={b.branch}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">{b.branch}</span>
                      <span className="text-slate-400">{b.placed}/{b.total} ({b.rate}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-700" style={{ width: `${b.rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card overflow-x-auto">
              <h2 className="font-semibold mb-4">Recent Placements</h2>
              {s.recentPlacements.length === 0 ? (
                <div className="text-sm text-slate-400">No placements yet.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400">
                      <th className="pb-2">Student</th>
                      <th className="pb-2">Company</th>
                      <th className="pb-2 text-right">CTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.recentPlacements.map((p, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="py-2">
                          <div className="font-medium text-ink-900">{p.student}</div>
                          <div className="text-xs text-slate-400">{p.branch}</div>
                        </td>
                        <td className="py-2">{p.company}</td>
                        <td className="py-2 text-right font-semibold">INR {p.ctc}L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}