"use client"

import { useState } from "react"

interface Props {
  horseId: string
  horseName: string
  currentStatus: string
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente", color: "rgb(234, 179, 8)", bg: "rgba(234, 179, 8, 0.15)", icon: "⏳" },
  { value: "verified", label: "Verificado", color: "rgb(34, 197, 94)", bg: "rgba(34, 197, 94, 0.15)", icon: "✅" },
  { value: "rejected", label: "Rechazado", color: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.15)", icon: "❌" },
]

export default function VerificationStatusChanger({ horseId, horseName, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const currentConfig = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]
  const selectedConfig = STATUS_OPTIONS.find((s) => s.value === selectedStatus)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
    setError(null)
    setSuccess(null)
    setShowConfirm(false)
  }

  const handlePrepareSubmit = () => {
    if (!selectedStatus || selectedStatus === status) {
      setError("Selecciona un estado diferente al actual")
      return
    }
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`/api/v1/admin/horses/${horseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          reason: reason.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (data.ok) {
        setStatus(selectedStatus)
        setSuccess(`Estado actualizado a "${selectedConfig?.label}". Se envió un mensaje automático al vendedor.`)
        setSelectedStatus("")
        setReason("")
        setShowConfirm(false)
      } else {
        setError(data.message || "Error al actualizar el estado")
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
        <span className="text-[rgb(var(--color-gold))] text-lg">◆</span>
        <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">
          Verificación
        </h3>
      </div>

      {/* Current status */}
      <div className="mb-6">
        <div className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2">
          Estado actual
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentConfig.icon}</span>
          <span
            className="fontMontserrat text-sm px-3 py-1.5 rounded-full uppercase tracking-wider font-medium"
            style={{ color: currentConfig.color, backgroundColor: currentConfig.bg }}
          >
            {currentConfig.label}
          </span>
        </div>
      </div>

      {/* Status selector */}
      <div className="mb-4">
        <div className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2">
          Cambiar estado a
        </div>
        <select
          value={selectedStatus}
          onChange={handleSelectChange}
          className="w-full bg-gray-900 border border-[rgb(var(--color-cream)/0.2)] rounded-lg px-4 py-2.5 text-sm fontMontserrat outline-none cursor-pointer appearance-none"
          style={{ color: "rgb(var(--color-cream))" }}
        >
          <option value="">Seleccionar nuevo estado...</option>
          {STATUS_OPTIONS.filter((s) => s.value !== status).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.icon} {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reason textarea */}
      {selectedStatus && (
        <div className="mb-4">
          <div className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2">
            Motivo / Mensaje {selectedStatus === "rejected" ? "(recomendado)" : "(opcional)"}
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              selectedStatus === "rejected"
                ? "Explica al vendedor por qué se rechazó..."
                : "Mensaje opcional para el vendedor..."
            }
            rows={3}
            className="w-full bg-gray-900 border border-[rgb(var(--color-cream)/0.2)] rounded-lg px-4 py-2.5 text-sm fontMontserrat outline-none resize-none focus:border-[rgb(var(--color-gold)/0.5)]"
            style={{ color: "rgb(var(--color-cream))" }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 fontMontserrat mb-3">{error}</p>
      )}

      {/* Success */}
      {success && (
        <div className="mb-3 p-3 rounded-lg border border-green-500/30 bg-green-500/10">
          <p className="text-sm text-green-400 fontMontserrat">{success}</p>
        </div>
      )}

      {/* Confirmation step */}
      {showConfirm && selectedConfig && (
        <div className="mb-4 p-4 rounded-lg border border-[rgb(var(--color-gold)/0.3)] bg-[rgb(var(--color-gold)/0.05)]">
          <p className="fontMontserrat text-sm text-[rgb(var(--color-cream))] mb-3">
            ¿Confirmas cambiar el estado de <strong>&quot;{horseName}&quot;</strong> a{" "}
            <span style={{ color: selectedConfig.color }}>{selectedConfig.label}</span>?
          </p>
          <p className="fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] mb-4">
            Se enviará un mensaje automático al vendedor informando este cambio.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 px-4 py-2 text-sm fontMontserrat font-medium uppercase tracking-wider rounded-lg transition-opacity cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: selectedConfig.color, color: "#000" }}
            >
              {submitting ? "Actualizando..." : "Confirmar"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-sm fontMontserrat text-[rgb(var(--color-cream)/0.6)] border border-[rgb(var(--color-cream)/0.2)] rounded-lg hover:border-[rgb(var(--color-cream)/0.4)] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Submit button (before confirmation) */}
      {selectedStatus && !showConfirm && (
        <button
          onClick={handlePrepareSubmit}
          className="w-full px-6 py-3 bg-[rgb(var(--color-gold))] text-black text-sm fontMontserrat tracking-[0.125em] uppercase font-medium hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 cursor-pointer"
        >
          Actualizar Estado
        </button>
      )}
    </div>
  )
}
