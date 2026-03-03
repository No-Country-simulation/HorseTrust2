import { LucideIcon } from "lucide-react"

interface Props {
    icon: LucideIcon
    title: string
    description: string
}

export default function PropositoItem({icon: Icon, title, description}: Props){
    return (
        <div className=" text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-[rgb(var(--color-teal)/0.2)] flex items-center justify-center text-4xl shadow-lg/20">
                <Icon size={10} className="w-10 h-10 text-[rgb(var(--color-terracota))]" strokeWidth={1.5}/>
            </div>
            <h3 className="fontCormorant text-2xl text-[rgb(var(--color-teal))] mb-3">{title}</h3>
            <p className="fontMontserrat text-sm font-light text-black/70 leading-relaxed">
                {description}
            </p>
        </div>
    )
}