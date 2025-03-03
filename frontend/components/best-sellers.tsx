import { ProductCard } from "./product-card"

const products = [
  {
    id: "1",
    title: "Kệ Tivi đế sàn gỗ MDF phong cách châu âu hiện đại và sang trọng TV08",
    image: "/1519.jpg",
    price: 2200000,
  },
  {
    id: "2",
    title: "Tủ gỗ nhỏ hai ngăn đựng đồ đa năng chất liệu MDF mã TA04",
    image: "../images/1519.jpg",
    price: 978000,
    originalPrice: 1180000,
  },
  {
    id: "3",
    title: "Tủ gỗ thấp nhiều ngăn rộng TT03",
    image: "../images/1519.jpg",
    price: 2975000,
    originalPrice: 3100000,
  },
  {
    id: "4",
    title: "Tủ đựng giày nhiều ngăn rộng TG02",
    image: "../images/1519.jpg",
    price: 2135000,
    originalPrice: 2300000,
  },
  {
    id: "5",
    title: "Tủ quần áo nhiều ngăn đa năng TA01",
    image: "../images/1519.jpg",
    price: 4488000,
    originalPrice: 5000000,
  },
]

export function BestSellers() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-8">
          SẢN PHẨM BÁN CHẠY
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

