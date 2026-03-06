"use client"

import styles from "./Gallery.module.css"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AuthModal from "../ui/AuthModal"
import VerificationBadge from "./VerificationBadge"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  horse: any
}

export default function ItemCardGallery({ horse }: Props) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [horseImage, setHorseImage] = useState<string>("/images/placeholder-horses.png")

  useEffect(() => {
    let canceled = false

    const fetchImage = async () => {
      let url: string | null = null
      if (horse?.documents && Array.isArray(horse.documents)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imageDoc = horse.documents.find((doc: any) => doc.type === 'image' && doc.url)
        if (imageDoc) {
          url = imageDoc.url
        }
      }
            
      if (!url) {
        try {
          const res = await fetch(`/api/v1/horses/${horse.id}/documents`)
          if (res.ok) {
            const json = await res.json()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageDoc = (json.data || []).find((doc: any) => doc.type === 'image' && doc.url)
            if (imageDoc) {
              url = imageDoc.url
            }
          }
        } catch (err) {
          console.error('Error fetching horse documents for image:', err)
        }
      }

      if (!canceled) {
        if (url) {
          setHorseImage(url.replace('/api/v1/uploads/', '/uploads/'))
        } else {
          setHorseImage("/images/placeholder-horses.png")
        }
      }
    }

    fetchImage()
    return () => { canceled = true }
  }, [horse])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/v1/me", {
          method: "GET",
          credentials: "include", 
        })

        setIsAuthenticated(res.ok)
      } catch {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }

    router.push(`/horses/${horse.id}`)
  }

  const statusColors: Record<string, string> = {
    for_sale: "bg-[rgb(var(--color-gold))] text-black",
    reserved: "bg-orange-500 text-white",
    sold: "bg-red-600 text-white",
  };

  const statusClass = statusColors[horse.sale_status] ?? "bg-gray-400 text-white";

  const statusLabels: Record<string, string> = {
    for_sale: "A la venta",
    reserved: "Reservado",
    sold: "Vendido",
  };


  return (
    <section>

        <div className={`${styles.horseCard} group`}>
          <div className="relative fontMontserrat overflow-hidden aspect-[3/4] bg-[rgb(var(--color-teal)/0.2)] mb-4">
            <Image
              src={horseImage}
              alt="Caballo"
              width={200}
              height={300}
              className="w-full h-full object-cover"
            />
    
            <div className={`absolute top-4 right-4 px-3 py-1 text-xs uppercase tracking-wider font-medium ${statusClass}`}>
              {statusLabels[horse.sale_status] ?? horse.sale_status}
            </div>

            
    
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
                <button
                onClick={handleClick}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-[rgb(var(--color-cream))] text-black text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                >
                Ver Detalles
                </button>
            </div>
    
            <div className="space-y-2 p-4">
                <div className="flex justify-between items-start py-4">
                    <h3 className="fontCormorant text-xl text-[rgb(var(--color-cream))] tracking-wide">
                        {horse.name}
                    </h3>

                    <VerificationBadge status={horse.verification_status} />
                
                </div>
    
                <p className="text-sm py-2 fontMontserrat text-[rgb(var(--color-cream)/0.6)] font-light">
                {horse.breed} • {horse.age} años
                </p>
    
                <p className="text-xs fontMontserrat text-[rgb(var(--color-cream)/0.4)] uppercase tracking-wider">
                {horse.discipline}
                </p>
    
                <div className="flex justify-between items-center pt-2">
                <span className="fontCormorant text-[1.3rem] text-[rgb(var(--color-gold))]">
                    $ {horse.price || "Consultar precio"}
                </span>
    
            </div>
        </div>
        
      </div>
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        redirectTo={`/horses/${horse.id}`}
      />
    </section>
  )
}
