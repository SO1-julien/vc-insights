"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { createClientClient } from "@/lib/supabase/client"

export function SupabaseDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClientClient()

      // Test connection by fetching startups count
      const { count, error: countError } = await supabase.from("Startups").select("*", { count: "exact", head: true })

      if (countError) {
        throw new Error(`Supabase error: ${countError.message}`)
      }

      // Get environment info
      const envInfo = {
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
      }

      setDiagnostics({
        connectionStatus: "Success",
        recordCount: count,
        environment: envInfo,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setDiagnostics({
        connectionStatus: "Failed",
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Diagnostics</CardTitle>
        <CardDescription>Check if your Supabase connection is working properly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={loading}>
          {loading ? "Running Diagnostics..." : "Run Diagnostics"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diagnostics && (
          <div className="space-y-4">
            <Alert variant={diagnostics.connectionStatus === "Success" ? "default" : "warning"}>
              {diagnostics.connectionStatus === "Success" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>Connection Status: {diagnostics.connectionStatus}</AlertTitle>
              <AlertDescription>
                {diagnostics.connectionStatus === "Success"
                  ? `Successfully connected to Supabase. Found ${diagnostics.recordCount} startups.`
                  : `Failed to connect to Supabase: ${diagnostics.error || "Unknown error"}`}
              </AlertDescription>
            </Alert>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Environment Variables</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>{" "}
                  {diagnostics.environment?.hasSupabaseUrl ? "✅ Set" : "❌ Not set"}
                </p>
                <p>
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{" "}
                  {diagnostics.environment?.hasSupabaseAnonKey ? "✅ Set" : "❌ Not set"}
                </p>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">System Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Environment:</span> {diagnostics.environment?.environment}
                </p>
                <p>
                  <span className="font-medium">Timestamp:</span> {diagnostics.timestamp}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Troubleshooting Tips:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Verify that your Supabase URL and API keys are correct</li>
            <li>Check that the Startups table exists in your Supabase database</li>
            <li>Ensure your Supabase project is active and not in maintenance mode</li>
            <li>Check network connectivity to Supabase servers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
