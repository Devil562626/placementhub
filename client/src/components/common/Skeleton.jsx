export function SkeletonCard({ className = '' }) {
  return <div className={`bg-slate-200 rounded-xl animate-pulse ${className}`} />;
}

export function SkeletonGrid({ cards = 3, height = 'h-24' }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} className={`${height} animate-fadeUp`} />
      ))}
    </div>
  );
}