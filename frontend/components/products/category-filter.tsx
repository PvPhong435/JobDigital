import Link from "next/link"

const categories = [
  { name: "Giường", href: "/san-pham/giuong", count: 12 },
  { name: "Kệ để bàn", href: "/san-pham/ke-de-ban", count: 8 },
  { name: "Kệ máy tính", href: "/san-pham/ke-may-tinh", count: 15 },
  { name: "Kệ tivi", href: "/san-pham/ke-tivi", count: 10 },
  { name: "Kệ treo tường", href: "/san-pham/ke-treo-tuong", count: 20 },
  { name: "Phụ kiện", href: "/san-pham/phu-kien", count: 25 },
  { name: "Tủ", href: "/san-pham/tu", count: 18 },
]

export function CategoryFilter() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">DANH MỤC SẢN PHẨM</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="block text-gray-600 hover:text-gray-900"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

