import { createHash } from "crypto"
import { createJWT, verifyJWT } from "./jwt"

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "your-secret-key"

/**
 * Hashes a password using SHA-256
 * In a production environment, you would use a more secure hashing algorithm with salt
 * like bcrypt or Argon2, but for this demo we'll use a simple SHA-256 hash
 */
export async function hashPassword(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex")
}

/**
 * Verifies a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}

/**
 * Client-side sign in function
 */
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

/**
 * Client-side sign out function
 */
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

/**
 * Server-side function to create a JWT token
 */
export async function createToken(payload: any) {
  return createJWT(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    },
    JWT_SECRET,
  )
}

/**
 * Server-side function to verify a JWT token
 */
export async function verifyToken(token: string) {
  return verifyJWT(token, JWT_SECRET)
}
