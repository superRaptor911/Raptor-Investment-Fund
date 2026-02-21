import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TransactionType } from "@/lib/types"

export type TransactionFilter = "all" | TransactionType

interface TransactionsFilterProps {
  value: TransactionFilter
  onValueChange: (value: TransactionFilter) => void
}

export function TransactionsFilter({
  value,
  onValueChange,
}: TransactionsFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">Filter</span>
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue as TransactionFilter)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="withdrawal">Withdrawal</SelectItem>
          <SelectItem value="interest">Interest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
