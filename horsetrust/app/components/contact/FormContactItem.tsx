export default function FormContactItem(){
    const stylesLabel = "block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-teal))] pt-6 pb-3 font-medium"
    const stylesInput = " fontMontserrat w-full px-4 py-4 bg-white border border-black/20 text-black font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300"
    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={stylesLabel}>
                        Nombre *
                    </label>
                    <input 
                        type="text" 
                        required
                        className={stylesInput}
                        placeholder="Juan"
                    />
                </div>
                <div>
                    <label className={stylesLabel}>
                        Apellido *
                    </label>
                    <input 
                        type="text" 
                        required
                        className={stylesInput}
                        placeholder="Pérez"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={stylesLabel}>
                        Email *
                    </label>
                    <input 
                        type="email" 
                        required
                        className={stylesInput}
                        placeholder="juan@ejemplo.com"
                    />
                </div>
                <div>
                    <label className={stylesLabel}>
                        Teléfono
                    </label>
                    <input 
                        type="tel" 
                        className={stylesInput}
                        placeholder="+54 9 11 1234-5678"
                    />
                </div>
            </div>

            <div>
                <label className={stylesLabel}>
                    Tipo de Consulta *
                </label>
                <select 
                    required
                    className={stylesInput + " cursor-pointer"}
                >
                    <option value="">Seleccionar tipo</option>
                    <option value="comprador">Soy Comprador - Consulta General</option>
                    <option value="vendedor">Quiero Publicar un Caballo</option>
                    <option value="verificacion">Consulta sobre Verificación</option>
                    <option value="soporte">Soporte Técnico</option>
                    <option value="otro">Otra Consulta</option>
                </select>
            </div>

            <div className="pb-6">
                <label className={stylesLabel}>
                    Mensaje *
                </label>
                <textarea 
                    required
                    rows={6}
                    className={stylesInput + " resize-none"}
                    placeholder="Contanos cómo podemos ayudarte..."
                ></textarea>
            </div>

            <button 
                type="submit"
                className="w-full px-12 py-5 bg-[rgb(var(--color-teal))] text-[rgb(var(--color-cream))] text-xs tracking-[0.1875em] uppercase transition-all duration-400 font-medium hover:bg-[rgb(var(--color-terracota))] hover:-translate-y-1"
            >
                Enviar Consulta
            </button>

            <p className="fontMontserrat text-xs text-black/50 font-light leading-relaxed pt-1">
                Al enviar este formulario, aceptás nuestra política de privacidad y el procesamiento 
                de tus datos personales.
            </p>
        </form>
    )
}