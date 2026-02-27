"use client";

import { useEffect, useRef, useState } from "react";
import { IoArrowBack, IoSend, IoAlertCircleOutline } from "react-icons/io5";
import { useChatStore, ChatMessage } from "@/store/chatStore";
import { useSession } from "@/store/authSession";
import { useSocket } from "@/hooks/useSocket";
import Image from "next/image";

function formatMessageTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow() {
  const {
    activeChat,
    messages,
    isTyping,
    chats,
    setActiveChat,
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
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chat = chats.find((c) => c.id === activeChat);
  const otherUser = chat
    ? chat.buyer.id === user?.id
      ? chat.seller
      : chat.buyer
    : null;
  const otherName = otherUser
    ? [otherUser.first_name, otherUser.last_name].filter(Boolean).join(" ") ||
      "Usuario"
    : "Chat";
  const otherInitials = otherName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Cargar mensajes al abrir
  useEffect(() => {
    if (!activeChat) return;

    fetch(`/api/v1/chats/${activeChat}/messages`)
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setMessages(res.data);
      })
      .catch(console.error);
  }, [activeChat, setMessages]);

  // Emitir mark_read al abrir el chat
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeChat || !user) return;

    socket.emit("mark_read", { chatId: activeChat, userId: user.id });
    markChatAsRead(activeChat);
  }, [activeChat, socketRef, user, markChatAsRead]);

  // Eventos de socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeChat) return;

    socket.emit("join_chat", activeChat);

    const handleNewMessage = (message: ChatMessage & { tempId?: string }) => {
      if (message.chat_id !== activeChat) return;

      if (message.sender_id === user?.id) {
        // Confirmar mensaje optimista propio
        if (message.tempId) {
          confirmMessage(message.tempId, message);
          updateLastMessage(activeChat, message);
        }
      } else {
        // Mensaje del otro usuario
        addMessage(message);
        updateLastMessage(activeChat, message);

        // Marcar como leído inmediatamente (el chat está abierto)
        socket.emit("mark_read", { chatId: activeChat, userId: user?.id });
        markChatAsRead(activeChat);
      }
    };

    const handleMessageError = ({
      tempId,
      error,
    }: {
      tempId: string;
      error: string;
    }) => {
      console.error("Error al enviar mensaje:", error);
      if (tempId) failMessage(tempId);
    };

    const handleTyping = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) setTyping(true);
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (userId !== user?.id) setTyping(false);
    };

    const handleMessagesRead = ({ chatId }: { chatId: string }) => {
      // El otro usuario leyó nuestros mensajes — podríamos actualizar ticks de lectura aquí
      console.log("Mensajes leídos en chat:", chatId);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_error", handleMessageError);
    socket.on("user_typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_error", handleMessageError);
      socket.off("user_typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("messages_read", handleMessagesRead);
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

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const socket = socketRef.current;
    if (!input.trim() || !activeChat || !user) return;

    const content = input.trim();
    const tempId = crypto.randomUUID();
    setInput("");

    // Añadir mensaje optimista
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
      // Fallback HTTP si el socket no está disponible
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const socket = socketRef.current;
    if (!socket?.connected || !activeChat || !user) return;

    socket.emit("typing", { chatId: activeChat, userId: user.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { chatId: activeChat, userId: user.id });
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-120">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-700">
        <button
          onClick={() => setActiveChat(null)}
          className="p-1 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          title="Volver"
        >
          <IoArrowBack
            className="text-lg"
            style={{ color: "rgb(238, 238, 255)" }}
          />
        </button>
        {otherUser?.avatar_url ? (
          <Image
            src={otherUser.avatar_url}
            alt={otherName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{
              backgroundColor: "rgb(62, 98, 89)",
              color: "rgb(238, 238, 255)",
            }}
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
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === user?.id;
          const isFailed = (msg as ChatMessage & { failed?: boolean }).failed;
          const isPending = msg.isPending;

          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  isOwn ? "rounded-br-sm" : "rounded-bl-sm"
                } ${isFailed ? "opacity-50" : isPending ? "opacity-70" : ""}`}
                style={{
                  backgroundColor: isOwn
                    ? "rgb(62, 98, 89)"
                    : "rgb(38, 38, 38)",
                  color: "rgb(238, 238, 255)",
                }}
              >
                <p className="wrap-break-words">{msg.content}</p>
                <div
                  className={`flex items-center gap-1 mt-1 ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className="text-[10px]"
                    style={{ color: "rgba(238, 238, 255, 0.5)" }}
                  >
                    {formatMessageTime(msg.created_at)}
                  </p>
                  {isOwn && isFailed && (
                    <IoAlertCircleOutline
                      className="text-red-400 text-xs"
                      title="Error al enviar"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicador de typing si no está ya en el header */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm outline-none placeholder-gray-500"
            style={{ color: "rgb(238, 238, 255)" }}
            maxLength={2000}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: "rgb(62, 98, 89)" }}
            title="Enviar"
          >
            <IoSend
              className="text-sm"
              style={{ color: "rgb(238, 238, 255)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
