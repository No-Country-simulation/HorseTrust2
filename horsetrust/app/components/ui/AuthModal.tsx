"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export default function AuthModal({ isOpen, onClose, redirectTo }: Props) {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center fontMontserrat">
      {/* Overlay con fade in */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal con scale y fade */}
      <div 
        className={`relative bg-black/90 rounded-none p-12 w-[90%] max-w-lg shadow-2xl z-10 border border-[rgb(var(--color-gold)/0.3)] transition-all duration-300 ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-gold))] transition-colors duration-300 text-2xl font-light"
        >
          ×
        </button>

        <div className="flex items-center gap-3 pb-6">
          <span className="text-[rgb(var(--color-gold))] text-xl">◆</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgb(var(--color-gold))] to-transparent"></div>
        </div>

        <h2 className="fontCormorant text-3xl font-light tracking-wide text-[rgb(var(--color-gold))] uppercase pb-4 pl-7">
          Debes iniciar sesión
        </h2>

        <p className="text-sm font-light leading-relaxed text-[rgb(var(--color-cream)/0.8)] pb-7">
          Para ver los detalles completos del caballo necesitás iniciar sesión en tu cuenta.
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-8 py-3 text-xs tracking-[0.125em] uppercase border border-[rgb(var(--color-teal)/0.6)] text-[rgb(var(--color-teal))] hover:border-[rgb(var(--color-teal))] transition-all duration-300 font-medium"
          >
            Seguir Explorando
          </button>

          <button
            onClick={() =>
              router.push(`/login?redirect=${redirectTo || "/"}`)
            }
            className="px-8 py-3 text-xs tracking-[0.125em] uppercase bg-[rgb(var(--color-gold))] text-black hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 font-medium"
          >
            Iniciar Sesión
          </button>
        </div>

        <div className="flex items-center gap-3 pt-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[rgb(var(--color-gold))]"></div>
          <span className="text-[rgb(var(--color-gold))] text-xl">◆</span>
        </div>
      </div>
    </div>
  )
}