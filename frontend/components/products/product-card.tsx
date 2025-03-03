import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'

interface ProductCardProps {
  title: string
  image: string
  price: number
  originalPrice?: number
  category: string
  id: string
}

export function ProductCard({ title, image, price, originalPrice, category, id }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden border">
      {originalPrice && (
        <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white px-2 py-1 text-sm rounded">
          Giảm giá!
        </div>
      )}
      <div className="relative aspect-square">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="text-sm text-blue-600 uppercase">{category}</div>
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        <div className="space-y-1">
          <div className="text-lg font-bold">
            {price.toLocaleString()}đ
          </div>
          {originalPrice && (
            <div className="text-sm text-muted-foreground line-through">
              {originalPrice.toLocaleString()}đ
            </div>
          )}
        </div>
        <div className="pt-2 space-y-2">
          <Button className="w-full" variant="default">
            MUA NGAY
          </Button>
          <button className="w-full text-sm text-blue-600 hover:underline">
            Add to wishlist
          </button>
        </div>
      </div>
    </div>
  )
}

