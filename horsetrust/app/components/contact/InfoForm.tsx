export default function InfoForm(){
    const stylesDivInfoUno = "fontMontserrat text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-teal))] pb-2 pt-6 font-medium"
    const stylesTextInfoUno = "fontMontserrat text-lg text-black/80 hover:text-[rgb(var(--color-teal))] transition-colors duration-300 font-light"

    const stylesDivInfoDos = "flex justify-between fontMontserrat"
    return (
        <div className="space-y-12">
            <div className="bg-[rgb(var(--color-teal)/0.1)] mb-6 p-10 border border-[rgb(var(--color-teal)/0.2)]">
                <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-teal))] pb-4 uppercase font-medium">
                    Contacto Directo
                </div>
                <h3 className="fontCormorant text-3xl font-normal tracking-wide text-[rgb(var(--color-terracota))] pb-6">
                    Otras Formas de<br />Comunicarte
                </h3>
                        
                <div className="space-y-6">
                    <div>
                        <div className={stylesDivInfoUno}>
                            Email de Soporte
                        </div>
                        <a href="mailto:soporte@elite-equestrian.com" className={stylesTextInfoUno}>
                            soporte@elite-equestrian.com
                        </a>
                    </div>

                    <div>
                        <div className={stylesDivInfoUno}>
                            Consultas Comerciales
                        </div>
                        <a href="mailto:comercial@elite-equestrian.com" className={stylesTextInfoUno}>
                            comercial@elite-equestrian.com
                        </a>
                    </div>

                    <div>
                        <div className={stylesDivInfoUno}>
                            WhatsApp
                        </div>
                        <a href="https://wa.me/5491112345678" className={stylesTextInfoUno}>
                            +54 9 11 1234-5678
                        </a>
                        <p className="fontMontserrat text-xs text-black/50 pt-1 font-light">Lun-Vie 9:00-18:00</p>
                    </div>
                </div>
            </div>

            <div className="bg-[rgb(var(--color-terracota)/0.1)] p-10 border border-[rgb(var(--color-terracota)/0.2)]">
                <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-terracota))] mb-4 uppercase font-medium">
                    Horarios de Atención
                </div>
                <h3 className="fontCormorant text-3xl font-normal tracking-wide text-[rgb(var(--color-terracota))] mb-6">
                    Estamos<br/>Disponibles
                </h3>
                        
                <div className="space-y-3 text-sm font-light text-black/70">
                    <div className={stylesDivInfoDos}>
                        <span>Lunes - Viernes</span>
                        <span className="font-medium">9:00 - 19:00</span>
                    </div>
                    <div className={stylesDivInfoDos}>
                        <span>Sábados</span>
                        <span className="font-medium">10:00 - 14:00</span>
                    </div>
                    <div className={stylesDivInfoDos}>
                        <span>Domingos y Feriados</span>
                        <span className="font-medium">Cerrado</span>
                    </div>
                </div>

                <p className="fontMontserrat text-xs text-black/50 font-light mt-6 leading-relaxed">
                    * Horario de Argentina (GMT-3). Respondemos emails 24/7.
                </p>
            </div>
        </div>
    )
}