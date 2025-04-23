import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Startup } from "@/lib/startups"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface StartupCardProps {
  startup: Startup
}

export function StartupCard({ startup }: StartupCardProps) {
  return (
    <Link href={`/startup/${encodeURIComponent(startup.name)}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={startup.logo || "/placeholder.svg"}
                alt={`${startup.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{startup.name}</h3>
              <p className="text-sm text-muted-foreground">{startup.country}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline">{startup.category}</Badge>
                <Badge variant="outline">{startup.industry}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4 bg-slate-50 p-4">
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="font-medium">{formatCurrency(startup.revenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fundraising</p>
            <p className="font-medium">{formatCurrency(startup.fundraising)}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
