import { getFilePath } from "@/lib/storage/upload"
import { readFile } from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import { extname } from "path"

interface RouteContext {
  params: Promise<{
    path: string[]
  }>
}

const EXT_TO_CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
}

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  const { path } = await context.params
  const relativePath = path.join("/")

  try {
    const fullPath = await getFilePath(relativePath)
    const buffer = await readFile(fullPath)
    const ext = extname(fullPath).toLowerCase()
    const contentType = EXT_TO_CONTENT_TYPE[ext] || "application/octet-stream"

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return NextResponse.json(
      { ok: false, statusCode: 404, message: "Archivo no encontrado", code: "FILE_NOT_FOUND" },
      { status: 404 }
    )
  }
}
