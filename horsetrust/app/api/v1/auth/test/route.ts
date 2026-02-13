import { getAuthUser } from "@/lib/auth/get-user-from-token";
import { User } from "@/lib/database/entities/User";
import { getRepository } from "@/lib/database/get-repository";
import { errorResponse, successResponse } from "@/lib/http/response-handler";
import { withErrorHandler } from "@/lib/http/with-error-handler";

export const GET = withErrorHandler(async () => {
    const authUser = await getAuthUser();

    if (!authUser) {
        return errorResponse(
            {
                message: "No autorizado", code: "UNAUTHORIZED", statusCode: 401,
                name: ""
            },
        );
    }

    const repo = await getRepository(User);

    const user = await repo.findOne({
        where: { id: authUser.userId },
        select: ["id", "email"], // nunca devolver password
    });

    if (!user) {
        return errorResponse(
            {
                message: "Usuario no encontrado", code: "USER_NOT_FOUND", statusCode: 404,
                name: ""
            },
        );
    }

    return successResponse(
        user,
        "Sesión activa",
        200
    );
});