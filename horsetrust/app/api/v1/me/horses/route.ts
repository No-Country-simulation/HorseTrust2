import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Horse } from "@/lib/database/entities/Horse"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"

// ver mis caballos
export const GET = withErrorHandler(async () => {

    const authUser = await getAuthUser()
    if (!authUser) {
        return errorResponse({
            message: "No autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: ""
        })
    }

    const repo = await getRepository(Horse)
    const horses = await repo.find({
        where: { owner: { id: authUser.userId } },
        select: {
            id: true,
            age: true,
            breed: true,
            sales: true,
            updated_at: true,
            sex: true,
            created_at: true,
            documents: true,
            verification_status: true,
            discipline: true,
            name: true,
            sale_status: true,
            price: true,
        },
        order: { created_at: "DESC" },
    })
    return successResponse(horses, "Listado de mis caballos obtenido correctamente", 200)
})
