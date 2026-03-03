import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Chat } from "@/lib/database/entities/Chat"
import { Horse } from "@/lib/database/entities/Horse"
import { Message } from "@/lib/database/entities/Message"
import { VerificationStatus } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { validateEnumOrError } from "@/lib/errors/validate-enum"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

interface RouteContext {
    params: Promise<{
        id: string
    }>
}

function requireAdmin(user: { role: string } | null) {
    if (!user || user.role !== "admin") {
        return errorResponse({
            message: "Acceso no autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: ""
        })
    }
}

const STATUS_LABELS: Record<string, string> = {
    [VerificationStatus.pending]: "Pendiente",
    [VerificationStatus.verified]: "Verificado ✅",
    [VerificationStatus.rejected]: "Rechazado ❌",
}

// GET /api/v1/admin/horses/[id]
// Ver detalle completo del caballo con info del vendedor, documentos y ventas
export const GET = withErrorHandler(async (
    _req: NextRequest,
    context: RouteContext
) => {
    const user = await getAuthUser()
    const denied = requireAdmin(user)
    if (denied) return denied

    const { id } = await context.params
    if (!id) {
        return errorResponse({
            message: "ID del caballo no proporcionado",
            code: "MISSING_HORSE_ID",
            statusCode: 400,
            name: ""
        })
    }

    const repo = await getRepository(Horse)
    const horse = await repo.findOne({
        where: { id },
        relations: ["owner", "documents", "sales"],
        select: {
            id: true,
            name: true,
            age: true,
            breed: true,
            discipline: true,
            sex: true,
            price: true,
            sale_status: true,
            verification_status: true,
            created_at: true,
            updated_at: true,
            documents: {
                id: true,
                url: true,
                type: true,
                category: true,
                purpose: true,
                verified: true,
                created_at: true,
            },
            sales: {
                id: true,
                price: true,
                completed_at: true,
                created_at: true,
            },
            owner: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                avatar_url: true,
                average_rating: true,
                total_sales: true,
                seller_level: true,
            },
        }
    })

    if (!horse) {
        return errorResponse({
            message: "Caballo no encontrado",
            code: "HORSE_NOT_FOUND",
            statusCode: 404,
            name: ""
        })
    }

    return successResponse(horse, "Detalle del caballo obtenido correctamente")
})

// PUT /api/v1/admin/horses/[id]
// Cambiar status de verificación y enviar mensaje automático al vendedor
export const PUT = withErrorHandler(async (
    req: NextRequest,
    context: RouteContext
) => {
    const user = await getAuthUser()
    const denied = requireAdmin(user)
    if (denied) return denied

    const { id } = await context.params
    if (!id) {
        return errorResponse({
            message: "ID del caballo no proporcionado",
            code: "MISSING_HORSE_ID",
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

    const enumError = validateEnumOrError(VerificationStatus, status, "Estado de verificación", "INVALID_VERIFICATION_STATUS")
    if (enumError) return enumError

    const repo = await getRepository(Horse)
    const horse = await repo.findOne({
        where: { id },
        relations: ["owner"],
        select: {
            id: true,
            name: true,
            verification_status: true,
            owner: { id: true, first_name: true },
        },
    })

    if (!horse) {
        return errorResponse({
            message: "Caballo no encontrado",
            code: "HORSE_NOT_FOUND",
            statusCode: 404,
            name: ""
        })
    }

    const previousStatus = horse.verification_status
    if (previousStatus === status) {
        return errorResponse({
            message: `El caballo ya se encuentra en estado "${status}"`,
            code: "SAME_STATUS",
            statusCode: 400,
            name: ""
        })
    }

    // Actualizar status
    horse.verification_status = status
    await repo.save(horse)

    // Enviar mensaje automático al vendedor vía chat
    const sellerId = horse.owner?.id
    if (sellerId && user) {
        try {
            await sendStatusNotification(
                user.userId,
                sellerId,
                horse.name,
                status,
                reason
            )
        } catch (err) {
            console.error("Error al enviar notificación al vendedor:", err)
        }
    }

    return successResponse(
        {
            id: horse.id,
            name: horse.name,
            previous_status: previousStatus,
            verification_status: horse.verification_status,
        },
        "Estado actualizado correctamente"
    )
})

/**
 * Busca o crea un chat entre el admin y el vendedor,
 * y envía un mensaje automático informando el cambio de status.
 */
async function sendStatusNotification(
    adminId: string,
    sellerId: string,
    horseName: string,
    newStatus: string,
    reason?: string
) {
    const chatRepo = await getRepository(Chat)

    // Buscar chat existente entre admin y vendedor (en cualquier dirección)
    let chat = await chatRepo.findOne({
        where: [
            { buyer_id: adminId, seller_id: sellerId },
            { buyer_id: sellerId, seller_id: adminId },
        ],
    })

    // Si no existe, crear uno nuevo
    if (!chat) {
        chat = chatRepo.create({
            buyer_id: adminId,
            seller_id: sellerId,
        })
        await chatRepo.save(chat)
    }

    // Construir mensaje automático
    const statusLabel = STATUS_LABELS[newStatus] || newStatus
    let content = `🔔 Actualización de verificación\n\nTu caballo "${horseName}" ha cambiado de estado a: ${statusLabel}.`

    if (newStatus === VerificationStatus.verified) {
        content += "\n\n¡Felicidades! Tu caballo ya está verificado y visible para los compradores."
    } else if (newStatus === VerificationStatus.rejected) {
        content += "\n\nPor favor, revisa la documentación y vuelve a subir los archivos necesarios."
        if (reason) {
            content += `\n\nMotivo: ${reason}`
        }
    } else if (newStatus === VerificationStatus.pending) {
        content += "\n\nTu caballo está en revisión nuevamente."
    }

    const messageRepo = await getRepository(Message)
    const message = messageRepo.create({
        chat_id: chat.id,
        sender_id: adminId,
        content,
    })
    await messageRepo.save(message)
}
