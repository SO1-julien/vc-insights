"use client"

import { useCurrentUser } from "@/lib/auth-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function AuthTest() {
  const { user, loading, isAdmin } = useCurrentUser()
  const router = useRouter()
  const [testingAdmin, setTestingAdmin] = useState(false)
  const [adminAccessResult, setAdminAccessResult] = useState<string | null>(null)

  const testAdminAccess = async () => {
    setTestingAdmin(true)
    try {
      const response = await fetch("/api/auth/test-admin", {
        method: "GET",
      })

      const data = await response.json()

      if (response.ok) {
        setAdminAccessResult("Success: You have admin access")
      } else {
        setAdminAccessResult(`Error: ${data.error || "Access denied"}`)
      }
    } catch (error) {
      setAdminAccessResult("Error: Failed to test admin access")
    } finally {
      setTestingAdmin(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Loading user information...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
        <CardDescription>Testing your authentication status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">User Information</h3>
          {user ? (
            <div className="mt-2 rounded-md bg-green-50 p-4 text-green-800">
              <p>
                <strong>Authenticated:</strong> Yes
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Admin Access:</strong> {isAdmin ? "Yes" : "No"}
              </p>
            </div>
          ) : (
            <div className="mt-2 rounded-md bg-red-50 p-4 text-red-800">
              <p>
                <strong>Authenticated:</strong> No
              </p>
              <p>You are not signed in.</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium">Admin Access Test</h3>
          <div className="mt-2 space-y-2">
            <Button onClick={testAdminAccess} disabled={testingAdmin}>
              {testingAdmin ? "Testing..." : "Test Admin Access"}
            </Button>

            {adminAccessResult && (
              <div
                className={`rounded-md p-4 ${
                  adminAccessResult.includes("Success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {adminAccessResult}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Navigation Test</h3>
          <div className="mt-2 space-y-2">
            <Button onClick={() => router.push("/admin")} variant="outline">
              Try Accessing Admin Page
            </Button>
            <Button onClick={() => router.push("/portfolio")} variant="outline">
              Go to Portfolio Page
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
