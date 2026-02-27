"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { IoArrowBack, IoTrashOutline, IoStorefrontOutline } from "react-icons/io5";
import { useChatStore, ChatMessage } from "@/store/chatStore";
import { useSession } from "@/store/authSession";
import { useSocket } from "@/hooks/useSocket";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";
import ChatSalePanel from "./ChatSalePanel";
import ChatSaleCard from "./ChatSaleCard";
import ChatReviewModal from "./ChatReviewModal";
import Image from "next/image";

interface SaleData {
  id: string;
  horse: { id: string; name: string; breed: string; price: number | null };
  seller_id: string;
  buyer_id: string;
  price: number;
  completed_at: string;
  reviews: { id: string; rating: number; comment: string | null; buyer_id: string }[];
}

interface ChatConversationProps {
  onBack: () => void;
}

export default function ChatConversation({ onBack }: ChatConversationProps) {
  const {
    activeChat,
    messages,
    isTyping,
    chats,
    setActiveChat,
    setChats,
    setMessages,
    addMessage,
    confirmMessage,
    failMessage,
    setTyping,
    updateLastMessage,
    markChatAsRead,
    incrementUnread,
  } = useChatStore();
  const { user } = useSession();
  const socketRef = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showSalePanel, setShowSalePanel] = useState(false);
  const [sales, setSales] = useState<SaleData[]>([]);
  const [reviewSaleId, setReviewSaleId] = useState<string | null>(null);

  const chat = chats.find((c) => c.id === activeChat);
  const otherUser = chat
    ? chat.buyer.id === user?.id
      ? chat.seller
      : chat.buyer
    : null;
  const otherName = otherUser
    ? [otherUser.first_name, otherUser.last_name].filter(Boolean).join(" ") || "Usuario"
    : "Chat";
  const otherInitials = otherName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Load messages
  useEffect(() => {
    if (!activeChat) return;

    fetch(`/api/v1/chats/${activeChat}/messages`)
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setMessages(res.data);
      })
      .catch(console.error);
  }, [activeChat, setMessages]);

  // Mark as read
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeChat || !user) return;

    socket.emit("mark_read", { chatId: activeChat, userId: user.id });
    markChatAsRead(activeChat);
  }, [activeChat, socketRef, user, markChatAsRead]);

  // Socket events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeChat) return;

    socket.emit("join_chat", activeChat);

    const handleNewMessage = (message: ChatMessage & { tempId?: string }) => {
      if (message.chat_id !== activeChat) return;

      if (message.sender_id === user?.id) {
        if (message.tempId) {
          confirmMessage(message.tempId, message);
          updateLastMessage(activeChat, message);
        }
      } else {
        addMessage(message);
        updateLastMessage(activeChat, message);
        socket.emit("mark_read", { chatId: activeChat, userId: user?.id });
        markChatAsRead(activeChat);
      }
    };

    const handleMessageError = ({ tempId, error }: { tempId: string; error: string }) => {
      console.error("Error al enviar mensaje:", error);
      if (tempId) failMessage(tempId);
    };

    const handleTyping = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) setTyping(true);
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) setTyping(false);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_error", handleMessageError);
    socket.on("user_typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_error", handleMessageError);
      socket.off("user_typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [
    activeChat,
    socketRef,
    user?.id,
    addMessage,
    confirmMessage,
    failMessage,
    setTyping,
    updateLastMessage,
    markChatAsRead,
  ]);

  // Load sales between users
  const loadSales = useCallback(() => {
    if (!activeChat) return;
    fetch(`/api/v1/chats/${activeChat}/sales`)
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setSales(res.data ?? []);
      })
      .catch(console.error);
  }, [activeChat]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (content: string) => {
    const socket = socketRef.current;
    if (!activeChat || !user) return;

    const tempId = crypto.randomUUID();

    const optimistic: ChatMessage = {
      id: tempId,
      chat_id: activeChat,
      sender_id: user.id,
      content,
      read_at: null,
      created_at: new Date().toISOString(),
      tempId,
      isPending: true,
    };
    addMessage(optimistic);
    updateLastMessage(activeChat, optimistic);

    if (socket?.connected) {
      socket.emit("send_message", {
        chatId: activeChat,
        senderId: user.id,
        content,
        tempId,
      });
      socket.emit("stop_typing", { chatId: activeChat, userId: user.id });
    } else {
      fetch(`/api/v1/chats/${activeChat}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.ok) {
            confirmMessage(tempId, res.data);
            updateLastMessage(activeChat, res.data);
          } else {
            failMessage(tempId);
          }
        })
        .catch(() => failMessage(tempId));
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!activeChat || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/v1/chats/${activeChat}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.ok && data.data?.url) {
        handleSend(data.data.url);
      }
    } catch {
      console.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleTyping = () => {
    const socket = socketRef.current;
    if (!socket?.connected || !activeChat || !user) return;

    socket.emit("typing", { chatId: activeChat, userId: user.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { chatId: activeChat, userId: user.id });
    }, 2000);
  };

  const handleClearHistory = async () => {
    if (!activeChat) return;
    if (!confirm("¿Eliminar esta conversación y todos sus mensajes?")) return;

    try {
      const res = await fetch(`/api/v1/chats/${activeChat}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setChats(chats.filter((c) => c.id !== activeChat));
        setActiveChat(null);
        onBack();
      }
    } catch {
      console.error("Error al eliminar chat");
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "rgb(17, 17, 17)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <button
          onClick={onBack}
          className="lg:hidden p-1.5 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          title="Volver"
        >
          <IoArrowBack className="text-lg" style={{ color: "rgb(238, 238, 255)" }} />
        </button>

        {otherUser?.avatar_url ? (
          <Image
            src={otherUser.avatar_url}
            alt={otherName}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ backgroundColor: "rgb(62, 98, 89)", color: "rgb(238, 238, 255)" }}
          >
            {otherInitials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <span
            className="font-medium text-sm block truncate"
            style={{ color: "rgb(238, 238, 255)" }}
          >
            {otherName}
          </span>
          {isTyping && (
            <span className="text-xs text-gray-400 animate-pulse">
              escribiendo...
            </span>
          )}
        </div>

        <button
          onClick={() => setShowSalePanel((v) => !v)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            showSalePanel ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
          title="Registrar venta"
        >
          <IoStorefrontOutline
            className="text-lg"
            style={{ color: "rgb(181, 186, 114)" }}
          />
        </button>

        <button
          onClick={handleClearHistory}
          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
          title="Eliminar conversación"
        >
          <IoTrashOutline className="text-lg text-red-400" />
        </button>
      </div>

      {/* Sale Panel (seller only) */}
      {showSalePanel && chat && (
        <ChatSalePanel
          chatId={chat.id}
          sellerId={chat.seller.id}
          buyerId={chat.buyer.id}
          currentUserId={user?.id ?? ""}
          onSaleCreated={() => {
            loadSales();
            setShowSalePanel(false);
          }}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Sale cards */}
        {sales.length > 0 && (
          <div className="space-y-3 mb-4">
            {sales.map((sale) => (
              <ChatSaleCard
                key={sale.id}
                sale={sale}
                currentUserId={user?.id ?? ""}
                onReview={(saleId) => setReviewSaleId(saleId)}
              />
            ))}
          </div>
        )}

        {messages.length === 0 && sales.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">
            Aún no hay mensajes. ¡Envía el primero!
          </p>
        )}

        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === user?.id}
          />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2 rounded-2xl rounded-bl-sm text-sm"
              style={{ backgroundColor: "rgb(38, 38, 38)", color: "rgb(238, 238, 255)" }}
            >
              <span className="animate-pulse text-gray-400">escribiendo...</span>
            </div>
          </div>
        )}

        {uploading && (
          <div className="flex justify-end">
            <div
              className="px-3 py-2 rounded-2xl rounded-br-sm text-sm opacity-70"
              style={{ backgroundColor: "rgb(62, 98, 89)", color: "rgb(238, 238, 255)" }}
            >
              <span className="animate-pulse">Subiendo imagen...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onImageUpload={handleImageUpload}
        onTyping={handleTyping}
        disabled={uploading}
      />

      {/* Review Modal */}
      {reviewSaleId && (
        <ChatReviewModal
          saleId={reviewSaleId}
          onClose={() => setReviewSaleId(null)}
          onReviewSubmitted={loadSales}
        />
      )}
    </div>
  );
}
