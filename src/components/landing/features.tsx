import { BookIcon, MessageCircleIcon, ShieldIcon, TargetIcon } from "@/components/icons";
import { SectionHeader } from "./how-it-works";

const features = [
  { icon: <BookIcon />, title: "Deep Leaving Cert context", body: "Your Tutor is grounded in the curriculum, subject specifications, level and topic you are actually studying. It is not a generic chat with a school label.", accent: "cyan" },
  { icon: <TargetIcon />, title: "Past papers and marking in context", body: "Past-paper questions, marking schemes and exam-style practice keep revision close to how your subject is actually assessed.", accent: "lime" },
  { icon: <MessageCircleIcon />, title: "A tutor that becomes more personal", body: "Your focus areas, Tutor conversations and results build a clearer picture of what you find easy, what needs work, and the next useful step.", accent: "violet" },
  { icon: <ShieldIcon />, title: "Created with Irish teachers", body: "GrindsAI is made and monitored with real Irish secondary school teachers, keeping the experience grounded in the classroom and the exam.", accent: "amber" },
] as const;

const accent = {
  cyan: "border-cyan-100 bg-cyan-50/60 text-cyan-700",
  lime: "border-lime-100 bg-lime-50/60 text-lime-700",
  violet: "border-violet-100 bg-violet-50/60 text-violet-700",
  amber: "border-amber-100 bg-amber-50/60 text-amber-700",
};

export function Features() {
  return (
    <section id="features" className="bg-[#eef4f2] py-20 sm:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHeader eyebrow="Why GrindsAI" title="Built for the exam you are actually sitting." subtitle="A connected study workspace gives you the right curriculum context, the right next question, and a clearer picture of your progress without sending you through a one-size-fits-all programme." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => <article key={feature.title} className={`rounded-2xl border p-6 shadow-[0_18px_44px_-36px_rgba(15,23,42,.36)] ${accent[feature.accent]}`}><div className="grid h-11 w-11 place-items-center rounded-xl border border-white/80 bg-[#fbfaf6]">{feature.icon}</div><h3 className="mt-5 text-[19px] font-semibold tracking-[-.015em] text-gray-900">{feature.title}</h3><p className="m-0 mt-2 max-w-[480px] text-[14.5px] leading-relaxed text-gray-600">{feature.body}</p></article>)}
        </div>
      </div>
    </section>
  );
}
