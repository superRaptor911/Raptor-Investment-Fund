import { createContext } from "react"
import type { Session, User } from "@supabase/supabase-js"

import type { Profile } from "@/lib/types"

export interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
