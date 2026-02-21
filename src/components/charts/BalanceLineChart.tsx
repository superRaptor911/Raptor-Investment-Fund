import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface BalancePoint {
  month: string
  balance: number
}

interface BalanceLineChartProps {
  data: BalancePoint[]
  isLoading: boolean
}

export function BalanceLineChart({ data, isLoading }: BalanceLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Monthly Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-muted h-80 w-full animate-pulse" />
        ) : data.length === 0 ? (
          <div className="text-muted-foreground border p-4 text-xs">No transactions yet</div>
        ) : (
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value: number) =>
                    new Intl.NumberFormat("en-IN", {
                      notation: "compact",
                      compactDisplay: "short",
                      maximumFractionDigits: 1,
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number | string | Array<number | string> | undefined) => {
                    const raw = Array.isArray(value) ? value[0] : value
                    const numericValue = typeof raw === "number" ? raw : Number(raw)
                    return formatCurrency(Number.isFinite(numericValue) ? numericValue : 0)
                  }}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--color-chart-2)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
