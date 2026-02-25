import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { Chat } from "@/lib/database/entities/Chat";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest } from "next/server";

export const DELETE = withErrorHandler(
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

    await chatRepo.remove(chat);

    return successResponse(null, "Chat eliminado correctamente");
  }
);
