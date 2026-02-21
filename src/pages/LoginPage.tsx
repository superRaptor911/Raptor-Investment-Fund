import { useState } from "react"
import { Navigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onGoogleSignIn = async () => {
    setPending(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (authError) {
      setError(authError.message)
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button type="button" onClick={onGoogleSignIn} disabled={pending} className="w-full">
              {pending ? "Redirecting..." : "Continue with Google"}
            </Button>
            {error ? <p className="text-destructive text-xs">{error}</p> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
