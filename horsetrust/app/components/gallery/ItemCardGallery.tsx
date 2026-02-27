"use client"

import styles from "./Gallery.module.css"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AuthModal from "../ui/AuthModal"

interface Props {
  horse: any
}

export default function ItemCardGallery({ horse }: Props) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/v1/me", {
          method: "GET",
          credentials: "include", // 🔥 necesario para enviar la cookie
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

  return (
    <section>

        <div className={`${styles.horseCard} group`}>
          <div className="relative fontMontserrat overflow-hidden aspect-[3/4] bg-[rgb(var(--color-teal)/0.2)] mb-4">
            <Image
              src="/images/placeholder-horses.png"
              alt="Caballo"
              width={200}
              height={300}
              className="w-full h-full object-cover"
            />
    
            <div className="absolute top-4 right-4 bg-[rgb(var(--color-gold))] text-black px-3 py-1 text-xs uppercase tracking-wider font-medium">
              {horse.verification_status}
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
    
                <div className="flex items-center gap-1 text-[rgb(var(--color-gold))] text-sm">
                    ★{" "}
                    <span className="fontMontserrat text-[rgb(var(--color-cream)/0.8)]">
                    {horse.rating || 0.0}
                    </span>
                </div>
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
    
                <span className="text-xs fontMontserrat text-[rgb(var(--color-cream)/0.4)]">
                    Buenos Aires
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
