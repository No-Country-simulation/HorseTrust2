interface Props {
  seller: any
}

export default function SellerDetail({ seller }: Props){
    const styleSpan = "flex items-center gap-2"
    return (
        <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-6">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-[rgb(var(--color-gold))] text-lg">◆</span>
                <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">Vendedor</h3>
            </div>

            <div className="fontMontserrat flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-teal)/0.3)] flex items-center justify-center text-2xl">
                    👤
                </div>
                <div>
                    <div className="font-medium text-[rgb(var(--color-cream))] mb-1">{seller.first_name || "Desconocido"}</div>
                    <div className={styleSpan}>
                        <div className="flex items-center gap-1 text-[rgb(var(--color-gold))] text-sm">
                            ★★★★★ <span className="text-[rgb(var(--color-cream)/0.8)] ml-1">5.0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {/*Datos dinamicos con un map*/}
                <div className="flex justify-between text-sm">
                    <span className="text-[rgb(var(--color-cream)/0.6)]">Miembro desde</span>
                    <span className="text-[rgb(var(--color-cream))]">2018</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[rgb(var(--color-cream)/0.6)]">Caballos vendidos</span>
                    <span className="text-[rgb(var(--color-cream))]">47</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[rgb(var(--color-cream)/0.6)]">Tasa de respuesta</span>
                    <span className="text-[rgb(var(--color-cream))]">98%</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-[rgb(var(--color-cream)/0.6)]">Tiempo de respuesta</span>
                    <span className="text-[rgb(var(--color-cream))]">&lt; 2 horas</span>
                </div>
            </div>

            <button className="w-full px-6 py-3 bg-transparent border border-[rgb(var(--color-teal)/0.6)] text-[rgb(var(--color-teal))] text-xs tracking-[0.125em] uppercase hover:border-[rgb(var(--color-teal))] hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300">
                Ver Perfil Completo
            </button>

            <div className="mt-6 pt-6 border-t border-[rgb(var(--color-cream)/0.1)]">
                <div className="text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-3">Verificaciones</div>
                <div className="space-y-2 text-xs text-[rgb(var(--color-cream)/0.8)]">
                    <div className={styleSpan}>
                        <span className="text-[rgb(var(--color-gold))]">✓</span>
                        <span>Identidad Verificada</span>
                    </div>
                    <div className={styleSpan}>
                        <span className="text-[rgb(var(--color-gold))]">✓</span>
                        <span>Email Confirmado</span>
                    </div>
                    <div className={styleSpan}>
                        <span className="text-[rgb(var(--color-gold))]">✓</span>
                        <span>Teléfono Confirmado</span>
                    </div>
                    <div className={styleSpan}>
                        <span className="text-[rgb(var(--color-gold))]">✓</span>
                        <span>Ubicación Verificada</span>
                    </div>
                </div>
            </div>
        </div>
    )
}