import DocsItem from "./DocsItem"

interface Props {
  date: string
}

export default function DocsContainer({ date }: Props){
    return (
       <div className="bg-black/50 border border-[rgb(var(--color-terracota)/0.4)] p-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-[rgb(var(--color-terracota))] text-xl">◆</span>
                <h2 className="fontCormorant text-3xl text-[rgb(var(--color-terracota))] uppercase tracking-wide">Documentación Médica</h2>
            </div>

            <div className="space-y-4">
                <DocsItem title="Certificado Veterinario" info="Fecha: 15/01/2026" size="2.4 MB" />
                <DocsItem title="Certificado de Pedigree" info="Emitido por: AACPS" size="1.8 MB" />
                <DocsItem title="Historial de Vacunación" info="Actualizado al día" size="980 KB" />
                <DocsItem title="Radiografías" info="Fecha: 10/12/2025" size="4.2 MB" />
            </div>

            <div className="mt-6 p-4 bg-[rgb(var(--color-teal)/0.1)] border border-[rgb(var(--color-teal)/0.3)]">
                <div className="flex items-start gap-3">
                    <span className="text-[rgb(var(--color-gold))] text-xl mt-1">✓</span>
                    <div>
                        <div className="text-sm font-medium text-[rgb(var(--color-tecreamal))] mb-1">Documentación Verificada</div>
                        <div className="text-xs text-[rgb(var(--color-tecreamal)/0.7)] font-light leading-relaxed">
                            Toda la documentación ha sido revisada y validada por nuestro equipo de veterinarios 
                            y expertos en pedigree. Última verificación: {date}
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    )
}