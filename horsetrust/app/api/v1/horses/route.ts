import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Horse } from "@/lib/database/entities/Horse"
import { Discipline, HorseSaleStatus, Sex } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { validateEnumOrError } from "@/lib/errors/validate-enum"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"

export const GET = withErrorHandler(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)

    const saleStatus = searchParams.get("status")
    //const verificationStatus = searchParams.get("verification_status")

    const where: Record<string, string> = {}

    if (saleStatus) {
        const error = validateEnumOrError(HorseSaleStatus, saleStatus, "sale_status", "INVALID_SALE_STATUS")
        if (error) return error
        where.sale_status = saleStatus
    }

    // if (verificationStatus) {
    //     const error = validateEnumOrError(VerificationStatus, verificationStatus, "verification_status", "INVALID_VERIFICATION_STATUS")
    //     if (error) return error
    //     where.verification_status = verificationStatus
    // }

    const repo = await getRepository(Horse)
    const horses = await repo.find({
        where,
        //relations: ["owner"], // opcional si quieres traer las relaciones
        select: {
            id: true,
            age: true,
            breed: true,
            discipline: true,
            name: true,
            sale_status: true,
            sex: true,
            verification_status: true,
            owner: {
                addresses: true,
            },
        },
        order: { created_at: "DESC" },
    })

    return successResponse(horses, "Listado de caballos obtenido correctamente", 200)
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


    const horse = repo.create({
        owner: { id: authUser.userId },
        name: body.name,
        age: body.age,
        sex: body.sex,
        breed: body.breed,
        discipline: body.discipline,
    })

    await repo.save(horse)

    return successResponse(horse, "Caballo creado correctamente", 201)
})
