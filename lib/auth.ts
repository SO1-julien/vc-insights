import { createHash } from "crypto"

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
