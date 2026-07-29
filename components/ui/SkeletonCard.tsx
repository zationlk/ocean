export default function SkeletonCard() {
  return (
    <div className="bg-brand-charcoal rounded-2xl border border-brand-border overflow-hidden animate-pulse">
      <div className="h-56 bg-brand-bg skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 rounded-full skeleton" />
        <div className="h-4 w-full rounded-full skeleton" />
        <div className="h-4 w-3/4 rounded-full skeleton" />
        <div className="h-3 w-full rounded-full skeleton" />
        <div className="h-3 w-2/3 rounded-full skeleton" />
        <div className="flex gap-2 pt-1">
          <div className="h-9 flex-1 rounded-lg skeleton" />
          <div className="h-9 w-9 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
