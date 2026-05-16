import { SparkleIcon, ShieldIcon, ClockIcon } from "@/components/icons";
import { SectionHeader } from "./how-it-works";

function FauxMsg({ user, children }: { user?: boolean; children: React.ReactNode }) {
  return user ? (
    <div className="self-end bg-emerald-500 text-white text-[12.5px] px-2.5 py-1.5 rounded-[10px_10px_2px_10px] max-w-[85%]">
      {children}
    </div>
  ) : (
    <div className="self-start bg-white border border-gray-200 text-[12.5px] px-2.5 py-1.5 rounded-[2px_10px_10px_10px] max-w-[85%]">
      {children}
    </div>
  );
}

const features = [
  {
    icon: <SparkleIcon />,
    title: "Socratic method",
    body: "It won't hand you the answer. GrindsAI asks the questions that lead you there - the way a real teacher does.",
    demo: (
      <div className="flex flex-col gap-2">
        <FauxMsg user>Just give me the answer.</FauxMsg>
        <FauxMsg>Let&apos;s try a smaller version first - what&apos;s 2^3?</FauxMsg>
      </div>
    ),
  },
  {
    icon: <ShieldIcon />,
    title: "Curriculum-locked",
    body: "Trained only on the State Exams Commission syllabus. No hallucinated theorems, no off-spec rabbit holes.",
    demo: (
      <div className="flex flex-col gap-1.5">
        {["Maths H - Topic 5.2", "Biology - Unit 2.4", "Chemistry - Mole concept"].map((t) => (
          <div key={t} className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[11.5px] text-gray-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            {t}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <ClockIcon />,
    title: "Available 24/7",
    body: "Stuck at 11pm the night before a class test? GrindsAI doesn't sleep, doesn't cancel, and never doubles its rates.",
    demo: (
      <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-500 font-mono leading-[1.7]">
        <div><span className="text-emerald-500">*</span> Online / {new Date().toLocaleString("en-IE", { weekday: "short" })} 23:47</div>
        <div className="text-gray-400">avg. response &lt; 2s</div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-[1140px] mx-auto px-6">
        <SectionHeader eyebrow="Why GrindsAI" title="A tutor, not a cheat sheet." />
        <div className="mt-10 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {features.map((f) => (
            <article
              key={f.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col"
              style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 1px 1px rgba(17,24,39,0.03)" }}
            >
              <div className="w-[38px] h-[38px] rounded-[10px] bg-emerald-50 text-emerald-700 grid place-items-center border border-emerald-100 mb-4">
                {f.icon}
              </div>
              <h3 className="text-[17px] font-semibold tracking-[-0.01em] mb-2">{f.title}</h3>
              <p className="text-gray-500 text-[14.5px] leading-relaxed mb-[18px]">{f.body}</p>
              <div className="mt-auto p-3.5 bg-gray-50 border border-[#eef0f3] rounded-xl">{f.demo}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
