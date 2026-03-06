import { cookies } from "next/headers";
import AdminHorsesContainer from "./horses/_components/AdminHorsesContainer";
import { getBaseUrl } from "@/lib/get-base-url";

async function getAllHorses(token: string) {
  const res = await fetch(`${getBaseUrl()}/api/v1/horses?limit=100`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.horses ?? [];
}

export default async function AdminHorsesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return <div>No autorizado</div>;

  const horses = await getAllHorses(token);

  return <AdminHorsesContainer initialHorses={horses} />;
}
