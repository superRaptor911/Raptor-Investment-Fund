import { LogOut, Menu, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-background border-b px-4 py-3">
      <div className="mx-auto flex w-full items-center justify-between gap-3">
        <Button size="icon-sm" variant="outline" className="md:hidden" onClick={onMenuClick}>
          <Menu className="size-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="text-muted-foreground ml-auto text-xs">{user?.email ?? "Unknown user"}</div>
        <ThemeToggle />
        <Button variant="outline" onClick={() => void signOut()}>
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark")

  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.toggle("dark")
    localStorage.setItem("ledger-theme", root.classList.contains("dark") ? "dark" : "light")
  }

  return (
    <Button variant="outline" size="icon-sm" onClick={toggleTheme}>
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
