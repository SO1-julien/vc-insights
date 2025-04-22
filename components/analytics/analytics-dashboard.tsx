"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchStartupsAnalytics } from "@/lib/airtable"
import { formatCurrency } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      try {
        const data = await fetchStartupsAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [dateRange])

  // Prepare data for charts
  const fundingStageData = analytics
    ? Object.entries(analytics.byFundingStage).map(([stage, count]) => ({
        name: stage,
        value: count,
      }))
    : []

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const categoryData = analytics ? analytics.categoryAnalytics : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Startup Analytics</h1>
        <p className="text-muted-foreground">Analyze startup performance metrics and trends</p>
      </div>

      {/* Date Range Filter */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Startups</CardDescription>
                <CardTitle className="text-3xl">{analytics?.totalStartups || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-3xl">{formatCurrency(analytics?.totalRevenue || 0)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Charts */}
          <div className="mb-8 grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Startups by Funding Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fundingStageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {fundingStageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Startups by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="startups" fill="#8884d8" name="Startups" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Category Analytics</CardTitle>
              <CardDescription>Performance metrics by startup category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Startups</TableHead>
                      <TableHead>Avg. Revenue</TableHead>
                      <TableHead>Avg. Employees</TableHead>
                      <TableHead>Avg. ARR</TableHead>
                      <TableHead>Avg. Gross Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell>{category.startups}</TableCell>
                        <TableCell>{formatCurrency(category.averageRevenue)}</TableCell>
                        <TableCell>{Math.round(category.averageEmployees)}</TableCell>
                        <TableCell>{formatCurrency(category.averageARR)}</TableCell>
                        <TableCell>{(category.averageGrossMargin * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
