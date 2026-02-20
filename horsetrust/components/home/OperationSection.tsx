import OperationItem from "./OperationItem"

export default function OperationSection(){
    return (
        <section className="py-32 px-8 lg:px-16 bg-[rgb(var(--color-teal))] relative reveal" id="como-funciona">
            <div className="text-center mb-20 pb-20">
                <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-gold))] mb-6 pb-3 uppercase font-medium">
                    Proceso Simple
                </div>
                <h2 className="fontCormorant text-5xl lg:text-6xl font-normal tracking-wide text-[rgb(var(--color-cream))] uppercase">
                    Cómo Funciona
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <OperationItem nro="1" title="Explorá" description="Navegá por nuestra selección de caballos verificados. Filtrá por categoría, precio, ubicación y más. Cada perfil incluye fotos, videos y documentación completa." />
                <OperationItem nro="2" title="Conectá" description="Usa nuestro canal de comunicación seguro para contactar al vendedor. Consultá sus reseñas y calificaciones de compradores anteriores." />
                <OperationItem nro="3" title="Comprá Seguro" description="Coordiná la visita y cierre directamente con el vendedor. Nuestra verificación previa te garantiza transparencia y seguridad en cada transacción." />
            </div>
        </section>
    )
}