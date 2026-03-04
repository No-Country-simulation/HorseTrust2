import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Document } from "@/lib/database/entities/Document"
import { TypeDocument } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

interface RouteContext {
    params: Promise<{
        videoId: string
    }>
}

// GET /api/v1/admin/videos/[videoId]
export const GET = withErrorHandler(async (
    _req: NextRequest,
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

    const repo = await getRepository(Document)
    const video = await repo.findOne({
        where: { id: videoId, type: TypeDocument.video },
        relations: ["horse", "user"],
        select: {
            id: true,
            url: true,
            public_id: true,
            type: true,
            category: true,
            purpose: true,
            verified: true,
            reason: true,
            created_at: true,
            updated_at: true,
            horse: {
                id: true,
                name: true,
                breed: true,
                age: true,
                verification_status: true,
            },
            user: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
            },
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

    return successResponse(video, "Detalle del video obtenido correctamente")
})
