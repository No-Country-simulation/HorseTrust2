import { Review } from "@/lib/database/entities/Review"
import { getRepository } from "@/lib/database/get-repository"
import { successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

interface RouteContext {
    params: Promise<{ id: string }>
}

export const GET = withErrorHandler(async (_req: NextRequest, context: RouteContext) => {

    const { id } = await context.params

    const repo = await getRepository(Review)
    const reviews = await repo.find({
        where: { seller_id: id },
        relations: {
            buyer: true,
            sale: { horse: true },
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
                horse: {
                    id: true,
                    name: true,
                },
            },
        },
        order: { created_at: "DESC" },
    })

    return successResponse(reviews, "Reseñas del vendedor obtenidas correctamente", 200)
})
