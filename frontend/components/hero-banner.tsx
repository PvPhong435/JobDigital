import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-[#CC0000] text-white">
      <div className="container relative z-10 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                BLACK FRIDAY SALE
              </h1>
              <div className="inline-block rounded-lg bg-black px-3 py-1 text-sm font-semibold">
                SPECIAL OFFER
              </div>
              <p className="text-base sm:text-lg md:text-xl font-semibold">
                DISCOUNT UP TO 50% OFF - DISCOUNT UP TO 50% OFF - DISCOUNT UP TO 50% OFF
              </p>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">SĂN SALE MỖI TAY</h2>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">CHỐT NGAY DEAL KHỦNG</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["Website", "Facebook", "Shopee", "TikTok"].map((platform) => (
                  <div
                    key={platform}
                    className="flex aspect-square items-center justify-center rounded-lg bg-white/10 p-2"
                  >
                    <div className="aspect-square w-full bg-white/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <div className="relative h-[200px] sm:h-[300px] md:h-[400px] w-full max-w-[600px] mx-auto">
              <Image
                src="/placeholder.svg"
                alt="Black Friday Sale"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
        }}
      />
    </div>
  )
}

