import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user-from-token";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getAuthUser();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return <>{children}</>;
}