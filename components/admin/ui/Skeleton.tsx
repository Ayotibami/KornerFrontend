// Base pulsing placeholder block — compose page-shaped skeletons out of these
// sized/rounded to match the real content they stand in for. No default size
// or rounding: every caller supplies the exact shape it needs.
export default function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-white/[0.08] ${className}`} />;
}
