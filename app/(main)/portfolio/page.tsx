"use client"

import { useState, useEffect } from "react"
import { fetchStartups, type Startup } from "@/lib/airtable"
import { StartupCard } from "@/components/ui/startup-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Filter, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PortfolioPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: "",
    country: "",
    year: "",
  })

  // Get unique values for filter options
  const categories = [...new Set(startups.map((s) => s.category))]
  const countries = [...new Set(startups.map((s) => s.country))]
  const years = [...new Set(startups.map((s) => s.yearFounded))].sort((a, b) => b - a)

  useEffect(() => {
    const loadStartups = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching startups data...")
        const data = await fetchStartups()
        console.log(`Fetched ${data.length} startups`)

        if (data.length > 0 && data[0].id.startsWith("mock-")) {
          console.warn("Using mock data - Airtable connection not available")
          setError("Using sample data. Airtable connection is not available.")
        }

        setStartups(data)
        setFilteredStartups(data)
      } catch (error) {
        console.error("Error loading startups:", error)
        setError("Failed to load startup data. Using sample data instead.")
        toast({
          title: "Error loading startups",
          description: "Using sample data instead. Please check your Airtable configuration.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadStartups()
  }, [])

  useEffect(() => {
    let result = [...startups]

    if (filters.category && filters.category !== "all") {
      result = result.filter((s) => s.category === filters.category)
    }

    if (filters.country && filters.country !== "all") {
      result = result.filter((s) => s.country === filters.country)
    }

    if (filters.year && filters.year !== "all") {
      result = result.filter((s) => s.yearFounded === Number.parseInt(filters.year))
    }

    setFilteredStartups(result)
  }, [filters, startups])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      country: "",
      year: "",
    })
  }

  const hasActiveFilters = filters.category || filters.country || filters.year

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Startup Portfolio</h1>
        <p className="text-muted-foreground">Browse and analyze startups across different industries and regions</p>
      </div>

      {error && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Year Founded" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={resetFilters}
              className="h-9 w-9 rounded-full"
              title="Reset filters"
            >
              <X size={16} />
              <span className="sr-only">Reset filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Startups Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
            <p>Loading startups...</p>
          </div>
        </div>
      ) : filteredStartups.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border bg-card p-8 text-center">
          <div>
            <h3 className="mb-2 text-lg font-medium">No startups found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      )}
    </div>
  )
}
