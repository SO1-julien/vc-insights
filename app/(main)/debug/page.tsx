import { AirtableDebug } from "@/components/debug/airtable-debug"
import { checkUserRole } from "@/lib/server-auth"
import { redirect } from "next/navigation"

export default async function DebugPage() {
  // Check if user is admin
  const isAdmin = await checkUserRole("admin")

  if (!isAdmin) {
    redirect("/portfolio")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Debug Tools</h1>
        <p className="text-muted-foreground">Troubleshoot application configuration and integrations</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <AirtableDebug />
      </div>
    </div>
  )
}
