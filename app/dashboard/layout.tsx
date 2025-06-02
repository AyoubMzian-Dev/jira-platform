import type React from "react"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getUser } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>
      </div>

      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="relative">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl px-4">
            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-700" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-slate-400 hover:text-white">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </div>
  )
}
