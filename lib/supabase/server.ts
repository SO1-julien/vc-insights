import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { cookies } from "next/headers"

// Create a single supabase client for the server
export const createServerClient = () => {
  const cookieStore = cookies()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "investor-startup-platform",
      },
    },
  })

  return supabase
}

// This comment marks this file as server-only
// @ts-expect-error - This is a server component
export const serverOnly = true
