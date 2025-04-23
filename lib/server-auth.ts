import { cookies } from "next/headers"
import { verifyToken } from "./auth"

/**
 * Server-side function to get the current user from the request
 */
export async function getCurrentUser() {
  const cookieStore = await cookies()
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
