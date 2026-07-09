"use client";

import { getTopic, STARTERS } from "@/lib/constants";
import { subjectLabel } from "./subjects";
import { TutorTopicChips, TutorTopicSidebar } from "./tutor-topic-sidebar";

interface ConversationViewProps {
  subjectId: string;
  level: string;
  topicId: string;
  stuck: boolean;
  onRevealStuck: () => void;
  onOpenTopic: (topicId: string) => void;
}

export function ConversationView({ subjectId, level, topicId, stuck, onRevealStuck, onOpenTopic }: ConversationViewProps) {
  const subject = subjectLabel(subjectId);
  const topic = getTopic(subjectId, topicId);
  const starters = STARTERS[`${subjectId}:${topic.id}`] ?? STARTERS[subjectId] ?? [];

  return (
    <div className="mx-auto grid h-full max-w-[1180px] grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)]">
      <TutorTopicSidebar subjectId={subjectId} activeTopicId={topic.id} onSelectTopic={onOpenTopic} />

      <div className="flex min-w-0 flex-col px-5 sm:px-7">
        <div className="flex items-center gap-[13px] border-b border-gray-200 px-1 pb-4 pt-5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-heading text-base font-semibold text-white">
            AI
            <span className="absolute bottom-px right-px h-[11px] w-[11px] rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="font-heading text-[17px] font-semibold text-gray-900">Subject tutor</div>
            <div className="text-[12.5px] text-gray-400">
              {subject} / {level === "OL" ? "Ordinary Level" : "Higher Level"} / {topic.name}
            </div>
          </div>
          <span className="rounded-full border border-gray-200 bg-gray-100 px-[11px] py-[5px] text-xs text-gray-500">
            Socratic mode
          </span>
        </div>

        <TutorTopicChips subjectId={subjectId} activeTopicId={topic.id} onSelectTopic={onOpenTopic} />

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-1 pb-4 pt-[22px]">
          <TutorBubble>
            You&apos;re in {topic.name}. Ask a question from this topic, paste an exam question, or choose one of the starters
            below. I will keep the help step by step.
          </TutorBubble>

          {starters.length > 0 && (
            <div className="ml-[41px] flex flex-wrap gap-2">
              {starters.map((starter) => (
                <span key={starter} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12.5px] text-gray-600">
                  {starter}
                </span>
              ))}
            </div>
          )}

          <PastPaperCard topicName={topic.name} />

          <TutorBubble>
            Before we try to solve anything, tell me what part of {topic.name} feels least clear: the concept, the exam
            wording, or the first step in a question?
          </TutorBubble>

          <StudentBubble>I usually understand it in class, but I am not sure how to start when it appears in an exam question.</StudentBubble>

          <TutorBubble>
            Good. Then we will start with recognition: what clues in the question tell you this is a {topic.name} problem?
            Name one clue, even if you are not fully sure.
          </TutorBubble>

          <StudentBubble>The wording and the formula I think I need.</StudentBubble>

          <QuickQuestion>Can you give me one starting hint?</QuickQuestion>
          <QuickFactBubble />

          <TutorBubble>
            Exactly. Now make that concrete: write the first line you would put on the page. It does not have to be perfect;
            we just need a starting point to improve.
          </TutorBubble>

          {stuck && (
            <>
              <QuickQuestion>I&apos;m still stuck.</QuickQuestion>
              <TutorBubble>
                One nudge: write down the information the question gives you first, then underline what it asks for. Most
                exam questions become easier once those two pieces are separated.
              </TutorBubble>
            </>
          )}
        </div>

        <div className="shrink-0 px-1 pb-5 pt-2">
          <div className="mb-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRevealStuck}
              className="rounded-full border border-gray-200 bg-white px-[13px] py-[7px] text-[12.5px] font-medium text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-500"
            >
              Give me a hint
            </button>
            <button
              type="button"
              onClick={onRevealStuck}
              className="rounded-full border border-gray-200 bg-white px-[13px] py-[7px] text-[12.5px] font-medium text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-500"
            >
              I&apos;m still stuck
            </button>
            <button
              type="button"
              className="rounded-full border border-gray-200 bg-white px-[13px] py-[7px] text-[12.5px] font-medium text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-500"
            >
              Show a worked example
            </button>
          </div>
          <div className="flex items-center gap-2.5 rounded-[13px] border border-gray-200 bg-white py-1.5 pl-4 pr-1.5 shadow-[0_6px_18px_-14px_rgba(17,24,39,.5)]">
            <input
              placeholder="Reply to the tutor, or type your answer..."
              className="flex-1 border-none bg-transparent py-2.5 text-[14.5px] text-gray-700 outline-none"
            />
            <button
              type="button"
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-emerald-500 transition-colors hover:bg-emerald-600"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-center text-[11.5px] text-gray-400">
            The tutor guides you to the answer instead of simply giving it away.
          </div>
        </div>
      </div> 
    </div>
  );
}

function TutorBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[88%] gap-2.5">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-emerald-500 font-heading text-[11px] font-semibold text-white">
        AI
      </div>
      <div className="rounded-b-2xl rounded-tl-sm rounded-tr-2xl bg-gray-100 px-4 py-[13px] text-[14.5px] leading-relaxed text-gray-900">
        {children}
      </div>
    </div>
  );
}

function StudentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-b-2xl rounded-tl-2xl rounded-tr-sm bg-emerald-500 px-[15px] py-[11px] text-[14.5px] leading-relaxed text-white">
        {children}
      </div>
    </div>
  );
}

function QuickQuestion({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[74%] rounded-b-2xl rounded-tl-2xl rounded-tr-sm border border-emerald-100 bg-emerald-50 px-3.5 py-2.5 text-[13.5px] leading-snug text-emerald-700">
        {children}
      </div>
    </div>
  );
}

function QuickFactBubble() {
  return (
    <div className="flex max-w-[88%] gap-2.5">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-emerald-500 font-heading text-[11px] font-semibold text-white">
        AI
      </div>
      <div className="max-w-full rounded-b-xl rounded-tl-sm rounded-tr-xl border border-emerald-100 border-l-[3px] border-l-emerald-500 bg-emerald-50 px-[15px] py-3">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.05em] text-emerald-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3v18M3 12h18" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Quick fact
        </div>
        <div className="font-heading mb-1.5 text-lg text-gray-900">Start by naming the task</div>
        <p className="m-0 text-[13px] leading-relaxed text-gray-500">
          A strong first move is to identify the topic, list the given information, and write what the question is asking
          for before doing any working.
        </p>
      </div>
    </div>
  );
}

function PastPaperCard({ topicName }: { topicName: string }) {
  return (
    <div className="mb-0.5 ml-[41px] mt-0.5 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-[0_10px_30px_-24px_rgba(17,24,39,.6)]">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-[15px] py-[9px]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 3h8l4 4v14H6z" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 3v4h4" stroke="#6B7280" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="font-mono text-[11.5px] font-bold uppercase tracking-[0.04em] text-gray-500">Topic context</span>
        <span className="text-xs text-gray-400">Higher Level / Paper 1 / 25 marks</span>
        <div className="flex-1" />
      </div>
      <div className="flex">
        <div className="w-1.5 shrink-0 bg-[repeating-linear-gradient(180deg,#E5E7EB,#E5E7EB_6px,transparent_6px,transparent_12px)]" />
        <div className="flex-1 px-5 py-[18px]">
          <p className="m-0 mb-3.5 text-[13.5px] text-gray-500">
            This session is keyed to the mapped topic:
          </p>
          <div className="font-heading py-1.5 text-center text-2xl text-gray-900">{topicName}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="#6B7280" strokeWidth="1.6" />
          <path d="M12 8v5l3 2" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        The topic ID is preserved for backend context and retrieval.
      </div>
    </div>
  );
}
