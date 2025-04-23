import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a single supabase client for the client side
let client: ReturnType<typeof createClient<Database>> | null = null

export const createClientClient = () => {
  // If we already have a client, return it
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables in client")
  }

  // Create the client
  client = createClient<Database>(supabaseUrl, supabaseKey)
  return client
}
