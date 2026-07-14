import { BookIcon, MessageCircleIcon, TargetIcon } from "@/components/icons";

const steps = [
  {
    n: "01",
    icon: <BookIcon />,
    title: "Choose a subject",
    body: "Open the workspace for Maths, Biology, Accounting, English, or any subject in your study profile.",
    accent: "cyan",
  },
  {
    n: "02",
    icon: <MessageCircleIcon />,
    title: "Pick what you need",
    body: "Start with Tutor, generate practice questions, log a test, or check your progress.",
    accent: "lime",
  },
  {
    n: "03",
    icon: <TargetIcon />,
    title: "Know what to do next",
    body: "The tutor keeps the help step by step and uses your recent work to point you toward the next useful move.",
    accent: "violet",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#f4f8f6] py-24">
      <div className="max-w-[1140px] mx-auto px-6">
        <SectionHeader eyebrow="How it works" title="Simple enough to use before class." />
        <div
          className="mt-10 grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {steps.map((s) => (
            <div key={s.n} className={`rounded-2xl border px-7 py-8 ${stepSurface[s.accent]}`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-10 h-10 rounded-[10px] grid place-items-center border ${stepIcon[s.accent]}`}>
                  {s.icon}
                </div>
                <span className="text-xs text-gray-400 font-mono">{s.n}</span>
              </div>
              <h3 className="text-[17px] font-semibold tracking-[-0.01em] mb-2">{s.title}</h3>
              <p className="text-gray-500 text-[14.5px] leading-relaxed m-0">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stepSurface = {
  cyan: "border-cyan-100 bg-cyan-50/70 shadow-[0_16px_38px_-32px_rgba(8,145,178,.75)]",
  lime: "border-lime-100 bg-lime-50/70 shadow-[0_16px_38px_-32px_rgba(101,163,13,.7)]",
  violet: "border-violet-100 bg-violet-50/70 shadow-[0_16px_38px_-32px_rgba(139,92,246,.7)]",
};

const stepIcon = {
  cyan: "border-cyan-100 bg-[#fbfaf6] text-cyan-700",
  lime: "border-lime-100 bg-[#fbfaf6] text-lime-700",
  violet: "border-violet-100 bg-[#fbfaf6] text-violet-700",
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-[620px] mx-auto">
      <div className="text-xs text-cyan-700 uppercase tracking-[0.08em] font-mono mb-3">{eyebrow}</div>
      <h2 className="font-heading text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.025em] leading-[1.1] m-0">{title}</h2>
      {subtitle && <p className="mt-4 text-gray-500 text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}
