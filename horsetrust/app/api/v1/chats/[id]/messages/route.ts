import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { Chat } from "@/lib/database/entities/Chat";
import { Message } from "@/lib/database/entities/Message";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const authUser = await getAuthUser();
    if (!authUser) {
      return errorResponse({
        message: "No autorizado",
        code: "UNAUTHORIZED",
        statusCode: 401,
        name: "",
      });
    }

    const { id: chatId } = await params;

    const chatRepo = await getRepository(Chat);
    const chat = await chatRepo.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      return errorResponse({
        message: "Chat no encontrado",
        code: "CHAT_NOT_FOUND",
        statusCode: 404,
        name: "",
      });
    }

    if (
      chat.buyer_id !== authUser.userId &&
      chat.seller_id !== authUser.userId
    ) {
      return errorResponse({
        message: "No tienes acceso a este chat",
        code: "FORBIDDEN",
        statusCode: 403,
        name: "",
      });
    }

    const messageRepo = await getRepository(Message);
    const messages = await messageRepo.find({
      where: { chat_id: chatId },
      order: { created_at: "ASC" },
    });

    // Marcar como leídos los mensajes del otro usuario
    await messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ read_at: new Date() })
      .where(
        "chat_id = :chatId AND sender_id != :userId AND read_at IS NULL",
        { chatId, userId: authUser.userId }
      )
      .execute();

    return successResponse(messages, "Mensajes obtenidos correctamente");
  }
);

export const POST = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const authUser = await getAuthUser();
    if (!authUser) {
      return errorResponse({
        message: "No autorizado",
        code: "UNAUTHORIZED",
        statusCode: 401,
        name: "",
      });
    }

    const { id: chatId } = await params;

    const chatRepo = await getRepository(Chat);
    const chat = await chatRepo.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      return errorResponse({
        message: "Chat no encontrado",
        code: "CHAT_NOT_FOUND",
        statusCode: 404,
        name: "",
      });
    }

    if (
      chat.buyer_id !== authUser.userId &&
      chat.seller_id !== authUser.userId
    ) {
      return errorResponse({
        message: "No tienes acceso a este chat",
        code: "FORBIDDEN",
        statusCode: 403,
        name: "",
      });
    }

    if (!chat.is_active) {
      return errorResponse({
        message: "Este chat está inactivo",
        code: "CHAT_INACTIVE",
        statusCode: 400,
        name: "",
      });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return errorResponse({
        message: "El contenido del mensaje es requerido",
        code: "MISSING_CONTENT",
        statusCode: 400,
        name: "",
      });
    }

    const messageRepo = await getRepository(Message);
    const message = messageRepo.create({
      chat_id: chatId,
      sender_id: authUser.userId,
      content: content.trim(),
    });

    await messageRepo.save(message);

    return successResponse(message, "Mensaje enviado correctamente", 201);
  }
);
