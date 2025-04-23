import AdminDashboard from "@/components/admin/admin-dashboard"
import { SupabaseDiagnostics } from "@/components/admin/supabase-diagnostics"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and system settings</p>
      </div>

      <div className="mb-8">
        <SupabaseDiagnostics />
      </div>

      <AdminDashboard />
    </div>
  )
}
