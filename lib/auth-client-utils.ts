"use client"

// Client-side utility functions for authentication

// Function to get the current user from the client side
export async function getCurrentUser() {
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

// Client-side sign in function
export async function signIn(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to sign in",
      }
    }

    return {
      success: true,
      role: data.role,
    }
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

// Client-side sign out function
export async function signOut() {
  try {
    await fetch("/api/auth/signout", {
      method: "POST",
    })
    window.location.href = "/"
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}
