"use client";

import Image from "next/image"
import { useReveal } from "@/hooks/useReveal";

export default function FeaturedSection() {
    useReveal();

    return (
        <section className="py-32 px-8 lg:px-16 bg-[rgb(var(--color-cream))] text-black relative reveal">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgb(var(--color-gold))] to-transparent"></div>
            
            <div className="text-center mb-20">
                <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-teal))] mb-4 uppercase font-medium">
                    Lo Mejor de lo Mejor
                </div>
                <h2 className="fontCormorant text-5xl lg:text-6xl font-normal tracking-wide text-[rgb(var(--color-terracota))] uppercase pb-7">
                    Cada Detalle
                    <br />
                    Importa
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[rgb(var(--color-teal))] to-[rgb(var(--color-terracota))] shadow-xl">
                    <Image src="/images/featured.jpg" alt="caballo galopando" fill className="absolute inset-0 border border-[rgb(var(--color-gold))] opacity-50"></Image >
                </div>
                <div>
                    <h3 className="fontCormorant text-4xl font-normal text-[rgb(var(--color-gold))] mb-6 tracking-wide">
                        Caballos Excepcionales
                    </h3>
                    <p className="text-base fontMontserrat leading-loose text-black/70 mb-8 font-light">
                        Cada caballo en nuestra colección ha sido meticulosamente seleccionado y verificado. 
                        Garantizamos linaje, salud impecable y temperamento extraordinario. Nuestro proceso 
                        de verificación incluye análisis genético, evaluación veterinaria completa y 
                        certificación de pedigrí por instituciones reconocidas internacionalmente.
                    </p>
                    <a href="#" className="inline-flex items-center justify-center gap-4 text-[rgb(var(--color-teal))] no-underline text-sm tracking-[0.125em] uppercase font-medium transition-all duration-300 group hover:gap-6">
                        Conocer más
                        <span className="text-xl pb-[0.4rem]">→</span>
                    </a>
                </div>
            </div>
        </section>
    )
    
}