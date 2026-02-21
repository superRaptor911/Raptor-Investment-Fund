export type Role = "user" | "admin"

export interface Profile {
  id: string
  role: Role
}

export interface Account {
  id: string
  user_id: string
  created_at: string
}

export type TransactionType = "deposit" | "withdrawal" | "interest"

export interface Transaction {
  id: string
  account_id: string
  type: TransactionType
  amount: number
  note: string | null
  date: string
}

export interface TransactionInsert {
  account_id: string
  type: Exclude<TransactionType, "interest">
  amount: number
  note?: string | null
  date?: string
}
