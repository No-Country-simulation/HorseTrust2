import { cookies } from "next/headers"
import AdminHorsesContainer from "./_components/AdminHorsesContainer"

async function getAllHorses(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/horses?limit=100`,
    {
      cache: "no-store",
      headers: { Cookie: `token=${token}` },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.data?.horses ?? []
}

export default async function AdminHorsesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return <div>No autorizado</div>

  const horses = await getAllHorses(token)

  return <AdminHorsesContainer initialHorses={horses} />
}
