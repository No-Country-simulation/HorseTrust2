"use client"

import { useState } from "react"
import DocsItem from "./DocsItem"

interface Props {
  documents: any[]
}

export default function DocsContainer({ documents }: Props) {
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

    const latestDocumentDate =
        documents.length > 0
        ? new Date(
            Math.max(...documents.map((doc) => new Date(doc.created_at).getTime()))
            )
        : null

    return (
        <>
            <div className="bg-black/50 border border-[rgb(var(--color-terracota)/0.4)] p-8">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[rgb(var(--color-terracota))] text-xl">◆</span>
                    <h2 className="fontCormorant text-3xl text-[rgb(var(--color-terracota))] uppercase tracking-wide">
                        Documentación
                    </h2>
                </div>

                <div className="space-y-4">
                    {documents.length === 0 && (
                        <div className="text-sm text-[rgb(var(--color-cream)/0.6)]">
                        No hay documentación cargada.
                        </div>
                    )}

                    {documents.map((doc) => (
                        <DocsItem
                        key={doc.id}
                        title={`${doc.category} - ${doc.purpose}`}
                        info={`Subido el: ${new Date(doc.created_at).toLocaleDateString()}`}
                        url={`${process.env.NEXT_PUBLIC_BASE_URL}${doc.url}`}
                        onPreview={(url) => setSelectedDoc(url)}
                        />
                    ))}
                </div>

                <div className="mt-6 p-4 bg-[rgb(var(--color-teal)/0.1)] border border-[rgb(var(--color-teal)/0.3)]">
                    <div className="text-xs text-[rgb(var(--color-cream)/0.7)]">
                        {latestDocumentDate
                        ? `Última actualización: ${latestDocumentDate.toLocaleDateString()}`
                        : "Sin documentos verificados"}
                    </div>
                </div>
            </div>

            {selectedDoc && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-black w-[90%] h-[90%] relative border border-[rgb(var(--color-gold))]">
                        
                        <button
                        onClick={() => setSelectedDoc(null)}
                        className="absolute top-2 right-3 text-white text-xl"
                        >
                        ✕
                        </button>

                        <iframe
                        src={selectedDoc}
                        className="w-full h-full"
                        />
                    </div>
                </div>
            )}
        </>
    )
}
