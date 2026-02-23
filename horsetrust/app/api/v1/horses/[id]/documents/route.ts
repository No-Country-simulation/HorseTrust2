import { getAuthUser } from "@/lib/auth/get-user-from-token"
import { Document } from "@/lib/database/entities/Document"
import { Horse } from "@/lib/database/entities/Horse"
import { Category, DocumentPurpose, ExamResult, ExamType, TypeDocument } from "@/lib/database/enums"
import { getRepository } from "@/lib/database/get-repository"
import { validateEnumOrError } from "@/lib/errors/validate-enum"
import { errorResponse, successResponse } from "@/lib/http/response-handler"
import { withErrorHandler } from "@/lib/http/with-error-handler"
import { saveFile, deleteFile, UploadError } from "@/lib/storage/upload"
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
    return { error: errorResponse({ message: "No autorizado para gestionar documentos de este caballo", code: "UNAUTHORIZED", statusCode: 403, name: "" }) }
  }

  return { horse }
}

// GET /api/v1/horses/[id]/documents
export const GET = withErrorHandler(async (
  req: NextRequest,
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

  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  const where: Record<string, string> = { horse_id: horseId }

  if (category) {
    const error = validateEnumOrError(Category, category, "Categoría", "INVALID_CATEGORY")
    if (error) return error
    where.category = category
  }

  const docRepo = await getRepository(Document)
  const documents = await docRepo.find({
    where,
    select: {
      id: true,
      type: true,
      category: true,
      purpose: true,
      url: true,
      public_id: true,
      issued_at: true,
      vet_name: true,
      exam_type: true,
      exam_result: true,
      verified: true,
      created_at: true,
    },
    order: { created_at: "DESC" },
  })

  return successResponse(documents, "Documentos del caballo obtenidos correctamente", 200)
})

// POST /api/v1/horses/[id]/documents (multipart/form-data)
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
  const type = formData.get("type") as string | null
  const category = formData.get("category") as string | null
  const role = formData.get("role") as string | null
  const issuedAt = formData.get("issuedAt") as string | null
  const vetName = formData.get("vetName") as string | null
  const examType = formData.get("examType") as string | null
  const examResult = formData.get("examResult") as string | null

  if (!file || !(file instanceof File) || file.size === 0) {
    return errorResponse({ message: "El archivo es obligatorio", code: "MISSING_FILE", statusCode: 400, name: "" })
  }

  if (!type) {
    return errorResponse({ message: "El tipo de documento es obligatorio", code: "MISSING_TYPE", statusCode: 400, name: "" })
  }

  const typeError = validateEnumOrError(TypeDocument, type, "Tipo de documento", "INVALID_TYPE")
  if (typeError) return typeError

  if (!category) {
    return errorResponse({ message: "La categoría es obligatoria", code: "MISSING_CATEGORY", statusCode: 400, name: "" })
  }

  const categoryError = validateEnumOrError(Category, category, "Categoría", "INVALID_CATEGORY")
  if (categoryError) return categoryError

  if (!role) {
    return errorResponse({ message: "El rol del documento es obligatorio", code: "MISSING_ROLE", statusCode: 400, name: "" })
  }

  const purposeError = validateEnumOrError(DocumentPurpose, role, "Rol del documento", "INVALID_ROLE")
  if (purposeError) return purposeError

  // Campos obligatorios cuando la categoría es "veterinary"
  if (category === Category.veterinary) {
    if (!issuedAt) {
      return errorResponse({ message: "La fecha del examen (issuedAt) es obligatoria para documentos veterinarios", code: "MISSING_ISSUED_AT", statusCode: 400, name: "" })
    }

    if (!vetName) {
      return errorResponse({ message: "El nombre del veterinario (vetName) es obligatorio para documentos veterinarios", code: "MISSING_VET_NAME", statusCode: 400, name: "" })
    }

    if (!examType) {
      return errorResponse({ message: "El tipo de examen (examType) es obligatorio para documentos veterinarios", code: "MISSING_EXAM_TYPE", statusCode: 400, name: "" })
    }

    const examTypeError = validateEnumOrError(ExamType, examType, "Tipo de examen", "INVALID_EXAM_TYPE")
    if (examTypeError) return examTypeError

    if (!examResult) {
      return errorResponse({ message: "El resultado del examen (examResult) es obligatorio para documentos veterinarios", code: "MISSING_EXAM_RESULT", statusCode: 400, name: "" })
    }

    const examResultError = validateEnumOrError(ExamResult, examResult, "Resultado del examen", "INVALID_EXAM_RESULT")
    if (examResultError) return examResultError
  }

  // Subir archivo al filesystem
  let uploadResult
  try {
    uploadResult = await saveFile(file, type, horseId, category, role)
  } catch (err) {
    if (err instanceof UploadError) {
      return errorResponse({ message: err.message, code: err.code, statusCode: 400, name: "" })
    }
    throw err
  }

  const docRepo = await getRepository(Document)

  const document = docRepo.create({
    user: { id: authUser.userId },
    user_id: authUser.userId,
    horse: { id: horseId },
    horse_id: horseId,
    type: type as TypeDocument,
    category: category as Category,
    purpose: role as DocumentPurpose,
    url: uploadResult.url,
    public_id: uploadResult.publicId,
    issued_at: issuedAt ? new Date(issuedAt) : null,
    vet_name: category === Category.veterinary ? vetName : null,
    exam_type: category === Category.veterinary ? (examType as ExamType) : null,
    exam_result: category === Category.veterinary ? (examResult as ExamResult) : null,
    verified: false,
  })

  await docRepo.save(document)

  return successResponse(document, "Documento subido correctamente. Pendiente por verificación", 201)
})

// DELETE /api/v1/horses/[id]/documents?documentId=xxx
export const DELETE = withErrorHandler(async (
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

  const { searchParams } = new URL(req.url)
  const documentId = searchParams.get("documentId")

  if (!documentId) {
    return errorResponse({ message: "ID del documento no proporcionado (query param: documentId)", code: "MISSING_DOCUMENT_ID", statusCode: 400, name: "" })
  }

  const docRepo = await getRepository(Document)

  const document = await docRepo.findOne({
    where: { id: documentId, horse_id: horseId },
  })

  if (!document) {
    return errorResponse({ message: "Documento no encontrado", code: "DOCUMENT_NOT_FOUND", statusCode: 404, name: "" })
  }

  // Eliminar archivo del filesystem
  await deleteFile(document.public_id)

  await docRepo.delete(documentId)

  return successResponse(null, "Documento eliminado correctamente", 200)
})
