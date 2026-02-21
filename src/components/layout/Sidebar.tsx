import { BarChart3, LayoutDashboard, Shield, TableProperties } from "lucide-react"
import { NavLink } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onNavigate?: () => void
}

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: TableProperties },
]

export function Sidebar({ onNavigate }: SidebarProps) {
  const { isAdmin } = useAuth()

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border h-full w-64 border-r p-4">
      <div className="mb-6 flex items-center gap-2 text-sm font-semibold">
        <BarChart3 className="size-4" />
        <span>Raptor Ledger</span>
      </div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 border px-2 py-2 text-xs",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-transparent"
              )
            }
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </NavLink>
        ))}

        {isAdmin ? (
          <NavLink
            to="/admin"
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 border px-2 py-2 text-xs",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-transparent"
              )
            }
          >
            <Shield className="size-4" />
            <span>Admin</span>
          </NavLink>
        ) : null}
      </nav>
    </aside>
  )
}
