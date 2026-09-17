const STYLES = {
  APPLIED: 'bg-slate-100 text-slate-600',
  SHORTLISTED: 'bg-sky-100 text-sky-700',
  IN_PROCESS: 'bg-amber-100 text-amber-700',
  SELECTED: 'bg-emerald-100 text-emerald-700',
  PLACED: 'bg-emerald-500 text-white',
  REJECTED: 'bg-red-100 text-red-600',
  WITHDRAWN: 'bg-slate-100 text-slate-400',
  DRAFT: 'bg-slate-100 text-slate-500',
  PUBLISHED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-slate-200 text-slate-600',
  OFFERED: 'bg-indigo-100 text-indigo-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  DECLINED: 'bg-red-100 text-red-500',
};

export default function StatusBadge({ status }) {
  const label = String(status || '').replaceAll('_', ' ');
  return <span className={`badge ${STYLES[status] || 'bg-slate-100 text-slate-500'}`}>{label}</span>;
}