import { useMemo, useState } from "react"

import {
  type TransactionFilter,
  TransactionsFilter,
} from "@/features/transactions/TransactionsFilter"
import { TransactionsTable } from "@/features/transactions/TransactionsTable"
import { useTransactions } from "@/hooks/useTransactions"

export function TransactionsPage() {
  const [filter, setFilter] = useState<TransactionFilter>("all")
  const transactionsQuery = useTransactions()

  const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data])

  const transactionsWithRunning = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const enrichedAscending = sorted.reduce<Array<(typeof sorted)[number] & { runningBalance: number }>>(
      (accumulator, transaction) => {
        const previous = accumulator.at(-1)?.runningBalance ?? 0
        accumulator.push({
          ...transaction,
          runningBalance: previous + transaction.amount,
        })
        return accumulator
      },
      []
    )

    return enrichedAscending.reverse()
  }, [transactions])

  const visibleRows = useMemo(() => {
    if (filter === "all") {
      return transactionsWithRunning
    }

    return transactionsWithRunning.filter((transaction) => transaction.type === filter)
  }, [filter, transactionsWithRunning])

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold">Transactions</h1>
          <p className="text-muted-foreground text-xs">Transaction ledger with running balances.</p>
        </div>
        <TransactionsFilter value={filter} onValueChange={setFilter} />
      </div>

      {transactionsQuery.isError ? (
        <div className="text-destructive border p-3 text-xs">
          {(transactionsQuery.error as Error).message}
        </div>
      ) : null}

      <TransactionsTable transactions={visibleRows} isLoading={transactionsQuery.isLoading} />
    </section>
  )
}
