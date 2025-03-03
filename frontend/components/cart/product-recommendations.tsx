import { ProductCard } from "@/components/products/product-card"

const recommendedProducts = [
  {
    id: "1",
    title: "Kệ Tivi đế sàn gỗ MDF phong cách châu âu hiện đại và sang trọng TV08",
    image: "/placeholder.svg",
    price: 2200000,
    originalPrice: 2500000,
    category: "KỆ TIVI"
  },
  {
    id: "2",
    title: "Tủ gỗ nhỏ hai ngăn đựng đồ đa năng chất liệu MDF mã TA04",
    image: "/placeholder.svg",
    price: 978000,
    originalPrice: 1100000,
    category: "TỦ GỖ"
  },
  {
    id: "3",
    title: "Tủ gỗ thấp nhiều ngăn rộng TT03",
    image: "/placeholder.svg",
    price: 2975000,
    originalPrice: 3100000,
    category: "TỦ GỖ"
  },
  {
    id: "4",
    title: "Tủ đựng giày nhiều ngăn rộng TG02",
    image: "/placeholder.svg",
    price: 2135000,
    originalPrice: 2300000,
    category: "TỦ GỖ"
  },
]

export function ProductRecommendations() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8">Sản phẩm mới</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

