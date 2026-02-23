// Listar de todos los caballos sin aprobar

import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Horse } from "@/lib/database/entities/Horse"
import { VerificationStatus } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"



export const GET = withErrorHandler(async () => {
    const authUser = await getAuthUser()

    if (!authUser || authUser.role !== "admin") {
        return errorResponse({
            message: "No autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: ""
        })
    }

    const repo = await getRepository(Horse)
    const horses = await repo.find({

        where: { verification_status: VerificationStatus.pending },
        select: {
            id: true,
            name: true,
            breed: true,
            age: true,
            discipline: true,
            verification_status: true
        },
        order: { created_at: "DESC" },
    })

    return new Response(JSON.stringify({
        success: true,
        message: "Listado de caballos sin aprobar obtenido correctamente",
        data: horses
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
})
