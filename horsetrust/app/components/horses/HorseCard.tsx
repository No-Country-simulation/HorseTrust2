"use client";

import Image from "next/image"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import { useChatStore } from "@/store/chatStore"

export interface HorseCardProps {
  id: number
  age: number
  breed: string
  discipline: string
  name: string
  sale_status: string
  sex: string
  verification_status: string
  owner: {
    id: string
    avatar_url: string
    addresses: string[]
  }
}

interface Props {
  horse: HorseCardProps
  meId?: string
}

export default function HorseCard({ horse, meId }: Props) {
  const { setSellerId, setOpen } = useChatStore()
  const isOwner = meId === horse.owner?.id

  const canChat =
    meId &&
    !isOwner &&
    horse.sale_status === "for_sale" &&
    horse.verification_status === "verified"

  const handleContactSeller = () => {
    setSellerId(horse.owner?.id.toString())
    setOpen(true)
  }

  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white">
      <h2 className="text-xl font-bold">{horse.name}</h2>

      <p>Edad: {horse.age} años</p>
      <p>Raza: {horse.breed}</p>
      <p>Disciplina: {horse.discipline}</p>
      <p>Sexo: {horse.sex}</p>

      <div className="flex items-center gap-3 mt-4">
        {horse.owner?.avatar_url ? (
          <Image
            src={horse.owner.avatar_url}
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
        ) : (
          <div className="w-12.5 h-12.5 rounded-full bg-gray-300" />
        )}
        <span className="text-sm text-gray-600">
          Vendedor ID: {horse.owner?.id}
        </span>
      </div>

      {canChat && (
        <div className="mt-4">
          <button
            onClick={handleContactSeller}
            className="w-full py-2 rounded-lg text-white transition hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: "rgb(62, 98, 89)" }}
          >
            <IoChatbubbleEllipsesOutline />
            <span>Contactar vendedor</span>
          </button>
        </div>
      )}
    </div>
  )
}
