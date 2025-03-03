import { CartBreadcrumb } from "@/components/cart/cart-breadcrumb"
import { EmptyCart } from "@/components/cart/empty-cart"
import { ProductRecommendations } from "@/components/cart/product-recommendations"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <CartBreadcrumb currentStep={0} />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <EmptyCart />
        </div>
        <Separator className="my-12" />
        <ProductRecommendations />
      </div>
    </div>
  )
}

