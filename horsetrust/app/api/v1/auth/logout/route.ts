import { cookies } from "next/headers";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { successResponse } from "@/lib/http/response-handler";

export const POST = withErrorHandler(async () => {
  (await cookies()).set("token", "", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // 👈 fuerza expiración inmediata
  });

  return successResponse(null, "Sesión cerrada correctamente", 200);
});
