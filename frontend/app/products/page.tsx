import { SiteHeader } from "@/components/site-header"
import { CategoryFilter } from "@/components/products/category-filter"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const products = [
  {
    id: "1",
    title: "Đinh bốn chân Treo Tường Định Đô Tranh Treo Khung Ảnh Treo Đồ",
    image: "/placeholder.svg",
    price: 4500,
    originalPrice: 8000,
    category: "PHỤ KIỆN"
  },
  {
    id: "2",
    title: "Miếng Đệm Tường Ốc Vít Cường Lực Treo Giá Kệ, Treo Tranh",
    image: "/placeholder.svg",
    price: 15000,
    originalPrice: 30000,
    category: "PHỤ KIỆN"
  },
  {
    id: "3",
    title: "Móc Treo Inox Và Đinh Bốn Chân Inox Dùng Cho Kệ Gỗ Treo Tường",
    image: "/placeholder.svg",
    price: 35000,
    originalPrice: 85000,
    category: "PHỤ KIỆN"
  },
  // Add more products as needed
  {
    id: "4",
    title: "Đinh bốn chân Treo Tường Định Đô Tranh Treo Khung Ảnh Treo Đồ",
    image: "/placeholder.svg",
    price: 4500,
    originalPrice: 8000,
    category: "PHỤ KIỆN"
  },
  {
    id: "5",
    title: "Miếng Đệm Tường Ốc Vít Cường Lực Treo Giá Kệ, Treo Tranh",
    image: "/placeholder.svg",
    price: 15000,
    originalPrice: 30000,
    category: "PHỤ KIỆN"
  },
  {
    id: "6",
    title: "Móc Treo Inox Và Đinh Bốn Chân Inox Dùng Cho Kệ Gỗ Treo Tường",
    image: "/placeholder.svg",
    price: 35000,
    originalPrice: 85000,
    category: "PHỤ KIỆN"
  },
  {
    id: "7",
    title: "Đinh bốn chân Treo Tường Định Đô Tranh Treo Khung Ảnh Treo Đồ",
    image: "/placeholder.svg",
    price: 4500,
    originalPrice: 8000,
    category: "PHỤ KIỆN"
  },
  {
    id: "8",
    title: "Miếng Đệm Tường Ốc Vít Cường Lực Treo Giá Kệ, Treo Tranh",
    image: "/placeholder.svg",
    price: 15000,
    originalPrice: 30000,
    category: "PHỤ KIỆN"
  },
  {
    id: "9",
    title: "Móc Treo Inox Và Đinh Bốn Chân Inox Dùng Cho Kệ Gỗ Treo Tường",
    image: "/placeholder.svg",
    price: 35000,
    originalPrice: 85000,
    category: "PHỤ KIỆN"
  },
]

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container py-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-gray-900">TRANG CHỦ</a>
          <span>/</span>
          <span className="font-medium text-gray-900">SẢN PHẨM</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-8">
            <CategoryFilter />
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Hiển thị 1–12 của 25 kết quả
              </p>
              <Select defaultValue="price-low-high">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low-high">Thứ tự theo giá: thấp đến cao</SelectItem>
                  <SelectItem value="price-high-low">Thứ tự theo giá: cao đến thấp</SelectItem>
                  <SelectItem value="latest">Mới nhất</SelectItem>
                  <SelectItem value="popularity">Phổ biến nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

