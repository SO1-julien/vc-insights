import { createHmac } from "crypto"

// Simple JWT implementation without external dependencies
export interface JWTPayload {
  [key: string]: any
  iat?: number
  exp?: number
}

// Function to convert standard base64 to base64url format
function base64ToBase64Url(base64: string): string {
  // Replace characters that are not URL-safe
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

// Function to create a JWT token
export async function createJWT(payload: JWTPayload, secret: string): Promise<string> {
  // Create header
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  // Add issued at time if not present
  if (!payload.iat) {
    payload.iat = Math.floor(Date.now() / 1000)
  }

  // Encode header and payload using standard base64 and convert to base64url
  const encodedHeader = base64ToBase64Url(Buffer.from(JSON.stringify(header)).toString("base64"))
  const encodedPayload = base64ToBase64Url(Buffer.from(JSON.stringify(payload)).toString("base64"))

  // Create signature
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = base64ToBase64Url(createHmac("sha256", secret).update(data).digest("base64"))

  // Return complete JWT
  return `${data}.${signature}`
}

// Custom constant-time string comparison function
// This helps prevent timing attacks without relying on Node.js-specific APIs
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    // XOR the character codes and OR the result
    // This ensures the comparison takes the same amount of time
    // regardless of how many characters match
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

// Function to convert base64url to standard base64 format
function base64UrlToBase64(base64url: string): string {
  // Add padding if needed
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  while (base64.length % 4) {
    base64 += "="
  }
  return base64
}

// Function to verify a JWT token
export async function verifyJWT(
  token: string,
  secret: string,
): Promise<{ valid: boolean; payload: JWTPayload | null }> {
  try {
    // Split token into parts
    const parts = token.split(".")
    if (parts.length !== 3) {
      return { valid: false, payload: null }
    }

    const [encodedHeader, encodedPayload, providedSignature] = parts

    // Verify signature
    const data = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = base64ToBase64Url(createHmac("sha256", secret).update(data).digest("base64"))

    // Use constant-time comparison to prevent timing attacks
    const signatureIsValid = constantTimeEqual(providedSignature, expectedSignature)

    if (!signatureIsValid) {
      return { valid: false, payload: null }
    }

    // Decode payload - first convert base64url to base64, then decode
    const payloadBase64 = base64UrlToBase64(encodedPayload)
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString()) as JWTPayload

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, payload: null }
    }

    return { valid: true, payload }
  } catch (error) {
    console.error("JWT verification error:", error)
    return { valid: false, payload: null }
  }
}
