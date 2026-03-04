import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Review } from "@/lib/database/entities/Review"
import { User } from "@/lib/database/entities/User"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

interface RouteContext {
  params: Promise<{ id: string }>
}

export const PATCH = withErrorHandler(async (
  req: NextRequest,
  { params }: RouteContext
) => {
  const authUser = await getAuthUser()
  if (!authUser) {
    return errorResponse({
      message: "No autorizado",
      code: "UNAUTHORIZED",
      statusCode: 401,
      name: "",
    })
  }

  const { id } = await params

  const reviewRepo = await getRepository(Review)
  const review = await reviewRepo.findOne({
    where: { id },
  })

  if (!review) {
    return errorResponse({
      message: "Reseña no encontrada",
      code: "REVIEW_NOT_FOUND",
      statusCode: 404,
      name: "",
    })
  }

  if (review.buyer_id !== authUser.userId) {
    return errorResponse({
      message: "Solo puedes editar tus propias reseñas",
      code: "FORBIDDEN",
      statusCode: 403,
      name: "",
    })
  }

  const body = await req.json()
  const { rating, comment } = body

  if (rating !== undefined) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return errorResponse({
        message: "La calificación debe ser un entero entre 1 y 5",
        code: "INVALID_RATING",
        statusCode: 400,
        name: "",
      })
    }
    review.rating = rating
  }

  if (comment !== undefined) {
    review.comment = comment
  }

  await reviewRepo.save(review)

  const userRepo = await getRepository(User)
  const seller = await userRepo.findOne({
    where: { id: review.seller_id },
  })

  if (seller) {
    const allReviews = await reviewRepo.find({
      where: { seller_id: review.seller_id },
      select: { rating: true },
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    seller.average_rating = parseFloat(avgRating.toFixed(2))
    seller.total_reviews = allReviews.length

    await userRepo.save(seller)
  }

  return successResponse(review, "Reseña actualizada correctamente", 200)
})

export const DELETE = withErrorHandler(async (
  _req: NextRequest,
  { params }: RouteContext
) => {
  const authUser = await getAuthUser()
  if (!authUser) {
    return errorResponse({
      message: "No autorizado",
      code: "UNAUTHORIZED",
      statusCode: 401,
      name: "",
    })
  }

  const { id } = await params

  const reviewRepo = await getRepository(Review)
  const review = await reviewRepo.findOne({
    where: { id },
  })

  if (!review) {
    return errorResponse({
      message: "Reseña no encontrada",
      code: "REVIEW_NOT_FOUND",
      statusCode: 404,
      name: "",
    })
  }

  if (review.buyer_id !== authUser.userId) {
    return errorResponse({
      message: "Solo puedes eliminar tus propias reseñas",
      code: "FORBIDDEN",
      statusCode: 403,
      name: "",
    })
  }

  const sellerId = review.seller_id

  await reviewRepo.remove(review)

  const userRepo = await getRepository(User)
  const seller = await userRepo.findOne({
    where: { id: sellerId },
  })

  if (seller) {
    const allReviews = await reviewRepo.find({
      where: { seller_id: sellerId },
      select: { rating: true },
    })

    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      seller.average_rating = parseFloat(avgRating.toFixed(2))
      seller.total_reviews = allReviews.length
    } else {
      seller.average_rating = null as unknown as number
      seller.total_reviews = 0
    }

    await userRepo.save(seller)
  }

  return successResponse(null, "Reseña eliminada correctamente", 200)
})
