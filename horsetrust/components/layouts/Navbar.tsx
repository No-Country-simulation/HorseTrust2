"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarContainer() {
    const pathname = usePathname();
    const navItems = [
        { name: "Inicio", href: "/" },
        { name: "Galería", href: "/galery" },
        { name: "Como Funciona", href: "/como-funciona" },
        { name: "Contacto", href: "/contact" },
        { name: "Login", href: "/login" },
    ];

    const stylesNavItems = "fontMontserrat text-[rgb(var(--color-cream))] no-underline text-xs font-light  tracking-[0.125em] uppercase hover:text-[rgb(var(--color-gold))] transition-colors duration-300 relative group"
    const stylesSpan = "absolute bottom-[-5px] left-0 w-0 h-[1px] bg-[rgb(var(--color-gold))] transition-all duration-300 group-hover:w-full"

  return (
    <nav className="fixed bg-gradient-to-b from-black/80 to-transparent top-0 left-0 w-full px-8 lg:px-16 py-3 flex justify-between items-center z-50 backdrop-blur-lg" >
        <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo HorseTrust" width={70} height={70} />
            <h2 className="fontCormorant text-[rgb(var(--color-cream))] text-3xl">Horse Trust</h2>
        </Link>
        <ul className="hidden lg:flex gap-12 list-none">
            {navItems.map((item) => (
                <li key={item.href}>
                    <Link
                    href={item.href}
                    className={`${stylesNavItems} ${
                        pathname === item.href ? "text-[rgb(var(--color-gold))]" : ""
                    }`}
                    >
                    {item.name}
                    <span
                        className={`${stylesSpan} ${
                        pathname === item.href ? "w-full" : ""
                        }`}
                    ></span>
                    </Link>
                </li>
            ))}
        </ul>
        
        <Link href="/register" className="px-5 md:px-8 py-3 bg-transparent border border-[rgb(var(--color-gold))] text-[rgb(var(--color-gold))] text-xs uppercase cursor-pointer transition-all duration-300 hover:bg-[rgb(var(--color-gold))] hover:text-black">Publicar</Link>
            
    </nav>
  )
}
