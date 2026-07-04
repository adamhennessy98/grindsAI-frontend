"use client";

import { subjectLabel } from "./subjects";

interface HomeFeedProps {
  subjectId: string;
  onOpenConvo: () => void;
  onGoProgress: () => void;
}

export function HomeFeed({ subjectId, onOpenConvo, onGoProgress }: HomeFeedProps) {
  const showExam = subjectId === "all" || subjectId === "maths";
  const showWeak = subjectId === "all" || subjectId === "chemistry";
  const showProg = subjectId === "all" || subjectId === "english";
  const emptyFeed = !(showExam || showWeak || showProg);

  return (
    <div className="max-w-[760px] mx-auto px-7 pt-[34px] pb-16">
      {/* opener */}
      <div className="bg-white border border-gray-200 rounded-[18px] px-7 pt-7 pb-6 shadow-[0_1px_2px_rgba(17,24,39,.04),0_18px_40px_-30px_rgba(17,24,39,.4)]">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-[34px] h-[34px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-base font-semibold shrink-0">
            S
          </div>
          <div className="text-[13px] text-gray-400">
            <span className="text-emerald-600 font-semibold">Dia duit, Colm.</span> &nbsp;It&apos;s Saoirse — good to see you back.
          </div>
        </div>
        <h1 className="font-heading text-[27px] leading-tight font-semibold text-gray-900 tracking-[-0.02em] mb-[18px]">
          What would you like to focus on today?
        </h1>
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-[13px] pl-4 pr-1.5 py-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M12 5v14M5 12h14" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Ask Saoirse anything, or tell her what you're working on…"
            className="flex-1 border-none bg-transparent outline-none text-[14.5px] text-gray-700 py-2.5"
            onKeyDown={(e) => e.key === "Enter" && onOpenConvo()}
          />
          <button
            type="button"
            onClick={onOpenConvo}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[10px] px-4 py-2.5 text-sm font-semibold shrink-0 transition-colors"
          >
            Start
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2.5 mt-3.5 flex-wrap">
          <SuggestionChip icon="✎" label="Homework help" onClick={onOpenConvo} />
          <SuggestionChip icon="◷" label="Mock prep" onClick={onOpenConvo} />
          <SuggestionChip icon="◎" label="A topic I'm stuck on" onClick={onOpenConvo} />
        </div>
      </div>

      {/* feed heading */}
      <div className="flex items-center gap-3 mt-8 mb-4 mx-0.5">
        <span className="font-heading text-[15px] font-semibold text-gray-500">From Saoirse</span>
        <span className="text-xs text-gray-400">· {subjectLabel(subjectId)}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex flex-col gap-4">
        {emptyFeed && (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-7 py-[34px] text-center">
            <div className="font-heading text-lg text-gray-700 mb-1.5">
              Saoirse is still getting to know you in {subjectLabel(subjectId)}
            </div>
            <p className="text-sm text-gray-400 max-w-[420px] mx-auto mb-4 leading-relaxed">
              Your feed fills in as you work together. Start a session and she&apos;ll begin building a picture of your
              strengths and the bits that trip you up.
            </p>
            <button
              type="button"
              onClick={onOpenConvo}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-[10px] px-[18px] py-2.5 text-sm font-semibold transition-colors"
            >
              Start a session
            </button>
          </div>
        )}

        {showExam && <ExamCard onOpenConvo={onOpenConvo} />}
        {showWeak && <WeaknessCard onOpenConvo={onOpenConvo} onGoProgress={onGoProgress} />}
        {showProg && <ProgressCard onOpenConvo={onOpenConvo} />}
      </div>
    </div>
  );
}

function SuggestionChip({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-full px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors"
    >
      <span className="text-sm">{icon}</span> {label}
    </button>
  );
}

function ExamCard({ onOpenConvo }: { onOpenConvo: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-[22px] shadow-[0_1px_2px_rgba(17,24,39,.04),0_14px_34px_-28px_rgba(17,24,39,.45)]">
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="w-6 h-6 rounded-[7px] bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold">M</span>
        <span className="text-[12.5px] font-semibold text-emerald-600">Maths (H)</span>
        <span className="text-[12.5px] text-gray-400">· Christmas mock coming up</span>
        <div className="flex-1" />
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">in 18 days</span>
      </div>
      <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">Let&apos;s get you ready for the Maths mock</h3>

      <div className="flex items-center mb-[18px]">
        <TimelineStep dot="filled" label="Homework" labelColor="text-emerald-600" sub="on track" />
        <div className="h-0.5 flex-[1.2] mb-[26px] bg-gradient-to-r from-emerald-500 to-gray-500" />
        <TimelineStep dot="filled-muted" label="Class test" labelColor="text-gray-500" sub="last week" />
        <div className="h-0.5 flex-[1.2] mb-[26px] bg-[repeating-linear-gradient(90deg,#D1D5DB,#D1D5DB_4px,transparent_4px,transparent_8px)]" />
        <TimelineStep dot="ring" label="Mock" labelColor="text-gray-900" sub="15 Dec" />
        <div className="h-0.5 flex-[1.2] mb-[26px] bg-[repeating-linear-gradient(90deg,#D1D5DB,#D1D5DB_4px,transparent_4px,transparent_8px)]" />
        <TimelineStep dot="outline" label="Leaving Cert" labelColor="text-gray-400" sub="Jun 2027" />
      </div>

      <div className="flex gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-[15px] py-3.5 mb-4">
        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-[13px] shrink-0">
          S
        </div>
        <p className="m-0 text-[13.5px] leading-relaxed text-gray-700">
          &ldquo;In your last mock you dropped most marks on <strong className="text-gray-900 font-semibold">differentiation</strong> —
          the chain rule questions in particular. Let&apos;s clear that up before the next one. I&apos;ve got the exact question you
          missed ready to go.&rdquo;
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenConvo}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[10px] px-[18px] py-[11px] text-sm font-semibold transition-colors"
      >
        Start prep with Saoirse
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function TimelineStep({
  dot,
  label,
  labelColor,
  sub,
}: {
  dot: "filled" | "filled-muted" | "ring" | "outline";
  label: string;
  labelColor: string;
  sub: string;
}) {
  const dotClass =
    dot === "filled"
      ? "w-[13px] h-[13px] rounded-full bg-emerald-500"
      : dot === "filled-muted"
        ? "w-[13px] h-[13px] rounded-full bg-gray-500"
        : dot === "ring"
          ? "w-[15px] h-[15px] rounded-full bg-white border-[2.5px] border-emerald-500"
          : "w-[13px] h-[13px] rounded-full bg-white border-2 border-gray-300";
  return (
    <div className="flex flex-col items-center flex-1">
      <div className={dotClass} />
      <span className={`text-[11.5px] font-semibold mt-1.5 ${labelColor}`}>{label}</span>
      <span className="text-[10.5px] text-gray-400">{sub}</span>
    </div>
  );
}

function WeaknessCard({ onOpenConvo, onGoProgress }: { onOpenConvo: () => void; onGoProgress: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-[0_1px_2px_rgba(17,24,39,.04),0_14px_34px_-28px_rgba(17,24,39,.45)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-6 h-6 rounded-[7px] bg-gray-500 text-white flex items-center justify-center text-[11px] font-bold">Ch</span>
        <span className="text-[12.5px] font-semibold text-gray-500">Chemistry (H)</span>
        <span className="text-[12.5px] text-gray-400">· this has come up before</span>
      </div>
      <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Mole calculations are tripping you up again</h3>
      <p className="m-0 mb-4 text-[13.5px] leading-relaxed text-gray-500">
        You&apos;ve hit a wall on stoichiometry in <strong className="text-gray-700">3 of your last 5 sessions</strong>. It&apos;s
        the conversion between moles, mass and volume — not the chemistry itself. Ten focused minutes should shift it.
      </p>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onOpenConvo}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[10px] px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
        >
          Work on this together
        </button>
        <button
          type="button"
          onClick={onGoProgress}
          className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium transition-colors"
        >
          See the pattern
        </button>
      </div>
    </div>
  );
}

function ProgressCard({ onOpenConvo }: { onOpenConvo: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-[0_1px_2px_rgba(17,24,39,.04),0_14px_34px_-28px_rgba(17,24,39,.45)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-6 h-6 rounded-[7px] bg-gray-500 text-white flex items-center justify-center text-[11px] font-bold">E</span>
        <span className="text-[12.5px] font-semibold text-gray-500">English</span>
        <span className="text-[12.5px] text-gray-400">· improving</span>
        <div className="flex-1" />
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 17l5-6 4 3 5-7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          +13
        </span>
      </div>
      <h3 className="font-heading text-lg font-semibold text-gray-900 mb-3.5">Your essay structure is really coming together</h3>
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Comparative essay marks</span>
          <span>
            <strong className="text-emerald-600">71%</strong> · up from 58%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-md overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-[58%] bg-gray-300" />
          <div className="absolute inset-y-0 left-0 w-[71%] bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-md" />
        </div>
      </div>
      <p className="mt-3.5 mb-4 text-[13.5px] leading-relaxed text-gray-500">
        Your introductions used to wander — now you&apos;re landing a clear thesis in the first two sentences. Keep it up and
        the marks follow.
      </p>
      <button
        type="button"
        onClick={onOpenConvo}
        className="bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-700 rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium transition-colors"
      >
        Push it to the next grade
      </button>
    </div>
  );
}
