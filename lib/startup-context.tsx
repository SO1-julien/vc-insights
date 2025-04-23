"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Startup, fetchStartups } from "@/lib/startups"

interface StartupContextType {
  startups: Startup[]
  loading: boolean
  error: string | null
  refetchStartups: () => Promise<void>
}

const StartupContext = createContext<StartupContextType | undefined>(undefined)

export function StartupProvider({ children }: { children: ReactNode }) {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStartupsData = async () => {
    try {
      setLoading(true)
      const data = await fetchStartups()
      setStartups(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching startups:", err)
      setError("Failed to load startups data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStartupsData()
  }, [])

  return (
    <StartupContext.Provider
      value={{
        startups,
        loading,
        error,
        refetchStartups: fetchStartupsData,
      }}
    >
      {children}
    </StartupContext.Provider>
  )
}

export function useStartups() {
  const context = useContext(StartupContext)
  if (context === undefined) {
    throw new Error("useStartups must be used within a StartupProvider")
  }
  return context
}
