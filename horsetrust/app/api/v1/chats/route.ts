import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { Chat } from "@/lib/database/entities/Chat";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";

const userSelect = {
  id: true,
  first_name: true,
  last_name: true,
  avatar_url: true,
};

export const GET = withErrorHandler(async () => {
  const authUser = await getAuthUser();
  if (!authUser) {
    return errorResponse({
      message: "No autorizado",
      code: "UNAUTHORIZED",
      statusCode: 401,
      name: "",
    });
  }

  const chatRepo = await getRepository(Chat);
  const chats = await chatRepo.find({
    where: [
      { buyer_id: authUser.userId },
      { seller_id: authUser.userId },
    ],
    relations: ["buyer", "seller", "messages"],
    order: { created_at: "DESC" },
  });

  const result = chats.map((chat) => {
    const sorted = chat.messages?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return {
      id: chat.id,
      buyer: {
        id: chat.buyer.id,
        first_name: chat.buyer.first_name,
        last_name: chat.buyer.last_name,
        avatar_url: chat.buyer.avatar_url,
      },
      seller: {
        id: chat.seller.id,
        first_name: chat.seller.first_name,
        last_name: chat.seller.last_name,
        avatar_url: chat.seller.avatar_url,
      },
      is_active: chat.is_active,
      created_at: chat.created_at,
      lastMessage: sorted?.[0] || null,
    };
  });

  // Sort by last message date
  result.sort((a, b) => {
    const dateA = a.lastMessage
      ? new Date(a.lastMessage.created_at).getTime()
      : new Date(a.created_at).getTime();
    const dateB = b.lastMessage
      ? new Date(b.lastMessage.created_at).getTime()
      : new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  return successResponse(result, "Chats obtenidos correctamente");
});

export const POST = withErrorHandler(async (req: Request) => {
  const authUser = await getAuthUser();
  if (!authUser) {
    return errorResponse({
      message: "No autorizado",
      code: "UNAUTHORIZED",
      statusCode: 401,
      name: "",
    });
  }

  const body = await req.json();
  const { sellerId } = body;

  if (!sellerId) {
    return errorResponse({
      message: "sellerId es requerido",
      code: "MISSING_SELLER_ID",
      statusCode: 400,
      name: "",
    });
  }

  if (sellerId === authUser.userId) {
    return errorResponse({
      message: "No puedes chatear contigo mismo",
      code: "SELF_CHAT",
      statusCode: 400,
      name: "",
    });
  }

  const chatRepo = await getRepository(Chat);

  // Check if chat already exists
  const existing = await chatRepo.findOne({
    where: {
      buyer_id: authUser.userId,
      seller_id: sellerId,
    },
    relations: ["buyer", "seller"],
    select: {
      id: true,
      buyer_id: true,
      seller_id: true,
      is_active: true,
      created_at: true,
      buyer: userSelect,
      seller: userSelect,
    },
  });

  if (existing) {
    return successResponse(existing, "Chat existente");
  }

  const chat = chatRepo.create({
    buyer_id: authUser.userId,
    seller_id: sellerId,
  });

  await chatRepo.save(chat);

  const saved = await chatRepo.findOne({
    where: { id: chat.id },
    relations: ["buyer", "seller"],
    select: {
      id: true,
      buyer_id: true,
      seller_id: true,
      is_active: true,
      created_at: true,
      buyer: userSelect,
      seller: userSelect,
    },
  });

  return successResponse(saved, "Chat creado correctamente", 201);
});
