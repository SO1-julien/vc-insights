import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a single supabase client for the client side
let client: ReturnType<typeof createClient<Database>> | null = null

export const createClientClient = () => {
  // If we already have a client, return it
  if (client) return client

  // Get environment variables with fallbacks for preview/development
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key-for-preview"

  // In preview/development with missing env vars, return a mock client
  if (
    process.env.NODE_ENV !== "production" &&
    (supabaseUrl === "https://example.supabase.co" || supabaseKey === "dummy-key-for-preview")
  ) {
    console.warn("Using mock Supabase client due to missing environment variables")
    // Return a mock client that won't throw errors but won't work either
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: null }),
            data: [],
            error: null,
          }),
          data: [],
          error: null,
        }),
        insert: () => ({
          select: () => ({
            single: () => ({ data: null, error: null }),
          }),
          data: null,
          error: null,
        }),
        delete: () => ({
          eq: () => ({ data: null, error: null }),
        }),
      }),
      auth: {
        signUp: () => ({ data: null, error: null }),
      },
    } as any
  }

  // Create the real client for production
  client = createClient<Database>(supabaseUrl, supabaseKey)
  return client
}
