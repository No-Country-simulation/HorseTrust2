import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Document } from "@/lib/database/entities/Document"
import { TypeDocument } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

// GET /api/v1/admin/videos?status=pending|verified|rejected
export const GET = withErrorHandler(async (req: NextRequest) => {
    const authUser = await getAuthUser()

    if (!authUser || authUser.role !== "admin") {
        return errorResponse({
            message: "No autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: ""
        })
    }

    const status = req.nextUrl.searchParams.get("status")

    const repo = await getRepository(Document)

    const qb = repo
        .createQueryBuilder("doc")
        .leftJoin("doc.horse", "horse")
        .leftJoin("doc.user", "user")
        .addSelect(["horse.id", "horse.name", "user.id", "user.first_name", "user.last_name"])
        .where("doc.type = :type", { type: TypeDocument.video })
        .orderBy("doc.created_at", "DESC")

    if (status === "pending") {
        qb.andWhere("doc.verified = :verified", { verified: false })
        qb.andWhere("doc.reason IS NULL")
    } else if (status === "verified") {
        qb.andWhere("doc.verified = :verified", { verified: true })
    } else if (status === "rejected") {
        qb.andWhere("doc.verified = :verified", { verified: false })
        qb.andWhere("doc.reason IS NOT NULL")
    }

    const videos = await qb.getMany()

    return successResponse(videos, "Listado de videos obtenido correctamente")
})
