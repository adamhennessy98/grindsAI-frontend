export function ExamCountdownPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[5px] bg-cyan-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-tight text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200">
      {label}
    </span>
  );
}
