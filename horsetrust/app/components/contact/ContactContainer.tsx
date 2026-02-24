import FormContainer from "./FormContainer"

export default function ContactContainer(){
    return (
        <section>
            <section className="h-[60vh] relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[rgb(var(--color-teal)/0.3)] to-[rgb(var(--color-terracota)/0.3)]">
                <div className="absolute top-0 left-0 w-full h-full hero-overlay"></div>
                
                <div className="relative z-10 text-center max-w-4xl px-8">
                    <div className="fontMontserrat text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] mb-6 uppercase font-normal opacity-0 animate-fade-in-up" style={{animationDelay: "0.3s", animationFillMode: "forwards"}}>
                        — Estamos para Ayudarte —
                    </div>
                    <h1 className="fontCormorant text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.125em] mb-8 leading-tight text-[rgb(var(--color-cream))] uppercase opacity-0 animate-fade-in-up hero-title" style={{animationDelay: "0.6s", animationFillMode: "forwards"}}>
                        Conectemos
                    </h1>
                    <p className="fontMontserrat text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed text-[rgb(var(--color-cream)/0.8)] opacity-0 animate-fade-in-up" style={{animationDelay: "0.9s", animationFillMode: "forwards"}} >
                        ¿Tenés dudas sobre la plataforma? ¿Querés publicar tu caballo? 
                        Nuestro equipo está listo para asistirte.
                    </p>
                </div>
            </section>
            <FormContainer />

        </section>
    )
}