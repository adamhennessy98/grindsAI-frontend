export type ToolMode = "chat" | "generator";

interface ModeSwitcherProps {
  mode: ToolMode;
  onChange: (mode: ToolMode) => void;
}

const MODES: Array<{ id: ToolMode; label: string; mobileLabel: string }> = [
  { id: "chat", label: "Study Chat", mobileLabel: "Study Chat" },
  { id: "generator", label: "Exam Question Generator", mobileLabel: "Exam Generator" },
];

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="px-6 max-sm:px-3 py-2.5 max-sm:py-2 border-b border-gray-200 bg-white shrink-0">
      <div className="inline-grid grid-cols-2 gap-[3px] p-[3px] bg-gray-100 border border-gray-200 rounded-[10px] max-sm:w-full">
        {MODES.map((item) => {
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-pressed={active}
              className={[
                "h-8 max-sm:h-[30px] px-3.5 max-sm:px-2 rounded-[7px] text-[13px] max-sm:text-[12.5px] font-medium transition-all whitespace-nowrap",
                active
                  ? "bg-white text-gray-900 shadow-[0_1px_2px_rgba(17,24,39,0.06)]"
                  : "text-gray-500 hover:text-gray-900",
              ].join(" ")}
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.mobileLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
