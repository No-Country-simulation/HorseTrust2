import ReviewItem from "./ReviewItem"

export default function ReviewsContainer(){
    return(
         <div className="bg-black/50 border border-[rgb(var(--color-gold)/0.2)] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[rgb(var(--color-gold))] text-lg">◆</span>
                        <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide">Reseñas</h3>
                    </div>

                    <div className="space-y-4">
                        <ReviewItem rating={5} date="2 semanas" description="Excelente experiencia. El caballo llegó en perfectas condiciones y tal como se describió." reviewer="María González" />
                        <ReviewItem rating={3} date="1 mes" description="Vendedor muy profesional y transparente. Documentación impecable." reviewer="Carlos Martínez" />
                    </div>

                    <button className="w-full mt-4 text-[rgb(var(--color-gold))] text-xs uppercase tracking-wider hover:text-cream transition-colors">
                        Ver todas las reseñas (24) →
                    </button>
                </div>
    )
}