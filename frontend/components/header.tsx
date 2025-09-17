"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, Menu, X, Sun, Moon, Bell, User, LogOut, FileText, BarChart3, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMenuOpen(false)
  }

  const getNavigation = () => {
    if (!isAuthenticated) {
      return [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
      ]
    }

    const baseNav = [{ name: "Home", href: "/" }]

    if (user?.role === "user") {
      return [
        ...baseNav,
        { name: "File Complaint", href: "/file-complaint" },
        { name: "Track Complaints", href: "/track-complaints" },
        { name: "Dashboard", href: "/dashboard" },
      ]
    }

    if (user?.role === "police") {
      return [
        ...baseNav,
        { name: "Review Complaints", href: "/police/complaints" },
        { name: "Analytics", href: "/police/analytics" },
        { name: "Dashboard", href: "/dashboard" },
      ]
    }

    if (user?.role === "admin") {
      return [
        ...baseNav,
        { name: "Manage Users", href: "/admin/users" },
        { name: "All Complaints", href: "/admin/complaints" },
        { name: "Analytics", href: "/admin/analytics" },
        { name: "Dashboard", href: "/dashboard" },
      ]
    }

    return baseNav
  }

  const navigation = getNavigation()

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

  const getQuickActions = () => {
    if (user?.role === "user") {
      return [
        { name: "File Complaint", href: "/file-complaint", icon: FileText },
        { name: "Track Status", href: "/track-complaints", icon: BarChart3 },
      ]
    }

    if (user?.role === "police") {
      return [
        { name: "Review Complaints", href: "/police/complaints", icon: FileText },
        { name: "Analytics", href: "/police/analytics", icon: BarChart3 },
      ]
    }

    if (user?.role === "admin") {
      return [
        { name: "Manage Users", href: "/admin/users", icon: Users },
        { name: "System Analytics", href: "/admin/analytics", icon: BarChart3 },
      ]
    }

    return []
  }

  if (!mounted) return null

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "nav-sticky shadow-lg" : "bg-background/80 backdrop-blur-md border-b"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary/80" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent neon-text">
              CrimeWatch
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg relative group ${
                    isActive
                      ? "text-primary bg-primary/10 nav-link-active"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.name}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 relative overflow-hidden group"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 group-hover:text-yellow-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:text-blue-400" />
              <span className="sr-only">Toggle theme</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
            </Button>

            {isAuthenticated && (
              <Button variant="ghost" size="sm" className="h-9 w-9 relative group">
                <Bell className="h-4 w-4 transition-all duration-300 group-hover:text-primary" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary border-0 animate-pulse">
                  2
                </Badge>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
              </Button>
            )}

            {/* User Menu or Login */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full group">
                    <Avatar className="h-9 w-9 transition-all duration-300 group-hover:scale-105">
                      <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary border border-primary/20">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 slide-down" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>{user.role.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {getQuickActions().map((action) => (
                    <DropdownMenuItem key={action.name} asChild>
                      <Link href={action.href} className="flex items-center">
                        <action.icon className="mr-2 h-4 w-4" />
                        {action.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="hover:text-primary">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary hover:bg-primary/90 neon-border">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 transition-all duration-300 group-hover:text-primary" />
              ) : (
                <Menu className="h-4 w-4 transition-all duration-300 group-hover:text-primary" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-sm slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                      isActive
                        ? "text-primary bg-primary/10 border-l-2 border-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
              {!isAuthenticated && (
                <div className="pt-2 border-t space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
