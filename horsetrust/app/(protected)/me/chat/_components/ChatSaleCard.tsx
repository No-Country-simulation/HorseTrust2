"use client";

import { IoCheckmarkCircle, IoStar, IoStarOutline } from "react-icons/io5";

interface SaleData {
  id: string;
  horse: { id: string; name: string; breed: string; price: number | null };
  seller_id: string;
  buyer_id: string;
  price: number;
  completed_at: string;
  reviews: { id: string; rating: number; comment: string | null; buyer_id: string }[];
}

interface ChatSaleCardProps {
  sale: SaleData;
  currentUserId: string;
  onReview: (saleId: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export default function ChatSaleCard({ sale, currentUserId, onReview }: ChatSaleCardProps) {
  const isBuyer = currentUserId === sale.buyer_id;
  const userReview = sale.reviews.find((r) => r.buyer_id === currentUserId);
  const hasReviewed = isBuyer && !!userReview;

  return (
    <div
      className="rounded-xl border border-gray-700 p-4 mx-auto max-w-md w-full"
      style={{ backgroundColor: "rgba(17, 17, 17, 0.6)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <IoCheckmarkCircle className="text-xl text-green-400 shrink-0" />
        <span
          className="text-sm font-semibold fontMontserrat"
          style={{ color: "rgb(238, 238, 255)" }}
        >
          Venta completada
        </span>
      </div>

      <div className="space-y-1 mb-3">
        <p
          className="text-base font-semibold fontMontserrat"
          style={{ color: "rgb(238, 238, 255)" }}
        >
          {sale.horse.name}
        </p>
        <p
          className="text-sm fontMontserrat"
          style={{ color: "rgb(238, 238, 255, 0.6)" }}
        >
          {sale.horse.breed}
        </p>
        <p
          className="text-sm font-medium fontMontserrat"
          style={{ color: "rgb(181, 186, 114)" }}
        >
          {formatPrice(sale.price)}
        </p>
        <p
          className="text-xs fontMontserrat"
          style={{ color: "rgb(238, 238, 255, 0.4)" }}
        >
          {formatDate(sale.completed_at)}
        </p>
      </div>

      {isBuyer && !hasReviewed && (
        <button
          onClick={() => onReview(sale.id)}
          className="w-full py-2 rounded-lg text-sm font-semibold fontMontserrat cursor-pointer transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "rgba(181, 186, 114, 0.15)",
            color: "rgb(181, 186, 114)",
            border: "1px solid rgb(181, 186, 114)",
          }}
        >
          ⭐ Dejar Reseña
        </button>
      )}

      {hasReviewed && userReview && (
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }, (_, i) =>
              i < userReview.rating ? (
                <IoStar key={i} style={{ color: "rgb(181, 186, 114)" }} />
              ) : (
                <IoStarOutline
                  key={i}
                  style={{ color: "rgb(238, 238, 255, 0.3)" }}
                />
              )
            )}
          </div>
          {userReview.comment && (
            <p
              className="text-sm fontMontserrat"
              style={{ color: "rgb(238, 238, 255, 0.7)" }}
            >
              {userReview.comment}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
