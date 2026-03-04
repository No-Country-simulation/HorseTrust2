import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Chat } from "@/lib/database/entities/Chat"
import { Document } from "@/lib/database/entities/Document"
import { Message } from "@/lib/database/entities/Message"
import { TypeDocument, VerificationStatus } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

interface RouteContext {
    params: Promise<{
        videoId: string
    }>
}

const ALLOWED_STATUSES = [VerificationStatus.verified, VerificationStatus.rejected] as string[]

// PATCH /api/v1/admin/videos/[videoId]/review
export const PATCH = withErrorHandler(async (
    req: NextRequest,
    context: RouteContext
) => {
    const authUser = await getAuthUser()

    if (!authUser || authUser.role !== "admin") {
        return errorResponse({
            message: "No autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: ""
        })
    }

    const { videoId } = await context.params

    if (!videoId) {
        return errorResponse({
            message: "ID del video no proporcionado",
            code: "MISSING_VIDEO_ID",
            statusCode: 400,
            name: ""
        })
    }

    const body = await req.json()
    const { status, reason } = body

    if (!status) {
        return errorResponse({
            message: "Debe enviar el nuevo estado (status) en el body",
            code: "MISSING_STATUS",
            statusCode: 400,
            name: ""
        })
    }

    if (!ALLOWED_STATUSES.includes(status)) {
        return errorResponse({
            message: `Estado inválido. Valores permitidos: ${ALLOWED_STATUSES.join(", ")}`,
            code: "INVALID_STATUS",
            statusCode: 400,
            name: ""
        })
    }

    if (status === VerificationStatus.rejected && !reason) {
        return errorResponse({
            message: "Debe proporcionar un motivo (reason) al rechazar un video",
            code: "MISSING_REASON",
            statusCode: 400,
            name: ""
        })
    }

    const repo = await getRepository(Document)
    const video = await repo.findOne({
        where: { id: videoId, type: TypeDocument.video },
        relations: ["user", "horse"],
        select: {
            id: true,
            verified: true,
            reason: true,
            user: { id: true, first_name: true },
            horse: { id: true, name: true },
        },
    })

    if (!video) {
        return errorResponse({
            message: "Video no encontrado",
            code: "VIDEO_NOT_FOUND",
            statusCode: 404,
            name: ""
        })
    }

    if (status === VerificationStatus.verified) {
        video.verified = true
        video.reason = null
    } else {
        video.verified = false
        video.reason = reason
    }

    await repo.save(video)

    // Notificar al vendedor vía chat si fue rechazado
    const sellerId = video.user?.id
    if (status === VerificationStatus.rejected && sellerId && authUser) {
        try {
            await sendVideoReviewNotification(
                authUser.userId,
                sellerId,
                video.horse?.name ?? "Sin nombre",
                reason
            )
        } catch (err) {
            console.error("Error al enviar notificación al vendedor:", err)
        }
    }

    return successResponse(
        {
            id: video.id,
            verified: video.verified,
            reason: video.reason,
        },
        status === VerificationStatus.verified
            ? "Video verificado correctamente"
            : "Video rechazado correctamente"
    )
})

async function sendVideoReviewNotification(
    adminId: string,
    sellerId: string,
    horseName: string,
    reason: string
) {
    const chatRepo = await getRepository(Chat)

    let chat = await chatRepo.findOne({
        where: [
            { buyer_id: adminId, seller_id: sellerId },
            { buyer_id: sellerId, seller_id: adminId },
        ],
    })

    if (!chat) {
        chat = chatRepo.create({
            buyer_id: adminId,
            seller_id: sellerId,
        })
        await chatRepo.save(chat)
    }

    const content = `🔔 Video Rechazado\n\nEl video de tu caballo "${horseName}" ha sido rechazado.\n\nMotivo: ${reason}\n\nPor favor, sube un nuevo video que cumpla con los requisitos.`

    const messageRepo = await getRepository(Message)
    const message = messageRepo.create({
        chat_id: chat.id,
        sender_id: adminId,
        content,
    })
    await messageRepo.save(message)
}
