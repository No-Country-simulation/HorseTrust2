import ColumnLeftContainer from "./ColumnLeftContainer"
import ColumnRightContainer from "./ColumnRightContainer"

interface Props {
  horse: any
}

export default function HorseDetailContainer({ horse }: Props){
    return (
        <div className="fontMontserrat bg-black text-[rgb(var(--color-cream))] overflow-x-hidden">
            <section className="py-12 px-8 lg:px-16 bg-gradient-to-b from-black to-[rgb(var(--color-teal)/0.1)]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                    <ColumnLeftContainer horse={horse} /> 
                    <ColumnRightContainer horse={horse} seller={horse.owner}/>
                </div>
            </section>
        </div>
    )
}