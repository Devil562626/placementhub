import { useState } from 'react';
import { getDrives, applyToDrive } from '../../../api/drives.api.js';
import DriveCard from './DriveCard.jsx';
import { SkeletonCard } from '../../../components/common/Skeleton.jsx';
import useFetch from '../../../hooks/useFetch.js';

export default function DriveBrowser() {
  const { data, loading, error, reload } = useFetch(getDrives, []);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState('');
  const drives = data?.data || [];

  async function handleApply(id) {
    setApplyingId(id);
    setToast('');
    try {
      const res = await applyToDrive(id);
      setToast(res.message || 'Application submitted!');
      reload();
    } catch (e) {
      setToast(e.message || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div>
      {toast && <div className="mb-4 px-4 py-3 rounded-lg bg-primary-50 text-primary-700 text-sm animate-popIn">{toast}</div>}
      {loading && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} className="h-64" />)}
        </div>
      )}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
      {!loading && !error && drives.length === 0 && (
        <div className="card text-center text-slate-400">No eligible drives right now. Check back later!</div>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drives.map((d, i) => (
          <DriveCard key={d.id} drive={d} index={i} onApply={handleApply} applying={applyingId === d.id} />
        ))}
      </div>
    </div>
  );
}