// ruta administrativa para validar la venta de caballos.

import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Horse } from "@/lib/database/entities/Horse"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { NextRequest, NextResponse } from "next/server"

interface RouteContext {
    params: Promise<{
        id: string
    }>
}


export const GET = withErrorHandler(async (
    _req: NextRequest,
    context: RouteContext
) => {

    // vertificar si es admin
    const user = await getAuthUser()
    if (!user || user.role !== "admin") {
        return errorResponse({
            message: "Acceso no autorizado",
            code: "UNAUTHORIZED",
            statusCode: 401,
            name: ""
        })
    }

    const { id } = await context.params
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
        relations: ["owner", "documents"],
        select: {
            id: true,
            age: true,
            breed: true,
            discipline: true,
            name: true,
            sale_status: true,
            sex: true,
            price: true,
            documents: {
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

    return new NextResponse(JSON.stringify(horse), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
})


// actualizar status

import { VerificationStatus } from "@/lib/database/enums"
import { validateEnumOrError } from "@/lib/errors/validate-enum"

export const PUT = withErrorHandler(async (
  req: NextRequest,
  context: RouteContext
) => {
  const user = await getAuthUser()
  const body = await req.json()
  const { status } = body

  if (status) {
        const error = validateEnumOrError(VerificationStatus, status, "Estado de verificación", "INVALID_VERIFICATION_STATUS")
        if (error) return error
      }

  if (!user || user.role !== "admin") {
    return errorResponse({
      message: "Acceso no autorizado",
      code: "UNAUTHORIZED",
      statusCode: 401,
      name: ""
    })
  }

  const { id } = await context.params

  if (!id) {
    return errorResponse({
      message: "ID del caballo no proporcionado",
      code: "MISSING_HORSE_ID",
      statusCode: 400,
      name: ""
    })
  }


  if (!status) {
    return errorResponse({
      message: "Debe enviar el nuevo estado en el body",
      code: "MISSING_STATUS",
      statusCode: 400,
      name: ""
    })
  }

  if (!Object.values(VerificationStatus).includes(status)) {
    return errorResponse({
      message: "Estado de verificación inválido",
      code: "INVALID_STATUS",
      statusCode: 400,
      name: ""
    })
  }

  const repo = await getRepository(Horse)

  const horse = await repo.findOne({
    where: { id }
  })

  if (!horse) {
    return errorResponse({
      message: "Caballo no encontrado",
      code: "HORSE_NOT_FOUND",
      statusCode: 404,
      name: ""
    })
  }

  if (horse.verification_status !== VerificationStatus.pending) {
    return errorResponse({
      message: "Solo se pueden validar caballos en estado 'pending'",
      code: "INVALID_CURRENT_STATUS",
      statusCode: 400,
      name: ""
    })
  }

  horse.verification_status = status
  await repo.save(horse)

  return NextResponse.json(
    {
      message: "Estado actualizado correctamente",
      data: {
        id: horse.id,
        verification_status: horse.verification_status
      }
    },
    { status: 200 }
  )
})