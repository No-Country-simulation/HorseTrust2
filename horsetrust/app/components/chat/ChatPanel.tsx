"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore, ChatPreview } from "@/store/chatStore";
import { useSession } from "@/store/authSession";
import ChatWindow from "./ChatWindow";
import Image from "next/image";

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  return `${Math.floor(diffH / 24)}d`;
}

function ChatItem({
  chat,
  currentUserId,
  onClick,
}: {
  chat: ChatPreview;
  currentUserId: string;
  onClick: () => void;
}) {
  const otherUser = chat.buyer.id === currentUserId ? chat.seller : chat.buyer;
  const name =
    [otherUser.first_name, otherUser.last_name].filter(Boolean).join(" ") ||
    "Usuario";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const unread = chat.unreadCount ?? 0;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-left cursor-pointer"
    >
      <div className="relative shrink-0">
        {otherUser.avatar_url ? (
          <Image
            src={otherUser.avatar_url}
            alt={name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: "rgb(62, 98, 89)", color: "rgb(238, 238, 255)" }}
          >
            {initials}
          </div>
        )}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm truncate ${unread > 0 ? "font-semibold" : "font-medium"}`}
            style={{ color: "rgb(238, 238, 255)" }}
          >
            {name}
          </span>
          {chat.lastMessage && (
            <span className="text-xs text-gray-400 shrink-0 ml-2">
              {formatTime(chat.lastMessage.created_at)}
            </span>
          )}
        </div>
        <p className={`text-xs truncate ${unread > 0 ? "text-gray-200 font-medium" : "text-gray-400"}`}>
          {chat.lastMessage?.content || "Sin mensajes"}
        </p>
      </div>
    </button>
  );
}

export default function ChatPanel() {
  const {
    activeChat,
    chats,
    setChats,
    setActiveChat,
    addOrUpdateChat,
    selectedSellerId,
    clearSellerId,
    getTotalUnread,
  } = useChatStore();
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handledSellerRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    fetch("/api/v1/chats")
      .then((res) => res.json())
      .then(async (res) => {
        if (!res.ok) {
          setError("No se pudieron cargar los chats");
          return;
        }

        const loadedChats: ChatPreview[] = res.data ?? [];
        setChats(loadedChats);

        // Si hay un sellerId pendiente, procesarlo ahora que ya tenemos los chats
        if (!selectedSellerId || handledSellerRef.current === selectedSellerId) return;
        handledSellerRef.current = selectedSellerId;

        // Buscar chat existente con ese vendedor
        const existing = loadedChats.find(
          (c) =>
            (c.buyer.id === user.id && c.seller.id === selectedSellerId) ||
            (c.seller.id === user.id && c.buyer.id === selectedSellerId)
        );

        if (existing) {
          setActiveChat(existing.id);
          clearSellerId();
          return;
        }

        // Crear nuevo chat
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
          } else {
            setError("No se pudo iniciar el chat");
          }
        } catch {
          setError("Error al conectar con el servidor");
        } finally {
          clearSellerId();
        }
      })
      .catch(() => setError("Error al cargar los chats"))
      .finally(() => setLoading(false));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedSellerId]);

  if (!user) return null;

  const totalUnread = getTotalUnread();

  return (
    <div
      className="fixed bottom-22 right-6 z-50 w-90 max-h-120 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden"
      style={{ backgroundColor: "rgb(17, 17, 17)" }}
    >
      {activeChat ? (
        <ChatWindow />
      ) : (
        <>
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: "rgb(238, 238, 255)" }}>
              Mensajes
            </h3>
            {totalUnread > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {totalUnread > 99 ? "99+" : totalUnread} sin leer
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {/* Estado: cargando */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">
                  {selectedSellerId ? "Abriendo chat..." : "Cargando mensajes..."}
                </p>
              </div>
            )}

            {/* Estado: error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-8 gap-2 px-4">
                <p className="text-red-400 text-sm text-center">{error}</p>
                <button
                  onClick={() => {
                    handledSellerRef.current = null;
                    setError(null);
                  }}
                  className="text-xs text-gray-400 underline cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Estado: sin chats */}
            {!loading && !error && chats.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">
                No tienes conversaciones aún
              </p>
            )}

            {/* Lista de chats */}
            {!loading && !error && chats.length > 0 &&
              chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  currentUserId={user.id}
                  onClick={() => setActiveChat(chat.id)}
                />
              ))
            }
          </div>
        </>
      )}
    </div>
  );
}
