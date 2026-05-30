export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Filter bar skeleton */}
      <div className="fixed top-[14vh] left-0 right-0 z-[4] flex justify-center gap-4 py-3 bg-slate-100/90">
        <div className="w-28 h-10 rounded-full bg-slate-300 animate-pulse" />
        <div className="w-28 h-10 rounded-full bg-slate-300 animate-pulse" />
      </div>

      {/* Card grid skeleton */}
      <div
        className="grid gap-4 p-3 pt-[80px]"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[500px] rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
