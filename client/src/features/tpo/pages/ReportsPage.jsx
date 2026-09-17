import { summary, exportCsv } from '../../../api/reports.api.js';
import StatCard from '../../../components/common/StatCard.jsx';
import useFetch from '../../../hooks/useFetch.js';

export default function ReportsPage() {
  const { data, loading, error } = useFetch(summary, []);
  const s = data?.data;

  async function downloadCsv() {
    try {
      const blob = await exportCsv();
      const url = URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'placements.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || 'Export failed');
    }
  }

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button className="btn-primary" onClick={downloadCsv}>Export CSV</button>
      </div>
      {loading && <div className="text-sm text-slate-400">Loading...</div>}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
      {s && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard label="Placement Rate" value={s.placementRate} suffix="%" icon="" />
            <StatCard label="Total Offers" value={s.totalOffers} icon="" />
            <StatCard label="Average CTC" value={'INR ' + s.avgCtc + 'L'} icon="" />
            <StatCard label="Lowest CTC" value={'INR ' + s.lowestCtc + 'L'} icon="" />
          </div>
          <div className="card">
            <h2 className="font-semibold mb-4">Company-wise Hiring</h2>
            {s.companyWise.length === 0 ? (
              <div className="text-sm text-slate-400">No placements yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="pb-2">Company</th>
                    <th className="pb-2">Hires</th>
                    <th className="pb-2 text-right">Avg CTC</th>
                  </tr>
                </thead>
                <tbody>
                  {s.companyWise.map((c) => (
                    <tr key={c.company} className="border-t border-slate-100">
                      <td className="py-2 font-medium text-ink-900">{c.company}</td>
                      <td className="py-2">{c.hires}</td>
                      <td className="py-2 text-right font-semibold">INR {c.avgCtc}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}