type Props = {
    category: string
    description: string
}

export default function CategoriesItem({category, description}: Props){
    return (
        <div className="relative aspect-square bg-gradient-to-br from-black/60 to-[rgb(var(--color-terracota)/0.4)] flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-3 group">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgb(var(--color-gold)/0.3)] opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
            <div className="relative z-10 text-center">
                <div className="fontCormorant text-3xl font-normal tracking-wide text-[rgb(var(--color-cream))] mb-2 uppercase">
                    {category}
                </div>
                <div className="text-xs tracking-[0.125em] text-[rgb(var(--color-gold))] uppercase">
                    {description}
                </div>
            </div>
        </div>
    )
}