"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import NavbarLinks from "./NavbarLinks"

export default function MobileMenu({ authUser, stylesNavItems, stylesSpan }: any) {

    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="lg:hidden text-[rgb(var(--color-gold))]"
            >
                {open ? <X size={28}/> : <Menu size={28}/>}
            </button>

            {open && (
                <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg py-8 lg:hidden">
                    <ul className="flex flex-col items-center gap-8">
                        <NavbarLinks
                            stylesNavItems={stylesNavItems}
                            stylesSpan={stylesSpan}
                            authUser={authUser}
                        />
                    </ul>
                </div>
            )}
        </>
    )
}
