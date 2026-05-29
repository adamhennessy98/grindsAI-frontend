import { IS_BETA } from "@/lib/beta";

export function BetaBadge({ className = "" }: { className?: string }) {
  if (!IS_BETA) return null;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.06em] bg-amber-50 text-amber-900 border border-amber-200 ${className}`.trim()}
    >
      Beta
    </span>
  );
}
