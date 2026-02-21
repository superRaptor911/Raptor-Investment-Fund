import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/lib/types"
import { formatCurrency, formatDateTime } from "@/lib/utils"

interface TransactionWithRunning extends Transaction {
  runningBalance: number
}

interface TransactionsTableProps {
  transactions: TransactionWithRunning[]
  isLoading: boolean
}

function typeVariant(type: Transaction["type"]) {
  if (type === "withdrawal") {
    return "destructive" as const
  }

  return "secondary" as const
}

export function TransactionsTable({
  transactions,
  isLoading,
}: TransactionsTableProps) {
  if (isLoading) {
    return <div className="bg-muted h-64 w-full animate-pulse" />
  }

  if (transactions.length === 0) {
    return <div className="text-muted-foreground border p-4 text-xs">No transactions yet</div>
  }

  return (
    <div className="overflow-x-auto border">
      <table className="w-full min-w-[760px] border-collapse text-xs">
        <thead className="bg-muted/50">
          <tr>
            <th className="border-b px-3 py-2 text-left font-medium">Date</th>
            <th className="border-b px-3 py-2 text-left font-medium">Type</th>
            <th className="border-b px-3 py-2 text-left font-medium">Note</th>
            <th className="border-b px-3 py-2 text-right font-medium">Amount</th>
            <th className="border-b px-3 py-2 text-right font-medium">Running Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-muted/30">
              <td className="border-b px-3 py-2">{formatDateTime(transaction.date)}</td>
              <td className="border-b px-3 py-2">
                <Badge variant={typeVariant(transaction.type)}>{transaction.type}</Badge>
              </td>
              <td className="border-b px-3 py-2">{transaction.note ?? "-"}</td>
              <td className="border-b px-3 py-2 text-right font-medium">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="border-b px-3 py-2 text-right font-medium">
                {formatCurrency(transaction.runningBalance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
