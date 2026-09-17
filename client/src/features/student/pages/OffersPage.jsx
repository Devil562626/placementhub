import { useState } from 'react';
import { myOffers, respondToOffer } from '../../../api/offers.api.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import useFetch from '../../../hooks/useFetch.js';

export default function OffersPage() {
  const { data, loading, error, reload } = useFetch(myOffers, []);
  const [busyId, setBusyId] = useState(null);
  const offers = data?.data || [];

  async function respond(id, action) {
    setBusyId(id);
    try {
      await respondToOffer(id, action);
      reload();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-bold mb-6">My Offers</h1>
      {loading && <div className="text-sm text-slate-400">Loading...</div>}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
      <div className="space-y-4">
        {offers.map((o) => (
          <div key={o.id} className="card flex items-center justify-between animate-popIn">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center font-display font-bold text-emerald-600">OFFR</div>
              <div>
                <div className="font-semibold text-ink-900">{o.application?.drive?.company?.name}</div>
                <div className="text-xs text-slate-400">{o.jobRole} · INR {o.ctc} LPA</div>
              </div>
            </div>
            {o.status === 'OFFERED' ? (
              <div className="flex gap-2">
                <button className="btn-primary" disabled={busyId === o.id} onClick={() => respond(o.id, 'ACCEPTED')}>Accept</button>
                <button className="btn border border-slate-200 text-slate-600 hover:bg-slate-50" disabled={busyId === o.id} onClick={() => respond(o.id, 'DECLINED')}>Decline</button>
              </div>
            ) : (
              <StatusBadge status={o.status} />
            )}
          </div>
        ))}
        {!loading && offers.length === 0 && (
          <div className="card text-center text-slate-400">No offers yet. Keep going!</div>
        )}
      </div>
    </div>
  );
}