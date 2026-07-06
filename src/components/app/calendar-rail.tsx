"use client";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const HOMEWORK_DAYS = new Set([24, 30]);
const TODAY = 27;

const UPCOMING = [
  { day: "Fri", date: "27", title: "Maths homework due", meta: "Integration Q4–Q7 · today" },
  { day: "Mon", date: "30", title: "Chemistry class test", meta: "Stoichiometry · in 3 days" },
  { day: "Dec", date: "15", title: "Christmas Mocks begin", meta: "All subjects · in 18 days" },
];

interface CalendarRailProps {
  dimmed: boolean;
  onDismiss: () => void;
  onOpenConvo: () => void;
}

export function CalendarRail({ dimmed, onDismiss, onOpenConvo }: CalendarRailProps) {
  return (
    <aside className="relative w-[340px] shrink-0 h-full bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-[14px] px-[15px] py-[14px] mb-5">
          <div className="relative w-[42px] h-[42px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-[19px] font-semibold shrink-0">
            S
            <span className="absolute right-0 bottom-px w-[11px] h-[11px] rounded-full bg-emerald-400 border-2 border-gray-50" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-[15px] font-semibold text-gray-900">Saoirse</div>
            <div className="text-xs text-gray-400">Your tutor since September · 18 sessions</div>
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="font-heading text-base font-semibold text-gray-900">Samhain</span>{" "}
            <span className="text-[13px] text-gray-400">November 2026</span>
          </div>
          <div className="flex gap-1">
            <CalNavButton dir="left" />
            <CalNavButton dir="right" />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1.5">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="text-center text-[10.5px] font-semibold text-gray-400 py-0.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-[3px] text-xs">
          {Array(5).fill(null).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {DAYS.map((day) => (
            <div key={day} className="relative aspect-square flex flex-col items-center justify-center text-gray-700">
              {day === TODAY ? (
                <span className="w-[27px] h-[27px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
                  {day}
                </span>
              ) : (
                day
              )}
              {(HOMEWORK_DAYS.has(day) || day === TODAY) && (
                <span
                  className={`absolute bottom-0.5 w-[5px] h-[5px] rounded-full ${
                    day === TODAY ? "bg-emerald-500" : "bg-gray-500"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3.5 mt-3.5 mb-1 text-[11px] text-gray-400">
          <span className="flex items-center gap-1"><Dot color="bg-emerald-500" />Today</span>
          <span className="flex items-center gap-1"><Dot color="bg-gray-500" />Homework</span>
          <span className="flex items-center gap-1"><Dot color="bg-gray-500" />Class test</span>
        </div>

        <div className="mt-5">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 mb-2.5">Coming up</div>
          <div className="flex flex-col gap-2">
            {UPCOMING.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={onOpenConvo}
                className="flex items-center gap-3 w-full text-left bg-white border border-gray-200 rounded-[11px] px-3.5 py-[11px] hover:border-emerald-500 transition-colors"
              >
                <div className="flex flex-col items-center shrink-0 w-[34px]">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">{item.day}</span>
                  <span className="font-heading text-lg font-semibold text-gray-900 leading-none">{item.date}</span>
                </div>
                <div className="flex-1 min-w-0 border-l border-gray-200 pl-3">
                  <div className="text-[13.5px] font-semibold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.meta}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3.5 bg-emerald-500 rounded-[13px] px-[17px] py-4 text-white relative overflow-hidden">
            <div className="absolute -right-5 -top-5 w-[90px] h-[90px] rounded-full bg-white/15" />
            <div className="relative font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-emerald-100">
              Leaving Cert
            </div>
            <div className="relative flex items-baseline gap-2 mt-1.5 mb-0.5">
              <span className="font-heading text-3xl font-semibold">193</span>
              <span className="text-sm text-emerald-100">days to go</span>
            </div>
            <div className="relative text-[12.5px] text-emerald-100">Begins Monday 8 June 2027</div>
          </div>
        </div>
      </div>

      {dimmed && (
        <div
          onClick={onDismiss}
          className="absolute inset-0 bg-white/60 backdrop-blur-[1.5px] cursor-pointer"
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
      className="w-6 h-6 rounded-[7px] border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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
  return <span className={`w-1.5 h-1.5 rounded-full ${color}`} />;
}
