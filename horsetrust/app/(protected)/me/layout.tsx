import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user-from-token";

interface MeLayoutProps {
  children: ReactNode;
}

export default async function MeLayout({ children }: MeLayoutProps) {
  const user = await getAuthUser();

  if (user?.role !== "user" && user?.role !== "admin") {
    redirect("/login");
  }

  return <>{children}</>;
}