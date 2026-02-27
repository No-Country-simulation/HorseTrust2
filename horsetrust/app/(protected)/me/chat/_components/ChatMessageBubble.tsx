"use client";

import Image from "next/image";
import { IoAlertCircleOutline } from "react-icons/io5";
import type { ChatMessage } from "@/store/chatStore";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

const URL_REGEX = /https?:\/\/[^\s]+/g;
const IMAGE_URL_REGEX = /^https?:\/\/\S+\.(jpg|jpeg|png|webp)(\?.*)?$/i;

function isImageContent(content: string): boolean {
  const trimmed = content.trim();
  return IMAGE_URL_REGEX.test(trimmed) || /\/api\/v1\/uploads\//.test(trimmed);
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function renderContentWithLinks(content: string) {
  const parts = content.split(URL_REGEX);
  const urls = content.match(URL_REGEX);

  if (!urls) return <span>{content}</span>;

  return (
    <span>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {urls[i] && (
            <a
              href={urls[i]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "rgb(181, 186, 114)" }}
            >
              {urls[i].length > 40 ? urls[i].slice(0, 40) + "…" : urls[i]}
            </a>
          )}
        </span>
      ))}
    </span>
  );
}

export default function ChatMessageBubble({ message, isOwn }: ChatMessageBubbleProps) {
  const isFailed = message.isPending === false && !message.id;
  const isPending = message.isPending === true;

  const bubbleClasses = [
    "max-w-[70%] px-3 py-2 rounded-2xl",
    isOwn ? "rounded-br-sm" : "rounded-bl-sm",
    isPending ? "opacity-70" : "",
    isFailed ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageContent = isImageContent(message.content);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={bubbleClasses}
        style={{
          backgroundColor: isOwn ? "rgb(62, 98, 89)" : "rgb(38, 38, 38)",
          color: "rgb(238, 238, 255)",
        }}
      >
        {imageContent ? (
          <a
            href={message.content.trim()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={message.content.trim()}
              alt="Imagen compartida"
              width={250}
              height={250}
              className="rounded-lg object-cover"
              style={{ maxWidth: 250 }}
            />
          </a>
        ) : (
          <p className="text-sm break-words">
            {renderContentWithLinks(message.content)}
          </p>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] opacity-60">
            {formatTime(message.created_at)}
          </span>
          {isFailed && (
            <IoAlertCircleOutline className="text-red-400 text-xs" />
          )}
        </div>
      </div>
    </div>
  );
}
