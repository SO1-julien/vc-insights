import { createHash } from "crypto"
import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || "your-secret-key")

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
    console.error("Sign in error:", error)
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
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

/**
 * Server-side function to verify a JWT token
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { valid: true, payload }
  } catch (error) {
    return { valid: false, payload: null }
  }
}

/**
 * Server-side function to get the current user from the request
 */
export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  const { valid, payload } = await verifyToken(token)
  if (!valid || !payload) {
    return null
  }

  return payload
}

/**
 * Server-side function to check if the current user has a specific role
 */
export async function checkUserRole(requiredRole: string | string[]) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role as string)
  }

  return user.role === requiredRole
}
