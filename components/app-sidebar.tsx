"use client"

import { Home, Ticket, Settings, LogOut, BarChart3, Users, Bell } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logout, type User as AuthUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "Service Requests",
  //   url: "/dashboard/requests",
  //   icon: Ticket,
  // },
  // {
  //   title: "Analytics",
  //   url: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Team",
  //   url: "/dashboard/team",
  //   icon: Users,
  // },
  // {
  //   title: "Notifications",
  //   url: "/dashboard/notifications",
  //   icon: Bell,
  // },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  user: AuthUser
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 2000,
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar className="border-r border-border bg-sidebar backdrop-blur-xl">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Ticket className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Service Desk</h2>
            <p className="text-sm text-muted-foreground">Jira Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider px-2 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 group
                        ${isActive ? "bg-primary/10 text-primary border-r-2 border-primary" : ""}
                      `}
                    >
                      <a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                        <item.icon
                          className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`}
                        />
                        <span className="hidden lg:block">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8 ring-2 ring-primary/50">
            <AvatarImage src={user.avatarUrls["48x48"] || "/placeholder.svg"} alt={user.displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 hidden lg:block">
            <p className="text-sm font-medium text-foreground truncate">{user.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.emailAddress}</p>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="outline"
          size="sm"
          className="w-full bg-accent/50 border-border text-muted-foreground hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:inline">{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
