import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export interface AuthUser {
  userId: string;
  email: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

/// example protecion rutas backend

// const authUser = await getAuthUser();

// if (!authUser) {
//   return errorResponse(
//     { message: "No autorizado", code: "UNAUTHORIZED" },
//     401
//   );
// }

// Proteccion para rutas del frontend

// import { redirect } from "next/navigation";
// import { getAuthUser } from "@/lib/auth/get-auth-user";

// export default async function DashboardPage() {
//   const authUser = await getAuthUser();

//   if (!authUser) {
//     redirect("/login");
//   }

//   return <div>Bienvenido {authUser.email}</div>;
// }


// Proteccion Middleware

// middleware.ts
// import { NextResponse } from "next/server";
// import { verifyToken } from "./lib/auth/jwt";
// import { cookies } from "next/headers";

// export async function middleware(request: Request) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("auth_token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     verifyToken(token);
//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
