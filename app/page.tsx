import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignInForm } from "@/components/auth/sign-in-form"

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect("/portfolio")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="grid min-h-[calc(100vh-64px)] md:grid-cols-2">
          {/* Left side - Logo and introduction */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-6 flex items-center gap-2">
                <div className="relative h-10 w-10">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="InvestorInsight Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold">InvestorInsight</h1>
              </div>

              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Make smarter investment decisions</h2>

              <p className="mb-8 text-lg text-muted-foreground">
                Analyze startup performance, compare companies within their industry, and gain valuable insights to
                optimize your investment portfolio.
              </p>

              <div className="hidden md:block">
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <span>Comprehensive startup analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <span>Industry performance comparisons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <span>Data-driven investment insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right side - Sign in form */}
          <div className="relative flex items-center justify-center bg-gray-100 p-8 md:p-12">
            <div className="absolute inset-0 z-0">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Background"
                fill
                className="object-cover opacity-20"
              />
            </div>

            <SignInForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
