import { BookIcon, MessageCircleIcon, TargetIcon } from "@/components/icons";

const steps = [
  {
    n: "01",
    icon: <BookIcon />,
    title: "Pick your subject",
    body: "Choose from LC subjects at Higher or Ordinary Level. Curriculum-locked, exam-relevant.",
  },
  {
    n: "02",
    icon: <MessageCircleIcon />,
    title: "Ask a question",
    body: "A homework problem, a past-paper question, a topic you missed in class — anything.",
  },
  {
    n: "03",
    icon: <TargetIcon />,
    title: "Get guided to the answer",
    body: "GrindsAI asks the questions a good teacher would. You arrive at the answer yourself.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <SectionHeader eyebrow="How it works" title="Three steps. No fluff." />
        <div
          className="mt-10 grid gap-px rounded-2xl overflow-hidden border border-gray-200"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", background: "#e5e7eb" }}
        >
          {steps.map((s) => (
            <div key={s.n} className="bg-white px-7 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-[10px] bg-emerald-50 text-emerald-700 grid place-items-center border border-emerald-100">
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
      <div className="text-xs text-emerald-700 uppercase tracking-[0.08em] font-mono mb-3">{eyebrow}</div>
      <h2 className="font-heading text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.025em] leading-[1.1] m-0">{title}</h2>
      {subtitle && <p className="mt-4 text-gray-500 text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}
