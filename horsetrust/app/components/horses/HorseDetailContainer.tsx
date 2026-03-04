import ColumnLeftContainer from "./ColumnLeftContainer"
import ColumnRightContainer from "./ColumnRightContainer"
import HorseOwnerPanel from "./HorseOwnerPanel"

interface Props {
  horse: any
  documents: any[]
  isOwner?: boolean
}

export default function HorseDetailContainer({ horse, documents, isOwner }: Props) {
  return (
    <div className="fontMontserrat bg-black text-[rgb(var(--color-cream))] overflow-x-hidden">
      <section className="py-12 px-8 lg:px-16 bg-gradient-to-b from-black to-[rgb(var(--color-teal)/0.1)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          <ColumnLeftContainer 
            horse={horse} 
            documents={documents}
          />

          <ColumnRightContainer 
            horse={horse} 
            seller={horse.owner}
          />

        </div>

        {isOwner && (
          <div className="max-w-7xl mx-auto mt-12">
            <HorseOwnerPanel horse={horse} documents={documents} />
          </div>
        )}
      </section>
    </div>
  )
}
