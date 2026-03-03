import { Check } from "lucide-react"

interface Props {
    color: string
    nro:number
    title: string
    description: string
    items: string[]
}

export default function ProcesoItem({color, nro, title, description, items}: Props){
    return (
        <div className="relative step-connector">
            <div className="text-center lg:text-left">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-[rgb(var(--color-${color})/0.2)] border-4 border-[rgb(var(--color-${color}))] mb-8`}>
                    <span className={`fontCormorant text-4xl text-[rgb(var(--color-${color}))]`}>{nro}</span>
                </div>
                
                <h3 className={`fontCormorant text-3xl text-[rgb(var(--color-${color}))] uppercase tracking-wide mb-4`}>
                    {title}
                </h3>
                
                <p className="fontMontserrat text-base font-light leading-relaxed text-[rgb(var(--color-cream)/0.8)] mb-6">
                    {description}
                </p>

                 <div className="space-y-3 text-sm text-[rgb(var(--color-cream)/0.7)]">
                    {items.map((item, index) => (
                        <div key={index} className="flex fontMontserrat items-start gap-3">
                            <Check width={18} height={18} className={`text-[rgb(var(--color-${color}))] mt-1`}>✓</Check>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}