"use client"

import { useState, useEffect } from "react"
import { fetchStartups, type Startup } from "@/lib/airtable"
import { StartupCard } from "@/components/ui/startup-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function PortfolioPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
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
        const data = await fetchStartups()
        setStartups(data)
        setFilteredStartups(data)
      } catch (error) {
        console.error("Error loading startups:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStartups()
  }, [])

  useEffect(() => {
    let result = [...startups]

    if (filters.category) {
      result = result.filter((s) => s.category === filters.category)
    }

    if (filters.country) {
      result = result.filter((s) => s.country === filters.country)
    }

    if (filters.year) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Startup Portfolio</h1>
        <p className="text-muted-foreground">Browse and analyze startups across different industries and regions</p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Filters</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
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
          </div>

          <div>
            <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
              <SelectTrigger>
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
          </div>

          <div>
            <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
              <SelectTrigger>
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
          </div>

          <div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
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
