import { useState, useRef } from 'react';
import { getMyProfile, updateMyProfile, uploadResume } from '../../api/students.api.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import useFetch from '../../hooks/useFetch.js';

export default function ProfilePage() {
  const { data, loading, error, reload } = useFetch(getMyProfile, []);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const p = data?.data;

  function startEdit() {
    setForm({
      cgpa: p.cgpa,
      activeBacklogs: p.activeBacklogs,
      branch: p.branch,
      gradYear: p.gradYear,
      phone: p.phone || '',
    });
    setEditing(true);
    setMsg('');
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setMsg('');
    try {
      await updateMyProfile({
        cgpa: Number(form.cgpa),
        activeBacklogs: Number(form.activeBacklogs),
        branch: form.branch,
        gradYear: Number(form.gradYear),
        phone: form.phone || undefined,
      });
      setEditing(false);
      setMsg('Profile updated');
      reload();
    } catch (err) {
      setMsg(err.message || 'Update failed');
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      await uploadResume(file);
      setMsg('Resume uploaded');
      reload();
    } catch (err) {
      setMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  if (loading) return <div className="text-sm text-slate-400">Loading profile...</div>;
  if (error) return <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>;
  if (!p) return null;

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {msg && <div className="mb-4 px-4 py-3 rounded-lg bg-primary-50 text-primary-700 text-sm animate-popIn">{msg}</div>}

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 text-white flex items-center justify-center font-display text-2xl font-bold">
            {p.user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold text-ink-900">{p.user?.name}</div>
            <div className="text-xs text-slate-400">{p.user?.email} · Roll {p.rollNo}</div>
          </div>
          <StatusBadge status={p.placedStatus} />
        </div>

        {editing ? (
          <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
            <label className="text-xs font-medium text-slate-500">Branch
              <input className="input mt-1" value={form.branch} onChange={set('branch')} required />
            </label>
            <label className="text-xs font-medium text-slate-500">Graduation Year
              <input className="input mt-1" type="number" value={form.gradYear} onChange={set('gradYear')} required />
            </label>
            <label className="text-xs font-medium text-slate-500">CGPA
              <input className="input mt-1" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={set('cgpa')} required />
            </label>
            <label className="text-xs font-medium text-slate-500">Active Backlogs
              <input className="input mt-1" type="number" min="0" value={form.activeBacklogs} onChange={set('activeBacklogs')} required />
            </label>
            <label className="text-xs font-medium text-slate-500 md:col-span-2">Phone
              <input className="input mt-1" value={form.phone} onChange={set('phone')} placeholder="Optional" />
            </label>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" className="btn border border-slate-200 text-slate-600" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><div className="text-xs text-slate-400">Branch</div><div className="font-medium text-ink-900">{p.branch}</div></div>
            <div><div className="text-xs text-slate-400">Graduation Year</div><div className="font-medium text-ink-900">{p.gradYear}</div></div>
            <div><div className="text-xs text-slate-400">CGPA</div><div className="font-medium text-ink-900">{p.cgpa}</div></div>
            <div><div className="text-xs text-slate-400">Active Backlogs</div><div className="font-medium text-ink-900">{p.activeBacklogs}</div></div>
            <div><div className="text-xs text-slate-400">Phone</div><div className="font-medium text-ink-900">{p.phone || '-'}</div></div>
            <div className="md:col-span-3 pt-2">
              <button className="btn-primary" onClick={startEdit}>Edit Profile</button>
            </div>
          </div>
        )}
      </div>

      <div className="card mt-4">
        <h2 className="font-semibold mb-3">Resume</h2>
        {p.resumeUrl ? (
          <div className="flex items-center gap-3">
            <a href={p.resumeUrl} target="_blank" rel="noreferrer" className="text-primary-600 font-semibold text-sm">View current resume (PDF)</a>
            <span className="text-xs text-slate-400">or replace:</span>
          </div>
        ) : (
          <p className="text-sm text-slate-400 mb-3">No resume uploaded yet. TPOs and recruiters will see it on your applications.</p>
        )}
        <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
        <button
          className="btn border border-primary-600 text-primary-600 hover:bg-primary-50 mt-2"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? 'Uploading...' : p.resumeUrl ? 'Replace Resume (PDF)' : 'Upload Resume (PDF, max 5MB)'}
        </button>
      </div>
    </div>
  );
}