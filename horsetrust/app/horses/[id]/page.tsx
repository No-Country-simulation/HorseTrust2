import { redirect } from "next/navigation"
import HorseDetailContainer from "@/app/components/horses/HorseDetailContainer"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth/jwt"

interface Props {
  params: Promise<{
    id: string
  }>
}


async function getHorse(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/horses/${id}`,
    { cache: "no-store" }
  )

  if (!res.ok) return null

  const data = await res.json()
  return data.data
}

async function getHorseDocuments(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/horses/${id}/documents`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) return []

  const data = await res.json()
  return data.data
}

export default async function HorseDetailPage({ params }: Props) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value


  if (!token) {
    redirect("/login")
  }

  try {
    verifyToken(token)
  } catch {
    redirect("/login")
  }

  if (!id) {
    return <div>ID inválido</div>
  }

  const horse = await getHorse(id)

  if (!horse) {
    return <div>Caballo no encontrado</div>
  }

  const documents = await getHorseDocuments(id, token)

  return (
    <HorseDetailContainer
      horse={horse}
      documents={documents}
    />
  )
}
