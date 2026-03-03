"use client"

import { useChatStore } from "@/store/chatStore"
import { useSession } from "@/store/authSession"
import { useRouter } from "next/navigation"
import { MessageCircle, Bookmark, Share2, Check} from "lucide-react"

interface Props {
  horse: any
}

export default function PriceCard({ horse }: Props) {
    const { setSellerId, setOpen } = useChatStore()
    const { isAuthenticated } = useSession()
    const router = useRouter()

    const handleContact = () => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        const sellerId = horse.owner?.id
        if (!sellerId) return

        setSellerId(sellerId)
        setOpen(true)
    }

    return (
        <div className="bg-gradient-to-br from-[rgb(var(--color-gold)/0.2)] to-[rgb(var(--color-terracota)/0.2)] border border-[rgb(var(--color-gold)/0.4)] p-8 sticky top-26 mb-20">
            <div className="text-center mb-6">
                <div className="text-xs text-[rgb(var(--color-cream)/0.8)] uppercase tracking-wider mb-2">Precio</div>
                <div className="font-serif text-5xl text-[rgb(var(--color-gold))] mb-4">{"$ " + (horse.price || "A consultar")}</div>
            </div>

            <div className="space-y-4">
                <button 
                onClick={handleContact}
                className="w-full flex items-center justify-center px-8 py-4 bg-[rgb(var(--color-gold))] text-black text-sm tracking-[0.125em] uppercase font-medium hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 cursor-pointer"
                >
                    <MessageCircle size={30} strokeWidth={1} className="shrink-0 ml-6" />
                    <span>Contactar Vendedor</span>
                </button>

                
                <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-sm tracking-[0.125em] uppercase font-medium hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] transition-all duration-300">
                    <Bookmark size={25} strokeWidth={1} className="shrink-0" />
                    <span>Guardar</span>
                </button>

                <button className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-sm tracking-[0.125em] uppercase font-medium hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] transition-all duration-300">
                    <Share2 size={25} strokeWidth={1} className="shrink-0" />
                    <span>Compartir</span>
                </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[rgb(var(--color-cream)/0.1)] text-center">
                <div className="fontCormorant text-xs text-[rgb(var(--color-cream)/0.6)] mb-3">Seguridad Garantizada</div>
                <div className="flex items-center justify-center gap-2 text-xs text-[rgb(var(--color-cream)/0.8)]">
                    <span className="flex items-center gap-1"><Check size={12} strokeWidth={2} className="text-[rgb(var(--color-gold))]" /> Pago Seguro</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Check size={12} strokeWidth={2} className="text-[rgb(var(--color-gold))]" /> Verificado</span>
                </div>
            </div>
        </div>
    )
}
