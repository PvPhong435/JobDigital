import { SiteHeader } from "@/components/site-header"
import { BlogCard } from "@/components/blog/blog-card"

const blogPosts = [
  {
    title: "Phụ Kiện Bàn Làm Việc Văn Phòng Được Ưa Chuộng Nhất Năm 2025",
    excerpt: "Nếu bạn muốn phụ Kiện Bàn Làm Việc văn phòng trở nên sinh động hơn",
    slug: "phu-kien-ban-lam-viec-van-phong-2025",
    image: "/placeholder.svg",
    date: {
      day: 30,
      month: 11
    }
  },
  {
    title: "Black Friday Siêu Sale Đồ Nội Thất Góc Xinh Decor – Cơ Hội Vàng Để Tân Trang Không Gian Sống",
    excerpt: "Black Friday siêu sale đồ nội thất Góc Xinh Decor là sự kiện được nhiều",
    slug: "black-friday-sieu-sale-2023",
    image: "/placeholder.svg",
    date: {
      day: 28,
      month: 11
    }
  },
  {
    title: "Kích Thước Tab Đầu Giường – Bí Quyết Lựa Chọn Cho Phòng Ngủ Của Bạn",
    excerpt: "Kích thước tab đầu giường là một trong những yếu tố quan trọng khi trang",
    slug: "kich-thuoc-tab-dau-giuong",
    image: "/placeholder.svg",
    date: {
      day: 24,
      month: 11
    }
  }
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <h1 className="text-2xl font-bold border-b pb-4">BÀI VIẾT MỚI NHẤT</h1>
              <div className="space-y-12">
                {blogPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    {...post}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
