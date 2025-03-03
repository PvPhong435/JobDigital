import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  title: string
  image: string
  href: string
}

export function CategoryCard({ title, image, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-center font-medium text-teal-800">{title}</h3>
        </div>
      </div>
    </Link>
  )
}

