interface Props {
  rating: number
  date: string
  description: string
  reviewer:string
}

export default function ReviewItem({ rating, date, description, reviewer }: Props){
    return (
        <div className="pb-4 border-b border-[rgb(var(--color-cream)/0.1)]">
            <div className="flex items-center gap-2 mb-2">
                <div className="text-[rgb(var(--color-gold))] text-sm">
                    {Array.from({ length: rating }, (_, i) => (
                        <span key={i}>★</span>
                    ))}
                </div>
                <div className="text-xs text-[rgb(var(--color-cream)/0.6)]">hace {date}</div>
            </div>
            <p className="text-sm text-[rgb(var(--color-cream)/0.8)] font-light leading-relaxed">
                {description}
            </p>
            <div className="text-xs text-[rgb(var(--color-cream)/0.6)] mt-2">- {reviewer}</div>
        </div>
    )
}