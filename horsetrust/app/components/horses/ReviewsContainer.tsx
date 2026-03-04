"use client"

import { useState, useCallback, useEffect } from "react"
import { useSession } from "@/store/authSession"
import ReviewItem from "./ReviewItem"
import ReviewForm from "./ReviewForm"
import { Star } from "lucide-react"

interface ReviewData {
    id: string
    rating: number
    comment: string | null
    created_at: string
    sale_id?: string
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
    const { user, isAuthenticated } = useSession()
    const [reviews, setReviews] = useState<ReviewData[]>([])
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingReview, setEditingReview] = useState<ReviewData | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    const loadReviews = useCallback(async () => {
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
}, [sellerId])

// ✅ AQUÍ VA
useEffect(() => {
    loadReviews()
}, [loadReviews])


    const handleDelete = async (reviewId: string) => {
        if (!confirm("¿Estás seguro de eliminar esta reseña?")) return

        setDeleting(reviewId)
        try {
            const res = await fetch(`/api/v1/reviews/${reviewId}`, { method: "DELETE" })
            const data = await res.json()
            if (data.ok) {
                loadReviews()
            } else {
                setError(data.message || "Error al eliminar")
            }
        } catch {
            setError("Error de conexión")
        } finally {
            setDeleting(null)
        }
    }

    const handleFormSaved = () => {
        setShowForm(false)
        setEditingReview(null)
        loadReviews()
    }

    const isOwnProfile = user?.id === sellerId

    return (
        <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-6">
            <div className="flex flex-col items-start gap-3 justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-[rgb(var(--color-gold))] text-lg">◆</span>
                    <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">Reseñas</h3>
                </div>

                {isAuthenticated && !isOwnProfile && loaded && (
                    <button
                        onClick={() => { setEditingReview(null); setShowForm(true) }}
                        className="fontMontserrat w-full flex items-center justify-center gap-3 text-xs px-4 py-2 bg-[rgb(var(--color-gold))] text-black uppercase tracking-wider font-medium hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 cursor-pointer"
                    >
                        <Star  size={20} strokeWidth={1} />
                        Dejar Reseña
                    </button>
                )}
            </div>

            {/* Load button */}
            {!loaded && !loading && (
                <button
                    onClick={loadReviews}
                    className="w-full text-[rgb(var(--color-gold))] text-xs uppercase tracking-wider hover:text-[rgb(var(--color-cream))] transition-colors cursor-pointer py-2"
                >
                    Ver reseñas del vendedor →
                </button>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-4">
                    <div className="w-5 h-5 border-2 border-[rgb(var(--color-gold)/0.3)] border-t-[rgb(var(--color-gold))] rounded-full animate-spin" />
                </div>
            )}

            {/* Error */}
            {error && (
                <p className="text-sm text-red-400 text-center py-2">{error}</p>
            )}

            {/* Empty */}
            {loaded && reviews.length === 0 && (
                <p className="text-sm text-[rgb(var(--color-cream)/0.5)] text-center py-4">
                    Este vendedor aún no tiene reseñas
                </p>
            )}

            {/* Reviews list */}
            {loaded && reviews.length > 0 && (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const reviewerName = [review.buyer.first_name, review.buyer.last_name]
                            .filter(Boolean)
                            .join(" ") || "Usuario"
                        const isOwn = user?.id === review.buyer.id

                        return (
                            <div key={review.id}>
                                <ReviewItem
                                    rating={review.rating}
                                    date={timeAgo(review.created_at)}
                                    description={review.comment || "Sin comentario"}
                                    reviewer={reviewerName}
                                />
                                {isOwn && (
                                    <div className="flex gap-3 mt-2 ml-1">
                                        <button
                                            onClick={() => { setEditingReview(review); setShowForm(true) }}
                                            className="fontMontserrat text-xs text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-cream))] transition-colors cursor-pointer uppercase tracking-wider"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deleting === review.id}
                                            className="fontMontserrat text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer uppercase tracking-wider disabled:opacity-50"
                                        >
                                            {deleting === review.id ? "Eliminando..." : "🗑️ Eliminar"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Review Form Modal */}
            {showForm && (
                <ReviewForm
                    sellerId={sellerId}
                    editingReview={editingReview ? {
                        id: editingReview.id,
                        rating: editingReview.rating,
                        comment: editingReview.comment,
                        sale_id: editingReview.sale_id ?? "",
                    } : null}
                    onClose={() => { setShowForm(false); setEditingReview(null) }}
                    onSaved={handleFormSaved}
                />
            )}
        </div>
    )
}
