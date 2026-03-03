interface Props{
    title: string
    description: string
}

export default function DudaItem({title, description}: Props){
    return (
        <div className="bg-[rgb(var(--color-teal)/0.1)] border border-[rgb(var(--color-teal)/0.3)] p-8 hover:border-[rgb(var(--color-teal)/0.5)] transition-all duration-300">
            <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] mb-4">{title}</h3>
            <p className="text-base font-light text-[rgb(var(--color-cream)/0.8)] leading-relaxed">
                {description}
            </p>
        </div>
    )
}