import { describe, expect, it } from "vitest";
import { composeStudentContext } from "@/lib/learning/compose-student-context";
import type { StudentProfile } from "@/lib/onboarding";

const sampleProfile: StudentProfile = {
  yearGroup: "6th-year",
  subjects: ["maths"],
  subjectLevels: { maths: "HL" },
  examTarget: "June 2026",
  challenge: "exam-freeze",
  completedAt: "2026-08-01T00:00:00.000Z",
};

describe("composeStudentContext", () => {
  it("returns empty string when nothing is provided (no empty Student context noise)", () => {
    expect(composeStudentContext({})).toBe("");
    expect(composeStudentContext({ profile: null, handoffContext: null })).toBe("");
    expect(composeStudentContext({ handoffContext: "   " })).toBe("");
  });

  it("includes prefs framing when profile exists", () => {
    const out = composeStudentContext({ profile: sampleProfile });
    expect(out).toContain("6th Year");
    expect(out).toContain("freeze");
    expect(out).toContain("Personalisation must not override Socratic rules");
    expect(out).not.toMatch(/^Student context:/i);
  });

  it("appends handoff after prefs", () => {
    const out = composeStudentContext({
      profile: sampleProfile,
      handoffContext: "Paper 1 Q6: integrate by parts",
    });
    const prefsIdx = out.indexOf("Student prefs");
    const handoffIdx = out.indexOf("Question / paper handoff:");
    expect(prefsIdx).toBeGreaterThanOrEqual(0);
    expect(handoffIdx).toBeGreaterThan(prefsIdx);
    expect(out).toContain("integrate by parts");
  });

  it("keeps personalisation when handoff is huge (truncate handoff first)", () => {
    const hugeHandoff = "MARKING ".repeat(4000); // well over 12k with prefs
    const out = composeStudentContext({
      profile: sampleProfile,
      handoffContext: hugeHandoff,
    });
    expect(out.length).toBeLessThanOrEqual(12000);
    expect(out).toContain("Student prefs");
    expect(out).toContain("Personalisation must not override Socratic rules");
    // Handoff still present but shortened
    expect(out).toContain("Question / paper handoff:");
    expect(out.length).toBeLessThan(hugeHandoff.length);
  });

  it("includes tone and mastery without treating them as ability proof", () => {
    const out = composeStudentContext({
      profile: sampleProfile,
      tone: { anxietyFlag: true, notes: ["Prefers short steps"], learnerStyle: null },
      strugglingKcs: [
        {
          kcId: "calc.ibp",
          label: "Integration by parts",
          subjectId: "maths",
          strandTopicId: "calculus",
          masteryP: 0.2,
          masteryPDecayed: 0.18,
          evidenceN: 3,
          lastOutcome: "incorrect",
          lastEventAt: "2026-08-01T00:00:00.000Z",
        },
      ],
    });
    expect(out).toContain("test anxiety");
    expect(out).toContain("do not treat as ability evidence");
    expect(out).toContain("Integration by parts");
    expect(out).toContain("graded attempts only");
  });
});
