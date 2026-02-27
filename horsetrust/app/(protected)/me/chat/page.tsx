"use client";

import ChatPageLayout from "./_components/ChatPageLayout";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-black pt-4 pb-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto" style={{ height: "calc(100vh - 120px)" }}>
        <ChatPageLayout />
      </div>
    </div>
  );
}
