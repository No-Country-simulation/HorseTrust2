import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth/jwt"
import ItemDetailHorse from "@/app/components/horses/ItemDetailHorse"
import DocsContainer from "@/app/components/horses/DocsContainer"
import ColumnLeftContainer from "@/app/components/horses/ColumnLeftContainer"
import VideoSection from "@/app/components/horses/VideoSection"
import SellerDetail from "@/app/components/horses/SellerDetail"
import VerificationStatusChanger from "../_components/VerificationStatusChanger"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

async function getHorseAdmin(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/horses/${id}`,
    {
      cache: "no-store",
      headers: { Cookie: `token=${token}` },
    }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.data
}

export default async function AdminHorseDetailPage({ params }: Props) {
  const { id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) redirect("/login")

  try {
    verifyToken(token)
  } catch {
    redirect("/login")
  }

  const horse = await getHorseAdmin(id, token)

  if (!horse) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[rgb(var(--color-cream))] fontMontserrat">Caballo no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-[rgb(var(--color-cream))] py-8 px-4 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          href="/admin/horses"
          className="fontMontserrat text-sm text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-cream))] transition-colors uppercase tracking-wider mb-6 inline-block"
        >
          ← Volver al listado
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="fontMontserrat text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] mb-3 uppercase">
            — Administración —
          </div>
          <h1 className="fontCormorant text-4xl lg:text-5xl text-[rgb(var(--color-cream))] uppercase tracking-wide">
            {horse.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images, horse info, videos & docs */}
          <div className="lg:col-span-2 space-y-8">
            <ColumnLeftContainer horse={horse} documents={horse.documents ?? []} />
            <VideoSection horseId={horse.id} showAll />
          </div>

          {/* Right column - Status changer & seller info */}
          <div className="lg:col-span-1 space-y-8">
            <VerificationStatusChanger
              horseId={horse.id}
              horseName={horse.name}
              currentStatus={horse.verification_status}
            />
            <SellerDetail seller={horse.owner} />
          </div>
        </div>
      </div>
    </div>
  )
}
