"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "@/store/authSession";
import ChatSidebar from "./ChatSidebar";
import ChatConversation from "./ChatConversation";
import ChatEmptyState from "./ChatEmptyState";

export default function ChatPageLayout() {
  const {
    activeChat,
    setActiveChat,
    setChats,
    addOrUpdateChat,
    selectedSellerId,
    clearSellerId,
  } = useChatStore();
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [showConversation, setShowConversation] = useState(false);
  const handledSellerRef = useRef<string | null>(null);

  // Load chats
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    fetch("/api/v1/chats")
      .then((res) => res.json())
      .then(async (res) => {
        if (!res.ok) return;

        setChats(res.data ?? []);

        if (!selectedSellerId || handledSellerRef.current === selectedSellerId) return;
        handledSellerRef.current = selectedSellerId;

        const existing = (res.data ?? []).find(
          (c: { buyer: { id: string }; seller: { id: string } }) =>
            (c.buyer.id === user.id && c.seller.id === selectedSellerId) ||
            (c.seller.id === user.id && c.buyer.id === selectedSellerId)
        );

        if (existing) {
          setActiveChat(existing.id);
          setShowConversation(true);
          clearSellerId();
          return;
        }

        try {
          const r = await fetch("/api/v1/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sellerId: selectedSellerId }),
          });
          const data = await r.json();
          if (data.ok && data.data) {
            addOrUpdateChat({ ...data.data, unreadCount: 0 });
            setActiveChat(data.data.id);
            setShowConversation(true);
          }
        } catch {
          console.error("Error al crear chat");
        } finally {
          clearSellerId();
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedSellerId]);

  const handleSelectChat = (chatId: string) => {
    if (chatId) {
      setActiveChat(chatId);
      setShowConversation(true);
    } else {
      setActiveChat(null);
      setShowConversation(false);
    }
  };

  const handleBack = () => {
    setActiveChat(null);
    setShowConversation(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 fontMontserrat">Cargando...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
          <p className="text-gray-400 text-sm fontMontserrat">Cargando chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full rounded-2xl overflow-hidden border border-gray-800">
      {/* Sidebar - hidden on mobile when conversation is open */}
      <div
        className={`w-full lg:w-[340px] lg:block shrink-0 ${
          showConversation ? "hidden" : "block"
        }`}
      >
        <ChatSidebar onSelectChat={handleSelectChat} activeChatId={activeChat} />
      </div>

      {/* Conversation area */}
      <div
        className={`flex-1 ${showConversation ? "block" : "hidden lg:block"}`}
      >
        {activeChat ? (
          <ChatConversation onBack={handleBack} />
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  );
}
