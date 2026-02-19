export default function ContactSection(){
    return (
        <section className="py-40 px-8 lg:px-16 bg-gradient-to-br from-[rgb(var(--color-terracota))] to-black text-center relative overflow-hidden reveal">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient" style={{background: "radial-gradient(circle, rgba(181, 186, 114, 0.1) 0%, transparent 70%)"}}></div>
            
            <div className="relative z-10">
                <h2 className="fontCormorant text-[rgb(var(--color-cream))] text-5xl lg:text-7xl font-light tracking-[0.25em] mb-8 uppercase">
                    Comenzá tu
                    <br />
                    Legado Ecuestre
                </h2>
                <p className="fontMontserrat text-lg font-light tracking-wide max-w-full mx-auto py-5 pb-10 mb-12 leading-relaxed text-[rgb(var(--color-cream)/0.8)]">
                    Agendá una visita privada a nuestras instalaciones y conocé personalmente 
                    <br />
                    la colección más exclusiva de caballos verificados.
                </p>
                <a href="#contacto" className="inline-block px-16 py-6 bg-[rgb(var(--color-gold))] text-black text-xs tracking-[0.1875em] uppercase no-underline transition-all duration-400 font-medium hover:bg-[rgb(var(--color-cream))] hover:-translate-y-2 hover:shadow-2xl" style={{boxShadow: "0 10px 30px rgba(181, 186, 114, 0);"}}>
                    Agendar Visita
                </a>
            </div>
        </section>
    )
}