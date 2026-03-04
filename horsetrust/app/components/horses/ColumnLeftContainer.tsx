"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import MiniaturaImage from "./MiniaturaImage"
import ItemDetailHorse from "./ItemDetailHorse"
import DocsContainer from "./DocsContainer"
import styles from "./Horses.module.css"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  horse: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any[]
}

export default function ColumnLeftContainer({ horse, documents }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>("")

  // Calcular imágenes desde los documentos del caballo
  const images = useMemo(() => {
    if (documents && Array.isArray(documents)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imageDocuments = documents.filter((doc: any) => doc.type === 'image' && doc.url)

      if (imageDocuments.length > 0) {
        // Convertir URLs API a URLs públicas
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return imageDocuments.map((doc: any) =>
          doc.url.replace('/api/v1/uploads/', '/uploads/')
        )
      }
    }
    return ["/images/placeholder-horses.png"]
  }, [documents])

  // Usar la primera imagen como inicial si no hay seleccionada
  const displayImage = selectedImage || images[0] || "/images/placeholder-horses.png"

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="fontCormorant bg-[rgb(var(--color-gold))] text-black px-4 py-2 text-xs uppercase tracking-wider font-medium">
          ✓ Caballo {horse.verification_status}
        </div>
        <div className="text-xs text-[rgb(var(--color-cream)/0.6)]">
          ID: {horse.id}
        </div>
      </div>

      <div className="relative w-full bg-[rgb(var(--color-teal)/0.2)] flex items-center justify-center min-h-[400px]">
        <Image
          src={displayImage}
          width={1200}
          height={800}
          alt={horse.name}
          className={`${styles.mainImage} w-full h-auto object-contain max-h-[500px]`}
          onError={() => setSelectedImage("")}
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {images.map((img, index) => (
          <MiniaturaImage
            key={index}
            src={img}
            isActive={displayImage === img}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      <ItemDetailHorse horse={horse} />

      <DocsContainer
        documents={documents}
      />
    </div>
  )
}
