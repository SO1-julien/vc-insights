import { fetchStartupByName, fetchStartupsByCategory } from "@/lib/startups"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import DynamicCharts from "@/components/startup/dynamic-charts"

export default async function StartupPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name)
  const startup = await fetchStartupByName(decodedName)

  if (!startup) {
    notFound()
  }

  // Fetch comparison data
  const sameCategory = await fetchStartupsByCategory(startup.category)

  // Prepare comparison data for charts
  const revenueComparisonData = sameCategory
    .filter((s) => s.id !== startup.id)
    .slice(0, 5)
    .map((s) => ({
      name: s.name,
      revenue: s.revenue,
    }))

  revenueComparisonData.unshift({
    name: startup.name,
    revenue: startup.revenue,
  })

  const employeesComparisonData = sameCategory
    .filter((s) => s.id !== startup.id)
    .slice(0, 5)
    .map((s) => ({
      name: s.name,
      employees: s.employees,
    }))

  employeesComparisonData.unshift({
    name: startup.name,
    employees: startup.employees,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/portfolio">
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
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Portfolio
          </Link>
        </Button>
      </div>

      {/* Main Info Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={startup.logo || "/placeholder.svg"}
                alt={`${startup.name} logo`}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-3xl font-bold">{startup.name}</h1>
                <Button variant="outline" size="sm" asChild>
                  <Link href={startup.url} target="_blank" rel="noopener noreferrer">
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
                      className="mr-2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <path d="M15 3h6v6" />
                      <path d="m10 14 11-11" />
                    </svg>
                    Website
                  </Link>
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-muted-foreground">{startup.country}</p>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="outline">{startup.category}</Badge>
                {startup.industry.map((ind) => (
                  <Badge key={ind} variant="secondary" className="bg-slate-100">
                    {ind}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground">{startup.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(startup.revenue)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fundraising</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(startup.fundraising)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Year Founded</CardDescription>
            <CardTitle className="text-2xl">{startup.yearFounded}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Employees</CardDescription>
            <CardTitle className="text-2xl">{startup.employees}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Comparison Charts */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <DynamicCharts
          revenueData={revenueComparisonData}
          employeesData={employeesComparisonData}
          category={startup.category}
        />
      </div>

      {/* Analysis */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i < startup.analysisRating ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={i < startup.analysisRating ? "text-yellow-400" : "text-gray-300"}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{startup.analysisRating}/5 Rating</span>
            </div>
          </CardHeader>
          <CardContent>
            <p>{startup.analysisContent}</p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Funding Stage</dt>
                <dd>{startup.fundingStage}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Production Stage</dt>
                <dd>{startup.productionDevelopmentStage}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Target Market</dt>
                <dd>{startup.targetMarket}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Customers</dt>
                <dd>{startup.customers}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Industries</dt>
                <dd>{startup.industry.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Country</dt>
                <dd>{startup.country}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <Button size="lg" asChild>
              <Link href={`mailto:contact@${startup.name.toLowerCase().replace(/\s+/g, "")}.com`}>
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
                  className="mr-2"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Contact via Email
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
