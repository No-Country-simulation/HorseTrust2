'use server'
import { getAuthUser } from '@/lib/auth/get-user-from-token'
import HorseCard, { HorseCardProps } from '../components/horses/HorseCard'

export default async function page() {
  const authUser = await getAuthUser()
  const meId = authUser?.userId

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/horses?status=for_sale`,{
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  )

  const json = await res.json()
  const horses = json.data

  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {horses.map((horse: HorseCardProps) => (
        <HorseCard key={horse.id} horse={horse} meId={meId} />
      ))}
    </div>
  )
}
