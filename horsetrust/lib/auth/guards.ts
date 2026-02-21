// lib/auth/guards.ts

import { getAuthUser } from "./get-user-from-token";

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return user;
}