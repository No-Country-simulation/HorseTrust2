import { CgFacebook } from "react-icons/cg";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export default function Footer(){
    const stylesItems = "text-[rgb(var(--color-cream)/0.7)] no-underline text-sm font-light transition-colors duration-300 hover:text-[rgb(var(--color-cream))]";

    const stylesTitles = "text-xs tracking-[0.1875em] text-[rgb(var(--color-gold))] mb-6 uppercase font-medium"

    const stylesRedes = "text-[rgb(var(--color-cream)/0.5)] text-xl no-underline transition-colors duration-300 hover:text-[rgb(var(--color-gold))]"
    return (
        <footer className="bg-black px-8 lg:px-16 py-16 pb-8 border-t border-[rgb(var(--color-gold)/0.2)]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-12 pb-4">
                <div>
                    <div className="fontCormorant text-2xl tracking-[0.25em] text-[rgb(var(--color-gold))] mb-4 uppercase">
                        Horse Trust
                    </div>
                    <p className="text-sm text-[rgb(var(--color-cream)/0.6)] leading-relaxed font-light">
                        La plataforma de confianza que conecta al mundo ecuestre. Verificación, transparencia y seguridad en cada transacción.
                    </p>
                </div>
                <div>
                    <div className={stylesTitles}>
                        Plataforma
                    </div>
                    <ul className="space-y-3 list-none">
                        <li><a href="#" className={stylesItems}>Explorar Caballos</a></li>
                        <li><a href="#" className={stylesItems}>Cómo Funciona</a></li>
                        <li><a href="#" className={stylesItems}>Verificación</a></li>
                        <li><a href="#" className={stylesItems}>Contacto</a></li>
                    </ul>
                </div>
                <div>
                    <div className={stylesTitles}>
                        Vendedores
                    </div>
                    <ul className="space-y-3 list-none">
                        <li><a href="#" className={stylesItems}>Publicar Caballo</a></li>
                        <li><a href="#" className={stylesItems}>Contacto directo</a></li>
                        <li><a href="#" className={stylesItems}>Guía del Vendedor</a></li>
                        <li><a href="#" className={stylesItems}>Asesoramiento</a></li>
                    </ul>
                </div>
                <div>
                    <div className={stylesTitles}>
                        Contacto
                    </div>
                    <ul className="space-y-3 list-none">
                        <li><a href="mailto:info@elite-equestrian.com" className={stylesItems}>info@horse-trust.com</a></li>
                        <li><a href="tel:+123456789" className={stylesItems}>+1 234 567 89</a></li>
                        <li><a href="#" className={stylesItems}>Ubicación</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-4 border-t border-[rgb(var(--color-cream)/0.1)] flex flex-col md:flex-row justify-between items-center text-xs text-[rgb(var(--color-cream)/0.5)] gap-4">
                <div>© 2026 Horse Trust. Todos los derechos reservados.</div>
                <div className="flex gap-8">
                    <a href="#" className={stylesRedes}>
                    <FaInstagram />
                    </a>
                    <a href="#" className={stylesRedes}>
                        <CgFacebook />
                    </a>
                    <a href="#" className={stylesRedes}>
                        <FaYoutube/>
                    </a>
                </div>
            </div>
        </footer>
    )
}