"use client";

import { useEffect, useState } from "react";
import { IoStorefrontOutline } from "react-icons/io5";

interface Horse {
  id: string;
  name: string;
  breed: string;
  price: number;
  sale_status: string;
}

interface ChatSalePanelProps {
  chatId: string;
  sellerId: string;
  buyerId: string;
  currentUserId: string;
  onSaleCreated: () => void;
}

export default function ChatSalePanel({
  chatId,
  sellerId,
  buyerId,
  currentUserId,
  onSaleCreated,
}: ChatSalePanelProps) {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHorseId, setSelectedHorseId] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isSeller = currentUserId === sellerId;

  useEffect(() => {
    if (!isSeller) return;

    fetch("/api/v1/me/horses")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          const available = (res.data as Horse[]).filter(
            (h) => h.sale_status !== "sold"
          );
          setHorses(available);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isSeller]);

  if (!isSeller) return null;

  const selectedHorse = horses.find((h) => h.id === selectedHorseId);

  const handleHorseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const horse = horses.find((h) => h.id === e.target.value);
    setSelectedHorseId(e.target.value);
    setPrice(horse ? String(horse.price) : "");
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!selectedHorseId || !price) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horseId: selectedHorseId,
          buyerId,
          price: Number(price),
        }),
      });
      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
        setSelectedHorseId("");
        setPrice("");
        onSaleCreated();
      } else {
        setError(data.message || "Error al registrar la venta");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="border-t border-gray-800 px-4 py-3 bg-gray-900/50">
        <p className="text-xs text-gray-400 animate-pulse text-center">
          Cargando caballos...
        </p>
      </div>
    );
  }

  if (horses.length === 0) {
    return (
      <div className="border-t border-gray-800 px-4 py-3 bg-gray-900/50">
        <div className="flex items-center gap-2 justify-center">
          <IoStorefrontOutline className="text-sm text-gray-500" />
          <p className="text-xs text-gray-500">
            No tienes caballos disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-800 px-4 py-3 bg-gray-900/50">
      <div className="flex items-center gap-2 mb-2">
        <IoStorefrontOutline
          className="text-sm"
          style={{ color: "rgb(181, 186, 114)" }}
        />
        <span
          className="text-xs font-medium"
          style={{ color: "rgb(238, 238, 255)" }}
        >
          Registrar venta
        </span>
      </div>

      {success && (
        <p className="text-xs text-green-400 mb-2">
          ¡Venta registrada con éxito!
        </p>
      )}

      {error && (
        <p className="text-xs text-red-400 mb-2">{error}</p>
      )}

      <div className="flex items-center gap-2">
        <select
          value={selectedHorseId}
          onChange={handleHorseChange}
          className="flex-1 bg-gray-800 rounded-lg px-3 py-1.5 text-sm outline-none appearance-none cursor-pointer"
          style={{ color: "rgb(238, 238, 255)" }}
        >
          <option value="">Seleccionar caballo</option>
          {horses.map((horse) => (
            <option key={horse.id} value={horse.id}>
              {horse.name} — {horse.breed}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5 gap-1 shrink-0">
          <span className="text-sm text-gray-400">$</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio"
            className="bg-transparent w-24 text-sm outline-none"
            style={{ color: "rgb(238, 238, 255)" }}
            min={0}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !selectedHorseId || !price}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity cursor-pointer disabled:opacity-40 shrink-0"
          style={{
            backgroundColor: "rgb(62, 98, 89)",
            color: "rgb(238, 238, 255)",
          }}
        >
          {submitting ? "Enviando..." : "Confirmar Venta"}
        </button>
      </div>

      {selectedHorse && (
        <p className="text-xs text-gray-400 mt-1.5">
          {selectedHorse.name} · {selectedHorse.breed} · Precio sugerido: ${selectedHorse.price.toLocaleString()}
        </p>
      )}
    </div>
  );
}
