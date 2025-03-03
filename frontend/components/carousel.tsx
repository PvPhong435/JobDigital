'use client'

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const slides = [
  {
    id: 1,
    imageUrl: '/placeholder.svg?height=600&width=1200',
    title: 'Sản phẩm mới',
    description: 'Khám phá bộ sưu tập mới nhất của chúng tôi',
  },
  {
    id: 2,
    imageUrl: '/placeholder.svg?height=600&width=1200',
    title: 'Giảm giá đặc biệt',
    description: 'Tiết kiệm lên đến 50% cho các mặt hàng được chọn',
  },
  {
    id: 3,
    imageUrl: '/placeholder.svg?height=600&width=1200',
    title: 'Thiết kế nội thất',
    description: 'Để chúng tôi giúp bạn tạo nên không gian sống trong mơ',
  },
]

export function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0">
              <Image
                src={slide.imageUrl || "/placeholder.svg"}
                alt={slide.title}
                width={1200}
                height={600}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white p-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center">{slide.title}</h2>
                <p className="text-sm sm:text-base md:text-lg text-center">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

