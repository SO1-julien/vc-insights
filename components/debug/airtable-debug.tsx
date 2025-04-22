"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { debugAirtableConfig } from "@/lib/airtable-client"

export function AirtableDebug() {
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    try {
      // Log to console
      debugAirtableConfig()

      // Fetch debug info from API
      const response = await fetch("/api/debug/airtable", {
        method: "GET",
      })

      const data = await response.json()
      setDebugInfo(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error("Debug error:", error)
      setDebugInfo(JSON.stringify({ error: "Failed to run debug" }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airtable Configuration Debug</CardTitle>
        <CardDescription>Check if Airtable environment variables are properly configured</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDebug} disabled={loading}>
          {loading ? "Running Debug..." : "Run Debug"}
        </Button>

        {debugInfo && (
          <Alert>
            <AlertDescription>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{debugInfo}</pre>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Expected environment variables:</p>
          <ul className="list-disc pl-5">
            <li>AIRTABLE_API_KEY</li>
            <li>AIRTABLE_BASE_ID</li>
            <li>AIRTABLE_TABLE_NAME (optional, defaults to "Startups")</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
