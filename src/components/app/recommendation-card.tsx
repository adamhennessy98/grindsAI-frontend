type RecommendationFeature = "tutor" | "questions" | "progress";

const tones: Record<RecommendationFeature, { surface: string; label: string; button: string }> = {
  tutor: { surface: "border-cyan-200 border-l-cyan-500 bg-white/88 dark:border-cyan-900 dark:border-l-cyan-400 dark:bg-slate-900", label: "text-cyan-700 dark:text-cyan-300", button: "bg-cyan-600 hover:bg-cyan-700" },
  questions: { surface: "border-lime-200 border-l-lime-500 bg-white/88 dark:border-lime-900 dark:border-l-lime-400 dark:bg-slate-900", label: "text-lime-700 dark:text-lime-300", button: "bg-lime-600 hover:bg-lime-700" },
  progress: { surface: "border-violet-200 border-l-violet-500 bg-white/88 dark:border-violet-900 dark:border-l-violet-400 dark:bg-slate-900", label: "text-violet-700 dark:text-violet-300", button: "bg-violet-600 hover:bg-violet-700" },
};

export function RecommendationCard({ title, reason, cta, onClick, feature = "tutor" }: { title: string; reason?: string; cta: string; onClick: () => void; feature?: RecommendationFeature }) {
  const tone = tones[feature];
  return <section className={`border border-l-4 px-4 py-4 sm:px-5 ${tone.surface}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className={`text-[11px] font-semibold ${tone.label}`}>RECOMMENDED NEXT STEP</div><h2 className="font-heading m-0 mt-1 text-[18px] font-semibold text-gray-900 dark:text-white">{title}</h2>{reason && <p className="m-0 mt-1 text-[13px] text-gray-500">{reason}</p>}</div><button type="button" onClick={onClick} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10 dark:focus-visible:ring-white/20 ${tone.button}`}>{cta}</button></div></section>;
}
