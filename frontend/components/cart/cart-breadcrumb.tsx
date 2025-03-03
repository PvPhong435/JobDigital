import Link from "next/link"
import { ChevronRight } from 'lucide-react'

const steps = [
  { name: "GIỎ HÀNG", href: "/gio-hang" },
  { name: "CHI TIẾT THANH TOÁN", href: "/gio-hang/thanh-toan" },
  { name: "HOÀN THÀNH ĐƠN HÀNG", href: "/gio-hang/hoan-thanh" },
]

export function CartBreadcrumb({ currentStep }: { currentStep: number }) {
  return (
    <nav className="flex justify-center mb-8">
      <ol className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <li key={step.name} className="flex items-center">
            <Link
              href={step.href}
              className={`text-sm font-medium ${
                index <= currentStep
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {step.name}
            </Link>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

