import { AdminTransactionForm } from "@/features/admin/AdminTransactionForm"

export function AdminPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-sm font-semibold">Admin</h1>
        <p className="text-muted-foreground text-xs">Create deposit and withdrawal transactions.</p>
      </div>
      <AdminTransactionForm />
    </section>
  )
}
