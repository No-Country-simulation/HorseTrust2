import PriceCard from "./PriceCard"
import SellerDetail from "./SellerDetail"
import ReviewsContainer from "./ReviewsContainer"

interface Props {
  horse: any
  seller: any
}

export default function ColumnRightContainer({ horse, seller }: Props){
    return (
        <div className="lg:col-span-1 space-y-8">
            <PriceCard horse={horse} />
            <SellerDetail seller={seller} />
            <ReviewsContainer />
        </div>
    )
}