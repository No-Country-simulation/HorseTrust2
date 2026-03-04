interface Props {
  horse: any
}

export default function ItemDetailHorse({ horse }: Props){
    const stylesTitleItem = "text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-2"
    const stylesValueItem = "text-lg font-light text-[rgb(var(--color-cream))]"
    const stylesCaract = "px-4 py-2 bg-[rgb(var(--color-teal)/0.2)] border border-[rgb(var(--color-teal)/0.4)] text-xs text-[rgb(var(--color-cream))] uppercase tracking-wider"
    return(
        <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-[rgb(var(--color-gold))] text-xl">◆</span>
                <h2 className="fontCormorant text-3xl text-[rgb(var(--color-gold))] uppercase tracking-wide">Información del Caballo</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className={stylesTitleItem}>Raza</div>
                    <div className={stylesValueItem}>{horse.breed || "Desconocida"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Edad</div>
                    <div className={stylesValueItem}>{horse.age || "Desconocida"} ({2026 - horse.age})</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Sexo</div>
                    <div className={stylesValueItem}>{horse.sex || "Desconocido"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Color</div>
                    <div className={stylesValueItem}>{horse.color || "Desconocido"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Altura</div>
                    <div className={stylesValueItem}>{horse.height ? `${horse.height} cm` : "Desconocida"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Disciplina</div>
                    <div className={stylesValueItem}>{horse.discipline || "Desconocida"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Ubicación</div>
                    <div className={stylesValueItem}>{horse.owner.address || "Desconocida"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Precio</div>
                    <div className={stylesValueItem}>{horse.price || "Desconocido"}</div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[rgb(var(--color-cream)/0.1)]">
                <div className="text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-3">Descripción</div>
                <p className="text-base font-light leading-relaxed text-[rgb(var(--color-cream)/0.8)]">
                    {horse.description || "No hay descripción proporcionada para este caballo."}
                </p>
            </div>
        </div>
    )
}