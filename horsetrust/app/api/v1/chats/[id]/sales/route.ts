import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { Chat } from "@/lib/database/entities/Chat";
import { Sale } from "@/lib/database/entities/Sale";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
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

    const saleRepo = await getRepository(Sale);
    const sales = await saleRepo.find({
      where: [
        { seller_id: chat.seller_id, buyer_id: chat.buyer_id },
        { seller_id: chat.buyer_id, buyer_id: chat.seller_id },
      ],
      relations: ["horse", "reviews"],
      select: {
        id: true,
        price: true,
        completed_at: true,
        created_at: true,
        seller_id: true,
        buyer_id: true,
        horse_id: true,
        horse: {
          id: true,
          name: true,
          breed: true,
          price: true,
        },
        reviews: {
          id: true,
          rating: true,
          comment: true,
          buyer_id: true,
        },
      },
      order: { created_at: "DESC" },
    });

    return successResponse(sales, "Ventas del chat obtenidas correctamente");
  }
);
