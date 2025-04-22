"use client"
import dynamic from "next/dynamic"

// Dynamically import the chart components to avoid SSR issues
const StartupCharts = dynamic(() => import("@/components/startup/startup-charts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
        <p>Loading charts...</p>
      </div>
    </div>
  ),
})

interface DynamicChartsProps {
  revenueData: Array<{ name: string; revenue: number }>
  employeesData: Array<{ name: string; employees: number }>
  category: string
}

export default function DynamicCharts({ revenueData, employeesData, category }: DynamicChartsProps) {
  return <StartupCharts revenueData={revenueData} employeesData={employeesData} category={category} />
}
