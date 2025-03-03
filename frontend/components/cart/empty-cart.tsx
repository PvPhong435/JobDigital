import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 mb-6">
        <svg
          viewBox="0 0 100 100"
          className="text-blue-500 w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="50" cy="50" r="40" />
          <circle cx="35" cy="40" r="4" fill="currentColor" />
          <circle cx="65" cy="40" r="4" fill="currentColor" />
          <path d="M 30 65 Q 50 55 70 65" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Giỏ hàng của bạn đang trống!</h2>
      <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
      <Link href="/san-pham">
        <Button>Tiếp tục mua sắm</Button>
      </Link>
    </div>
  )
}

