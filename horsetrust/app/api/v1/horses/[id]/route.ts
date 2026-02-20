import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Horse } from "@/lib/database/entities/Horse"
import { Discipline, HorseSaleStatus, Sex } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { validateEnumOrError } from "@/lib/errors/validate-enum"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest } from "next/server"


interface RouteContext {
  params: {
    id: string
  }
}

export const GET = withErrorHandler(async (
  _req: NextRequest,
  { params }: RouteContext
) => {
  const { id } = await  params

  if (!id) {
    return errorResponse({
      message: "ID del caballo no proporcionado",
      code: "MISSING_HORSE_ID",
      statusCode: 400,
      name: ""
    })
  }

  const repo = await getRepository(Horse)

  const horse = await repo.findOne({
    where: { id },
    relations: ["owner", "documents", "sales"],
    select:{
        id: true,
        age: true,
        breed: true,
        discipline: true,
        name: true,
        sale_status: true,
        sex: true,
        price: true,
        sales:{
            id: true,
            price: true,
            created_at: true,
        },
        documents:{
            id: true,
            url: true,
            type: true,
            category: true,
        },
        verification_status: true,
        owner: {
            id: true,
            avatar_url: true,
            average_rating: true,
            last_name: true,
            first_name: true,
            addresses: true,
            email: true,
            phone: true,
            reviews_given: true,
            reviews_received: true,
            initiated_chats: true,
        },
    }
  })

  if (!horse) {
    return errorResponse({
      message: "Caballo no encontrado",
      code: "HORSE_NOT_FOUND",
      statusCode: 404,
      name: ""
    })
  }

  return successResponse(
    horse,
    "Detalle del caballo obtenido correctamente",
    200
  )
})

// PATCH

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
        name: ""
      })
    }

    const { id } = await params

    if (!id) {
      return errorResponse({
        message: "ID del caballo no proporcionado",
        code: "MISSING_HORSE_ID",
        statusCode: 400,
        name: ""
      })
    }

    const repo = await getRepository(Horse)

    const horse = await repo.findOne({
      where: { id },
      relations: ["owner"],
      select: {
        id: true,
        owner: { id: true },
      },
    })

    if (!horse) {
      return errorResponse({
        message: "Caballo no encontrado",
        code: "HORSE_NOT_FOUND",
        statusCode: 404,
        name: ""
      })
    }

    if (horse.owner?.id !== authUser.userId) {
      return errorResponse({
        message: "No autorizado para editar este caballo",
        code: "UNAUTHORIZED",
        statusCode: 403,
        name: ""
      })
    }

    const body = await req.json()

    if (body.sex) {
      const error = validateEnumOrError(Sex, body.sex, "Sexo", "INVALID_SEX")
      if (error) return error
    }

    if (body.discipline) {
      const error = validateEnumOrError(Discipline, body.discipline, "Disciplina", "INVALID_DISCIPLINE")
      if (error) return error
    }

    if (body.sale_status) {
      const error = validateEnumOrError(HorseSaleStatus, body.sale_status, "Estado de venta", "INVALID_SALE_STATUS")
      if (error) return error
    }

    type UpdatableField = "name" | "age" | "sex" | "breed" | "discipline" | "price" | "sale_status"
    const allowedFields: UpdatableField[] = ["name", "age", "sex", "breed", "discipline", "price", "sale_status"]
    const updates: Pick<Partial<Horse>, UpdatableField> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse({
        message: "No se proporcionaron campos para actualizar",
        code: "NO_FIELDS_TO_UPDATE",
        statusCode: 400,
        name: ""
      })
    }

    await repo.update(id, updates)

    const updatedHorse = await repo.findOne({
      where: { id },
      relations: ["owner"],
    })

    return successResponse(updatedHorse, "Caballo actualizado correctamente", 200)
})

// DELETE

export const DELETE = withErrorHandler(async (
  req: NextRequest,
  { params }: RouteContext
) => {

    const authUser = await getAuthUser();
    if (!authUser) {
      return errorResponse({
        message: "No autorizado",
        code: "UNAUTHORIZED",
        statusCode: 401,
        name: ""
        }
        , )
    }
  const { id } = await  params

  if (!id) {
    return errorResponse({
      message: "ID del caballo no proporcionado",
      code: "MISSING_HORSE_ID",
      statusCode: 400,
      name: ""
    })
  }

  const repo = await getRepository(Horse)

  // Verificar que el caballo existe antes de eliminarlo y si pertenece al usuario autenticado
  const isExistingHorse = await repo.findOne({
    where: { id },
    relations: ["owner"],
    select: {
      id: true,
      sale_status: true,
      owner: {
        id: true,
      },
    },
  })
  if (!isExistingHorse) {
    return errorResponse({
        message: "Caballo no encontrado",
        code: "HORSE_NOT_FOUND",
        statusCode: 404,
        name: ""
      })
    }

    if (isExistingHorse.owner?.id !== authUser.userId) {
        console.log('id pasada', authUser.userId, 'id del caballo', isExistingHorse.owner?.id)
        return errorResponse({
            message: "No autorizado para eliminar este caballo",
            code: "UNAUTHORIZED",
            statusCode: 403,
            name: ""
          })
    }

    if (isExistingHorse.sale_status === "sold") {
        return errorResponse({
            message: "No se puede eliminar un caballo que ha sido vendido",
            code: "HORSE_SOLD",
            statusCode: 400,
            name: ""
          })
    }

    // Eliminar el caballo
    await repo.delete(id)

    return successResponse(null, "Caballo eliminado correctamente", 200)
},)
