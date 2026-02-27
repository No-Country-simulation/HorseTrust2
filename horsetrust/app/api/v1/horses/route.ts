import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Horse } from "@/lib/database/entities/Horse"
import { Discipline, HorseSaleStatus, Sex, VerificationStatus } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { validateEnumOrError } from "@/lib/errors/validate-enum"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

export const GET = withErrorHandler(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)

    const repo = await getRepository(Horse)
    const qb = repo.createQueryBuilder("horse")
        .leftJoinAndSelect("horse.owner", "owner")
        .leftJoin("horse.documents", "doc")

    // Filter: sale status (for_sale, reserved, sold)
    const saleStatus = searchParams.get("status")
    if (saleStatus) {
        const error = validateEnumOrError(HorseSaleStatus, saleStatus, "sale_status", "INVALID_SALE_STATUS")
        if (error) return error
        qb.andWhere("horse.sale_status = :saleStatus", { saleStatus })
    }

    // Filter: verification status (pending, verified, rejected)
    const verificationStatus = searchParams.get("verification_status")
    if (verificationStatus) {
        const error = validateEnumOrError(VerificationStatus, verificationStatus, "verification_status", "INVALID_VERIFICATION_STATUS")
        if (error) return error
        qb.andWhere("horse.verification_status = :verificationStatus", { verificationStatus })
    }

    // Filter: discipline
    const discipline = searchParams.get("discipline")
    if (discipline) {
        const error = validateEnumOrError(Discipline, discipline, "discipline", "INVALID_DISCIPLINE")
        if (error) return error
        qb.andWhere("horse.discipline = :discipline", { discipline })
    }

    // Filter: sex
    const sex = searchParams.get("sex")
    if (sex) {
        const error = validateEnumOrError(Sex, sex, "sex", "INVALID_SEX")
        if (error) return error
        qb.andWhere("horse.sex = :sex", { sex })
    }

    // Filter: price range
    const minPrice = searchParams.get("min_price")
    const maxPrice = searchParams.get("max_price")
    if (minPrice) {
        qb.andWhere("horse.price >= :minPrice", { minPrice: parseInt(minPrice) })
    }
    if (maxPrice) {
        qb.andWhere("horse.price <= :maxPrice", { maxPrice: parseInt(maxPrice) })
    }

    // Filter: has documents (true/false)
    const hasDocuments = searchParams.get("has_documents")
    if (hasDocuments === "true") {
        qb.andWhere("doc.id IS NOT NULL")
    } else if (hasDocuments === "false") {
        qb.andWhere("doc.id IS NULL")
    }

    // Filter: created after date
    const createdAfter = searchParams.get("created_after")
    if (createdAfter) {
        qb.andWhere("horse.created_at >= :createdAfter", { createdAfter })
    }

    // Filter: created before date
    const createdBefore = searchParams.get("created_before")
    if (createdBefore) {
        qb.andWhere("horse.created_at <= :createdBefore", { createdBefore })
    }

    // Filter: breed (partial match)
    const breed = searchParams.get("breed")
    if (breed) {
        qb.andWhere("LOWER(horse.breed) LIKE :breed", { breed: `%${breed.toLowerCase()}%` })
    }

    // Sort
    const sortBy = searchParams.get("sort_by")
    const sortOrder = searchParams.get("sort_order")?.toUpperCase() === "ASC" ? "ASC" : "DESC"

    if (sortBy === "price") {
        qb.orderBy("horse.price", sortOrder)
    } else if (sortBy === "age") {
        qb.orderBy("horse.age", sortOrder)
    } else if (sortBy === "name") {
        qb.orderBy("horse.name", sortOrder)
    } else {
        qb.orderBy("horse.created_at", sortOrder)
    }

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    qb.skip((page - 1) * limit).take(limit)

    const [horses, total] = await qb.getManyAndCount()

    return successResponse(
        { horses, total, page, limit, totalPages: Math.ceil(total / limit) },
        "Listado de caballos obtenido correctamente",
        200
    )
})

// create horse
export const POST = withErrorHandler(async (req: Request) => {

    const authUser = await getAuthUser()

    if (!authUser) {
        return errorResponse({
            message: "No autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: ""
        })
    }

    const body = await req.json()
    const repo = await getRepository(Horse)

    const sexError = validateEnumOrError(
        Sex,
        body.sex,
        "Sexo inválido",
        "INVALID_SEX"
    )
    if (sexError) return sexError

    const disciplineError = validateEnumOrError(
        Discipline,
        body.discipline,
        "Disciplina inválida",
        "INVALID_DISCIPLINE"
    )
    if (disciplineError) return disciplineError

    // verifica si el nombre del caballo ya existe para este usuario
    const existingHorse = await repo.findOne({
        where: {
            name: body.name,
            owner: { id: authUser.userId },
        },
    })

    if (existingHorse) {
        return errorResponse({
            message: "Ya tienes un caballo registrado con ese nombre",
            code: "HORSE_NAME_EXISTS",
            statusCode: 400,
            name: ""
        })
    }

    const horse = repo.create({
        owner: { id: authUser.userId },
        name: body.name,
        age: body.age,
        sex: body.sex,
        breed: body.breed,
        price: body.price,
        discipline: body.discipline,
    })

    await repo.save(horse)

    return successResponse(horse, "Caballo creado correctamente", 201)
})
