"use client"

import ContainerCardGallery from "./ContainerCardGallery"
import FiltersGallery from "./FiltersGallery"

interface Props {
  initialHorses: any[]
}

export default function GalleryContainer({ initialHorses }: Props) {

    const animacion = (delay: number): React.CSSProperties => ({
        animationDelay: `${delay}s`,
        animationFillMode: "forwards",
    })

    return (
        <>
            <section className="h-[60vh] relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[rgb(var(--color-teal)/0.5)] to-[rgb(var(--color-terracota)/0.5)]">
                <div className="absolute top-0 left-0 w-full h-full hero-overlay"></div>
                
                <div className="relative z-10 text-center max-w-4xl px-8">
                    <div className="fontMontserrat text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] pb-6 uppercase font-normal opacity-0 animate-fade-in-up" style={animacion(0.3)}>
                        — Explorá Nuestra Colección —
                    </div>
                    <h1 className="fontCormorant text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.125em] text-[rgb(var(--color-cream))] pb-8 leading-tight uppercase opacity-0 animate-fade-in-up hero-title" style={animacion(0.6)}>
                        Galería de<br/>Caballos
                    </h1>
                    <p className="fontMontserrat text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed text-[rgb(var(--color-cream)/0.8)] opacity-0 animate-fade-in-up" style={animacion(0.9)}>
                        Todos los caballos verificados disponibles en nuestra plataforma
                    </p>
                </div>
            </section>
            <FiltersGallery />
            <ContainerCardGallery horses={initialHorses} />
        </>
    )
}
