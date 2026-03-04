"use client"

interface Props {
  url: string
  title?: string
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function VideoPlayer({ url, title }: Props) {
  const videoId = getYouTubeId(url)

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-black/50 border border-[rgb(var(--color-cream)/0.1)] flex items-center justify-center">
        <p className="fontMontserrat text-sm text-[rgb(var(--color-cream)/0.5)]">
          Video no disponible
        </p>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || "Video del caballo"}
        className="w-full h-full border border-[rgb(var(--color-cream)/0.1)]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
