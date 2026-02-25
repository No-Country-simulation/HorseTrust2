'use server';
import Link from "next/dist/client/link"
import Image from "next/image"
import { getAuthUser } from "@/lib/auth/get-user-from-token"
import LogoutButton from "@/app/components/logoutButton"
import NavbarLinks from "./NavbarLinks";

export  async function NavbarContainer() {

    const authUser = await getAuthUser();

    const stylesNavItems = "fontMontserrat text-[rgb(var(--color-cream))] no-underline text-xs font-light tracking-[0.125em] uppercase hover:text-[rgb(var(--color-gold))] transition-colors duration-300 relative group"
    const stylesSpan = "absolute bottom-[-5px] left-0 w-0 h-[1px] bg-[rgb(var(--color-gold))] transition-all duration-300 group-hover:w-full"

    return (
        <nav className="fixed bg-gradient-to-b from-black/80 to-transparent top-0 left-0 w-full px-8 lg:px-16 py-3 flex justify-between items-center z-50 backdrop-blur-lg">

            <Link href="/" className="flex items-center gap-3">
                <Image src="/images/logo.png" alt="Logo HorseTrust" width={70} height={70} />
                <h2 className="fontCormorant text-[rgb(var(--color-cream))] text-3xl">
                    Horse Trust
                </h2>
            </Link>

            <ul className="hidden lg:flex gap-12 list-none items-center">
                <NavbarLinks stylesNavItems={stylesNavItems} stylesSpan={stylesSpan} authUser={authUser}/>
            </ul>
        </nav>
    )
}
