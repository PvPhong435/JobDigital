import { CategoryCard } from "./category-card"

const categories = [
  { title: "GIƯỜNG", image: "/placeholder.svg", href: "/category/giuong" },
  { title: "TỦ", image: "/placeholder.svg", href: "/category/tu" },
  { title: "KỆ MÁY TÍNH", image: "/placeholder.svg", href: "/category/ke-may-tinh" },
  { title: "KỆ TREO TƯỜNG", image: "/placeholder.svg", href: "/category/ke-treo-tuong" },
  { title: "PHỤ KIỆN", image: "/placeholder.svg", href: "/category/phu-kien" },
  { title: "KỆ ĐỂ BÀN", image: "/placeholder.svg", href: "/category/ke-de-ban" },
  { title: "KỆ TIVI", image: "/placeholder.svg", href: "/category/ke-tivi" },
]

export function Collections() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-8">
          BỘ SƯU TẬP
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}

