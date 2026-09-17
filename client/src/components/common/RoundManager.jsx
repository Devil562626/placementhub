import { useState } from 'react';
import { getRounds, createRound, getRoundResults, recordResult } from '../../api/rounds.api.js';
import useFetch from '../../hooks/useFetch.js';

export default function RoundManager({ driveId }) {
  const roundsQ = useFetch(() => getRounds(driveId), [driveId]);
  const rounds = roundsQ.data?.data || [];
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', scheduledAt: '', venue: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(null);

  const resultsQ = useFetch(
    () => (selected ? getRoundResults(selected) : Promise.resolve(null)),
    [selected]
  );
  const apps = resultsQ.data?.data || [];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function addRound(e) {
    e.preventDefault();
    setMsg('');
    try {
      await createRound(driveId, {
        name: form.name,
        ...(form.scheduledAt && { scheduledAt: form.scheduledAt }),
        ...(form.venue && { venue: form.venue }),
      });
      setForm({ name: '', scheduledAt: '', venue: '' });
      setShowForm(false);
      roundsQ.reload();
    } catch (err) {
      setMsg(err.message || 'Failed to add round');
    }
  }

  async function setResult(appId, result) {
    setBusy(appId);
    setMsg('');
    try {
      await recordResult(selected, { applicationId: appId, result });
      resultsQ.reload();
    } catch (err) {
      setMsg(err.message || 'Failed to record result');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Interview Rounds</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-2.5 py-1 rounded-lg bg-primary-600 text-white text-xs font-semibold">
          {showForm ? 'Cancel' : '+ Add Round'}
        </button>
      </div>

      {msg && <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs">{msg}</div>}

      {showForm && (
        <form onSubmit={addRound} className="grid md:grid-cols-4 gap-2 mb-4">
          <input className="input" placeholder="Round name (e.g. Aptitude)" value={form.name} onChange={set('name')} required />
          <input className="input" type="datetime-local" value={form.scheduledAt} onChange={set('scheduledAt')} />
          <input className="input" placeholder="Venue (optional)" value={form.venue} onChange={set('venue')} />
          <button className="btn-primary">Add</button>
        </form>
      )}

      {rounds.length === 0 ? (
        <p className="text-xs text-slate-400">No rounds yet. Add the first round (Aptitude, Technical, HR...).</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {rounds.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${selected === r.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {r.sequence}. {r.name}
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-2">
              {resultsQ.loading && <p className="text-xs text-slate-400">Loading applicants...</p>}
              {apps.map((a) => {
                const rr = a.roundResults?.[0];
                return (
                  <div key={a.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-sm">
                    <div>
                      <span className="font-medium text-ink-900">{a.student?.user?.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{a.student?.branch}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {rr
                        ? <span className={`badge ${rr.result === 'PASS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{rr.result}</span>
                        : <span className="badge bg-slate-100 text-slate-400">PENDING</span>}
                      <button className="px-2 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold disabled:opacity-50" disabled={busy === a.id} onClick={() => setResult(a.id, 'PASS')}>PASS</button>
                      <button className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold disabled:opacity-50" disabled={busy === a.id} onClick={() => setResult(a.id, 'FAIL')}>FAIL</button>
                    </div>
                  </div>
                );
              })}
              {!resultsQ.loading && apps.length === 0 && <p className="text-xs text-slate-400">No applications for this drive yet.</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}