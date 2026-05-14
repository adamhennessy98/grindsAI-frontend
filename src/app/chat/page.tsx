import { Suspense } from "react";
import { ChatClient } from "./chat-client";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen grid place-items-center bg-white text-gray-500 text-sm">Loading chat…</div>
      }
    >
      <ChatClient />
    </Suspense>
  );
}
