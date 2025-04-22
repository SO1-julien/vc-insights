"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/portfolio" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="InvestorInsight Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold">InvestorInsight</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/portfolio"
            className={`text-sm font-medium ${
              pathname === "/portfolio" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Portfolio
          </Link>

          <Link
            href="/analytics"
            className={`text-sm font-medium ${
              pathname === "/analytics" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Analytics
          </Link>

          <Link
            href="/admin"
            className={`text-sm font-medium ${
              pathname === "/admin" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </Link>
        </nav>

        <div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Exit Platform</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
