import type React from "react"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { StartupProvider } from "@/lib/startup-context"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StartupProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </StartupProvider>
    </div>
  )
}
