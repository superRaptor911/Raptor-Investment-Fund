import { useMemo } from "react"

import { BalanceLineChart } from "@/components/charts/BalanceLineChart"
import { StatCards } from "@/features/dashboard/StatCards"
import { useTransactions } from "@/hooks/useTransactions"

export function DashboardPage() {
  const transactionsQuery = useTransactions()

  const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data])

  const balance = useMemo(
    () => transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  )

  const principal = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type !== "interest")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  )

  const interestEarned = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "interest")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  )

  const chartData = useMemo(() => {
    const grouped = new Map<string, number>()
    let runningBalance = 0

    for (const transaction of transactions) {
      runningBalance += transaction.amount

      const date = new Date(transaction.date)
      const bucket = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
      grouped.set(bucket, runningBalance)
    }

    return Array.from(grouped.entries()).map(([bucket, running]) => {
      const [year, month] = bucket.split("-")
      const label = new Intl.DateTimeFormat("en-IN", {
        month: "short",
        year: "numeric",
      }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)))

      return {
        month: label,
        balance: running,
      }
    })
  }, [transactions])

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-sm font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-xs">Ledger summary and trend view.</p>
      </div>

      {transactionsQuery.isError ? (
        <div className="text-destructive border p-3 text-xs">
          {(transactionsQuery.error as Error).message}
        </div>
      ) : null}

      <StatCards
        balance={balance}
        principal={principal}
        interestEarned={interestEarned}
        isLoading={transactionsQuery.isLoading}
      />

      <BalanceLineChart data={chartData} isLoading={transactionsQuery.isLoading} />
    </section>
  )
}
