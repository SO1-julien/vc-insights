import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import type { Database } from "@/lib/database.types"

// Create a server-only Supabase client directly in the API route
const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role = "user" } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = getSupabase()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned" which is expected
      console.error("Error checking existing user:", checkError)
      return NextResponse.json({ error: "Error checking if user exists" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Get current timestamp
    const now = new Date().toISOString()

    // Create user in the database
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          role,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Error creating user in database:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    if (!newUser) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Skip Supabase Auth integration for now as it's not necessary for our custom auth system
    // We're using our own JWT-based authentication

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Sign up error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
