import Image from "next/image"

interface Props {
  src: string
  isActive: boolean
  onClick: () => void
}

export default function MiniaturaImage({ src, isActive, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`aspect-square overflow-hidden border-2 cursor-pointer transition-all
        ${
          isActive
            ? "border-[rgb(var(--color-gold))] opacity-100"
            : "border-transparent opacity-70 hover:opacity-100"
        }
      `}
    >
      <Image
        src={src}
        width={120}
        height={120}
        alt="Thumbnail"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
