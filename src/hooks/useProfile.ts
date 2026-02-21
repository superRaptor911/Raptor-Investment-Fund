import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/hooks/queryKeys"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/lib/types"

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile(userId ?? "anonymous"),
    enabled: Boolean(userId),
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", userId)
        .maybeSingle()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  })
}
