"use client"

// Client-side utility functions for authentication
import { hashPassword as serverHashPassword } from "@/lib/auth"

// Client-side version of hashPassword that delegates to the server
export async function hashPassword(password: string): Promise<string> {
  // In a real app, you might want to use a client-side hashing library
  // or call an API endpoint to hash the password
  // For simplicity, we're reusing the server function, but this is safe
  // because it doesn't use any server-only APIs
  return serverHashPassword(password)
}
