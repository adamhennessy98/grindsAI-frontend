import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BookIcon, CheckIcon, MessageCircleIcon, ShieldIcon, TargetIcon } from "@/components/icons";

const featureStories = [
  {
    icon: <MessageCircleIcon />,
    title: "Tutor",
    value: "Get unstuck while the question is still in front of you.",
    body: "Ask in your own words, paste an exam question, or say exactly where the explanation stopped making sense. Your Tutor helps you understand why a method works and when to use it, instead of rushing to a finished answer to copy.",
    context: "It begins with the relevant subject, level and topic context, so a Maths conversation and a Biology conversation are not treated like the same generic chat.",
    label: "Guided, subject-aware help",
    accent: "cyan",
    image: "/landing/tutor-maths.png",
    imageAlt: "The GrindsAI Maths Tutor guiding a student through an Algebra concept, step by step.",
    width: 1208,
    height: 903,
  },
  {
    icon: <CheckIcon size={18} />,
    title: "Topic Check",
    value: "Make the foundations secure before the exam-style version.",
    body: "A Topic Check is a short, preparatory test of the core procedures a topic is built on. It moves from the first essential step to the common methods, so you can see what deserves a little more work.",
    context: "You stay in control: work independently, show your method, or bring the exact question into your Tutor when you need a nudge. Support used is simply useful context for what to practise next.",
    label: "Foundations first",
    accent: "amber",
    image: "/landing/topic-check-physics.png",
    imageAlt: "A GrindsAI Physics Topic Check asking a Mechanics question with space to show working and Tutor support available.",
    width: 1110,
    height: 871,
  },
  {
    icon: <BookIcon />,
    title: "Exam Questions",
    value: "Unlimited exam questions for all subjects and topics.",
    body: "Work through past exam questions or generate new Leaving Cert-style questions for the subject, topic, level and type of practice you need. Try it yourself first, then reveal help gradually or ask your Tutor to work through the exact question with you.",
    context: "Past-paper questions and marking schemes keep practice close to how the subject is assessed, while the Tutor stays available for the moment you need more than an answer.",
    label: "Focused exam practice",
    accent: "lime",
    image: "/landing/exam-questions-economics.png",
    imageAlt: "A GrindsAI Economics exam question with topic and difficulty controls, Tutor support, and reflection options.",
    width: 1140,
    height: 898,
  },
  {
    icon: <TargetIcon />,
    title: "Progress & Results",
    value: "Make improvement visible and keep the next step clear.",
    body: "Add the areas you are finding difficult, log a result when you have one, and mark something comfortable when it has clicked. It turns scattered revision into a useful record for each subject.",
    context: "That record helps GrindsAI make its next recommendation more relevant: revisit a weak area with your Tutor, take a confidence-building Topic Check, or move into an Exam Question.",
    label: "Your next useful move",
    accent: "violet",
    image: "/landing/progress-history.png",
    imageAlt: "The GrindsAI Progress and Results page with focus areas, recent activity, and improved areas.",
    width: 1123,
    height: 891,
  },
] as const;

const tones = {
  cyan: {
    border: "border-gray-200 border-l-[3px] border-l-cyan-500",
    surface: "bg-[#edf4f3]",
    text: "text-cyan-700",
    icon: "border-gray-200 bg-white text-cyan-700",
  },
  amber: {
    border: "border-gray-200 border-l-[3px] border-l-amber-500",
    surface: "bg-[#f7f1e8]",
    text: "text-amber-700",
    icon: "border-gray-200 bg-white text-amber-700",
  },
  lime: {
    border: "border-gray-200 border-l-[3px] border-l-lime-500",
    surface: "bg-[#f0f4e8]",
    text: "text-lime-700",
    icon: "border-gray-200 bg-white text-lime-700",
  },
  violet: {
    border: "border-gray-200 border-l-[3px] border-l-violet-500",
    surface: "bg-[#f0eef7]",
    text: "text-violet-700",
    icon: "border-gray-200 bg-white text-violet-700",
  },
} as const;

export function StudySystemDetail() {
  return (
    <section className="border-t border-cyan-100 bg-[#eef4f2] py-20 sm:py-24">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mx-auto max-w-[780px] text-center">
          <div className="text-xs font-semibold text-cyan-700">How GrindsAI works</div>
          <h2 className="font-heading m-0 mt-3 text-[clamp(30px,4vw,44px)] font-semibold leading-[1.08] tracking-[-.03em] text-gray-950">
            One study system that gets more useful as you use it.
          </h2>
          <p className="m-0 mt-4 text-[16px] leading-relaxed text-gray-600">
            Every subject has its own workspace, its own topic context and its own personal study history. That means the help can stay specific to the course in front of you and adapt to the way you learn over time.
          </p>
        </div>

        <div className="mt-12 space-y-6 sm:space-y-8">
          {featureStories.map((feature, index) => {
            const tone = tones[feature.accent];
            return (
              <article
                key={feature.title}
                className={`grid overflow-hidden rounded-xl border bg-[#fbfaf6] lg:grid-cols-2 ${tone.border}`}
              >
                <div className={`p-3 sm:p-5 ${tone.surface} ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_14px_26px_-24px_rgba(15,23,42,.45)]">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      width={feature.width}
                      height={feature.height}
                      sizes="(max-width: 1024px) calc(100vw - 72px), 520px"
                      unoptimized
                      className="block h-auto w-full"
                    />
                  </div>
                </div>

                <div className={`flex flex-col justify-center p-6 sm:p-9 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className={`flex items-center gap-3 text-[12px] font-semibold ${tone.text}`}>
                    <span className={`grid h-10 w-10 place-items-center rounded-lg border ${tone.icon}`}>{feature.icon}</span>
                    {feature.label}
                  </div>
                  <h3 className="font-heading m-0 mt-6 text-[clamp(25px,3vw,34px)] font-semibold leading-[1.08] tracking-[-.025em] text-gray-950">
                    {feature.title}
                  </h3>
                  <p className="m-0 mt-3 text-[18px] font-medium leading-snug text-gray-800">{feature.value}</p>
                  <p className="m-0 mt-5 text-[15px] leading-relaxed text-gray-600">{feature.body}</p>
                  <p className="m-0 mt-4 border-t border-gray-100 pt-4 text-[14px] leading-relaxed text-gray-500">{feature.context}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 border-y border-cyan-200 bg-[#f7faf8] px-0 py-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <div className="border-l-2 border-cyan-600 pl-2.5 text-xs font-semibold text-cyan-700">A connected relationship, not disconnected tools</div>
              <h3 className="font-heading m-0 mt-3 text-[clamp(25px,3vw,34px)] font-semibold leading-[1.1] tracking-[-.025em] text-gray-950">
                What you do in one tool helps shape the next useful step.
              </h3>
              <p className="m-0 mt-4 text-[15px] leading-relaxed text-gray-600">
                A question you work through, help you needed, a Topic Check you completed, or an area you add as difficult gives your subject workspace a clearer picture of where to meet you next. Over time, that makes the Tutor&apos;s guidance and the recommended practice more personal and more efficient.
              </p>
            </div>
            <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {[
                ["01", "Tutor", "Understand the difficult part."],
                ["02", "Topic Check", "Make the core methods secure."],
                ["03", "Exam Questions", "Apply it in an exam-style setting."],
                ["04", "Progress & Results", "Choose your next useful move."],
              ].map(([step, title, body], index) => {
                const accent = ["cyan", "amber", "lime", "violet"][index] as keyof typeof tones;
                const tone = tones[accent];
                return (
                  <li key={title} className={`border-l-[3px] bg-white p-4 ${tone.border}`}>
                    <div className={`text-[11px] font-semibold ${tone.text}`}>{step}</div>
                    <div className="mt-2 text-[14px] font-semibold text-gray-900">{title}</div>
                    <div className="mt-1 text-[12.5px] leading-relaxed text-gray-600">{body}</div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="border-l-[3px] border-amber-500 bg-white/65 p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-amber-700"><ShieldIcon size={20} /></span>
              <div>
                <div className="text-[12px] font-semibold text-amber-700">Relevant and teacher-informed</div>
                <h3 className="font-heading m-0 mt-3 text-[22px] font-semibold tracking-[-.02em] text-gray-950">Built around the Irish Leaving Cert, not a generic syllabus.</h3>
                <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-gray-700">Each subject workspace draws from the relevant curriculum, specification, topic, level, past papers and marking schemes. GrindsAI is created and monitored with real Irish secondary school teachers, so the study experience stays close to the classroom and the exam.</p>
              </div>
            </div>
          </article>
          <article className="border-l-[3px] border-violet-500 bg-white/65 p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-violet-700"><TargetIcon size={20} /></span>
              <div>
                <div className="text-[12px] font-semibold text-violet-700">Convenient by design</div>
                <h3 className="font-heading m-0 mt-3 text-[22px] font-semibold tracking-[-.02em] text-gray-950">Your subject Tutor is ready when you are.</h3>
                <p className="m-0 mt-3 text-[14.5px] leading-relaxed text-gray-700">Use it when a homework question is blocking you, before a class test, on the bus, or when you finally have a free hour. You decide the subject, topic, pace and kind of support you need, without waiting for an appointment.</p>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cyan-100 pt-8 sm:flex-row sm:items-center">
          <p className="m-0 max-w-[650px] text-[15px] leading-relaxed text-gray-600">
            The aim is simple: every subject should feel like it has its own tutor, its own context, and one clear next step.
          </p>
          <Link href="/signup" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-cyan-600 px-5 text-[14px] font-semibold text-white shadow-[0_14px_28px_-22px_rgba(8,145,178,.7)] transition-colors hover:bg-cyan-700">
            Create your workspace <ArrowRightIcon size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
