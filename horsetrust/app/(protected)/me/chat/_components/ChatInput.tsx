"use client";

import { useState, useRef } from "react";
import { IoSend, IoImageOutline, IoCloseCircle } from "react-icons/io5";

interface ChatInputProps {
  onSend: (content: string) => void;
  onImageUpload: (file: File) => void;
  onTyping: () => void;
  disabled?: boolean;
}

const SPAM_LIMIT = 5;
const SPAM_WINDOW_MS = 10_000;

export default function ChatInput({
  onSend,
  onImageUpload,
  onTyping,
  disabled,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [spamWarning, setSpamWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendTimestamps = useRef<number[]>([]);

  const isSpamming = (): boolean => {
    const now = Date.now();
    sendTimestamps.current = sendTimestamps.current.filter(
      (t) => now - t < SPAM_WINDOW_MS
    );
    if (sendTimestamps.current.length >= SPAM_LIMIT) {
      setSpamWarning(true);
      setTimeout(() => setSpamWarning(false), 3000);
      return true;
    }
    sendTimestamps.current.push(now);
    return false;
  };

  const handleSend = () => {
    if (disabled) return;
    if (isSpamming()) return;

    if (selectedFile) {
      onImageUpload(selectedFile);
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onTyping();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Solo se permiten imágenes (JPEG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border-t border-gray-700 p-3">
      {spamWarning && (
        <p className="text-xs text-red-400 mb-2 text-center">
          Estás enviando mensajes muy rápido. Espera unos segundos.
        </p>
      )}

      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img
            src={imagePreview}
            alt="Vista previa"
            className="h-20 rounded-lg object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute -top-1 -right-1 cursor-pointer"
            title="Quitar imagen"
          >
            <IoCloseCircle className="text-lg text-red-400" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Seleccionar imagen"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
          title="Enviar imagen"
        >
          <IoImageOutline
            className="text-lg"
            style={{ color: "rgb(238, 238, 255)" }}
          />
        </button>

        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedFile ? "Imagen lista para enviar" : "Escribe un mensaje..."}
          disabled={!!selectedFile}
          className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm outline-none placeholder-gray-500 disabled:opacity-50"
          style={{ color: "rgb(238, 238, 255)" }}
          maxLength={2000}
        />

        <button
          onClick={handleSend}
          disabled={disabled || (!input.trim() && !selectedFile)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-40 shrink-0"
          style={{ backgroundColor: "rgb(62, 98, 89)" }}
          title="Enviar"
        >
          <IoSend
            className="text-sm"
            style={{ color: "rgb(238, 238, 255)" }}
          />
        </button>
      </div>
    </div>
  );
}
