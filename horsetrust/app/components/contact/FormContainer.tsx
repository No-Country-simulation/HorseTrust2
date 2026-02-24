import FormContactItem from "./FormContactItem"
import InfoForm from "./InfoForm"

export default function FormContainer(){
    return (
       <section className="py-24 px-8 lg:px-16 bg-[rgb(var(--color-cream))] text-black ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <div className="pb-8">
                        <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-teal))] pb-4 uppercase font-medium">
                            Envianos un Mensaje
                        </div>
                        <h2 className="font-serif text-4xl lg:text-5xl font-normal tracking-wide text-[rgb(var(--color-terracota))] uppercase pb-6">
                            Estamos para<br />Escucharte
                        </h2>
                        <p className="text-base leading-relaxed text-black/70 font-light">
                            Completá el formulario y nos pondremos en contacto con vos dentro de las 24 horas hábiles.
                        </p>
                    </div>

                    <FormContactItem />
                </div>
                <InfoForm />
                
            </div>
        </section> 
    )
}