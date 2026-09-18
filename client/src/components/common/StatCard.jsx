export default function StatCard({ label, value, suffix = '' }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 text-white bg-gradient-to-br from-primary-600 to-purple-600 shadow-card-hover animate-fadeUp">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm text-white/80">{label}</span>
      </div>
      <div className="font-display text-2xl sm:text-3xl font-bold mt-2">{value}{suffix}</div>
    </div>
  );
}