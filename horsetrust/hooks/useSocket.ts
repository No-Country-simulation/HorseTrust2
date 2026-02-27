"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Singleton de socket — una sola conexión para toda la app
let globalSocket: Socket | null = null;

function getSocket(): Socket {
  if (!globalSocket || !globalSocket.connected) {
    globalSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin,
      {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    globalSocket.on("connect", () => {
      console.log("🟢 Socket conectado:", globalSocket?.id);
    });

    globalSocket.on("connect_error", (error) => {
      console.error("🔴 Error de conexión socket:", error.message);
    });

    globalSocket.on("disconnect", (reason) => {
      console.warn("🟡 Socket desconectado:", reason);
    });
  }

  return globalSocket;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();

    return () => {
      // No desconectar el singleton al desmontar — se reutiliza
    };
  }, []);

  return socketRef;
}
