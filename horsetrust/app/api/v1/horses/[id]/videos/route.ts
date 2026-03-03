import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Document } from "@/lib/database/entities/Document"
import { Horse } from "@/lib/database/entities/Horse"
import { TypeDocument, Category, DocumentPurpose } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { saveFile, UploadError } from "@/lib/storage/upload"
import { NextRequest } from "next/server"

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

async function getHorseIfOwner(horseId: string, userId: string) {
  const horseRepo = await getRepository(Horse)
  const horse = await horseRepo.findOne({
    where: { id: horseId },
    relations: ["owner"],
    select: {
      id: true,
      owner: { id: true },
    },
  })

  if (!horse) {
    return { error: errorResponse({ message: "Caballo no encontrado", code: "HORSE_NOT_FOUND", statusCode: 404, name: "" }) }
  }

  if (horse.owner?.id !== userId) {
    return { error: errorResponse({ message: "No autorizado para gestionar videos de este caballo", code: "UNAUTHORIZED", statusCode: 403, name: "" }) }
  }

  return { horse }
}

// GET /api/v1/horses/[id]/videos
export const GET = withErrorHandler(async (
  _req: NextRequest,
  context: RouteContext
) => {
  const { id: horseId } = await context.params

  if (!horseId) {
    return errorResponse({ message: "ID del caballo no proporcionado", code: "MISSING_HORSE_ID", statusCode: 400, name: "" })
  }

  const horseRepo = await getRepository(Horse)
  const horse = await horseRepo.findOne({ where: { id: horseId } })

  if (!horse) {
    return errorResponse({ message: "Caballo no encontrado", code: "HORSE_NOT_FOUND", statusCode: 404, name: "" })
  }

  const docRepo = await getRepository(Document)
  const videos = await docRepo.find({
    where: { horse_id: horseId, type: TypeDocument.video },
    select: {
      id: true,
      type: true,
      category: true,
      purpose: true,
      url: true,
      public_id: true,
      verified: true,
      created_at: true,
    },
    order: { created_at: "DESC" },
  })

  return successResponse(videos, "Videos del caballo obtenidos correctamente", 200)
})

// POST /api/v1/horses/[id]/videos (multipart/form-data)
export const POST = withErrorHandler(async (
  req: NextRequest,
  context: RouteContext
) => {
  const authUser = await getAuthUser()

  if (!authUser) {
    return errorResponse({ message: "No autorizado", code: "UNAUTHORIZED", statusCode: 401, name: "" })
  }

  const { id: horseId } = await context.params

  if (!horseId) {
    return errorResponse({ message: "ID del caballo no proporcionado", code: "MISSING_HORSE_ID", statusCode: 400, name: "" })
  }

  const { error } = await getHorseIfOwner(horseId, authUser.userId)
  if (error) return error

  const formData = await req.formData()

  const file = formData.get("file") as File | null
  const videoUrl = formData.get("video_url") as string | null

  if (!file && !videoUrl) {
    return errorResponse({ message: "Debe proporcionar un archivo de video (file) o una URL de video (video_url)", code: "MISSING_VIDEO", statusCode: 400, name: "" })
  }

  let url: string
  let publicId: string

  if (file && file instanceof File && file.size > 0) {
    try {
      const uploadResult = await saveFile(file, "video", horseId, "identification", "certificate")
      url = uploadResult.url
      publicId = uploadResult.publicId
    } catch (err) {
      if (err instanceof UploadError) {
        return errorResponse({ message: err.message, code: err.code, statusCode: 400, name: "" })
      }
      throw err
    }
  } else if (videoUrl) {
    try {
      new URL(videoUrl)
    } catch {
      return errorResponse({ message: "La URL de video proporcionada no es válida", code: "INVALID_VIDEO_URL", statusCode: 400, name: "" })
    }
    url = videoUrl
    publicId = ""
  } else {
    return errorResponse({ message: "El archivo de video está vacío", code: "EMPTY_FILE", statusCode: 400, name: "" })
  }

  const docRepo = await getRepository(Document)

  const document = docRepo.create({
    user: { id: authUser.userId },
    user_id: authUser.userId,
    horse: { id: horseId },
    horse_id: horseId,
    type: TypeDocument.video,
    category: Category.identification,
    purpose: DocumentPurpose.certificate,
    url,
    public_id: publicId,
    verified: false,
  })

  await docRepo.save(document)

  return successResponse(document, "Video subido correctamente. Pendiente de verificación", 201)
})
