"use client"

import { useState } from "react"

interface Props {
    sellerId: string
    editingReview?: {
        id: string
        rating: number
        comment: string | null
    } | null
    onClose: () => void
    onSaved: () => void
}

export default function ReviewForm({ sellerId, editingReview, onClose, onSaved }: Props) {
    const isEditing = !!editingReview
    const [rating, setRating] = useState(editingReview?.rating ?? 0)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [comment, setComment] = useState(editingReview?.comment ?? "")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            setError("Selecciona una calificación de 1 a 5 estrellas")
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
                res = await fetch(`/api/v1/users/${sellerId}/reviews`, {
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
                        disabled={submitting || rating < 1}
                        className="px-5 py-2 text-sm fontMontserrat font-medium uppercase tracking-wider cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-[rgb(var(--color-gold))] text-black hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))]"
                    >
                        {submitting ? "Enviando..." : isEditing ? "Actualizar" : "Enviar Reseña"}
                    </button>
                </div>
            </div>
        </div>
    )
}
