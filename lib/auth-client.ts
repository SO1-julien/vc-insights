"use client"

import { useEffect, useState } from "react"

// Type for the user object
export interface User {
  id: string
  email: string
  role: string
}

// Function to get the current user from the client side
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
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
