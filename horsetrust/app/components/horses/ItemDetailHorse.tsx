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
                    <div className={stylesValueItem}>{horse.sex || "Desconocida"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Color</div>
                    <div className={stylesValueItem}>Castaño Oscuro</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Altura</div>
                    <div className={stylesValueItem}>1.58 m</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Disciplina</div>
                    <div className={stylesValueItem}>{horse.discipline || "Desconocida"}</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Ubicación</div>
                    <div className={stylesValueItem}>Buenos Aires, Argentina</div>
                </div>
                <div>
                    <div className={stylesTitleItem}>Precio</div>
                    <div className={stylesValueItem}>{horse.price || "Desconocida"}</div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[rgb(var(--color-cream)/0.1)]">
                <div className="text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-3">Descripción</div>
                <p className="text-base font-light leading-relaxed text-[rgb(var(--color-cream)/0.8)]">
                    Thunder es un ejemplar excepcional de Pura Sangre Árabe con un temperamento noble y equilibrado. 
                    Destacado en doma clásica, ha participado en competencias regionales con excelentes resultados. 
                    Su elegancia natural y disposición para el trabajo lo convierten en un compañero ideal tanto para 
                    competencia como para equitación de placer. Maneja perfectamente aires extendidos y tiene una 
                    excelente respuesta a las ayudas. Ideal para jinete intermedio-avanzado que busque un caballo 
                    versátil y confiable.
                </p>
            </div>

            <div className="mt-8 pt-8 border-t border-[rgb(var(--color-cream)/0.1)]">
                <div className="text-xs text-[rgb(var(--color-cream)/0.6)] uppercase tracking-wider mb-4">Características Destacadas</div>
                <div className="flex flex-wrap gap-3">
                    {/*Esto tambien deberia ser dinamico*/}
                    <span className={stylesCaract}>Excelente Carácter</span>
                    <span className={stylesCaract}>Competencia</span>
                    <span className={stylesCaract}>Trailer Calmo</span>
                    <span className={stylesCaract}>Salud Impecable</span>
                    <span className={stylesCaract}>Pedigree Certificado</span>
                </div>
            </div>
        </div>
    )
}