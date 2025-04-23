import { NextResponse } from "next/server"
import { fetchAllStartups, fetchStartupByName, fetchStartupsByCategory } from "@/lib/airtable-utils"

// GET handler to fetch startups with optional filters
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const name = url.searchParams.get("name")
    const category = url.searchParams.get("category")

    // Fetch based on parameters
    if (name) {
      const startup = await fetchStartupByName(name)
      if (!startup) {
        return NextResponse.json({ error: "Startup not found" }, { status: 404 })
      }
      return NextResponse.json(startup)
    } else if (category) {
      const startups = await fetchStartupsByCategory(category)
      return NextResponse.json(startups)
    } else {
      // Fetch all startups if no filters
      const startups = await fetchAllStartups()
      return NextResponse.json(startups)
    }
  } catch (error) {
    console.error("Error in startups API:", error)
    return NextResponse.json({ error: "Failed to fetch data from Airtable" }, { status: 500 })
  }
}
