import { BookIcon, CheckIcon, MessageCircleIcon, TargetIcon } from "@/components/icons";

const steps = [
  { n: "01", icon: <MessageCircleIcon />, title: "Talk it through", body: "Ask your Tutor about the topic or question in front of you. It guides you step by step instead of handing you an answer to copy.", accent: "cyan" },
  { n: "02", icon: <CheckIcon size={18} />, title: "Test the foundations", body: "Take a Topic Check: a short preparatory test of the essential methods you need before moving into exam-style practice.", accent: "amber" },
  { n: "03", icon: <BookIcon />, title: "Practise the exam version", body: "Generate a focused exam question for your topic and level, then get help only when you need it.", accent: "lime" },
  { n: "04", icon: <TargetIcon />, title: "Know what to do next", body: "Your focus areas, results and recent work make it easier to spot what to improve and where to start next time.", accent: "violet" },
] as const;

const accent = {
  cyan: "border-t-cyan-500 text-cyan-700",
  amber: "border-t-amber-500 text-amber-700",
  lime: "border-t-lime-500 text-lime-700",
  violet: "border-t-violet-500 text-violet-700",
};

export function HowItWorks() {
  return (
    <section id="how" className="landing-revision-loop bg-[#f4f8f6] py-20 sm:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHeader eyebrow="A better revision loop" title="A more useful way to revise than another generic grind." subtitle="Open the subject you need. Understand the tricky part, check the foundations, practise it properly, then see what deserves your attention next." />
        <ol className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => <li key={step.n} className={`landing-revision-step border-t-[3px] border-gray-200 pt-5 ${accent[step.accent]}`}><div className="flex items-center justify-between"><span className="landing-revision-icon grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white">{step.icon}</span><span className="landing-revision-number text-[12px] font-semibold text-gray-400">{step.n}</span></div><h3 className="landing-revision-title m-0 mt-5 text-[17px] font-semibold tracking-[-.01em] text-gray-900">{step.title}</h3><p className="landing-revision-copy m-0 mt-2 max-w-[260px] text-[14.5px] leading-relaxed text-gray-500">{step.body}</p></li>)}
        </ol>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return <div className="landing-section-header mx-auto max-w-[680px] text-center"><div className="landing-section-eyebrow mb-3 text-xs font-semibold text-cyan-700">{eyebrow}</div><h2 className="landing-section-title font-heading m-0 text-[clamp(29px,4vw,42px)] font-semibold leading-[1.1] tracking-[-.03em] text-gray-950">{title}</h2>{subtitle && <p className="landing-section-subtitle mt-4 text-base leading-relaxed text-gray-500">{subtitle}</p>}</div>;
}
