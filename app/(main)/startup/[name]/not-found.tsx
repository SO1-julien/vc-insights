import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StartupNotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Startup Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The startup you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/portfolio">Return to Portfolio</Link>
        </Button>
      </div>
    </div>
  )
}
