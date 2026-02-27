import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { Horse } from "@/lib/database/entities/Horse";
import { Sale } from "@/lib/database/entities/Sale";
import { User } from "@/lib/database/entities/User";
import { HorseSaleStatus, SellerLevel } from "@/lib/database/enums";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const authUser = await getAuthUser();
  if (!authUser) {
    return errorResponse({
      message: "No autorizado",
      code: "UNAUTHORIZED",
      statusCode: 401,
      name: "",
    });
  }

  const body = await req.json();
  const { horseId, buyerId, price } = body;

  if (!horseId || !buyerId || price == null) {
    return errorResponse({
      message: "Faltan campos requeridos: horseId, buyerId, price",
      code: "MISSING_FIELDS",
      statusCode: 400,
      name: "",
    });
  }

  if (buyerId === authUser.userId) {
    return errorResponse({
      message: "El comprador no puede ser el mismo que el vendedor",
      code: "BUYER_IS_SELLER",
      statusCode: 400,
      name: "",
    });
  }

  const horseRepo = await getRepository(Horse);
  const horse = await horseRepo.findOne({
    where: { id: horseId },
    relations: ["owner"],
    select: {
      id: true,
      sale_status: true,
      owner: { id: true },
    },
  });

  if (!horse) {
    return errorResponse({
      message: "Caballo no encontrado",
      code: "HORSE_NOT_FOUND",
      statusCode: 404,
      name: "",
    });
  }

  if (horse.owner?.id !== authUser.userId) {
    return errorResponse({
      message: "No autorizado para vender este caballo",
      code: "FORBIDDEN",
      statusCode: 403,
      name: "",
    });
  }

  if (horse.sale_status === HorseSaleStatus.sold) {
    return errorResponse({
      message: "Este caballo ya ha sido vendido",
      code: "HORSE_ALREADY_SOLD",
      statusCode: 400,
      name: "",
    });
  }

  const saleRepo = await getRepository(Sale);
  const sale = saleRepo.create({
    horse_id: horseId,
    seller_id: authUser.userId,
    buyer_id: buyerId,
    price,
    completed_at: new Date(),
  });

  await saleRepo.save(sale);

  horse.sale_status = HorseSaleStatus.sold;
  await horseRepo.save(horse);

  const userRepo = await getRepository(User);
  const seller = await userRepo.findOne({
    where: { id: authUser.userId },
  });

  if (seller) {
    seller.total_sales += 1;

    if (seller.total_sales >= 15) {
      seller.seller_level = SellerLevel.gold;
    } else if (seller.total_sales >= 5) {
      seller.seller_level = SellerLevel.silver;
    } else {
      seller.seller_level = SellerLevel.bronze;
    }

    await userRepo.save(seller);
  }

  return successResponse(sale, "Venta registrada correctamente", 201);
});
