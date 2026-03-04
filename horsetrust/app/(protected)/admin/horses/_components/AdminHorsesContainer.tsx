"use client"

import { useState } from "react"
import Link from "next/link"

interface Props {
  initialHorses: any[]
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

export default function AdminHorsesContainer({ initialHorses }: Props) {
  const [activeTab, setActiveTab] = useState("all")

  const filtered = activeTab === "all"
    ? initialHorses
    : initialHorses.filter((h) => h.verification_status === activeTab)

  const getCount = (key: string) =>
    key === "all"
      ? initialHorses.length
      : initialHorses.filter((h) => h.verification_status === key).length

  return (
    <div className="min-h-screen bg-black text-[rgb(var(--color-cream))] py-8 px-4 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="fontMontserrat text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] mb-3 uppercase">
            — Panel de Administración —
          </div>
          <h1 className="fontCormorant text-4xl lg:text-5xl text-[rgb(var(--color-cream))] uppercase tracking-wide">
            Gestión de Caballos
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
            No hay caballos en esta categoría
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 text-xs fontMontserrat uppercase tracking-wider text-[rgb(var(--color-cream)/0.5)]">
              <span>Nombre</span>
              <span>Raza</span>
              <span>Disciplina</span>
              <span>Precio</span>
              <span>Estado</span>
              <span>Acción</span>
            </div>

            {filtered.map((horse: any) => {
              const config = STATUS_CONFIG[horse.verification_status] || STATUS_CONFIG.pending
              return (
                <div
                  key={horse.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center px-6 py-4 bg-black/50 border border-[rgb(var(--color-cream)/0.1)] hover:border-[rgb(var(--color-gold)/0.3)] transition-colors"
                >
                  <div>
                    <span className="md:hidden text-xs text-[rgb(var(--color-cream)/0.5)] uppercase">Nombre: </span>
                    <span className="fontCormorant text-lg text-[rgb(var(--color-cream))]">{horse.name}</span>
                  </div>
                  <div>
                    <span className="md:hidden text-xs text-[rgb(var(--color-cream)/0.5)] uppercase">Raza: </span>
                    <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.7)]">{horse.breed}</span>
                  </div>
                  <div>
                    <span className="md:hidden text-xs text-[rgb(var(--color-cream)/0.5)] uppercase">Disciplina: </span>
                    <span className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.7)]">{horse.discipline}</span>
                  </div>
                  <div>
                    <span className="md:hidden text-xs text-[rgb(var(--color-cream)/0.5)] uppercase">Precio: </span>
                    <span className="fontMontserrat text-sm text-[rgb(var(--color-gold))]">
                      {horse.price != null ? `$${horse.price.toLocaleString()}` : "A consultar"}
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
                      href={`/admin/horses/${horse.id}`}
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
