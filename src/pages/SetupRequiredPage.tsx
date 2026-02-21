export function SetupRequiredPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl border p-6 text-xs">
        <h1 className="mb-3 text-sm font-semibold">Supabase configuration required</h1>
        <p className="text-muted-foreground mb-2">
          Add environment variables to run this app:
        </p>
        <pre className="bg-muted overflow-x-auto p-3 text-xs">
{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
      </div>
    </div>
  )
}
