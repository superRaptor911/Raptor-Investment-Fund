import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAdminAccounts } from "@/hooks/useAdminAccounts"
import { useAdminCreateTransaction } from "@/hooks/useAdminCreateTransaction"

const transactionSchema = z
  .object({
    userId: z.string().min(1, "User is required"),
    accountId: z.string().min(1, "Account is required"),
    type: z.enum(["deposit", "withdrawal"]),
    amount: z.number(),
    note: z.string().max(500).optional(),
  })
  .superRefine((value, context) => {
    if (value.type === "deposit" && value.amount <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Deposit amount must be positive",
      })
    }

    if (value.type === "withdrawal" && value.amount >= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Withdrawal amount must be negative",
      })
    }
  })

type TransactionFormValues = z.infer<typeof transactionSchema>

export function AdminTransactionForm() {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      userId: "",
      accountId: "",
      type: "deposit",
      amount: 0,
      note: "",
    },
  })

  const selectedUserId = useWatch({ control: form.control, name: "userId" })
  const selectedAccountId = useWatch({ control: form.control, name: "accountId" })
  const selectedType = useWatch({ control: form.control, name: "type" })

  const { profilesQuery, accountsQuery } = useAdminAccounts(selectedUserId)
  const mutation = useAdminCreateTransaction()

  useEffect(() => {
    form.setValue("accountId", "")
  }, [selectedUserId, form])

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      account_id: values.accountId,
      type: values.type,
      amount: values.amount,
      note: values.note?.trim() ? values.note.trim() : null,
    })

    form.reset({
      userId: values.userId,
      accountId: "",
      type: "deposit",
      amount: 0,
      note: "",
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insert Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="userId">User</FieldLabel>
              <Select
                value={selectedUserId}
                onValueChange={(value) => form.setValue("userId", value, { shouldValidate: true })}
              >
                <SelectTrigger id="userId" className="w-full">
                  <SelectValue placeholder={profilesQuery.isLoading ? "Loading users..." : "Select user"} />
                </SelectTrigger>
                <SelectContent>
                  {(profilesQuery.data ?? []).map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.id} ({profile.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{form.formState.errors.userId?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="accountId">Account</FieldLabel>
              <Select
                value={selectedAccountId}
                onValueChange={(value) =>
                  form.setValue("accountId", value, { shouldValidate: true })
                }
                disabled={!selectedUserId || accountsQuery.isLoading}
              >
                <SelectTrigger id="accountId" className="w-full">
                  <SelectValue
                    placeholder={
                      !selectedUserId
                        ? "Select user first"
                        : accountsQuery.isLoading
                          ? "Loading accounts..."
                          : "Select account"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {(accountsQuery.data ?? []).map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUserId && !accountsQuery.isLoading && (accountsQuery.data ?? []).length === 0 ? (
                <p className="text-muted-foreground text-xs">No accounts for selected user</p>
              ) : null}
              <FieldError>{form.formState.errors.accountId?.message}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Select
                  value={selectedType}
                  onValueChange={(value) =>
                    form.setValue("type", value as "deposit" | "withdrawal", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...form.register("amount", { valueAsNumber: true })}
                />
                <FieldError>{form.formState.errors.amount?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="note">Note</FieldLabel>
              <Textarea id="note" rows={3} {...form.register("note")} />
              <FieldError>{form.formState.errors.note?.message}</FieldError>
            </Field>
          </FieldGroup>

          {mutation.isError ? (
            <p className="text-destructive text-xs">
              {(mutation.error as Error).message || "Failed to insert transaction"}
            </p>
          ) : null}

          {mutation.isSuccess ? (
            <p className="text-xs text-green-600 dark:text-green-400">Transaction created</p>
          ) : null}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
