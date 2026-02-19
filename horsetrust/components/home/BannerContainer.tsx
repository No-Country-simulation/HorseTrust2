import React from "react"
import Image from "next/image"


export default function BannerContainer() {

  const animacion = (delay: number): React.CSSProperties => ({
    animationDelay: `${delay}s`,
    animationFillMode: "forwards",
  })

  return (
    <section className="h-full pt-5 pb-10 relative flex items-center justify-center overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full hero-overlay"></div>

      <div className="relative items-center justify-center z-10 text-center w-full">

        <div className="fontMontserrat text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] mb-6 uppercase font-normal opacity-0 animate-fade-in-up" style={animacion(0.3)} >
          — Venta de Caballos Verificados —
        </div>

        <div className="flex w-full justify-center items-center animate-fade-in-up text-[rgb(var(--color-cream))]">
            <Image src="/images/banner.png" alt="Caballo mirando de costado" width={500} height={500} className=" hidden s:block animate-fade-in-up "/>         
            <h1 className="fontCormorant px-4 text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.125em] leading-tight uppercase opacity-0 animate-fade-in-up" style={animacion(0.6)} >
            Elegancia en Movimiento
            </h1>

        </div>


        <p className="text-lg fontMontserrat text-center font-light tracking-wide py-6 leading-relaxed text-[rgb(var(--color-cream)/0.8)] opacity-0 animate-fade-in-up" style={animacion(0.9)} >
          Selección exclusiva de caballos verificados por expertos.
          <br />
          Donde la tradición ecuestre se encuentra con la excelencia moderna.
        </p>

        <a href="#explorar" className="inline-block px-12 py-5  bg-transparent border-2 border-[rgb(var(--color-cream))] text-[rgb(var(--color-cream))] text-xs tracking-[0.1875em] uppercase no-underline transition-all duration-400 relative overflow-hidden group opacity-0 animate-fade-in-up" style={animacion(1.2)}>
            <span className="absolute top-0 left-[-100%] w-full h-full bg-[rgb(var(--color-cream))] transition-all duration-400 z-[-1] group-hover:left-0"></span>
            <span className="relative z-10 group-hover:text-black transition-colors duration-400">
                Explorar Colección
            </span>
        </a>

      </div>
    </section>
  )
}
