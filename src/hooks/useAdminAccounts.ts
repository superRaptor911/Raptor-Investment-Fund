import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/hooks/queryKeys"
import { supabase } from "@/lib/supabase"
import type { Account, Profile } from "@/lib/types"

export function useAdminAccounts(selectedUserId: string | undefined) {
  const profilesQuery = useQuery({
    queryKey: queryKeys.adminProfiles,
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role")
        .order("id", { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      return (data ?? []) as Profile[]
    },
  })

  const accountsQuery = useQuery({
    queryKey: queryKeys.adminAccounts(selectedUserId ?? "none"),
    enabled: Boolean(selectedUserId),
    queryFn: async (): Promise<Account[]> => {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, user_id, created_at")
        .eq("user_id", selectedUserId)
        .order("created_at", { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      return (data ?? []) as Account[]
    },
  })

  return { profilesQuery, accountsQuery }
}
