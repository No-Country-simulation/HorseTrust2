import Image from "next/image"

export default function NavbarContainer() {
    const stylesNavItems = "text-cream no-underline text-xs font-light tracking-[0.125em] uppercase hover:text-gold transition-colors duration-300 relative group"
  return (
    <nav className="fixed top-0 left-0 w-full px-8 lg:px-16 py-3 flex justify-between items-center z-50 backdrop-blur-lg">
        <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo HorseTrust" width={70} height={70} />
            <h2>Horse Trust</h2>
        </div>
        <ul className="hidden lg:flex gap-12 list-none">
            <li><a href="" className={stylesNavItems}>Galería</a></li>
            <li><a href="" className={stylesNavItems}>Nosotros</a></li>
            <li><a href="" className={stylesNavItems}>Testimonios</a></li>
            <li><a href="" className={stylesNavItems}>Login</a></li>
            <button>
                <li><a href="">Registrate</a></li>
            </button>
        </ul>
    </nav>
  )
}
