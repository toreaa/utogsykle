"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Activity,
  Trophy,
  BarChart3,
  Users,
  Settings,
  Building2,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut } from "@/app/(auth)/actions/auth"

// Navigation items - easy to customize
const userNavItems = [
  {
    title: "Oversikt",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Aktiviteter",
    url: "/dashboard/activities",
    icon: Activity,
  },
  {
    title: "Konkurranser",
    url: "/dashboard/competitions",
    icon: Trophy,
  },
  {
    title: "Ledertavle",
    url: "/dashboard/leaderboard",
    icon: BarChart3,
  },
]

const adminNavItems = [
  {
    title: "Brukere",
    url: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Konkurranser",
    url: "/dashboard/admin/competitions",
    icon: Trophy,
  },
]

const systemAdminNavItems = [
  {
    title: "Oversikt",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Bedrifter",
    url: "/admin/companies",
    icon: Building2,
  },
]

interface AppSidebarProps {
  user: {
    id: string
    full_name: string | null
    role: string | null
    companies?: {
      name: string
    } | null
  }
  variant?: "user" | "admin" | "system-admin"
}

export function AppSidebar({ user, variant = "user" }: AppSidebarProps) {
  const pathname = usePathname()

  const getNavItems = () => {
    switch (variant) {
      case "system-admin":
        return systemAdminNavItems
      case "admin":
        return [...userNavItems]
      default:
        return userNavItems
    }
  }

  const navItems = getNavItems()
  const showAdminSection = variant === "admin" && (user.role === "company_admin" || user.role === "system_admin")

  const initials = user.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            U
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">utogsykle</span>
            {user.companies?.name && (
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                {user.companies.name}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {variant === "system-admin" ? "System" : "Meny"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdminSection && (
          <SidebarGroup>
            <SidebarGroupLabel>Administrasjon</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.full_name || "Bruker"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.role === "system_admin"
                        ? "System Admin"
                        : user.role === "company_admin"
                        ? "Administrator"
                        : "Bruker"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Innstillinger
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={signOut} className="w-full">
                    <button type="submit" className="flex w-full items-center cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logg ut
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
