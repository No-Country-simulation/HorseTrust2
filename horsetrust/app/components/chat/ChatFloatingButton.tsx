"use client";

import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useChatStore } from "@/store/chatStore";
import { useSession } from "@/store/authSession";
import ChatPanel from "./ChatPanel";

export default function ChatFloatingButton() {
  const { isOpen, toggleOpen, getTotalUnread } = useChatStore();
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) return null;

  const totalUnread = getTotalUnread();

  return (
    <>
      {isOpen && <ChatPanel />}

      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        style={{ backgroundColor: "rgb(62, 98, 89)" }}
        title={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <IoClose
            className="text-2xl"
            style={{ color: "rgb(238, 238, 255)" }}
          />
        ) : (
          <>
            <IoChatbubbleEllipsesOutline
              className="text-2xl"
              style={{ color: "rgb(238, 238, 255)" }}
            />
            {totalUnread > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 translate-x-1 -translate-y-1">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
