import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { Review } from "@/lib/database/entities/Review";
import { Sale } from "@/lib/database/entities/Sale";
import { User } from "@/lib/database/entities/User";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest } from "next/server";

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

    const { id: saleId } = await params;

    const saleRepo = await getRepository(Sale);
    const sale = await saleRepo.findOne({
      where: { id: saleId },
    });

    if (!sale) {
      return errorResponse({
        message: "Venta no encontrada",
        code: "SALE_NOT_FOUND",
        statusCode: 404,
        name: "",
      });
    }

    if (sale.buyer_id !== authUser.userId) {
      return errorResponse({
        message: "Solo el comprador puede dejar una reseña",
        code: "FORBIDDEN",
        statusCode: 403,
        name: "",
      });
    }

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return errorResponse({
        message: "La calificación debe ser un entero entre 1 y 5",
        code: "INVALID_RATING",
        statusCode: 400,
        name: "",
      });
    }

    const reviewRepo = await getRepository(Review);

    const existingReview = await reviewRepo.findOne({
      where: { sale_id: saleId, buyer_id: authUser.userId },
    });

    if (existingReview) {
      return errorResponse({
        message: "Ya has dejado una reseña para esta venta",
        code: "REVIEW_ALREADY_EXISTS",
        statusCode: 400,
        name: "",
      });
    }

    const review = reviewRepo.create({
      sale_id: saleId,
      seller_id: sale.seller_id,
      buyer_id: authUser.userId,
      rating,
      comment: comment ?? null,
    });

    await reviewRepo.save(review);

    const userRepo = await getRepository(User);
    const seller = await userRepo.findOne({
      where: { id: sale.seller_id },
    });

    if (seller) {
      const allReviews = await reviewRepo.find({
        where: { seller_id: sale.seller_id },
        select: { rating: true },
      });

      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      seller.average_rating = parseFloat(avgRating.toFixed(2));
      seller.total_reviews = allReviews.length;

      await userRepo.save(seller);
    }

    return successResponse(review, "Reseña creada correctamente", 201);
  }
);
