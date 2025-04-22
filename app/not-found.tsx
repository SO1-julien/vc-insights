import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mb-8 text-muted-foreground">The page you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
