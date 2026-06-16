import { STARTERS } from "@/lib/constants";
import { SubjectIcon } from "@/components/icons";
import { IS_BETA } from "@/lib/beta";
import type { Subject, SubjectTopic } from "@/lib/types";

interface EmptyStateProps {
  subject: Subject;
  level: string;
  topic: SubjectTopic;
  onPick: (q: string) => void;
}

export function EmptyState({ subject, level, topic, onPick }: EmptyStateProps) {
  const starters = STARTERS[`${subject.id}:${topic.id}`] ?? STARTERS[subject.id] ?? [];
  return (
    <div className="max-w-[620px] mx-auto px-6 max-sm:px-4 pt-[60px] max-sm:pt-8 pb-10 max-sm:pb-6 text-center flex flex-col items-center gap-2.5">
      <div className="animate-fade-up w-16 h-16 max-sm:w-12 max-sm:h-12 rounded-[18px] max-sm:rounded-[14px] bg-emerald-50 text-emerald-700 grid place-items-center border border-emerald-100 mb-2.5 max-sm:mb-1">
        <SubjectIcon name={subject.icon} size={26} />
      </div>
      <h2 className="animate-fade-up-1 m-0 text-[28px] max-sm:text-[22px] font-semibold tracking-[-0.02em]">
        What do you want to study today?
      </h2>
      <p className="animate-fade-up-2 m-0 text-gray-500 text-[15px] max-sm:text-[14px] max-w-[440px] leading-relaxed">
        {topic.id === "general"
          ? `Ask me anything from the ${subject.name} ${level === "HL" ? "Higher Level" : "Ordinary Level"} course.`
          : `Ask me anything about ${topic.name} for ${subject.name} ${level === "HL" ? "Higher Level" : "Ordinary Level"}.`}
      </p>
      {IS_BETA && (
        <p className="animate-fade-up-2 m-0 mt-1 text-amber-800/90 text-[13px] max-w-[440px] leading-relaxed">
          Beta preview — answers can be wrong. Check important work with your teacher.
        </p>
      )}
      <div className="animate-fade-up-3 flex flex-wrap gap-2 max-sm:gap-1.5 justify-center mt-6 max-sm:mt-4 w-full max-w-[520px]">
        {starters.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="px-3.5 max-sm:px-3 py-2 max-sm:py-1.5 bg-gray-100 border border-transparent rounded-full text-[13.5px] max-sm:text-[12.5px] text-gray-600 transition-all hover:bg-white hover:border-emerald-500 hover:text-emerald-700"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
