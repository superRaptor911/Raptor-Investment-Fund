export const queryKeys = {
  profile: (userId: string) => ["profile", userId] as const,
  transactions: (userId: string) => ["transactions", userId] as const,
  adminProfiles: ["admin", "profiles"] as const,
  adminAccounts: (userId: string) => ["admin", "accounts", userId] as const,
} as const
