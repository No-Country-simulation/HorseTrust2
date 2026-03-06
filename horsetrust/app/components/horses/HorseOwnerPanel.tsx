"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Save, X } from "lucide-react"
import { Sex, Discipline } from "@/lib/database/enums"
import VideoManager from "./VideoManager"

interface Props {
  horse: any
  documents: any[]
}

export default function HorseOwnerPanel({ horse, documents }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [form, setForm] = useState({
    name: horse.name || "",
    age: horse.age ?? "",
    sex: horse.sex || "",
    breed: horse.breed || "",
    discipline: horse.discipline || "",
    price: horse.price ?? "",
    color: horse.color || "",
    height: horse.height ?? "",
    description: horse.description || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }))
  }

  const handleSave = async () => {
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    const updates: Record<string, unknown> = {}
    if (form.name !== horse.name) updates.name = form.name
    if (form.age !== "" && Number(form.age) !== horse.age) updates.age = Number(form.age)
    if (form.sex && form.sex !== horse.sex) updates.sex = form.sex
    if (form.breed !== horse.breed) updates.breed = form.breed
    if (form.discipline && form.discipline !== horse.discipline) updates.discipline = form.discipline
    if (form.price !== "" && Number(form.price) !== horse.price) updates.price = Number(form.price)
    if (form.color !== horse.color) updates.color = form.color
    if (form.height !== "" && Number(form.height) !== horse.height) updates.height = Number(form.height)
    if (form.description !== horse.description) updates.description = form.description

    if (Object.keys(updates).length === 0) {
      setError("No hay cambios para guardar")
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`/api/v1/horses/${horse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const data = await res.json()

      if (data.ok) {
        setSuccess("Caballo actualizado. Pasará a revisión nuevamente.")
        setEditing(false)
        setTimeout(() => router.refresh(), 1500)
      } else {
        setError(data.message || "Error al actualizar")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/v1/horses/${horse.id}`, { method: "DELETE" })
      const data = await res.json()

      if (data.ok) {
        router.push("/me")
      } else {
        setError(data.message || "Error al eliminar")
        setShowDeleteConfirm(false)
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setDeleting(false)
    }
  }

  const inputClass = "w-full bg-gray-900 border border-[rgb(var(--color-cream)/0.2)] px-4 py-2.5 text-sm fontMontserrat outline-none focus:border-[rgb(var(--color-gold)/0.5)]"
  const labelClass = "fontMontserrat text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-1"

  return (
    <div className="space-y-8">
      {/* Edit Horse Data */}
      <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-[rgb(var(--color-gold))] text-lg">◆</span>
            <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">
              Editar Caballo
            </h3>
          </div>
          {!editing ? (
            <button
              onClick={() => { setEditing(true); setSuccess(null); setError(null) }}
              className="flex items-center gap-2 px-4 py-2 text-sm fontMontserrat text-[rgb(var(--color-gold))] border border-[rgb(var(--color-gold)/0.3)] hover:bg-[rgb(var(--color-gold)/0.1)] transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Pencil size={14} />
              Editar
            </button>
          ) : (
            <button
              onClick={() => { setEditing(false); setError(null) }}
              className="flex items-center gap-2 px-4 py-2 text-sm fontMontserrat text-[rgb(var(--color-cream)/0.6)] border border-[rgb(var(--color-cream)/0.2)] hover:border-[rgb(var(--color-cream)/0.4)] transition-colors cursor-pointer"
            >
              <X size={14} />
              Cancelar
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <div className={labelClass}>Nombre</div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                style={{ color: "rgb(var(--color-cream))" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className={labelClass}>Edad</div>
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ color: "rgb(var(--color-cream))" }}
                />
              </div>
              <div>
                <div className={labelClass}>Sexo</div>
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ color: "rgb(var(--color-cream))" }}
                >
                  {Object.values(Sex).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className={labelClass}>Raza</div>
              <input
                name="breed"
                value={form.breed}
                onChange={handleChange}
                className={inputClass}
                style={{ color: "rgb(var(--color-cream))" }}
              />
            </div>

            <div>
                <div className={labelClass}>Color</div>
                <input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ color: "rgb(var(--color-cream))" }}
                />
            </div>

            <div>
                <div className={labelClass}>Altura (cm)</div>
                <input
                    name="height"
                    type="number"
                    value={form.height}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ color: "rgb(var(--color-cream))" }}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className={labelClass}>Disciplina</div>
                <select
                  name="discipline"
                  value={form.discipline}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ color: "rgb(var(--color-cream))" }}
                >
                  {Object.values(Discipline).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                    <div className={labelClass}>Precio</div>
                    <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className={inputClass}
                    style={{ color: "rgb(var(--color-cream))" }}
                    />
              </div>
              

            </div>
            <div>
                <div className={labelClass}>Descripción</div>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={4}
                    className={`${inputClass} resize-none`}
                    style={{ color: "rgb(var(--color-cream))" }}
                />
            </div>

            <div className="fontMontserrat text-xs text-yellow-500/80 p-3 border border-yellow-500/20 bg-yellow-500/5">
              ⚠️ Al guardar cambios, el caballo pasará automáticamente a estado "Pendiente de aprobación".
            </div>

            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[rgb(var(--color-gold))] text-black text-sm fontMontserrat tracking-[0.125em] uppercase font-medium hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        ) : (
          <div className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.6)]">
            Presiona "Editar" para modificar los datos del caballo.
          </div>
        )}

        {error && <p className="text-sm text-red-400 fontMontserrat mt-3">{error}</p>}
        {success && (
          <div className="mt-3 p-3 border border-green-500/30 bg-green-500/10">
            <p className="text-sm text-green-400 fontMontserrat">{success}</p>
          </div>
        )}
      </div>

      {/* Video Manager */}
      <VideoManager horseId={horse.id} />

      {/* Delete Horse */}
      <div className="bg-black/50 border border-red-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 size={18} className="text-red-400" />
          <h3 className="fontCormorant text-2xl text-red-400 uppercase tracking-wide">
            Zona Peligrosa
          </h3>
        </div>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 border border-red-500/30 text-red-400 text-sm fontMontserrat uppercase tracking-wider hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            Eliminar Caballo
          </button>
        ) : (
          <div className="p-4 border border-red-500/30 bg-red-500/5">
            <p className="fontMontserrat text-sm text-[rgb(var(--color-cream))] mb-3">
              ¿Estás seguro de eliminar <strong>{horse.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white text-sm fontMontserrat font-medium uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Sí, Eliminar"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm fontMontserrat text-[rgb(var(--color-cream)/0.6)] border border-[rgb(var(--color-cream)/0.2)] hover:border-[rgb(var(--color-cream)/0.4)] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
