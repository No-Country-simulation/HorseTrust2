"use client"

import { useState } from "react"
import Link from "next/link"
import { Video } from "lucide-react"

interface Props {
  initialVideos: any[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pendiente", color: "rgb(234, 179, 8)", bg: "rgba(234, 179, 8, 0.15)" },
  verified: { label: "Verificado", color: "rgb(34, 197, 94)", bg: "rgba(34, 197, 94, 0.15)" },
  rejected: { label: "Rechazado", color: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.15)" },
}

const TABS = [
  { key: "all", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "verified", label: "Verificados" },
  { key: "rejected", label: "Rechazados" },
]

function getVideoStatus(video: any): string {
  if (video.verified === true) return "verified"
  if (video.verified === false && video.reason) return "rejected"
  return "pending"
}

export default function AdminVideosContainer({ initialVideos }: Props) {
  const [activeTab, setActiveTab] = useState("all")

  const filtered = activeTab === "all"
    ? initialVideos
    : initialVideos.filter((v) => getVideoStatus(v) === activeTab)

  const getCount = (key: string) =>
    key === "all"
      ? initialVideos.length
      : initialVideos.filter((v) => getVideoStatus(v) === key).length

  return (
    <div className="min-h-screen bg-black text-[rgb(var(--color-cream))] py-8 px-4 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="fontMontserrat text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] mb-3 uppercase">
            — Panel de Administración —
          </div>
          <h1 className="fontCormorant text-4xl lg:text-5xl text-[rgb(var(--color-cream))] uppercase tracking-wide">
            Gestión de Videos
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`fontMontserrat px-4 py-2 text-sm uppercase tracking-wider transition-all cursor-pointer border ${
                activeTab === tab.key
                  ? "bg-[rgb(var(--color-gold))] text-black border-[rgb(var(--color-gold))]"
                  : "bg-transparent text-[rgb(var(--color-cream)/0.7)] border-[rgb(var(--color-cream)/0.2)] hover:border-[rgb(var(--color-gold)/0.5)]"
              }`}
            >
              {tab.label} ({getCount(tab.key)})
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[rgb(var(--color-cream)/0.5)] fontMontserrat">
            No hay videos en esta categoría
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 text-xs fontMontserrat uppercase tracking-wider text-[rgb(var(--color-cream)/0.5)]">
              <span>Video</span>
              <span>Caballo</span>
              <span>Vendedor</span>
              <span>Estado</span>
              <span>Acción</span>
            </div>

            {filtered.map((video: any) => {
              const statusKey = getVideoStatus(video)
              const config = STATUS_CONFIG[statusKey]
              return (
                <div
                  key={video.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center px-6 py-4 bg-black/50 border border-[rgb(var(--color-cream)/0.1)] hover:border-[rgb(var(--color-gold)/0.3)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-[rgb(var(--color-cream)/0.5)]" />
                    <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.7)] truncate">
                      {video.url ? video.url.substring(0, 30) + "..." : "Sin URL"}
                    </span>
                  </div>
                  <div>
                    <span className="md:hidden text-xs text-[rgb(var(--color-cream)/0.5)] uppercase">Caballo: </span>
                    <span className="fontCormorant text-lg text-[rgb(var(--color-cream))]">
                      {video.horse?.name || video.horse_name || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="md:hidden text-xs text-[rgb(var(--color-cream)/0.5)] uppercase">Vendedor: </span>
                    <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.7)]">
                      {video.user?.first_name || "—"}
                    </span>
                  </div>
                  <div>
                    <span
                      className="fontMontserrat text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium"
                      style={{ color: config.color, backgroundColor: config.bg }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/admin/videos/${video.id}`}
                      className="fontMontserrat text-sm text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-cream))] transition-colors uppercase tracking-wider"
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
