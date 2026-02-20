"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/v1/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      router.push("/");
      router.refresh(); // actualiza el estado del servidor
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-5 md:px-8 py-3 bg-transparent border border-red-500 text-red-500 text-xs uppercase cursor-pointer transition-all duration-300 hover:bg-red-500 hover:text-black"
    >
      Cerrar sesión
    </button>
  );
}