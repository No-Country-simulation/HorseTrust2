"use client"

import { useState } from "react"
import Image from "next/image"
import MiniaturaImage from "./MiniaturaImage"
import ItemDetailHorse from "./ItemDetailHorse"
import DocsContainer from "./DocsContainer"
import styles from "./Horses.module.css"

interface Props {
  horse: any
}

export default function ColumnLeftContainer({ horse }: Props) {
  // Después esto va a venir de horse.images
  const images = [
    "/images/placeholder-horses.png",
    "/images/premium.jpg",
    "/images/logo.png",
  ]

  const [selectedImage, setSelectedImage] = useState(images[0])

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

      <div className="relative aspect-[4/3] bg-[rgb(var(--color-teal)/0.2)] overflow-hidden">
        <Image
          src={selectedImage}
          width={1200}
          height={800}
          alt={horse.name}
          className={`${styles.mainImage} w-full h-full object-cover transition-opacity duration-300`}
        />

        <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 text-xs text-[rgb(var(--color-cream))]">
          {images.findIndex((img) => img === selectedImage) + 1} /{" "}
          {images.length}
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {images.map((img, index) => (
          <MiniaturaImage
            key={index}
            src={img}
            isActive={selectedImage === img}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      <ItemDetailHorse horse={horse} />
      <DocsContainer date="20/01/2026" />
    </div>
  )
}
