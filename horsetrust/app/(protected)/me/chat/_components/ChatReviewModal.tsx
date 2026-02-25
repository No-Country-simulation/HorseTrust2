"use client";

import { useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";

interface ChatReviewModalProps {
  saleId: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export default function ChatReviewModal({
  saleId,
  onClose,
  onReviewSubmitted,
}: ChatReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating < 1) {
      setError("Selecciona al menos una estrella.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/sales/${saleId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() || null }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Error al enviar la reseña.");
      }

      onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la reseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-full max-w-md"
        style={{ backgroundColor: "rgb(26, 26, 26)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-lg font-semibold fontMontserrat mb-4"
          style={{ color: "rgb(238, 238, 255)" }}
        >
          Dejar Reseña
        </h2>

        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: 5 }, (_, i) => {
            const starIndex = i + 1;
            const filled = starIndex <= (hoveredStar || rating);
            return (
              <button
                key={i}
                type="button"
                className="text-2xl cursor-pointer transition-colors"
                onClick={() => setRating(starIndex)}
                onMouseEnter={() => setHoveredStar(starIndex)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                {filled ? (
                  <IoStar style={{ color: "rgb(181, 186, 114)" }} />
                ) : (
                  <IoStarOutline style={{ color: "rgb(238, 238, 255, 0.3)" }} />
                )}
              </button>
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe un comentario opcional..."
          rows={3}
          className="w-full rounded-lg p-3 text-sm fontMontserrat resize-none outline-none border border-gray-700 focus:border-gray-500"
          style={{
            backgroundColor: "rgb(17, 17, 17)",
            color: "rgb(238, 238, 255)",
          }}
        />

        {error && (
          <p className="text-sm text-red-400 mt-2 fontMontserrat">{error}</p>
        )}

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-sm fontMontserrat cursor-pointer hover:underline"
            style={{ color: "rgb(238, 238, 255, 0.6)" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold fontMontserrat cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "rgb(62, 98, 89)",
              color: "rgb(238, 238, 255)",
            }}
          >
            {loading ? "Enviando..." : "Enviar Reseña"}
          </button>
        </div>
      </div>
    </div>
  );
}
