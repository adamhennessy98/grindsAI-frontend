"use client";

import { useState } from "react";
import type { TutorQuestionHandoff } from "./conversation-view";

type QuestionTutorActionsProps = {
  sourceLabel: TutorQuestionHandoff["sourceLabel"];
  title: string;
  topic: { id: string; name: string };
  level: string;
  question: string;
  supportingMaterialLabel: string;
  supportingMaterial: string;
  studentAnswer?: string;
  onOpen: (handoff: TutorQuestionHandoff) => void;
  onAssisted?: () => void;
};

export function QuestionTutorActions({ sourceLabel, title, topic, level, question, supportingMaterialLabel, supportingMaterial, studentAnswer = "", onOpen, onAssisted }: QuestionTutorActionsProps) {
  const [mode, setMode] = useState<"help" | "answer" | null>(null);
  const [detail, setDetail] = useState("");

  const chooseMode = (nextMode: "help" | "answer") => {
    setMode(nextMode);
    setDetail(nextMode === "answer" ? studentAnswer : "");
  };

  const openTutor = () => {
    if (!mode || (mode === "answer" && !detail.trim())) return;
    const askingForHelp = mode === "help";
    const initialMessage = askingForHelp
      ? detail.trim() ? `I need help with this question. I am finding this difficult: ${detail.trim()}` : "I need help with this question. Please guide me through it step by step."
      : `My answer was:\n${detail.trim()}\n\nPlease check it and help me correct anything that is wrong.`;
    const contextPrompt = [
      `Question handoff from ${sourceLabel.toLowerCase()}.`,
      `Topic: ${topic.name}.`,
      "Question:",
      question,
      supportingMaterial ? `Available ${supportingMaterialLabel}:\n${supportingMaterial}` : "No solution material has been revealed to the student.",
      askingForHelp
        ? "The student wants guided help. Do not reveal the full answer immediately; begin with the next useful step."
        : "The student submitted an answer. Check it against the available solution material, explain what is correct or needs changing, then guide them through any correction.",
    ].filter(Boolean).join("\n\n");

    onAssisted?.();
    onOpen({
      id: `question-handoff-${Date.now()}`,
      title,
      topicId: topic.id,
      topicName: topic.name,
      level,
      sourceLabel,
      summary: `${askingForHelp ? "Guided help requested" : "Student answer shared"}. The question and ${supportingMaterial ? supportingMaterialLabel : "available context"} are with your Tutor.`,
      initialMessage,
      contextPrompt,
    });
  };

  return <section className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50/45 px-4 py-4 dark:border-cyan-900 dark:bg-cyan-400/[.07]"><div className="font-heading text-[16px] font-semibold text-gray-900 dark:text-white">Ask your Tutor about this question</div><p className="m-0 mt-1 text-[13px] leading-relaxed text-gray-600 dark:text-slate-300">A focused {topic.name} chat will open below with this question and its {supportingMaterial ? supportingMaterialLabel : "question context"}.</p>{!mode ? <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => chooseMode("help")} className="rounded-xl bg-cyan-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-cyan-600">Ask for help</button><button type="button" onClick={() => chooseMode("answer")} className="rounded-xl border border-cyan-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-cyan-700 hover:border-cyan-500 dark:border-cyan-800 dark:bg-slate-900 dark:text-cyan-200">Tell Tutor my answer</button></div> : <div className="mt-3"><label className="block"><span className="text-[12.5px] font-medium text-gray-700 dark:text-slate-200">{mode === "help" ? "What would you like help with? (optional)" : "What answer did you get?"}</span><textarea value={detail} onChange={(event) => setDetail(event.target.value)} rows={3} placeholder={mode === "help" ? "e.g. I do not know how to start part (b)" : "Write your answer or working here"} className="mt-1.5 w-full resize-y rounded-xl border border-cyan-100 bg-white px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={mode === "answer" && !detail.trim()} onClick={openTutor} className="rounded-xl bg-cyan-500 px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-cyan-600 disabled:bg-gray-300 dark:disabled:bg-slate-700">Start chat below</button><button type="button" onClick={() => { setMode(null); setDetail(""); }} className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-700 hover:border-gray-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Cancel</button></div></div>}</section>;
}
