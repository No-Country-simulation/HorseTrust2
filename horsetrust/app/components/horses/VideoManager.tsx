"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Video, CheckCircle, Clock, XCircle } from "lucide-react"
import VideoPlayer from "./VideoPlayer"

interface Props {
  horseId: string
}

function getStatusInfo(video: any) {
  if (video.verified === true) {
    return { label: "Verificado", icon: <CheckCircle size={14} />, color: "rgb(34, 197, 94)", bg: "rgba(34, 197, 94, 0.15)" }
  }
  if (video.verified === false && video.reason) {
    return { label: "Rechazado", icon: <XCircle size={14} />, color: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.15)" }
  }
  return { label: "Pendiente de revisión", icon: <Clock size={14} />, color: "rgb(234, 179, 8)", bg: "rgba(234, 179, 8, 0.15)" }
}

export default function VideoManager({ horseId }: Props) {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadVideos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/horses/${horseId}/videos`)
      const data = await res.json()
      if (data.ok) {
        setVideos(data.data ?? [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [horseId])

  useEffect(() => {
    loadVideos()
  }, [loadVideos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append("video_url", url.trim())

      const res = await fetch(`/api/v1/horses/${horseId}/videos`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.ok) {
        setSuccess("Video agregado correctamente. Pendiente de revisión.")
        setUrl("")
        loadVideos()
      } else {
        setError(data.message || "Error al agregar el video")
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Video size={20} className="text-[rgb(var(--color-gold))]" />
        <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">
          Videos del Caballo
        </h3>
      </div>

      {/* Add video form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2">
          Agregar video de YouTube
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 bg-gray-900 border border-[rgb(var(--color-cream)/0.2)] px-4 py-2.5 text-sm fontMontserrat outline-none focus:border-[rgb(var(--color-gold)/0.5)]"
            style={{ color: "rgb(var(--color-cream))" }}
          />
          <button
            type="submit"
            disabled={submitting || !url.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[rgb(var(--color-gold))] text-black text-sm fontMontserrat uppercase tracking-wider font-medium hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <Plus size={16} />
            {submitting ? "Enviando..." : "Agregar"}
          </button>
        </div>
      </form>

      {/* Messages */}
      {error && (
        <p className="text-sm text-red-400 fontMontserrat mb-3">{error}</p>
      )}
      {success && (
        <div className="mb-3 p-3 border border-green-500/30 bg-green-500/10">
          <p className="text-sm text-green-400 fontMontserrat">{success}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-[rgb(var(--color-gold)/0.3)] border-t-[rgb(var(--color-gold))] rounded-full animate-spin" />
        </div>
      )}

      {/* Existing videos */}
      {!loading && videos.length === 0 && (
        <p className="text-sm text-[rgb(var(--color-cream)/0.5)] text-center py-4 fontMontserrat">
          No hay videos cargados
        </p>
      )}

      {!loading && videos.length > 0 && (
        <div className="space-y-6">
          {videos.map((video: any) => {
            const status = getStatusInfo(video)
            return (
              <div key={video.id} className="border border-[rgb(var(--color-cream)/0.1)] p-4">
                <VideoPlayer url={video.url} title={video.purpose || video.category} />
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="fontMontserrat text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium flex items-center gap-1.5"
                    style={{ color: status.color, backgroundColor: status.bg }}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>
                {video.verified === false && video.reason && (
                  <div className="mt-2 p-3 border border-red-500/20 bg-red-500/5">
                    <p className="fontMontserrat text-xs text-red-400">
                      <strong>Motivo:</strong> {video.reason}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
