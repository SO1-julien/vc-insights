import { requireAdmin } from "@/lib/auth"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  // This will redirect if the user is not an admin
  await requireAdmin()

  return <AdminDashboard />
}
