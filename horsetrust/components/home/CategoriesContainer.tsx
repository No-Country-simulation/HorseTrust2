import CategoriesItem from "./CategoriesItem"

export default function CategoriesContainer(){
    return (
        <section className="py-32 px-8 lg:px-16 bg-black relative reveal">
            <div className="text-center mb-20 pb-10">
                <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-gold))] mb-4 uppercase font-medium">
                    Nuestras Categorías
                </div>
                <h2 className="fontCormorant text-5xl lg:text-6xl font-normal tracking-wide text-[rgb(var(--color-cream))] uppercase">
                    Encontrá tu
                    <br/>
                    Compañero Ideal
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-20">
                <CategoriesItem category="Selección Premium" description="Calidad Superior"img="/images/premium.jpg"/>
                <CategoriesItem category="Caballos Deportivos" description="Alto Rendimiento" img="/images/deportivos.jpg"/>
                <CategoriesItem category="Caballos Recreativos" description="Docilidad & Nobleza" img="/images/recreativos.jpg"/>
                <CategoriesItem category="Crías" description="Genética Superior" img="/images/crias.jpg"/>
                <CategoriesItem category="Caballos Jóvenes" description="Potencial Futuro" img="/images/jovenes.jpg"/>
                <CategoriesItem category="Caballos Adultos" description="Experiencia Consolidada" img="/images/adultos.jpg"/>

            </div>
        </section>
    )
}