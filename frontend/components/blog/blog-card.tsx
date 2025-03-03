import Image from "next/image"
import Link from "next/link"

interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  image: string
  date: {
    day: number
    month: number
  }
}

export function BlogCard({ title, excerpt, slug, image, date }: BlogCardProps) {
  return (
    <article className="flex flex-col md:flex-row gap-6 items-start">
      <div className="relative">
        <div className="absolute left-4 top-4 bg-white rounded shadow-md z-10">
          <div className="px-3 py-2 text-center">
            <div className="text-lg font-bold">{date.day}</div>
            <div className="text-sm">Th{date.month}</div>
          </div>
        </div>
        <Link href={`/blog/${slug}`}>
          <div className="relative aspect-[16/9] md:w-[400px]">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </Link>
      </div>
      <div className="flex-1 space-y-3">
        <Link href={`/blog/${slug}`}>
          <h2 className="text-xl font-bold hover:text-blue-600 transition-colors">
            {title}
          </h2>
        </Link>
        <p className="text-gray-600 line-clamp-2">
          {excerpt}
        </p>
        <Link 
          href={`/blog/${slug}`}
          className="text-blue-600 hover:underline inline-block"
        >
          [...] Đọc tiếp
        </Link>
      </div>
    </article>
  )
}

