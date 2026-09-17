import { useState } from 'react';
import { listStudents } from '../../api/students.api.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import useFetch from '../../hooks/useFetch.js';

export default function TpoStudentsPage() {
  const { data, loading, error } = useFetch(() => listStudents(), []);
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('');
  const [placed, setPlaced] = useState('');

  const students = data?.data || [];
  const branches = [...new Set(students.map((s) => s.branch))];

  const filtered = students.filter((s) =>
    (!branch || s.branch === branch) &&
    (!placed || s.placedStatus === placed) &&
    (!q ||
      (s.user?.name || '').toLowerCase().includes(q.toLowerCase()) ||
      (s.rollNo || '').toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-bold mb-1">Students</h1>
      <p className="text-sm text-slate-400 mb-6">
        {students.length} registered · {students.filter((s) => s.placedStatus === 'PLACED').length} placed
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <input className="input max-w-xs" placeholder="Search name or roll no" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input max-w-[160px]" value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">All branches</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="input max-w-[160px]" value={placed} onChange={(e) => setPlaced(e.target.value)}>
          <option value="">All statuses</option>
          <option value="PLACED">Placed</option>
          <option value="UNPLACED">Unplaced</option>
        </select>
      </div>

      {loading && <div className="text-sm text-slate-400">Loading students...</div>}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400">
              <th className="pb-3">Roll No</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Branch</th>
              <th className="pb-3">Year</th>
              <th className="pb-3">CGPA</th>
              <th className="pb-3">Backlogs</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Resume</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-slate-100 hover:bg-primary-50/40">
                <td className="py-3 font-medium text-ink-900">{s.rollNo}</td>
                <td className="py-3">
                  <div className="font-medium text-ink-900">{s.user?.name}</div>
                  <div className="text-xs text-slate-400">{s.user?.email}</div>
                </td>
                <td className="py-3">{s.branch}</td>
                <td className="py-3">{s.gradYear}</td>
                <td className="py-3">{s.cgpa}</td>
                <td className="py-3">{s.activeBacklogs}</td>
                <td className="py-3"><StatusBadge status={s.placedStatus} /></td>
                <td className="py-3">
                  {s.resumeUrl
                    ? <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="text-primary-600 font-semibold text-xs">View</a>
                    : <span className="text-xs text-slate-300">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="py-6 text-center text-slate-400 text-sm">No students match the filters.</div>}
      </div>
    </div>
  );
}