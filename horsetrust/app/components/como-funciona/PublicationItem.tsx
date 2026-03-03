import { Check } from "lucide-react"

interface Props{
    title: string
    description: string
}

export default function PublicationItems({title, description}: Props){
    return (
        <div className="flex items-start gap-3">
            <Check width={20} height={20} className="text-[rgb(var(--color-gold))] text-xl mt-1">✓</Check>
            <div>
                <div className="font-medium text-[rgb(var(--color-teal))] mb-1">{title}</div>
                <div className="text-sm text-black/70 font-light">{description}</div>
            </div>
        </div>
    )
}