import { useQuery } from "@tanstack/react-query"

import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/hooks/queryKeys"
import { supabase } from "@/lib/supabase"
import type { Transaction } from "@/lib/types"

export function useTransactions() {
  const { user } = useAuth()

  return useQuery({
    queryKey: queryKeys.transactions(user?.id ?? "anonymous"),
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<Transaction[]> => {
      const { data: accounts, error: accountsError } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", user?.id)

      if (accountsError) {
        throw new Error(accountsError.message)
      }

      const accountIds = accounts?.map((account) => account.id) ?? []
      if (accountIds.length === 0) {
        return []
      }

      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("id, account_id, type, amount, note, date")
        .in("account_id", accountIds)
        .order("date", { ascending: true })

      if (transactionsError) {
        throw new Error(transactionsError.message)
      }

      return (transactions ?? []) as Transaction[]
    },
  })
}
