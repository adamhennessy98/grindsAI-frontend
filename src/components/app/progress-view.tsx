"use client";

interface ProgressViewProps {
  onOpenConvo: () => void;
}

export function ProgressView({ onOpenConvo }: ProgressViewProps) {
  return (
    <div className="max-w-[920px] mx-auto px-7 pt-[30px] pb-16">
      <div className="flex items-start gap-3.5 mb-[26px]">
        <div className="w-[46px] h-[46px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-xl font-semibold shrink-0">
          S
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-1">What Saoirse has learned about you</h1>
          <p className="m-0 text-sm text-gray-400">Built from 18 sessions since September · across all your subjects</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-6">
        <StatTile label="Overall trajectory" value="Climbing" valueColor="text-emerald-600" caption="+11% across your subjects this term" />
        <StatTile label="Strongest area" value="Algebra" valueColor="text-gray-900" caption="Reliably 85%+ for two months" />
        <StatTile label="Biggest turnaround" value="Differentiation" valueColor="text-gray-900" caption="41% → 68% since September" captionColor="text-emerald-600 font-semibold" />
      </div>

      <div className="grid grid-cols-[1.1fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-[22px] py-5">
            <h3 className="font-heading text-base font-semibold text-gray-900 mb-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              What you&apos;re good at
            </h3>
            <div className="flex flex-col gap-3.5">
              <SkillBar label="Algebra & functions" subject="Maths" pct={88} />
              <SkillBar label="Comparative essays" subject="English" pct={71} />
              <SkillBar label="Mechanics" subject="Physics" pct={79} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl px-[22px] py-5">
            <h3 className="font-heading text-base font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              What keeps coming back
            </h3>
            <p className="m-0 mb-3.5 text-[12.5px] text-gray-400">Topics Saoirse has watched you stumble on more than once.</p>
            <div className="flex flex-col gap-2.5">
              <RecurringRow title="Chain rule in differentiation" sub="Seen in 4 sessions · improving slowly" tag="Maths" onClick={onOpenConvo} />
              <RecurringRow title="Mole calculations" sub="Seen in 3 of last 5 sessions" tag="Chemistry" onClick={onOpenConvo} />
              <RecurringRow title="An Aimsir Chaite — past tense" sub="Verb endings slipping under time pressure" tag="Gaeilge" onClick={onOpenConvo} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-[22px] py-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-heading text-base font-semibold text-gray-900 m-0">Differentiation, over time</h3>
              <span className="text-xs font-semibold text-emerald-600">▲ +27 pts</span>
            </div>
            <p className="m-0 mb-4 text-[12.5px] text-gray-400">Your accuracy on chain-rule questions, session by session.</p>
            <DifferentiationChart />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-[18px]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-[26px] h-[26px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-[13px]">
                S
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.04em] text-gray-500">Saoirse&apos;s note</span>
            </div>
            <p className="m-0 text-[13.5px] leading-relaxed text-gray-700">
              &ldquo;Colm has put in steady, honest work this term. He&apos;s solid on the foundations and is finally turning
              the corner on differentiation — the topic that worried him most. Mole calculations are next on our list. He&apos;s
              exactly where a 6th year should be heading into the Christmas mocks.&rdquo;
            </p>
            <div className="text-[11.5px] text-gray-400 mt-2.5">A summary you can share with a parent or teacher.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  valueColor,
  caption,
  captionColor = "text-gray-400",
}: {
  label: string;
  value: string;
  valueColor: string;
  caption: string;
  captionColor?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-[18px]">
      <div className="text-[12.5px] text-gray-400 mb-2">{label}</div>
      <div className={`font-heading text-[27px] font-semibold ${valueColor}`}>{value}</div>
      <div className={`text-xs mt-1 ${captionColor}`}>{caption}</div>
    </div>
  );
}

function SkillBar({ label, subject, pct }: { label: string; subject: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1.5">
        <span className="text-gray-700">
          {label} <span className="text-gray-400">· {subject}</span>
        </span>
        <span className="text-emerald-600 font-semibold">{pct}%</span>
      </div>
      <div className="h-[7px] bg-gray-200 rounded-md overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-md" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RecurringRow({ title, sub, tag, onClick }: { title: string; sub: string; tag: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left bg-gray-50 border border-gray-200 hover:border-gray-500 rounded-[10px] px-3.5 py-[11px] transition-colors"
    >
      <span className="flex-1">
        <span className="block text-[13.5px] font-semibold text-gray-900">{title}</span>
        <span className="text-xs text-gray-400">{sub}</span>
      </span>
      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-xl shrink-0">{tag}</span>
    </button>
  );
}

function DifferentiationChart() {
  return (
    <svg viewBox="0 0 320 150" className="w-full h-auto block">
      <line x1="34" y1="14" x2="34" y2="118" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="34" y1="118" x2="312" y2="118" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="34" y1="40" x2="312" y2="40" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 4" />
      <line x1="34" y1="79" x2="312" y2="79" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 4" />
      <text x="26" y="44" textAnchor="end" fontSize="9" fill="#9CA3AF">80</text>
      <text x="26" y="83" textAnchor="end" fontSize="9" fill="#9CA3AF">50</text>
      <text x="26" y="121" textAnchor="end" fontSize="9" fill="#9CA3AF">20</text>
      <path d="M48,96 L114,90 L180,70 L246,58 L300,49 L300,118 L48,118 Z" fill="#10B981" opacity="0.08" />
      <path d="M48,96 L114,90 L180,70 L246,58 L300,49" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="96" r="3.4" fill="#fff" stroke="#10B981" strokeWidth="2" />
      <circle cx="114" cy="90" r="3.4" fill="#fff" stroke="#10B981" strokeWidth="2" />
      <circle cx="180" cy="70" r="3.4" fill="#fff" stroke="#10B981" strokeWidth="2" />
      <circle cx="246" cy="58" r="3.4" fill="#fff" stroke="#10B981" strokeWidth="2" />
      <circle cx="300" cy="49" r="4.2" fill="#10B981" />
      <text x="48" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Sep</text>
      <text x="114" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Oct</text>
      <text x="180" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Oct</text>
      <text x="246" y="134" textAnchor="middle" fontSize="9" fill="#9CA3AF">Nov</text>
      <text x="300" y="134" textAnchor="middle" fontSize="9" fill="#10B981" fontWeight="600">Now</text>
    </svg>
  );
}
