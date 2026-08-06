import {
  buildStudentContextPrompt,
  type StudentProfile,
} from "@/lib/onboarding";
import type { KcMasterySummary } from "@/lib/learning/profile";

export type StudentToneContext = {
  anxietyFlag: boolean;
  notes: string[];
};

const PROFILE_CAP = 2500;
const TONE_CAP = 1200;
const MASTERY_CAP = 1500;
const HANDOFF_CAP = 9000;
const TOTAL_CAP = 12000;

/**
 * Merge prefs (framing) + tone context + mastery hints + optional papers handoff.
 * Never treats self-report or free-text as proof of ability.
 * Truncates handoff first so personalisation survives long marking schemes.
 */
export function composeStudentContext(input: {
  profile?: StudentProfile | null;
  tone?: StudentToneContext | null;
  strugglingKcs?: KcMasterySummary[] | null;
  handoffContext?: string | null;
}): string {
  const parts: string[] = [];

  if (input.profile) {
    let prefs = buildStudentContextPrompt(input.profile);
    if (input.profile.targetGradeBand) {
      prefs += ` Target grade band (self-reported, not mastery evidence): ${input.profile.targetGradeBand}.`;
    }
    if (input.profile.reasonForUsing?.trim()) {
      prefs += ` Reason for using GrindsAI (self-reported): ${input.profile.reasonForUsing.trim().slice(0, 280)}.`;
    }
    prefs +=
      " Personalisation must not override Socratic rules or curriculum lock — never dump full answers because of profile tone.";
    parts.push(prefs.slice(0, PROFILE_CAP));
  }

  if (input.tone?.anxietyFlag || (input.tone?.notes?.length ?? 0) > 0) {
    const tone = input.tone;
    const toneBits = [
      "Tutor tone notes (do not treat as ability evidence):",
      tone?.anxietyFlag ? "Student has indicated test anxiety — stay calm, encouraging, and paced." : "",
      ...(tone?.notes ?? []).slice(0, 5).map((n) => `• ${n}`),
    ]
      .filter(Boolean)
      .join(" ");
    parts.push(toneBits.slice(0, TONE_CAP));
  }

  if (input.strugglingKcs?.length) {
    const labels = input.strugglingKcs
      .slice(0, 6)
      .map((k) => k.label)
      .join("; ");
    parts.push(
      `Topics with low estimated mastery (from graded attempts only — teach gently, do not assume failure): ${labels}.`.slice(
        0,
        MASTERY_CAP,
      ),
    );
  }

  const handoff = input.handoffContext?.trim() ?? "";
  if (handoff) {
    parts.push(`Question / paper handoff:\n${handoff}`.slice(0, HANDOFF_CAP));
  }

  let joined = parts.filter(Boolean).join("\n\n").trim();
  if (joined.length > TOTAL_CAP) {
    // Drop from handoff end first
    const withoutHandoff = parts.slice(0, -1).join("\n\n");
    const budget = Math.max(0, TOTAL_CAP - withoutHandoff.length - 40);
    const trimmedHandoff = handoff.slice(0, budget);
    joined = [withoutHandoff, trimmedHandoff ? `Question / paper handoff:\n${trimmedHandoff}` : ""]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, TOTAL_CAP);
  }
  return joined;
}
