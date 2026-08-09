import Link from "next/link";
import { ArrowRightIcon, BookIcon, CheckIcon, MessageCircleIcon, ShieldIcon, TargetIcon } from "@/components/icons";

const tools = [
  { icon: <MessageCircleIcon />, title: "Tutor", body: "Ask about the exact concept, question or piece of exam wording in front of you. Your Tutor guides the thinking step by step instead of simply giving you something to copy.", accent: "cyan" },
  { icon: <CheckIcon size={18} />, title: "Topic Check", body: "Before moving to exam-style questions, take a short preparatory check of the common foundations and procedures that the topic is built on.", accent: "amber" },
  { icon: <BookIcon />, title: "Exam Questions", body: "Practise focused Leaving Cert-style questions for your chosen subject, level and topic. Bring a question into your Tutor whenever you want support.", accent: "lime" },
  { icon: <TargetIcon />, title: "Progress & Results", body: "Keep track of what feels difficult, what is becoming comfortable, and what your next useful action should be in that subject.", accent: "violet" },
] as const;

const tones = {
  cyan: "border-cyan-100 bg-cyan-50/55 text-cyan-700",
  amber: "border-amber-100 bg-amber-50/55 text-amber-700",
  lime: "border-lime-100 bg-lime-50/55 text-lime-700",
  violet: "border-violet-100 bg-violet-50/55 text-violet-700",
};

export function StudySystemDetail() {
  return (
    <section className="border-t border-cyan-100 bg-[#eef4f2] py-20 sm:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="max-w-[760px]">
          <div className="font-mono text-xs uppercase tracking-[.08em] text-cyan-700">The detail</div>
          <h2 className="font-heading m-0 mt-3 text-[clamp(30px,4vw,44px)] font-semibold leading-[1.08] tracking-[-.03em] text-gray-950">One personalised tutor space for every subject you take.</h2>
          <p className="m-0 mt-4 text-[16px] leading-relaxed text-gray-600">Maths does not need the same help as Biology. That is why GrindsAI keeps every subject in its own workspace, with its own Tutor, topics, practice and progress. If you take eight subjects, you have eight subject-specific tutor spaces working from the relevant context for each one.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool) => <article key={tool.title} className={`rounded-2xl border p-5 ${tones[tool.accent]}`}><div className="grid h-10 w-10 place-items-center rounded-xl border border-white/80 bg-[#fbfaf6]">{tool.icon}</div><h3 className="mt-4 text-[18px] font-semibold tracking-[-.015em] text-gray-900">{tool.title}</h3><p className="m-0 mt-2 text-[13.5px] leading-relaxed text-gray-600">{tool.body}</p></article>)}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-cyan-100 bg-[#fbfaf6] p-6 sm:p-7">
            <div className="text-[12px] font-semibold uppercase tracking-[.08em] text-cyan-700">Relevant context, not information overload</div>
            <h3 className="font-heading m-0 mt-3 text-[22px] font-semibold tracking-[-.02em] text-gray-950">Each subject Tutor starts with the right materials.</h3>
            <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-gray-600">Your Tutor is given the Leaving Cert curriculum, subject specification, level and topic that matter for the work in front of you. It can draw on relevant past exam questions, marking schemes and Formulae &amp; Tables context where appropriate, without treating every subject like the same generic conversation.</p>
          </article>
          <article className="rounded-2xl border border-violet-100 bg-violet-50/55 p-6 sm:p-7">
            <div className="text-[12px] font-semibold uppercase tracking-[.08em] text-violet-700">Personalised over time</div>
            <h3 className="font-heading m-0 mt-3 text-[22px] font-semibold tracking-[-.02em] text-gray-950">The help gets more useful as it gets to know you.</h3>
            <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-gray-600">Your own focus areas, Tutor conversations, Topic Checks and results build a picture of what is secure and what still needs attention. That gives GrindsAI a better starting point each time you return, while keeping the next step clear and manageable.</p>
          </article>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-2xl border border-lime-100 bg-lime-50/55 p-6 sm:p-7">
            <div className="text-[12px] font-semibold uppercase tracking-[.08em] text-lime-700">How the four parts connect</div>
            <p className="m-0 mt-3 max-w-[710px] text-[15px] leading-relaxed text-gray-700">Talk through a tricky topic with your Tutor. Use a Topic Check to make sure the basics are secure. Move on to an Exam Question when you are ready to practise the way it may be asked in the exam. Then use Progress &amp; Results to make the improvement visible and choose what comes next.</p>
          </article>
          <article className="rounded-2xl border border-amber-100 bg-amber-50/55 p-6 sm:p-7">
            <div className="flex items-start gap-3"><span className="mt-0.5 shrink-0 text-amber-700"><ShieldIcon size={20} /></span><div><div className="text-[12px] font-semibold uppercase tracking-[.08em] text-amber-700">Teacher-informed</div><p className="m-0 mt-2 text-[14.5px] leading-relaxed text-gray-700">GrindsAI is made and monitored with real Irish secondary school teachers, keeping the product close to the classroom and the exam.</p></div></div>
          </article>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cyan-100 pt-8 sm:flex-row sm:items-center">
          <p className="m-0 max-w-[650px] text-[15px] leading-relaxed text-gray-600">The aim is simple: every subject should feel like it has its own tutor, its own memory, and one clear next step.</p>
          <Link href="/signup" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] bg-[linear-gradient(135deg,#06b6d4,#84cc16)] px-5 text-[14px] font-semibold text-white shadow-[0_16px_32px_-22px_rgba(6,182,212,.9)] transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105">Create your workspace <ArrowRightIcon size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
