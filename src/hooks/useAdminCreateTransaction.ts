import { useMutation, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/hooks/queryKeys"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import type { TransactionInsert } from "@/lib/types"

export function useAdminCreateTransaction() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (payload: TransactionInsert): Promise<void> => {
      const { error } = await supabase.from("transactions").insert(payload)

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: async () => {
      if (user?.id) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.transactions(user.id),
        })
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.adminProfiles })
      await queryClient.invalidateQueries({ queryKey: ["admin", "accounts"] })
    },
  })
}
