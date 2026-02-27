'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '../logoutButton'
import NavbarChatBadge from './NavbarChatBadge'

type Props = {
    stylesNavItems: string
    stylesSpan: string
    authUser: unknown | null
}

export default function NavbarLinks({ stylesNavItems, stylesSpan, authUser }: Props) {
  const pathname = usePathname()

  const links: {name: string; href:string}[] = [
    { name: "Inicio", href: "/" },
    { name: "Galería", href: "/gallery" },
    { name: "Cómo funciona", href: "/como-funciona" },
    { name: "Contacto", href: "/contact" },
  ]

  const isActive = (href: string): boolean => {
    return pathname === href
  }

  return (
    <>
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`${stylesNavItems} ${
              pathname === item.href
                ? "text-[rgb(var(--color-gold))]"
                : ""
            }`}
          >
            {item.name}
            <span
              className={`${stylesSpan} ${
                pathname === item.href ? "w-full" : ""
              }`}
            />
          </Link>
        </li>
      ))}

      {!authUser && (
        <>
          <li>
            <Link
              href="/login"
              className={`${stylesNavItems} ${
                isActive("/login")
                  ? "text-[rgb(var(--color-gold))]"
                  : ""
              }`}
            >
              Login
              <span
                className={`${stylesSpan} ${
                  isActive("/login") ? "w-full" : ""
                }`}
              />
            </Link>
          </li>

          <li>
            <Link href="/register">
              <button
                className={`px-5 py-3 border text-xs uppercase transition-all duration-300 ${
                  isActive("/register")
                    ? "bg-[rgb(var(--color-gold))] text-black"
                    : "bg-transparent border-[rgb(var(--color-gold))] text-[rgb(var(--color-gold))] hover:bg-[rgb(var(--color-gold))] hover:text-black"
                }`}
              >
                Regístrate
              </button>
            </Link>
          </li>
        </>
      )}

      {authUser && (
        <>
          <NavbarChatBadge stylesNavItems={stylesNavItems} />

          <li>
            <Link href="/me">
              <button
                className={`px-5 py-3 border text-xs uppercase transition-all duration-300 ${
                  pathname.startsWith("/me")
                    ? "bg-[rgb(var(--color-gold))] text-black"
                    : "bg-transparent border-[rgb(var(--color-gold))] text-[rgb(var(--color-gold))] hover:bg-[rgb(var(--color-gold))] hover:text-black"
                }`}
              >
                Mi Panel
              </button>
            </Link>
          </li>

          <li>
            <LogoutButton />
          </li>
        </>
      )}
    </>
  )
}
