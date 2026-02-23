import { mkdir, writeFile, unlink, access } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads")

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf"],
  video: ["video/mp4", "video/webm"],
}

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/webm": "webm",
}

interface UploadResult {
  filePath: string
  publicId: string
  url: string
}

export async function saveFile(
  file: File,
  type: string,
  horseId: string,
  category: string,
  purpose: string
): Promise<UploadResult> {
  const allowed = ALLOWED_MIME_TYPES[type]
  if (!allowed || !allowed.includes(file.type)) {
    throw new UploadError(
      `Tipo de archivo no permitido. Para type "${type}" se aceptan: ${allowed?.join(", ") || "ninguno"}`,
      "INVALID_FILE_TYPE"
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError(
      `El archivo excede el tamaño máximo permitido (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
      "FILE_TOO_LARGE"
    )
  }

  const ext = MIME_TO_EXT[file.type]
  const uuid = randomUUID()
  const filename = `${uuid}.${ext}`
  const relativePath = join("horses", horseId, category, purpose, filename)
  const dir = join(UPLOAD_ROOT, "horses", horseId, category, purpose)
  const fullPath = join(dir, filename)

  await mkdir(dir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(fullPath, buffer)

  return {
    filePath: fullPath,
    publicId: relativePath.replace(/\\/g, "/"),
    url: `/api/v1/uploads/horses/${horseId}/${category}/${purpose}/${filename}`,
  }
}

export async function deleteFile(publicId: string): Promise<void> {
  const fullPath = join(UPLOAD_ROOT, publicId)
  try {
    await access(fullPath)
    await unlink(fullPath)
  } catch {
    // File doesn't exist, nothing to delete
  }
}

export async function getFilePath(relativePath: string): Promise<string> {
  const fullPath = join(UPLOAD_ROOT, relativePath)
  await access(fullPath)
  return fullPath
}

export class UploadError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.code = code
    this.name = "UploadError"
  }
}
