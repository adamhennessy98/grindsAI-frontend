"use client";

import { buildPapers, subjectLabel } from "./subjects";

interface PapersViewProps {
  subjectId: string;
  onOpenConvo: () => void;
}

export function PapersView({ subjectId, onOpenConvo }: PapersViewProps) {
  const papersId = subjectId === "all" ? "maths" : subjectId;
  const papers = buildPapers(papersId);

  return (
    <div className="max-w-[880px] mx-auto px-7 pt-[30px] pb-16">
      <div className="mb-1.5 text-[13px] text-gray-400">{subjectLabel(papersId)} · Higher Level</div>
      <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-1.5">Every question opens with your tutor</h1>
      <p className="m-0 mb-[26px] text-[14.5px] text-gray-500 max-w-[560px] leading-relaxed">
        No PDFs to wrestle with. Pick a paper and Saoirse pulls the questions straight into your session — working through
        them with you, the way the mock card just did.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-[22px] py-5 mb-[30px]">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-[26px] h-[26px] rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading text-[13px]">
            S
          </div>
          <span className="font-heading text-base font-semibold text-gray-900">Questions Saoirse picked for you</span>
          <span className="text-xs text-gray-400">· based on your weak spots</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <RecommendedRow tag="2022 · P1 · Q6b" title="Differentiate (3x² + 1)⁵ — chain rule" sub="The one you missed in the mock" onClick={onOpenConvo} />
          <RecommendedRow tag="2021 · P1 · Q7a" title="Rates of change — differentiation in context" sub="Same skill, dressed up as a word problem" onClick={onOpenConvo} />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 mx-0.5">
        <span className="font-heading text-[15px] font-semibold text-gray-500">Full archive</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {papers.map((paper) => (
          <div
            key={paper.key}
            className="bg-white border border-gray-200 rounded-2xl px-5 py-[18px] flex flex-col shadow-[0_1px_2px_rgba(17,24,39,.04)]"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-heading text-[19px] font-semibold text-gray-900">{paper.year}</span>
              <span className="text-[13px] font-semibold text-emerald-600">{paper.paper}</span>
            </div>
            <div className="text-[12.5px] text-gray-400 mb-3.5 leading-snug">{paper.topics}</div>
            <div className="flex-1" />
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-gray-400">{paper.qCount} questions</span>
              <button
                type="button"
                onClick={onOpenConvo}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-emerald-500 border border-gray-200 hover:border-emerald-500 text-emerald-600 hover:text-white rounded-[9px] px-3 py-[7px] text-[12.5px] font-semibold transition-colors"
              >
                Work through
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendedRow({
  tag,
  title,
  sub,
  onClick,
}: {
  tag: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3.5 w-full text-left bg-white border border-gray-200 hover:border-emerald-500 rounded-[11px] px-4 py-[13px] transition-colors"
    >
      <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md shrink-0">{tag}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-gray-900">{title}</span>
        <span className="text-xs text-gray-400">{sub}</span>
      </span>
      <span className="flex items-center gap-1 text-[13px] font-semibold text-emerald-600 shrink-0">
        Work through
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h13M13 6l6 6-6 6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
