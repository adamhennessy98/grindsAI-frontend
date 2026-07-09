"use client";

import { subjectLabel } from "./subjects";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const EVENT_DAYS = new Set([7, 14, 22, 29]);
const TODAY = 7;

const UPCOMING = [
  { day: "Tue", date: "07", title: "Study plan review", meta: "All subjects / today" },
  { day: "Tue", date: "14", title: "Maths class test", meta: "Calculus / in 7 days" },
  { day: "Wed", date: "22", title: "Chemistry checkpoint", meta: "Stoichiometry / in 15 days" },
];

interface CalendarRailProps {
  subjectId?: string;
  dimmed: boolean;
  onDismiss: () => void;
  onOpenConvo: () => void;
}

export function CalendarRail({ subjectId, dimmed, onDismiss, onOpenConvo }: CalendarRailProps) {
  return (
    <aside className="relative hidden h-full w-[340px] shrink-0 flex-col border-l border-gray-200 bg-gray-50 2xl:flex">
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
        <div className="mb-5 rounded-[14px] border border-gray-200 bg-white px-[15px] py-[14px]">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
            {subjectId ? `${subjectLabel(subjectId)} milestones` : "General calendar"}
          </div>
          <div className="font-heading text-[17px] font-semibold text-gray-900">Upcoming exams and study blocks</div>
          <p className="m-0 mt-1 text-[12.5px] leading-relaxed text-gray-500">
            Calendar integration is visual for now. Subject-specific milestones are tracked in the exam tracker.
          </p>
        </div>

        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <span className="font-heading text-base font-semibold text-gray-900">July</span>{" "}
            <span className="text-[13px] text-gray-400">2026</span>
          </div>
          <div className="flex gap-1">
            <CalNavButton dir="left" />
            <CalNavButton dir="right" />
          </div>
        </div>

        <div className="mb-1.5 grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="py-0.5 text-center text-[10.5px] font-semibold text-gray-400">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-[3px] text-xs">
          {Array(3).fill(null).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {DAYS.map((day) => (
            <div key={day} className="relative flex aspect-square flex-col items-center justify-center text-gray-700">
              {day === TODAY ? (
                <span className="flex h-[27px] w-[27px] items-center justify-center rounded-full bg-emerald-500 font-semibold text-white">
                  {day}
                </span>
              ) : (
                day
              )}
              {EVENT_DAYS.has(day) && (
                <span className={`absolute bottom-0.5 h-[5px] w-[5px] rounded-full ${day === TODAY ? "bg-emerald-500" : "bg-gray-500"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-1 mt-3.5 flex gap-3.5 text-[11px] text-gray-400">
          <span className="flex items-center gap-1"><Dot color="bg-emerald-500" />Today</span>
          <span className="flex items-center gap-1"><Dot color="bg-gray-500" />Assessment</span>
          <span className="flex items-center gap-1"><Dot color="bg-gray-500" />Study block</span>
        </div>

        <div className="mt-5">
          <div className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Coming up</div>
          <div className="flex flex-col gap-2">
            {UPCOMING.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={onOpenConvo}
                className="flex w-full items-center gap-3 rounded-[11px] border border-gray-200 bg-white px-3.5 py-[11px] text-left transition-colors hover:border-emerald-500"
              >
                <div className="flex w-[34px] shrink-0 flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase text-gray-500">{item.day}</span>
                  <span className="font-heading text-lg font-semibold leading-none text-gray-900">{item.date}</span>
                </div>
                <div className="min-w-0 flex-1 border-l border-gray-200 pl-3">
                  <div className="text-[13.5px] font-semibold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.meta}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="relative mt-3.5 overflow-hidden rounded-[13px] bg-emerald-500 px-[17px] py-4 text-white">
            <div className="absolute -right-5 -top-5 h-[90px] w-[90px] rounded-full bg-white/15" />
            <div className="relative font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-emerald-100">
              Leaving Cert
            </div>
            <div className="relative mb-0.5 mt-1.5 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-semibold">2027</span>
              <span className="text-sm text-emerald-100">planning mode</span>
            </div>
            <div className="relative text-[12.5px] text-emerald-100">Final exam dates need live calendar data.</div>
          </div>
        </div>
      </div>

      {dimmed && (
        <div
          onClick={onDismiss}
          className="absolute inset-0 cursor-pointer bg-white/60 backdrop-blur-[1.5px]"
          aria-hidden
        />
      )}
    </aside>
  );
}

function CalNavButton({ dir }: { dir: "left" | "right" }) {
  return (
    <button
      type="button"
      className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-gray-200 bg-white transition-colors hover:bg-gray-100"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {dir === "left" ? (
          <path d="M15 6l-6 6 6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function Dot({ color }: { color: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}
