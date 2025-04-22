"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface StartupChartsProps {
  revenueData: Array<{ name: string; revenue: number }>
  employeesData: Array<{ name: string; employees: number }>
  category: string
}

export default function StartupCharts({ revenueData, employeesData, category }: StartupChartsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Comparison</CardTitle>
          <CardDescription>Compared to other {category} startups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employees Comparison</CardTitle>
          <CardDescription>Compared to other {category} startups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="employees" fill="#82ca9d" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
