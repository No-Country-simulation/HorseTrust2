"use client"

import { useState } from "react"

export default function FiltersGallery(){
    const [selectedCategory, setSelectedCategory] = useState("Todos")
    
    const stylesCategoryButton = "filter-btn px-6 py-3 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-xs tracking-[0.125em] uppercase transition-all duration-300 hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] data-[active=true]:bg-[rgb(var(--color-gold))] data-[active=true]:text-black data-[active=true]:border-[rgb(var(--color-gold))]"
    
    const categories = [
        "Todos",
        "Premium",
        "Deportivos",
        "Recreativos",
        "Jóvenes",
        "Adultos",
        "Cría"
    ]

    return (
        <section className="fontMontserrat py-12 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-black to-[rgb(var(--color-teal)/0.1)] border-b border-[rgb(var(--color-gold)/0.1)]">
            <div className="max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="pb-8 w-full flex justify-center">
                    <div className="relative w-full max-w-2xl px-0 sm:px-0">
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre, raza, ubicación..."
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[rgb(var(--color-cream)/0.1)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] placeholder-[rgb(var(--color-cream)/0.4)] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300"
                        />
                        <button className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-gold))] text-xl">
                            ⌕
                        </button>
                    </div>
                </div>

                {/* Categories - Desktop (hidden on mobile) */}
                <div className="hidden md:flex flex-wrap justify-center gap-4 pb-6">
                    {categories.map((category) => (
                        <button 
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            data-active={selectedCategory === category}
                            className={stylesCategoryButton}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Categories - Mobile (select dropdown) */}
                <div className="md:hidden pb-6">
                    <div className="relative">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-xs tracking-[0.125em] uppercase cursor-pointer focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300 appearance-none"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category} className="bg-black py-2">
                                    {category}
                                </option>
                            ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-gold))] pointer-events-none">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Sort & Results Count */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[rgb(var(--color-cream))]/60 text-xs">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="uppercase tracking-wider whitespace-nowrap">Ordenar:</span>
                        <select className="flex-1 sm:flex-none bg-transparent border border-[rgb(var(--color-cream))]/20 px-3 sm:px-4 py-2 text-[rgb(var(--color-cream))] cursor-pointer focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300 text-xs">
                            <option value="recientes" className="bg-black">Más Recientes</option>
                            <option value="precio-asc" className="bg-black">Precio: Menor a Mayor</option>
                            <option value="precio-desc" className="bg-black">Precio: Mayor a Menor</option>
                            <option value="nombre" className="bg-black">Nombre A-Z</option>
                        </select>
                    </div>
                    <div className="uppercase tracking-wider text-center">
                        <span className="text-[rgb(var(--color-gold))]">48</span> Caballos Encontrados
                    </div>
                </div>
            </div>
        </section> 
    )
}