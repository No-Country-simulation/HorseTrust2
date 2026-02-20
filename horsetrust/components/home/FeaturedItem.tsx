type Props = {
    title: string
    description: string
}

export default function FeaturedItem({title, description}: Props){
    return (
        <div className="flex items-start gap-4 pb-3">
            <span className="text-[rgb(var(--color-gold))] text-2xl">✓</span>
            <div>
                <h4 className="fontCormorant font-medium text-xl text-[rgb(var(--color-teal))] mb-1">{title}</h4>
                <p className="fontMontserrat text-sm text-black/60 font-light">{description}</p>
            </div>
        </div>
    )
}