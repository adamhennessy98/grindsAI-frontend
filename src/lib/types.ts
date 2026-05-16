export type MessageRole = "user" | "ai";

export interface Message {
  role: MessageRole;
  text: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface ConversationSummary {
  id: string;
  subjectId: string;
  level: string;
  title: string;
  updatedAt: string;
}
