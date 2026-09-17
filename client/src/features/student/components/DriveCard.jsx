import StatusBadge from '../../../components/common/StatusBadge.jsx';

export default function DriveCard({ drive, index = 0, onApply, applying }) {
  const deadline = new Date(drive.lastDateToApply).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const ctc = drive.ctcMin === drive.ctcMax ? `INR ${drive.ctcMax} LPA` : `INR ${drive.ctcMin}-${drive.ctcMax} LPA`;
  return (
    <div className="card animate-fadeUp hover:shadow-card-hover hover:-translate-y-0.5 transition-all" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-xl font-display font-bold text-primary-600">
            {drive.company?.name?.[0]}
          </div>
          <div>
            <div className="font-semibold text-ink-900">{drive.company?.name}</div>
            <div className="text-xs text-slate-400">{drive.jobTitle}</div>
          </div>
        </div>
        <StatusBadge status={drive.status} />
      </div>
      <div className="flex flex-wrap gap-2 mt-4 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600">{ctc}</span>
        <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600">{drive.location || 'TBA'}</span>
        <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600">Apply by {deadline}</span>
      </div>
      {drive.eligibility && (
        <div className="mt-3 text-xs text-slate-400">
          Eligibility: CGPA {drive.eligibility.minCgpa}+ · {(drive.eligibility.allowedBranches || []).join('/')} · Max {drive.eligibility.maxBacklogs} backlog
        </div>
      )}
      <div className="mt-4">
        {drive.hasApplied ? (
          <div className="flex items-center gap-2"><span className="text-xs text-slate-400">Your status:</span><StatusBadge status={drive.applicationStatus} /></div>
        ) : (
          <button className="btn-primary w-full" onClick={() => onApply(drive.id)} disabled={applying}>
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
}