import BannerContainer from "./BannerContainer"
import FeaturedSection from "./FeaturedSection"
import CategoriesContainer from "./CategoriesContainer"
import ContactSection from "./ContactSection"

export default function HomeContainer(){
    return (
        <div>
            <BannerContainer/>
            <FeaturedSection/>
            <CategoriesContainer/>
            <ContactSection/>
        </div>
    )
}