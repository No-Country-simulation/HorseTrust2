interface Props {
  horse: any
}

export default function PriceCard({ horse }: Props){
    return (
        <div className="bg-gradient-to-br from-[rgb(var(--color-gold)/0.2)] to-[rgb(var(--color-terracota)/0.2)] border border-[rgb(var(--color-gold)/0.4)] p-8 sticky top-26 mb-20">
            <div className="text-center mb-6">
                <div className="text-xs text-[rgb(var(--color-cream)/0.8)] uppercase tracking-wider mb-2">Precio</div>
                <div className="font-serif text-5xl text-[rgb(var(--color-gold))] mb-4">{"$ " + (horse.price || "A consultar")}</div>
            </div>

            <div className="space-y-4">
                <button className="w-full px-8 py-4 bg-[rgb(var(--color-gold))] text-black text-sm tracking-[0.125em] uppercase font-medium hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300">
                    💬 Contactar Vendedor
                </button>
                
                <button className="w-full px-8 py-4 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-sm tracking-[0.125em] uppercase font-medium hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] transition-all duration-300">
                    ⭐ Guardar
                </button>

                <button className="w-full px-8 py-4 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-sm tracking-[0.125em] uppercase font-medium hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] transition-all duration-300">
                    📤 Compartir
                </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[rgb(var(--color-cream)/0.1)] text-center">
                <div className="fontCormorant text-xs text-[rgb(var(--color-cream)/0.6)] mb-3">Seguridad Garantizada</div>
                <div className="flex items-center justify-center gap-2 text-xs text-[rgb(var(--color-cream)/0.8)]">
                    <span>✓ Pago Seguro</span>
                    <span>•</span>
                    <span>✓ Verificado</span>
                </div>
            </div>
        </div>
    )

}