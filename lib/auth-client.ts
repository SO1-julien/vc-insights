"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "./auth-client-utils"

// Type for the user object
export interface User {
  id: string
  email: string
  role: string
}

// Hook to get and manage the current user
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, isAdmin: user?.role === "admin" }
}
