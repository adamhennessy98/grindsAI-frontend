import type { Message, Subject } from "./types";

export const SUBJECTS: Subject[] = [
  { id: "maths",     name: "Maths",     icon: "Triangle", enabled: true  },
  { id: "biology",   name: "Biology",   icon: "Leaf",     enabled: true  },
  { id: "chemistry", name: "Chemistry", icon: "Flask",    enabled: true  },
  { id: "physics",   name: "Physics",   icon: "Target",   enabled: false },
  { id: "english",   name: "English",   icon: "Book",     enabled: false },
  { id: "irish",     name: "Irish",     icon: "Book",     enabled: false },
];

export const STARTERS: Record<string, string[]> = {
  maths:     ["Explain the quadratic formula", "Help me with differentiation", "What's on the Strand 2 syllabus?"],
  biology:   ["How does photosynthesis actually work?", "Explain the structure of DNA", "Difference between mitosis and meiosis?"],
  chemistry: ["Explain the mole concept", "How do I balance redox equations?", "Why does atomic radius change across a period?"],
};

export const SAMPLE_CONVO: Message[] = [
  { role: "user", text: "Can you explain Pythagoras' theorem to me?" },
  { role: "ai",   text: "Great topic! Before I explain it, let me ask you something - if you have a right-angled triangle, what's special about the longest side? Do you know what it's called?" },
  { role: "user", text: "Is it called the hypotenuse?" },
  { role: "ai",   text: "Exactly right. The hypotenuse is always the side opposite the right angle, and it's always the longest side.\n\nNow, Pythagoras noticed a relationship between the lengths of all three sides. If the hypotenuse is c, and the other two sides are a and b - what do you think that relationship might look like? Take a guess, even if you're not sure." },
  { role: "user", text: "Is it a^2 + b^2 = c^2?" },
  { role: "ai",   text: "Perfect - that's it exactly. **a^2 + b^2 = c^2**.\n\nNow let's make sure you can *use* it, not just recall it. If a = 3 and b = 4, what is c? Show me your working." },
];

export function socraticReply(subjectId: string, userText: string): string {
  const lower = userText.toLowerCase();
  if ((lower.includes("answer") && (lower.includes("just") || lower.includes("give"))) || lower.includes("tell me")) {
    return "I hear you - but if I just hand you the answer, you'll forget it by Friday. Let's try a smaller version of the problem together. What's the very first thing you'd write down to start it?";
  }
  if (/^\s*c\s*=?\s*5/.test(lower) || lower.includes("=5") || lower.includes("= 5")) {
    return "Spot on - c = 5. You worked through 3^2 + 4^2 = 9 + 16 = 25, and sqrt(25) = 5.\n\nNow here's the deeper question: *why* does squaring the sides work? What is a^2 actually measuring, geometrically?";
  }
  if (subjectId === "biology") return "Good question. Before we dive in - what do *you* already know about it from class? Even a half-remembered detail gives us a starting point we can build from.";
  if (subjectId === "chemistry") return "Let's think about it from first principles. What does the question actually want you to find - and what information does it hand you for free?";
  return "Nice question. Let me ask you one back: what part of this feels unclear to you right now? Pinpointing that is half the battle.";
}
