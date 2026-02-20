"use client";

import Image from "next/image"
import { useReveal } from "@/hooks/useReveal";
import FeaturedItem from "./FeaturedItem";

export default function FeaturedSection() {
    useReveal();

    return (
        <section className="py-32 px-8 lg:px-16 bg-[rgb(var(--color-cream)/0.85)] text-black relative reveal">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgb(var(--color-gold))] to-transparent"></div>
            
            <div className="text-center mb-20">
                <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-teal))] mb-4 uppercase font-medium">
                    Nuestro Compromiso
                </div>
                <h2 className="fontCormorant text-5xl lg:text-6xl font-normal tracking-wide text-[rgb(var(--color-terracota))] uppercase pb-7">
                    Verificación
                    <br />
                    Total
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[rgb(var(--color-teal))] to-[rgb(var(--color-terracota))] shadow-xl">
                    <Image src="/images/featured.jpg" alt="caballo galopando" fill className="absolute inset-0 border border-[rgb(var(--color-gold))] opacity-50"></Image >
                </div>
                <div>
                    <h3 className="fontCormorant text-4xl font-normal text-[rgb(var(--color-teal))] mb-6 tracking-wide">
                        Cada Dato Verificado
                    </h3>
                    <p className="text-base fontMontserrat leading-loose text-black/70 mb-8 font-light">
                        No somos vendedores, somos tu aliado de confianza. Verificamos exhaustivamente 
                    cada caballo publicado: pedigrí, historial médico, documentación legal y temperamento. 
                    Solo aprobamos perfiles de vendedores con reputación comprobada.
                    </p>
                    <div className="pt-4">
                        <FeaturedItem title="Certificación de Pedigrí" description="Validación con instituciones oficiales" />
                        <FeaturedItem title="Historial Médico Completo" description="Revisión veterinaria profesional" />
                        <FeaturedItem title="Reputación del Vendedor" description="Sistema de reseñas transparente" />
                    </div>
                </div>
            </div>
        </section>
    )
    
}