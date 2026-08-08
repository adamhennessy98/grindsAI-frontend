import { BookIcon, CheckIcon, MessageCircleIcon, TargetIcon } from "@/components/icons";

const steps = [
  {
    n: "01",
    icon: <MessageCircleIcon />,
    title: "Talk it through",
    body: "Ask your Tutor about the topic or question in front of you. It guides you step by step instead of handing you an answer to copy.",
    accent: "cyan",
  },
  {
    n: "02",
    icon: <CheckIcon size={18} />,
    title: "Test the foundations",
    body: "Take a Topic Check: a short preparatory test of the essential methods you need before moving into exam-style practice.",
    accent: "amber",
  },
  {
    n: "03",
    icon: <BookIcon />,
    title: "Practise the exam version",
    body: "Generate a focused exam question for your topic and level, then get help only when you need it.",
    accent: "lime",
  },
  {
    n: "04",
    icon: <TargetIcon />,
    title: "Know what to do next",
    body: "Your focus areas, results and recent work make it easier to spot what to improve and where to start next time.",
    accent: "violet",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#f4f8f6] py-20 sm:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHeader eyebrow="A better revision loop" title="A more useful way to revise than another generic grind." subtitle="Open the subject you need. Understand the tricky part, check the foundations, practise it properly, then see what deserves your attention next." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => <div key={step.n} className={`flex min-h-[245px] flex-col rounded-2xl border px-6 py-7 ${stepSurface[step.accent]}`}><div className="mb-6 flex items-center justify-between"><div className={`grid h-10 w-10 place-items-center rounded-[10px] border ${stepIcon[step.accent]}`}>{step.icon}</div><span className="font-mono text-xs text-gray-400">{step.n}</span></div><h3 className="m-0 text-[17px] font-semibold tracking-[-.01em] text-gray-900">{step.title}</h3><p className="m-0 mt-2 text-[14.5px] leading-relaxed text-gray-500">{step.body}</p></div>)}
        </div>
      </div>
    </section>
  );
}

const stepSurface = {
  cyan: "border-cyan-100 bg-cyan-50/70 shadow-[0_16px_38px_-32px_rgba(8,145,178,.75)]",
  amber: "border-amber-100 bg-amber-50/70 shadow-[0_16px_38px_-32px_rgba(217,119,6,.7)]",
  lime: "border-lime-100 bg-lime-50/70 shadow-[0_16px_38px_-32px_rgba(101,163,13,.7)]",
  violet: "border-violet-100 bg-violet-50/70 shadow-[0_16px_38px_-32px_rgba(139,92,246,.7)]",
};

const stepIcon = {
  cyan: "border-cyan-100 bg-[#fbfaf6] text-cyan-700",
  amber: "border-amber-100 bg-[#fbfaf6] text-amber-700",
  lime: "border-lime-100 bg-[#fbfaf6] text-lime-700",
  violet: "border-violet-100 bg-[#fbfaf6] text-violet-700",
};

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return <div className="mx-auto max-w-[680px] text-center"><div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-cyan-700">{eyebrow}</div><h2 className="font-heading m-0 text-[clamp(29px,4vw,42px)] font-semibold leading-[1.1] tracking-[-.03em] text-gray-950">{title}</h2>{subtitle && <p className="mt-4 text-base leading-relaxed text-gray-500">{subtitle}</p>}</div>;
}
