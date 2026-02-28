interface Props {
  title: string
  info: string
  size: string
}

export default function DocsItem({ title, info, size }: Props){
    return (
        <div className="flex fontMontserrat items-center justify-between p-4 bg-black/30 border border-[rgb(var(--color-cream)/0.1)] hover:border-[rgb(var(--color-gold)/0.3)] transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[rgb(var(--color-terracota)/0.2)] flex items-center justify-center">
                    <span className="text-[rgb(var(--color-terracota))] text-xl">📄</span>
                </div>
                <div>
                    <div className="text-sm font-medium text-[rgb(var(--color-cream))]">{title}</div>
                    <div className="text-xs text-[rgb(var(--color-cream)/0.6)]">{info} • {size}</div>
                </div>
            </div>
            <button className="text-[rgb(var(--color-gold))] text-sm hover:text-[rgb(var(--color-cream))] transition-colors">Descargar →</button>
        </div>
    )
}