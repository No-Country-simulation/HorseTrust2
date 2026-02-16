import { NextResponse } from "next/server";
import { ApiResponse } from "./ApiResponse";
import { AppError } from "../errors/AppError";

/**
 * Respuesta exitosa
 */
export function successResponse<T>(
  data: T,
  message = "Success",
  statusCode = 200
) {
  const response: ApiResponse<T> = {
    ok: true,
    statusCode,
    message,
    data,
  };

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Respuesta de error controlado (AppError)
 */
export function errorResponse(error: AppError) {
  const response: ApiResponse<null> = {
    ok: false,
    statusCode: error.statusCode,
    message: error.message,
    code: error.code,
  };

  return NextResponse.json(response, { status: error.statusCode });
}

/**
 * Manejo global de errores inesperados
 */
export function handleUnexpectedError(error: unknown) {
  console.error("Unexpected error:", error);

  const response: ApiResponse<null> = {
    ok: false,
    statusCode: 500,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  };

  return NextResponse.json(response, { status: 500 });
}
