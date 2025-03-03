import { SiteHeader } from "@/components/site-header"
import { Carousel } from "@/components/carousel"
import { Collections } from "@/components/collections"
import { BestSellers } from "@/components/best-sellers"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Carousel />
        <Collections />
        <BestSellers />
      </main>
    </div>
  )
}