import { BookIcon, ClockIcon, MessageCircleIcon, TargetIcon } from "@/components/icons";
import { SectionHeader } from "./how-it-works";

const features = [
  {
    icon: <MessageCircleIcon />,
    title: "Tutor",
    body: "Ask about a topic, paste an exam question, or say what feels confusing. The tutor helps you reason through it.",
    accent: "cyan",
    demo: "Step-by-step chat",
  },
  {
    icon: <BookIcon />,
    title: "Practice Questions",
    body: "Generate Leaving Cert-style questions by subject, level, topic, type, and difficulty.",
    accent: "lime",
    demo: "Exam-style practice",
  },
  {
    icon: <ClockIcon />,
    title: "Exam Tracker",
    body: "Log class tests, mocks, past-paper attempts, results, and feedback so your study has a record.",
    accent: "amber",
    demo: "Tests and milestones",
  },
  {
    icon: <TargetIcon />,
    title: "My Progress",
    body: "See strengths, weak areas, repeated mistakes, and the next area worth working on.",
    accent: "violet",
    demo: "What to focus on",
  },
] as const;

const accent = {
  cyan: {
    card: "border-cyan-100 bg-cyan-50/60 shadow-[0_16px_42px_-34px_rgba(8,145,178,.85)]",
    icon: "border-cyan-100 bg-[#fbfaf6] text-cyan-700",
    pill: "bg-cyan-100 text-cyan-800",
  },
  lime: {
    card: "border-lime-100 bg-lime-50/60 shadow-[0_16px_42px_-34px_rgba(101,163,13,.8)]",
    icon: "border-lime-100 bg-[#fbfaf6] text-lime-700",
    pill: "bg-lime-100 text-lime-800",
  },
  amber: {
    card: "border-amber-100 bg-amber-50/60 shadow-[0_16px_42px_-34px_rgba(245,158,11,.85)]",
    icon: "border-amber-100 bg-[#fbfaf6] text-amber-700",
    pill: "bg-amber-100 text-amber-800",
  },
  violet: {
    card: "border-violet-100 bg-violet-50/60 shadow-[0_16px_42px_-34px_rgba(139,92,246,.85)]",
    icon: "border-violet-100 bg-[#fbfaf6] text-violet-700",
    pill: "bg-violet-100 text-violet-800",
  },
};

export function Features() {
  return (
    <section id="features" className="bg-[#eef4f2] py-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHeader
          eyebrow="Features"
          title="One subject workspace. Four clear actions."
          subtitle="The logged-in app is built around the way students actually revise: ask, practise, track, improve."
        />
        <div className="mt-10 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {features.map((feature) => {
            const colors = accent[feature.accent];
            return (
              <article key={feature.title} className={`flex min-h-[250px] flex-col rounded-2xl border p-6 ${colors.card}`}>
                <div className={`mb-4 grid h-[42px] w-[42px] place-items-center rounded-[12px] border ${colors.icon}`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-[19px] font-semibold tracking-[-0.01em] text-gray-900">{feature.title}</h3>
                <p className="m-0 text-[14.5px] leading-relaxed text-gray-500">{feature.body}</p>
                <div className="mt-auto pt-5">
                  <span className={`inline-flex rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${colors.pill}`}>
                    {feature.demo}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
