export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string // UUID
          email: string
          password: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      Startups: {
        Row: {
          id: string
          name: string
          country: string
          category: string
          industry: string[]
          description: string
          revenue: number
          fundraising: number
          yearFounded: number
          employees: number
          analysisRating: number
          analysisContent: string
          fundingStage: string
          productionDevelopmentStage: string
          targetMarket: string
          customers: string
          ARR: number
          grossMargin: number
          logo: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          country: string
          category: string
          industry: string[]
          description: string
          revenue: number
          fundraising: number
          yearFounded: number
          employees: number
          analysisRating: number
          analysisContent: string
          fundingStage: string
          productionDevelopmentStage: string
          targetMarket: string
          customers: string
          ARR: number
          grossMargin: number
          logo: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string
          category?: string
          industry?: string[]
          description?: string
          revenue?: number
          fundraising?: number
          yearFounded?: number
          employees?: number
          analysisRating?: number
          analysisContent?: string
          fundingStage?: string
          productionDevelopmentStage?: string
          targetMarket?: string
          customers?: string
          ARR?: number
          grossMargin?: number
          logo?: string
          url?: string
          updated_at?: string
        }
      }
    }
  }
}
