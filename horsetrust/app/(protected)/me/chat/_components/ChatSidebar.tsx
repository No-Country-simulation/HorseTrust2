"use client";

import { useState } from "react";
import { IoSearchOutline, IoTrashOutline } from "react-icons/io5";
import { useChatStore, ChatPreview } from "@/store/chatStore";
import { useSession } from "@/store/authSession";
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

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  activeChatId: string | null;
}

export default function ChatSidebar({ onSelectChat, activeChatId }: ChatSidebarProps) {
  const { chats, setChats, getTotalUnread } = useChatStore();
  const { user } = useSession();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalUnread = getTotalUnread();

  const filteredChats = chats.filter((chat) => {
    if (!search.trim()) return true;
    const other = chat.buyer.id === user?.id ? chat.seller : chat.buyer;
    const name = [other.first_name, other.last_name].filter(Boolean).join(" ").toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta conversación? Se perderán todos los mensajes.")) return;

    setDeletingId(chatId);
    try {
      const res = await fetch(`/api/v1/chats/${chatId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setChats(chats.filter((c) => c.id !== chatId));
        if (activeChatId === chatId) onSelectChat("");
      }
    } catch {
      console.error("Error al eliminar chat");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="flex flex-col h-full border-r border-gray-800"
      style={{ backgroundColor: "rgb(17, 17, 17)" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg font-semibold fontMontserrat"
            style={{ color: "rgb(238, 238, 255)" }}
          >
            Mensajes
          </h2>
          {totalUnread > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearchOutline
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conversación..."
            className="w-full bg-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm outline-none placeholder-gray-500"
            style={{ color: "rgb(238, 238, 255)" }}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">
            {search ? "Sin resultados" : "No tienes conversaciones aún"}
          </p>
        )}

        {filteredChats.map((chat) => (
          <ChatSidebarItem
            key={chat.id}
            chat={chat}
            currentUserId={user?.id ?? ""}
            isActive={chat.id === activeChatId}
            isDeleting={chat.id === deletingId}
            onClick={() => onSelectChat(chat.id)}
            onDelete={(e) => handleDelete(e, chat.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ChatSidebarItem({
  chat,
  currentUserId,
  isActive,
  isDeleting,
  onClick,
  onDelete,
}: {
  chat: ChatPreview;
  currentUserId: string;
  isActive: boolean;
  isDeleting: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
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
      disabled={isDeleting}
      className={`group w-full flex items-center gap-3 px-4 py-3 transition-colors text-left cursor-pointer ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800/60"
      } ${isDeleting ? "opacity-50" : ""}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {otherUser.avatar_url ? (
          <Image
            src={otherUser.avatar_url}
            alt={name}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold"
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

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm truncate ${unread > 0 ? "font-semibold" : "font-medium"}`}
            style={{ color: "rgb(238, 238, 255)" }}
          >
            {name}
          </span>
          {chat.lastMessage && (
            <span className="text-xs text-gray-500 shrink-0 ml-2">
              {formatTime(chat.lastMessage.created_at)}
            </span>
          )}
        </div>
        <p className={`text-xs truncate ${unread > 0 ? "text-gray-300 font-medium" : "text-gray-500"}`}>
          {chat.lastMessage?.content
            ? chat.lastMessage.content.startsWith("/api/v1/uploads/")
              ? "📷 Imagen"
              : chat.lastMessage.content
            : "Sin mensajes"}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer shrink-0"
        title="Eliminar conversación"
      >
        <IoTrashOutline className="text-red-400 text-sm" />
      </button>
    </button>
  );
}
