import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Horse } from "@/lib/database/entities/Horse"
import { Discipline, Sex } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { validateEnumOrError } from "@/lib/errors/validate-enum"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"

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