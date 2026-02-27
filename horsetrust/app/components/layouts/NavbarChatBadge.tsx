"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "@/store/authSession";
import { useEffect } from "react";

interface NavbarChatBadgeProps {
  stylesNavItems: string;
}

export default function NavbarChatBadge({ stylesNavItems }: NavbarChatBadgeProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useSession();
  const { getTotalUnread, setChats } = useChatStore();

  // Load chats to get unread count
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/v1/chats")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) setChats(res.data ?? []);
      })
      .catch(console.error);
  }, [isAuthenticated, setChats]);

  if (!isAuthenticated) return null;

  const totalUnread = getTotalUnread();
  const isActive = pathname.startsWith("/me/chat");

  return (
    <li>
      <Link
        href="/me/chat"
        className={`${stylesNavItems} relative flex items-center gap-1 ${
          isActive ? "text-[rgb(var(--color-gold))]" : ""
        }`}
        title="Mensajes"
      >
        <IoChatbubbleEllipsesOutline className="text-base" />
        <span>Chat</span>
        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-3 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
        <span
          className={`absolute bottom-[-5px] left-0 h-[1px] bg-[rgb(var(--color-gold))] transition-all duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    </li>
  );
}
