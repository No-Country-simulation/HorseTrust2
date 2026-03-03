interface Props{
    nro:number
    title: string
    description: string
}

export default function PasosItem({nro, title, description}: Props){
    return (
        <div className="bg-black/10 border border-[rgb(var(--color-teal)/0.3)] p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[rgb(var(--color-teal)/0.2)] flex items-center justify-center text-2xl">
                    {nro}
                </div>
                <h4 className="fontCormorant text-xl text-[rgb(var(--color-teal))]">{title}</h4>
            </div>
            <p className="text-sm font-light text-black/70">
                {description}
            </p>
        </div>
    )
}