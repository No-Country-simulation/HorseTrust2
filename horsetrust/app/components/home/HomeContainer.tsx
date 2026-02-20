import BannerContainer from "./BannerContainer"
import FeaturedSection from "./FeaturedSection"
import OperationSection from "./OperationSection"
import CategoriesContainer from "./CategoriesContainer"
import ContactSection from "./ContactSection"

export default function HomeContainer(){
    return (
        <div>
            <BannerContainer/>
            <FeaturedSection/>
            <OperationSection />
            <CategoriesContainer/>
            <ContactSection/>
        </div>
    )
}