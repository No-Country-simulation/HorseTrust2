"use client";

import { create } from "zustand";

interface ChatUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  // Sólo en mensajes optimistas (se elimina al confirmar con el servidor)
  tempId?: string;
  isPending?: boolean;
}

export interface ChatPreview {
  id: string;
  buyer: ChatUser;
  seller: ChatUser;
  is_active: boolean;
  created_at: string;
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

interface ChatState {
  isOpen: boolean;
  activeChat: string | null;
  selectedSellerId: string | null;
  chats: ChatPreview[];
  messages: ChatMessage[];
  isTyping: boolean;

  setOpen: (open: boolean) => void;
  toggleOpen: () => void;

  setSellerId: (sellerId: string | null) => void;
  clearSellerId: () => void;

  setActiveChat: (chatId: string | null) => void;
  setChats: (chats: ChatPreview[]) => void;
  addOrUpdateChat: (chat: ChatPreview) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  /** Reemplaza un mensaje optimista (tempId) por el definitivo del servidor */
  confirmMessage: (tempId: string, confirmed: ChatMessage) => void;
  /** Marca el mensaje optimista como fallido */
  failMessage: (tempId: string) => void;
  setTyping: (typing: boolean) => void;
  updateLastMessage: (chatId: string, message: ChatMessage) => void;
  markChatAsRead: (chatId: string) => void;
  incrementUnread: (chatId: string) => void;
  getTotalUnread: () => number;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  isOpen: false,
  activeChat: null,
  selectedSellerId: null,
  chats: [],
  messages: [],
  isTyping: false,

  setOpen: (open) => set({ isOpen: open }),

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),

  setSellerId: (sellerId) => set({ selectedSellerId: sellerId }),

  clearSellerId: () => set({ selectedSellerId: null }),

  setActiveChat: (chatId) =>
    set((s) => ({
      activeChat: chatId,
      messages: [],
      isTyping: false,
      // Limpiar unread al abrir
      chats: chatId
        ? s.chats.map((c) =>
            c.id === chatId ? { ...c, unreadCount: 0 } : c
          )
        : s.chats,
    })),

  setChats: (chats) =>
    set({
      chats: chats.map((c) => ({
        ...c,
        unreadCount: (c as ChatPreview).unreadCount ?? 0,
      })),
    }),

  addOrUpdateChat: (chat) =>
    set((s) => {
      const exists = s.chats.find((c) => c.id === chat.id);
      if (exists) {
        return {
          chats: s.chats.map((c) =>
            c.id === chat.id ? { ...c, ...chat } : c
          ),
        };
      }
      return { chats: [{ ...chat, unreadCount: 0 }, ...s.chats] };
    }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((s) => ({
      messages: [...s.messages, message],
    })),

  confirmMessage: (tempId, confirmed) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.tempId === tempId
          ? { ...confirmed, isPending: false }
          : m
      ),
    })),

  failMessage: (tempId) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.tempId === tempId ? { ...m, isPending: false, failed: true } : m
      ) as ChatMessage[],
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  updateLastMessage: (chatId, message) =>
    set((s) => ({
      chats: s.chats
        .map((c) =>
          c.id === chatId ? { ...c, lastMessage: message } : c
        )
        .sort((a, b) => {
          const dateA = a.lastMessage
            ? new Date(a.lastMessage.created_at).getTime()
            : new Date(a.created_at).getTime();
          const dateB = b.lastMessage
            ? new Date(b.lastMessage.created_at).getTime()
            : new Date(b.created_at).getTime();
          return dateB - dateA;
        }),
    })),

  markChatAsRead: (chatId) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ),
    })),

  incrementUnread: (chatId) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 } : c
      ),
    })),

  getTotalUnread: () =>
    get().chats.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
}));
