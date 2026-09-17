import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDrives, getDriveApplications } from '../../../api/drives.api.js';
import { updateApplicationStatus } from '../../../api/applications.api.js';
import { api } from '../../../api/axios.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import useFetch from '../../../hooks/useFetch.js';

const NEXT = { APPLIED: 'SHORTLISTED', SHORTLISTED: 'IN_PROCESS', IN_PROCESS: 'SELECTED' };

function Applicants({ driveId }) {
  const { data, loading, reload } = useFetch(() => getDriveApplications(driveId), [driveId]);
  const [busy, setBusy] = useState(null);
  const apps = data?.data || [];

  async function advance(a) {
    setBusy(a.id);
    try { await updateApplicationStatus(a.id, NEXT[a.status]); reload(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  }

  async function sendOffer(a) {
    const ctc = prompt('Offer CTC (LPA):', '4.5');
    if (!ctc) return;
    setBusy(a.id);
    try { await api.post(`/applications/${a.id}/offer`, { ctc: Number(ctc) }); reload(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  }

  if (loading) return <div className="p-4 text-xs text-slate-400">Loading applicants...</div>;
  if (apps.length === 0) return <div className="p-4 text-xs text-slate-400">No applications for this drive yet.</div>;
  return (
    <div className="p-4 bg-slate-50 space-y-2">
      {apps.map((a) => (
        <div key={a.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
          <div>
            <span className="font-medium text-ink-900">{a.student?.user?.name}</span>
            <span className="text-xs text-slate-400 ml-2">{a.student?.branch} · CGPA {a.student?.cgpa}</span>
            {a.student?.resumeUrl && (
              <a href={a.student.resumeUrl} target="_blank" rel="noreferrer" className="ml-2 text-xs text-primary-600 font-semibold">Resume</a>
            )}
          </div>
          <div className="flex items-center gap-2">
            {a.offer ? <StatusBadge status={a.offer.status} /> : <StatusBadge status={a.status} />}
            {NEXT[a.status] && (
              <button className="px-2.5 py-1 rounded-lg bg-primary-600 text-white text-xs font-semibold disabled:opacity-50" disabled={busy === a.id} onClick={() => advance(a)}>
                Move to {NEXT[a.status].replaceAll('_', ' ')}
              </button>
            )}
            {a.status === 'SELECTED' && !a.offer && (
              <button className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold" disabled={busy === a.id} onClick={() => sendOffer(a)}>
                Send Offer
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecruiterCandidatesPage() {
  const { data, loading } = useFetch(getDrives, []);
  const [params, setParams] = useSearchParams();
  const drives = data?.data || [];
  const selected = Number(params.get('drive')) || drives[0]?.id || '';

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-bold mb-1">Candidates</h1>
      <p className="text-sm text-slate-400 mb-6">Review applicants, advance them through rounds, and send offers.</p>

      {loading && <div className="text-sm text-slate-400">Loading your drives...</div>}
      {!loading && drives.length === 0 && (
        <div className="card text-center text-slate-400">No drives for your company yet.</div>
      )}
      {drives.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-slate-500">Drive:</span>
            <select
              className="input max-w-md"
              value={selected}
              onChange={(e) => setParams({ drive: e.target.value })}
            >
              {drives.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.jobRole} ({d.status}) - {d._count?.applications ?? 0} applicants
                </option>
              ))}
            </select>
          </div>
          {selected ? <Applicants driveId={selected} /> : null}
        </div>
      )}
    </div>
  );
}