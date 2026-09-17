import { useState, Fragment } from 'react';
import { api } from '../../../api/axios.js';
import { getDrives, createDrive, updateDriveStatus, getDriveApplications } from '../../../api/drives.api.js';
import { updateApplicationStatus } from '../../../api/applications.api.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import useFetch from '../../../hooks/useFetch.js';
import RoundManager from '../../../components/common/RoundManager.jsx';

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
  if (apps.length === 0) return <div className="p-4 text-xs text-slate-400">No applications yet.</div>;
  return (
    <div className="p-4 bg-slate-50 space-y-2">
      {apps.map((a) => (
        <div key={a.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
          <div>
            <span className="font-medium text-ink-900">{a.student?.user?.name}</span>
            <span className="text-xs text-slate-400 ml-2">{a.student?.branch} · CGPA {a.student?.cgpa}</span>
          </div>
          <div className="flex items-center gap-2">
            {a.offer ? <StatusBadge status={a.offer.status} /> : <StatusBadge status={a.status} />}
            {NEXT[a.status] && (
              <button className="px-2.5 py-1 rounded-lg bg-primary-600 text-white text-xs font-semibold disabled:opacity-50" disabled={busy === a.id} onClick={() => advance(a)}>
                → {NEXT[a.status].replaceAll('_', ' ')}
              </button>
            )}
            {a.status === 'SELECTED' && !a.offer && (
              <button className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold" disabled={busy === a.id} onClick={() => sendOffer(a)}>
                🎯 Send Offer
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const EMPTY = {
  companyId: '', jobTitle: '', jobRole: '', description: '',
  ctcMin: '', ctcMax: '', location: '', lastDateToApply: '',
  minCgpa: '6', maxBacklogs: '1', branches: 'CSE,IT', gradYears: '2026',
};

export default function TpoDrivesPage() {
  const { data, loading, error, reload } = useFetch(getDrives, []);
  const companies = useFetch(() => api.get('/companies'), []);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const drives = data?.data || [];

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await createDrive({
        companyId: Number(form.companyId),
        jobTitle: form.jobTitle,
        jobRole: form.jobRole,
        description: form.description,
        ctcMin: form.ctcMin ? Number(form.ctcMin) : undefined,
        ctcMax: form.ctcMax ? Number(form.ctcMax) : undefined,
        location: form.location || undefined,
        lastDateToApply: form.lastDateToApply,
        eligibility: {
          minCgpa: Number(form.minCgpa),
          maxBacklogs: Number(form.maxBacklogs),
          allowedBranches: form.branches.split(',').map((b) => b.trim()).filter(Boolean),
          allowedGradYears: form.gradYears.split(',').map((g) => Number(g.trim())).filter(Boolean),
        },
      });
      setMsg('Drive created as DRAFT. Publish it when ready.');
      setForm(EMPTY);
      reload();
    } catch (err) {
      setMsg(err.message || 'Failed to create drive');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(d) {
    const next = d.status === 'DRAFT' ? 'PUBLISHED' : 'CLOSED';
    try { await updateDriveStatus(d.id, next); reload(); }
    catch (err) { setMsg(err.message); }
  }

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Drives</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close Form' : '+ New Drive'}</button>
      </div>

      {msg && <div className="mb-4 px-4 py-3 rounded-lg bg-primary-50 text-primary-700 text-sm animate-popIn">{msg}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 grid md:grid-cols-2 gap-4">
          <select className="input" value={form.companyId} onChange={set('companyId')} required>
            <option value="">Select company</option>
            {(companies.data?.data || []).map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <input className="input" placeholder="Job title" value={form.jobTitle} onChange={set('jobTitle')} required />
          <input className="input" placeholder="Job role" value={form.jobRole} onChange={set('jobRole')} required />
          <input className="input" placeholder="Location" value={form.location} onChange={set('location')} />
          <input className="input" type="number" step="0.1" placeholder="CTC min (LPA)" value={form.ctcMin} onChange={set('ctcMin')} />
          <input className="input" type="number" step="0.1" placeholder="CTC max (LPA)" value={form.ctcMax} onChange={set('ctcMax')} />
          <input className="input" type="date" value={form.lastDateToApply} onChange={set('lastDateToApply')} required />
          <input className="input" type="number" step="0.1" placeholder="Min CGPA" value={form.minCgpa} onChange={set('minCgpa')} />
          <input className="input" placeholder="Branches (comma separated)" value={form.branches} onChange={set('branches')} />
          <input className="input" placeholder="Grad years (comma separated)" value={form.gradYears} onChange={set('gradYears')} />
          <textarea className="input md:col-span-2" rows="3" placeholder="Description" value={form.description} onChange={set('description')} required />
          <button className="btn-primary md:col-span-2" disabled={saving}>{saving ? 'Creating...' : 'Create Drive (starts as DRAFT)'}</button>
        </form>
      )}

      {loading && <div className="text-sm text-slate-400">Loading drives...</div>}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400">
              <th className="pb-3">Company</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">CTC</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((d) => (
              <Fragment key={d.id}>
                <tr className="border-t border-slate-100 hover:bg-primary-50/40">
                  <td className="py-3 font-medium text-ink-900">{d.company?.name}</td>
                  <td className="py-3">{d.jobRole}</td>
                  <td className="py-3">{d.ctcMin}-{d.ctcMax}L</td>
                  <td className="py-3"><StatusBadge status={d.status} /></td>
                  <td className="py-3 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => setExpanded(expanded === d.id ? null : d.id)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-ink-900 hover:bg-slate-50">
                      👥 {d._count?.applications ?? 0}
                    </button>
                    {d.status !== 'CLOSED' && (
                      <button onClick={() => toggleStatus(d)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-primary-600 hover:bg-primary-50">
                        {d.status === 'DRAFT' ? 'Publish' : 'Close'}
                      </button>
                    )}
                  </td>
                </tr>
                {expanded === d.id && (
                  <tr><td colSpan="5" className="p-2 space-y-3"><Applicants driveId={d.id} /><RoundManager driveId={d.id} /></td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {!loading && drives.length === 0 && <div className="py-6 text-center text-slate-400 text-sm">No drives yet. Create one!</div>}
      </div>
    </div>
  );
}