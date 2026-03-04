"use client"

import { useState, useEffect } from "react"
import VideoPlayer from "./VideoPlayer"

interface Props {
  horseId: string
  showAll?: boolean
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: "Verificado", color: "rgb(34, 197, 94)", bg: "rgba(34, 197, 94, 0.15)" },
  pending: { label: "Pendiente", color: "rgb(234, 179, 8)", bg: "rgba(234, 179, 8, 0.15)" },
  rejected: { label: "Rechazado", color: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.15)" },
}

function getVideoStatus(video: any): string {
  if (video.verified === true) return "verified"
  if (video.verified === false && video.reason) return "rejected"
  return "pending"
}

export default function VideoSection({ horseId, showAll }: Props) {
  const [videos, setVideos] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch(`/api/v1/horses/${horseId}/videos`)
        const data = await res.json()
        if (data.ok) {
          const all = data.data ?? []
          setVideos(showAll ? all : all.filter((v: any) => v.verified === true))
        }
      } catch {
        // silently fail
      } finally {
        setLoaded(true)
      }
    }
    fetchVideos()
  }, [horseId, showAll])

  if (!loaded || videos.length === 0) return null

  return (
    <div className="bg-black/50 border border-[rgb(var(--color-teal)/0.3)] p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[rgb(var(--color-teal))] text-xl">◆</span>
        <h2 className="fontCormorant text-3xl text-[rgb(var(--color-teal))] uppercase tracking-wide">
          Videos
        </h2>
      </div>

      <div className="space-y-6">
        {videos.map((video: any) => (
          <div key={video.id}>
            <VideoPlayer url={video.url} title={video.purpose || video.category} />
            <div className="mt-2 flex items-center gap-3">
              {showAll && (() => {
                const status = STATUS_CONFIG[getVideoStatus(video)]
                return (
                  <span
                    className="fontMontserrat text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium"
                    style={{ color: status.color, backgroundColor: status.bg }}
                  >
                    {status.label}
                  </span>
                )
              })()}
              {(video.category || video.purpose) && (
                <span className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider">
                  {[video.category, video.purpose].filter(Boolean).join(" — ")}
                </span>
              )}
            </div>
            {showAll && video.reason && (
              <div className="mt-2 p-3 border border-red-500/20 bg-red-500/5">
                <p className="fontMontserrat text-xs text-red-400">
                  <strong>Motivo:</strong> {video.reason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
