"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Shield,
  Home,
  FileText,
  User,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Users,
  BarChart3,
  AlertTriangle,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getNavItems = () => {
    const baseItems = [
      { href: "/dashboard", icon: Home, label: "Dashboard" },
      { href: "/profile", icon: User, label: "Profile" },
    ]

    if (user?.role === "user") {
      return [
        ...baseItems,
        { href: "/file-complaint", icon: FileText, label: "File Complaint" },
        { href: "/track-complaints", icon: AlertTriangle, label: "Track Complaints" },
      ]
    }

    if (user?.role === "police") {
      return [
        ...baseItems,
        { href: "/police/complaints", icon: FileText, label: "Review Complaints" },
        { href: "/police/analytics", icon: BarChart3, label: "Analytics" },
      ]
    }

    if (user?.role === "admin") {
      return [
        ...baseItems,
        { href: "/admin/users", icon: Users, label: "Manage Users" },
        { href: "/admin/complaints", icon: FileText, label: "All Complaints" },
        { href: "/admin/analytics", icon: BarChart3, label: "System Analytics" },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "police":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-8 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">CrimeWatch</span>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 bg-muted/50 border-0 focus-visible:ring-1" />
          </div>
        </div>

        <nav className="flex-1 px-6 py-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`w-5 h-5 mr-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-primary-foreground" : ""
                    }`}
                  />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-border space-y-4">
          {/* Notifications */}
          <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/50 rounded-xl">
            <Bell className="w-5 h-5 mr-3" />
            <span className="flex-1 text-left">Notifications</span>
            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
          </Button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-3 hover:bg-muted/50 rounded-xl">
                <Avatar className="w-8 h-8 ring-2 ring-primary/20 mr-3">
                  <AvatarImage src={user?.profileImage || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                  <Badge className={`text-xs ${getRoleBadgeColor(user?.role || "user")}`}>
                    {user?.role?.toUpperCase()}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user?.profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Badge className={`text-xs mt-1 ${getRoleBadgeColor(user?.role || "user")}`}>
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="p-3 cursor-pointer">
                <Link href="/profile" className="flex items-center">
                  <User className="w-4 h-4 mr-3" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-3 cursor-pointer">
                <Link href="/settings" className="flex items-center">
                  <Settings className="w-4 h-4 mr-3" />
                  Preferences
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="p-3 text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-xl border-b border-border/50 shadow-lg">
          <div className="flex items-center justify-center h-20 px-8 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-8 lg:hidden p-2 hover:bg-muted/50 rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                {user?.role === "admin" && "Admin Dashboard"}
                {user?.role === "police" && "Police Dashboard"}
                {user?.role === "user" && "Citizen Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground/80 font-medium">Welcome back, {user?.name}</p>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8">{children}</main>
      </div>
    </div>
  )
}
