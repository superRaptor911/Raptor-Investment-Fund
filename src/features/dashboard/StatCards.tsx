import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface StatCardsProps {
  balance: number
  principal: number
  interestEarned: number
  isLoading: boolean
}

export function StatCards({
  balance,
  principal,
  interestEarned,
  isLoading,
}: StatCardsProps) {
  const skeleton = <div className="bg-muted h-6 w-24 animate-pulse" />

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>{isLoading ? skeleton : formatCurrency(balance)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Principal Invested</CardTitle>
        </CardHeader>
        <CardContent>{isLoading ? skeleton : formatCurrency(principal)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interest Accrued</CardTitle>
        </CardHeader>
        <CardContent>{isLoading ? skeleton : formatCurrency(interestEarned)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Rate</CardTitle>
        </CardHeader>
        <CardContent>0.75%</CardContent>
      </Card>
    </div>
  )
}
