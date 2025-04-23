import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function StartupLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Main Info Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <Skeleton className="h-24 w-24 flex-shrink-0 rounded-md" />

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-9 w-24" />
              </div>

              <div className="mb-4">
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>

              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <Skeleton className="h-10 w-48" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
