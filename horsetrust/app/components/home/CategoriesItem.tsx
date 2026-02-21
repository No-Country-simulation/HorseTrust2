/* eslint-disable @next/next/no-img-element */
import styles from "./CategoriesItem.module.css"

type Props = {
    category: string
    description: string
    img: string
}

export default function CategoriesItem({category, description, img}: Props){
    return (
        <div className={`${styles.categoryCard} relative aspect-square flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-3 group shadow-xl`}>
            <div className="absolute inset-0 w-full h-full">
                    <img src={img} 
                         alt="Doma Clásica" 
                         className={`${styles.categoryImage} w-full h-full object-cover`}
                         style={{filter: "grayscale(100%) brightness(0.4)"}} />
                </div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-[rgb(var(--color-terracota)/0.3)] z-[1]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgb(var(--color-gold)/0.3)] opacity-0 transition-opacity duration-400 group-hover:opacity-100 "></div>
            <div className="category-label relative z-10 text-center">
                <div className="category-name fontCormorant text-3xl font-normal tracking-wide text-[rgb(var(--color-cream))] mb-2 uppercase">
                    {category}
                </div>
                <div className="category-subtitle text-xs tracking-[0.125em] text-[rgb(var(--color-gold))] uppercase">
                    {description}
                </div>
            </div>
        </div>
    )
}