import "dotenv/config";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { AppDataSource } from "./lib/database/data-source";
import { Chat } from "./lib/database/entities/Chat";
import { Message } from "./lib/database/entities/Message";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  await AppDataSource.initialize();

  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} se unió al chat: ${chatId}`);
    });

    socket.on(
      "send_message",
      async (data: { chatId: string; senderId: string; content: string; tempId?: string }) => {
        const { chatId, senderId, content, tempId } = data;

        if (!chatId || !senderId || !content?.trim()) {
          socket.emit("message_error", {
            tempId,
            error: "Datos incompletos",
          });
          return;
        }

        try {
          const chatRepo = AppDataSource.getRepository(Chat);
          const chat = await chatRepo.findOne({ where: { id: chatId } });

          // Verificar que el sender es miembro del chat
          if (!chat || (chat.buyer_id !== senderId && chat.seller_id !== senderId)) {
            socket.emit("message_error", {
              tempId,
              error: "No tienes acceso a este chat",
            });
            return;
          }

          if (!chat.is_active) {
            socket.emit("message_error", {
              tempId,
              error: "Este chat está inactivo",
            });
            return;
          }

          const messageRepo = AppDataSource.getRepository(Message);
          const message = messageRepo.create({
            chat_id: chatId,
            sender_id: senderId,
            content: content.trim(),
          });

          await messageRepo.save(message);

          // Emitir a todos en el chat incluyendo al sender, con tempId para reconciliar
          io.to(chatId).emit("new_message", { ...message, tempId });
        } catch (error) {
          console.error("Error al guardar mensaje:", error);
          socket.emit("message_error", {
            tempId,
            error: "Error interno del servidor",
          });
        }
      }
    );

    socket.on(
      "typing",
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        socket.to(chatId).emit("user_typing", { userId });
      }
    );

    socket.on(
      "stop_typing",
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        socket.to(chatId).emit("stop_typing", { userId });
      }
    );

    socket.on(
      "mark_read",
      async ({ chatId, userId }: { chatId: string; userId: string }) => {
        if (!chatId || !userId) return;

        try {
          const messageRepo = AppDataSource.getRepository(Message);
          await messageRepo
            .createQueryBuilder()
            .update(Message)
            .set({ read_at: new Date() })
            .where(
              "chat_id = :chatId AND sender_id != :userId AND read_at IS NULL",
              { chatId, userId }
            )
            .execute();

          // Notificar al otro usuario que sus mensajes fueron leídos
          socket.to(chatId).emit("messages_read", { chatId, readBy: userId });
        } catch (error) {
          console.error("Error al marcar mensajes como leídos:", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("🔴 Usuario desconectado:", socket.id);
    });
  });

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(port, () => {
    console.log(`🚀 Servidor listo en http://localhost:${port}`);
  });
});
