"use client"

import { useState } from "react"
import ReviewItem from "./ReviewItem"

interface ReviewData {
    id: string
    rating: number
    comment: string | null
    created_at: string
    buyer: {
        id: string
        first_name: string | null
        last_name: string | null
        avatar_url: string | null
    }
}

interface Props {
    sellerId: string
}

function timeAgo(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 60) return `${diffMin} minutos`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `${diffH} horas`
    const diffD = Math.floor(diffH / 24)
    if (diffD < 7) return `${diffD} días`
    const diffW = Math.floor(diffD / 7)
    if (diffW < 4) return `${diffW} semanas`
    const diffM = Math.floor(diffD / 30)
    return `${diffM} meses`
}

export default function ReviewsContainer({ sellerId }: Props) {
    const [reviews, setReviews] = useState<ReviewData[]>([])
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLoadReviews = async () => {
        if (loaded) return
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`/api/v1/users/${sellerId}/reviews`)
            const data = await res.json()

            if (data.ok) {
                setReviews(data.data ?? [])
                setLoaded(true)
            } else {
                setError("No se pudieron cargar las reseñas")
            }
        } catch {
            setError("Error al conectar con el servidor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-6">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-[rgb(var(--color-gold))] text-lg">◆</span>
                <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">Reseñas</h3>
            </div>

            {!loaded && !loading && (
                <button
                    onClick={handleLoadReviews}
                    className="w-full text-[rgb(var(--color-gold))] text-xs uppercase tracking-wider hover:text-[rgb(var(--color-cream))] transition-colors cursor-pointer"
                >
                    Ver reseñas del vendedor →
                </button>
            )}

            {loading && (
                <div className="flex items-center justify-center py-4">
                    <div className="w-5 h-5 border-2 border-[rgb(var(--color-gold)/0.3)] border-t-[rgb(var(--color-gold))] rounded-full animate-spin" />
                </div>
            )}

            {error && (
                <p className="text-sm text-red-400 text-center py-2">{error}</p>
            )}

            {loaded && reviews.length === 0 && (
                <p className="text-sm text-[rgb(var(--color-cream)/0.5)] text-center py-4">
                    Este vendedor aún no tiene reseñas
                </p>
            )}

            {loaded && reviews.length > 0 && (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const reviewerName = [review.buyer.first_name, review.buyer.last_name]
                            .filter(Boolean)
                            .join(" ") || "Usuario"
                        return (
                            <ReviewItem
                                key={review.id}
                                rating={review.rating}
                                date={timeAgo(review.created_at)}
                                description={review.comment || "Sin comentario"}
                                reviewer={reviewerName}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
