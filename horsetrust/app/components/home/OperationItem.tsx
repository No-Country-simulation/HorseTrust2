type Props = {
    nro: string
    title: string
    description: string
}

export default function OperationItem({nro, title, description}: Props){
    return (
        <div className="flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[rgb(var(--color-gold)/0.2)] flex items-center justify-center border-2 border-[rgb(var(--color-gold))]">
                <span className="fontCormorant text-3xl text-[rgb(var(--color-gold))]">{nro}</span>
            </div>
            <h3 className="fontCormorant text-2xl font-normal text-[rgb(var(--color-cream))] mb-4 py-5 tracking-wide">
                {title}
            </h3>
            <p className="fontMontserrat text-base text-[rgb(var(--color-cream)/0.8)] leading-relaxed font-light">
                {description}
            </p>
        </div>
    )
}