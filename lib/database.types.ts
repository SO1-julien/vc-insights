export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string // UUID
          email: string
          password: string
          role: string // Changed from "admin" | "user" to string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          role?: string // Changed from "admin" | "user" to string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          role?: string // Changed from "admin" | "user" to string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
