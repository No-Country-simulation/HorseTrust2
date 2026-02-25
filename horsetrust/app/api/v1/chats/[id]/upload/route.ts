import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { Chat } from "@/lib/database/entities/Chat";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest } from "next/server";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorResponse({
        message: "El archivo es requerido",
        code: "MISSING_FILE",
        statusCode: 400,
        name: "",
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse({
        message: "El archivo no debe superar los 5MB",
        code: "FILE_TOO_LARGE",
        statusCode: 400,
        name: "",
      });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return errorResponse({
        message: "Solo se permiten imágenes (jpeg, png, webp)",
        code: "INVALID_FILE_TYPE",
        statusCode: 400,
        name: "",
      });
    }

    const fileName = `${randomUUID()}.${ext}`;
    const relativePath = join("chats", chatId, fileName);
    const uploadDir = join(process.cwd(), "public", "uploads", "chats", chatId);

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, fileName), buffer);

    const url = `/api/v1/uploads/${relativePath.replace(/\\/g, "/")}`;

    return successResponse({ url }, "Archivo subido correctamente", 201);
  }
);
