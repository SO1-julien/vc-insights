import { AuthTest } from "@/components/auth/auth-test"

export default function AuthTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Authentication Test</h1>
        <p className="text-muted-foreground">Verify that the authentication system is working correctly</p>
      </div>

      <div className="max-w-2xl">
        <AuthTest />
      </div>
    </div>
  )
}
