"use client"

import { useState } from "react"

interface Props {
    sellerId: string
    editingReview?: {
        id: string
        rating: number
        comment: string | null
        sale_id: string
    } | null
    onClose: () => void
    onSaved: () => void
}

export default function ReviewForm({ sellerId, editingReview, onClose, onSaved }: Props) {
    const isEditing = !!editingReview
    const [rating, setRating] = useState(editingReview?.rating ?? 0)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [comment, setComment] = useState(editingReview?.comment ?? "")
    const [saleId, setSaleId] = useState(editingReview?.sale_id ?? "")
    const [sales, setSales] = useState<{ id: string; horse: { name: string }; price: number }[]>([])
    const [loadingSales, setLoadingSales] = useState(false)
    const [salesLoaded, setSalesLoaded] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadMySales = async () => {
        if (salesLoaded) return
        setLoadingSales(true)
        try {
            const res = await fetch("/api/v1/me")
            const meData = await res.json()
            if (!meData.ok) return

            const salesRes = await fetch(`/api/v1/horses?limit=100`)
            const salesData = await salesRes.json()

            // We need to find sales where this user is buyer and seller is the target seller
            // Use the chats/sales endpoint or a direct query
            // For simplicity, let's fetch all sales via a dedicated approach
            // Actually the cleanest way: fetch sales from user purchases
            // But there's no direct endpoint. Let's search for completed sales with this seller
            // We'll use a workaround: find chats between me and seller, then get sales
            const chatsRes = await fetch("/api/v1/chats")
            const chatsData = await chatsRes.json()

            if (!chatsData.ok) return

            const myId = meData.data?.id
            const chat = (chatsData.data ?? []).find(
                (c: any) =>
                    (c.buyer.id === myId && c.seller.id === sellerId) ||
                    (c.seller.id === myId && c.buyer.id === sellerId)
            )

            if (chat) {
                const chatSalesRes = await fetch(`/api/v1/chats/${chat.id}/sales`)
                const chatSalesData = await chatSalesRes.json()
                if (chatSalesData.ok) {
                    // Only show sales where this user is the buyer and no review from this user yet
                    const mySales = (chatSalesData.data ?? []).filter(
                        (s: any) =>
                            s.buyer_id === myId &&
                            !s.reviews?.some((r: any) => r.buyer_id === myId)
                    )
                    setSales(mySales)
                }
            }

            setSalesLoaded(true)
        } catch {
            setError("Error al cargar ventas disponibles")
        } finally {
            setLoadingSales(false)
        }
    }

    // Load sales when creating (not editing)
    if (!isEditing && !salesLoaded && !loadingSales) {
        loadMySales()
    }

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            setError("Selecciona una calificación de 1 a 5 estrellas")
            return
        }

        if (!isEditing && !saleId) {
            setError("Selecciona una venta para dejar tu reseña")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            let res: Response

            if (isEditing) {
                res = await fetch(`/api/v1/reviews/${editingReview.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rating,
                        comment: comment.trim() || null,
                    }),
                })
            } else {
                res = await fetch(`/api/v1/sales/${saleId}/reviews`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rating,
                        comment: comment.trim() || null,
                    }),
                })
            }

            const data = await res.json()

            if (data.ok) {
                onSaved()
            } else {
                setError(data.message || "Error al guardar la reseña")
            }
        } catch {
            setError("Error de conexión. Intenta de nuevo.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={onClose}
        >
            <div
                className="rounded-xl p-6 w-full max-w-md border border-[rgb(var(--color-gold)/0.3)]"
                style={{ backgroundColor: "rgb(17, 17, 17)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide mb-5">
                    {isEditing ? "Editar Reseña" : "Dejar Reseña"}
                </h2>

                {/* Sale selector (only for new reviews) */}
                {!isEditing && (
                    <div className="mb-4">
                        <div className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2">
                            Seleccionar compra
                        </div>
                        {loadingSales ? (
                            <div className="flex items-center gap-2 py-2">
                                <div className="w-4 h-4 border-2 border-[rgb(var(--color-gold)/0.3)] border-t-[rgb(var(--color-gold))] rounded-full animate-spin" />
                                <span className="text-xs text-[rgb(var(--color-cream)/0.5)]">Buscando compras...</span>
                            </div>
                        ) : sales.length === 0 ? (
                            <p className="text-xs text-[rgb(var(--color-cream)/0.5)] py-2">
                                No tienes compras pendientes de reseña con este vendedor.
                            </p>
                        ) : (
                            <select
                                value={saleId}
                                onChange={(e) => setSaleId(e.target.value)}
                                className="w-full bg-gray-900 border border-[rgb(var(--color-cream)/0.2)] rounded-lg px-4 py-2.5 text-sm fontMontserrat outline-none cursor-pointer appearance-none"
                                style={{ color: "rgb(238, 238, 255)" }}
                            >
                                <option value="">Seleccionar compra...</option>
                                {sales.map((sale) => (
                                    <option key={sale.id} value={sale.id}>
                                        {sale.horse.name} — ${sale.price.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {/* Star rating */}
                <div className="mb-4">
                    <div className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2">
                        Calificación
                    </div>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => {
                            const starIndex = i + 1
                            const filled = starIndex <= (hoveredStar || rating)
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    className="text-2xl cursor-pointer transition-colors"
                                    onClick={() => setRating(starIndex)}
                                    onMouseEnter={() => setHoveredStar(starIndex)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                >
                                    <span style={{ color: filled ? "rgb(var(--color-gold))" : "rgba(238, 238, 255, 0.2)" }}>
                                        ★
                                    </span>
                                </button>
                            )
                        })}
                        {rating > 0 && (
                            <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.6)] ml-2">
                                {rating}/5
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                    <div className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2">
                        Comentario (opcional)
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Describe tu experiencia con este vendedor..."
                        rows={3}
                        className="w-full bg-gray-900 border border-[rgb(var(--color-cream)/0.2)] rounded-lg px-4 py-2.5 text-sm fontMontserrat outline-none resize-none focus:border-[rgb(var(--color-gold)/0.5)]"
                        style={{ color: "rgb(238, 238, 255)" }}
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-400 fontMontserrat mb-3">{error}</p>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.6)] cursor-pointer hover:text-[rgb(var(--color-cream))] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || rating < 1 || (!isEditing && !saleId)}
                        className="px-5 py-2 text-sm fontMontserrat font-medium uppercase tracking-wider cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[rgb(var(--color-gold))] text-black hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))]"
                    >
                        {submitting ? "Enviando..." : isEditing ? "Actualizar" : "Enviar Reseña"}
                    </button>
                </div>
            </div>
        </div>
    )
}
