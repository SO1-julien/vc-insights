"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function AirtableDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/diagnostics/airtable")

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      setDiagnostics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airtable Connection Diagnostics</CardTitle>
        <CardDescription>Check if your Airtable connection is working properly</CardDescription>
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
                  ? `Successfully connected to Airtable. Found ${diagnostics.recordCount} records.`
                  : `Failed to connect to Airtable: ${diagnostics.error || "Unknown error"}`}
              </AlertDescription>
            </Alert>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Environment Variables</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">AIRTABLE_API_KEY:</span>{" "}
                  {diagnostics.environmentVariables.airtableApiKey ? "✅ Set" : "❌ Not set"}
                </p>
                <p>
                  <span className="font-medium">AIRTABLE_BASE_ID:</span>{" "}
                  {diagnostics.environmentVariables.airtableBaseId ? "✅ Set" : "❌ Not set"}
                </p>
                <p>
                  <span className="font-medium">AIRTABLE_TABLE_NAME:</span>{" "}
                  {diagnostics.environmentVariables.airtableTableName || "Not set"}
                </p>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">System Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Environment:</span> {diagnostics.environment}
                </p>
                <p>
                  <span className="font-medium">Server Time:</span> {diagnostics.serverTime}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Troubleshooting Tips:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Verify that your Airtable API key is correct and has access to the base</li>
            <li>Check that your Base ID is correct</li>
            <li>Ensure the table name matches exactly (case-sensitive)</li>
            <li>Check Airtable's status page if you're experiencing persistent issues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
