import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Review } from "@/lib/database/entities/Review"
import { User } from "@/lib/database/entities/User"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { IsNull } from "typeorm"
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

export const POST = withErrorHandler(async (req: NextRequest, context: RouteContext) => {
    const authUser = await getAuthUser()
    if (!authUser) {
        return errorResponse({
            message: "No autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: "",
        })
    }

    const { id: sellerId } = await context.params

    if (sellerId === authUser.userId) {
        return errorResponse({
            message: "No puedes dejar una reseña sobre ti mismo",
            code: "SELF_REVIEW",
            statusCode: 400,
            name: "",
        })
    }

    const userRepo = await getRepository(User)
    const seller = await userRepo.findOne({ where: { id: sellerId } })

    if (!seller) {
        return errorResponse({
            message: "Vendedor no encontrado",
            code: "USER_NOT_FOUND",
            statusCode: 404,
            name: "",
        })
    }

    const body = await req.json()
    const { rating, comment } = body

    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return errorResponse({
            message: "La calificación debe ser un entero entre 1 y 5",
            code: "INVALID_RATING",
            statusCode: 400,
            name: "",
        })
    }

    const reviewRepo = await getRepository(Review)

    const existingReview = await reviewRepo.findOne({
        where: { seller_id: sellerId, buyer_id: authUser.userId, sale_id: IsNull() },
    })

    if (existingReview) {
        return errorResponse({
            message: "Ya has dejado una reseña directa para este vendedor",
            code: "REVIEW_ALREADY_EXISTS",
            statusCode: 400,
            name: "",
        })
    }

    const review = reviewRepo.create({
        sale_id: null,
        seller_id: sellerId,
        buyer_id: authUser.userId,
        rating,
        comment: comment ?? null,
    })

    await reviewRepo.save(review)

    const allReviews = await reviewRepo.find({
        where: { seller_id: sellerId },
        select: { rating: true },
    })

    const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    seller.average_rating = parseFloat(avgRating.toFixed(2))
    seller.total_reviews = allReviews.length

    await userRepo.save(seller)

    return successResponse(review, "Reseña creada correctamente", 201)
})
