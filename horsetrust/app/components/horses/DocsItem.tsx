interface Props {
  title: string
  info: string
  url: string
  onPreview: (url: string) => void
}

export default function DocsItem({ title, info, url, onPreview }: Props) {
    return (
        <div className="flex fontMontserrat items-center justify-between p-4 bg-black/30 border border-[rgb(var(--color-cream)/0.1)] hover:border-[rgb(var(--color-gold)/0.3)] transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[rgb(var(--color-terracota)/0.2)] flex items-center justify-center">
                📄
                </div>
                <div>
                    <div className="text-sm font-medium text-[rgb(var(--color-cream))]">
                        {title}
                    </div>
                    <div className="text-xs text-[rgb(var(--color-cream)/0.6)]">
                        {info}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 items-center justify-center">
                <button
                onClick={() => onPreview(url)}
                className="text-[rgb(var(--color-gold))] text-sm hover:text-white transition"
                >
                Ver
                </button>
                <p>|</p>

                <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(var(--color-gold))] text-sm hover:text-white transition"
                >
                Descargar
                </a>
            </div>
        </div>
    )
}
