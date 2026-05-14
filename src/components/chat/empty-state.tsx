import { STARTERS } from "@/lib/constants";
import { SubjectIcon } from "@/components/icons";
import type { Subject } from "@/lib/types";

interface EmptyStateProps {
  subject: Subject;
  level: string;
  onPick: (q: string) => void;
}

export function EmptyState({ subject, level, onPick }: EmptyStateProps) {
  const starters = STARTERS[subject.id] ?? [];
  return (
    <div className="max-w-[620px] mx-auto px-6 pt-[60px] pb-10 text-center flex flex-col items-center gap-2.5">
      <div className="animate-fade-up w-16 h-16 rounded-[18px] bg-emerald-50 text-emerald-700 grid place-items-center border border-emerald-100 mb-2.5">
        <SubjectIcon name={subject.icon} size={28} />
      </div>
      <h2 className="animate-fade-up-1 m-0 text-[28px] font-semibold tracking-[-0.02em]">
        What do you want to study today?
      </h2>
      <p className="animate-fade-up-2 m-0 text-gray-500 text-[15px] max-w-[440px] leading-relaxed">
        Ask me anything from the {subject.name} {level === "HL" ? "Higher Level" : "Ordinary Level"} course.
      </p>
      <div className="animate-fade-up-3 flex flex-wrap gap-2 justify-center mt-6 w-full max-w-[520px]">
        {starters.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="px-3.5 py-2 bg-gray-100 border border-transparent rounded-full text-[13.5px] text-gray-600 transition-all hover:bg-white hover:border-emerald-500 hover:text-emerald-700"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
