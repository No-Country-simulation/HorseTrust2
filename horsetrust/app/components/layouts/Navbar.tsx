'use server';
import Link from "next/dist/client/link"
import Image from "next/image"
import { getAuthUser } from "@/lib/auth/get-user-from-token"
import LogoutButton from "@/app/components/logoutButton"

export  async function NavbarContainer() {

    const authUser = await getAuthUser();

    const stylesNavItems = "fontMontserrat text-[rgb(var(--color-cream))] no-underline text-xs font-light tracking-[0.125em] uppercase hover:text-[rgb(var(--color-gold))] transition-colors duration-300 relative group"
    const stylesSpan = "absolute bottom-[-5px] left-0 w-0 h-[1px] bg-[rgb(var(--color-gold))] transition-all duration-300 group-hover:w-full"

    return (
        <nav className="fixed bg-gradient-to-b from-black/80 to-transparent top-0 left-0 w-full px-8 lg:px-16 py-3 flex justify-between items-center z-50 backdrop-blur-lg">

            <div className="flex items-center gap-3">
                <Image src="/images/logo.png" alt="Logo HorseTrust" width={70} height={70} />
                <h2 className="fontCormorant text-[rgb(var(--color-cream))] text-3xl">
                    Horse Trust
                </h2>
            </div>

            <ul className="hidden lg:flex gap-12 list-none items-center">

                <li><a href="#" className={stylesNavItems}>Galería<span className={stylesSpan}></span></a></li>
                <li><a href="#" className={stylesNavItems}>Vendedores<span className={stylesSpan}></span></a></li>
                <li><a href="#" className={stylesNavItems}>Cómo funciona<span className={stylesSpan}></span></a></li>
                <li><a href="#" className={stylesNavItems}>Contacto<span className={stylesSpan}></span></a></li>

                {!authUser && (
                    <>
                        <li>
                            <Link href="/login" className={stylesNavItems}>
                                Login
                                <span className={stylesSpan}></span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/register">
                                <button className="px-5 py-3 bg-transparent border border-[rgb(var(--color-gold))] text-[rgb(var(--color-gold))] text-xs uppercase transition-all duration-300 hover:bg-[rgb(var(--color-gold))] hover:text-black">
                                    Regístrate
                                </button>
                            </Link>
                        </li>
                    </>
                )}

                {authUser && (
                    <>
                        <li>
                            <Link href="/me">
                                <button className="px-5 py-3 bg-transparent border border-[rgb(var(--color-gold))] text-[rgb(var(--color-gold))] text-xs uppercase transition-all duration-300 hover:bg-[rgb(var(--color-gold))] hover:text-black">
                                    Mi Panel
                                </button>
                            </Link>
                        </li>

                        <li>
                            <LogoutButton />
                        </li>
                    </>
                )}

            </ul>
        </nav>
    )
}
