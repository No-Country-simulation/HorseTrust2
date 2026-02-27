import ItemCardGallery from "./ItemCardGallery"

interface Props {
  horses: any[]
}

export default function ContainerCardGallery({ horses }: Props) {
  if (!horses || horses.length === 0) {
    return <p>No hay caballos disponibles</p>
  }

  return (
    <section className="py-16 px-8 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                {horses.map((horse) => (
                    <ItemCardGallery key={horse.id} horse={horse} />
                ))}
            </div>
        </div>
    </section>
  )
}
