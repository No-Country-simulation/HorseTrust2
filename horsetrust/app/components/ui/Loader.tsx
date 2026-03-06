"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="w-170">
        <DotLottieReact
          src="/animations/loader.json"
          loop
          autoplay
        />
      </div>
      <h2 className="fontMontserrat text-1xl text-[rgb(var(--color-gold))]">Cargando...</h2>
    </div>
  )
}
