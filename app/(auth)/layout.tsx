import type React from "react"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { checkUserRole, requireAuth } from "@/lib/auth"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()
  const userRole = await checkUserRole(session.user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userRole={userRole} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
