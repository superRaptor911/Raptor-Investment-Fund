import { type PropsWithChildren, useEffect, useMemo, useState } from "react"

import { AuthContext, type AuthContextValue } from "@/features/auth/AuthContext"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/lib/types"

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthContextValue["session"]>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadProfile(userId: string) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", userId)
        .maybeSingle()

      if (!mounted) {
        return
      }

      if (error) {
        setProfile(null)
        return
      }

      setProfile(data as Profile | null)
    }

    async function syncSessionAndProfile() {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) {
        return
      }

      if (error) {
        setIsLoading(false)
        return
      }

      const nextSession = data.session
      setSession(nextSession)

      if (nextSession?.user?.id) {
        await loadProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    }

    void syncSessionAndProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)

      if (nextSession?.user?.id) {
        void loadProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      isAuthenticated: Boolean(session?.user),
      isAdmin: profile?.role === "admin",
      signOut: async () => {
        await supabase.auth.signOut()
      },
    }),
    [session, profile, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
