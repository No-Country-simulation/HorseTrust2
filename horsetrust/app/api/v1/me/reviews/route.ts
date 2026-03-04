import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Review } from "@/lib/database/entities/Review"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"

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

    const repo = await getRepository(Review)
    const reviews = await repo.find({
        where: { seller_id: authUser.userId },
        relations: {
            buyer: true,
            sale: true,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            created_at: true,
            buyer: {
                id: true,
                first_name: true,
                last_name: true,
                avatar_url: true,
            },
            sale: {
                id: true,
            },
        },
        order: { created_at: "DESC" },
    })

    return successResponse(reviews, "Mis reseñas recibidas obtenidas correctamente", 200)
})
