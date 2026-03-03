import { LucideIcon } from "lucide-react"

interface Props{
    icon: LucideIcon
    title: string
    description: string
}

export default function VerificationItem({icon: Icon, title, description}: Props){
    return(
         <div className="bg-black/40 border border-[rgb(var(--color-gold)/0.3)] p-8 hover:border-[rgb(var(--color-gold)/0.6)] transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[rgb(var(--color-gold)/0.2)] flex items-center justify-center flex-shrink-0 text-2xl">
                    <Icon size={16} className="w-6 h-6 text-[rgb(var(--color-gold))]" strokeWidth={1.5}/>
                </div>
                <div>
                    <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] mb-2">{title}</h3>
                    <p className="text-sm font-light text-[rgb(var(--color-cream)/0.7)] leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}