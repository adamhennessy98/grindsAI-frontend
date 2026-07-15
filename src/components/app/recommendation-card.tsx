type RecommendationFeature = "tutor" | "questions" | "progress";

const tones: Record<RecommendationFeature, { surface: string; label: string; button: string }> = {
  tutor: { surface: "border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,.86),rgba(248,250,247,.92))] dark:border-cyan-800/70 dark:!bg-none dark:!bg-[#0b2938]", label: "text-cyan-700 dark:text-cyan-300", button: "bg-cyan-500 hover:bg-cyan-600" },
  questions: { surface: "border-lime-100 bg-[linear-gradient(135deg,rgba(247,254,231,.86),rgba(248,250,247,.92))] dark:border-lime-800/70 dark:!bg-none dark:!bg-[#202c17]", label: "text-lime-700 dark:text-lime-300", button: "bg-lime-500 hover:bg-lime-600" },
  progress: { surface: "border-violet-100 bg-[linear-gradient(135deg,rgba(245,243,255,.9),rgba(248,250,247,.92))] dark:border-violet-800/70 dark:!bg-none dark:!bg-[#231d38]", label: "text-violet-700 dark:text-violet-300", button: "bg-violet-500 hover:bg-violet-600" },
};

export function RecommendationCard({ title, reason, cta, onClick, feature = "tutor" }: { title: string; reason?: string; cta: string; onClick: () => void; feature?: RecommendationFeature }) {
  const tone = tones[feature];
  return <section className={`rounded-2xl border px-4 py-4 shadow-[0_14px_38px_-34px_rgba(15,23,42,.55)] sm:px-5 ${tone.surface}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className={`text-[12px] font-semibold uppercase tracking-[.08em] ${tone.label}`}>Next recommended action</div><h2 className="font-heading m-0 mt-1 text-[18px] font-semibold text-gray-900 dark:text-white">{title}</h2>{reason && <p className="m-0 mt-1 text-[13px] text-gray-500">{reason}</p>}</div><button type="button" onClick={onClick} className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 ${tone.button}`}>{cta}</button></div></section>;
}
