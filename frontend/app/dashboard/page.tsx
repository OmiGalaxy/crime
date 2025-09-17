"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Plus,
  Eye,
  Activity,
  Calendar,
  ArrowUpRight,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const mockStats = {
  user: {
    totalComplaints: 3,
    pendingComplaints: 1,
    approvedComplaints: 1,
    rejectedComplaints: 1,
    responseTime: "2.3 days",
    satisfactionRate: 85,
  },
  police: {
    pendingReview: 12,
    reviewedToday: 8,
    totalAssigned: 45,
    approvalRate: 78,
    avgResponseTime: "1.2 hours",
    casesThisWeek: 23,
  },
  admin: {
    totalUsers: 1247,
    totalComplaints: 892,
    activePolice: 23,
    systemUptime: 99.9,
    newUsersToday: 12,
    systemLoad: 67,
  },
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const renderUserDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, {user.name}</h1>
          <p className="text-lg text-muted-foreground">Manage your complaints and track their status</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4" />
              <span>System Status: Online</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
            <Link href="/file-complaint">
              <Plus className="w-5 h-5 mr-2" />
              File New Complaint
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/track-complaints">
              <Eye className="w-5 h-5 mr-2" />
              Track Status
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Complaints</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{mockStats.user.totalComplaints}</div>
            <p className="text-sm text-muted-foreground mt-1">All time submissions</p>
            <div className="mt-3">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">75% resolved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{mockStats.user.pendingComplaints}</div>
            <p className="text-sm text-muted-foreground mt-1">Under review</p>
            <div className="mt-3 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">Avg: {mockStats.user.responseTime}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockStats.user.approvedComplaints}</div>
            <p className="text-sm text-muted-foreground mt-1">Accepted cases</p>
            <div className="mt-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Satisfaction Rate</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{mockStats.user.satisfactionRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">Service rating</p>
            <div className="mt-3">
              <Progress value={mockStats.user.satisfactionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Complaints</CardTitle>
                <CardDescription>Your latest filed complaints and their status</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/track-complaints" className="flex items-center">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Theft Report - Downtown Area</p>
                  <p className="text-sm text-muted-foreground">Filed 2 days ago • Case #CR-2024-001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  Under Review
                </Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Vandalism - Public Property</p>
                  <p className="text-sm text-muted-foreground">Filed 1 week ago • Case #CR-2024-002</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Approved</Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Noise Complaint - Residential</p>
                  <p className="text-sm text-muted-foreground">Filed 3 weeks ago • Case #CR-2024-003</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">In Progress</Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start h-12 hover:bg-muted/50 bg-transparent" asChild>
              <Link href="/file-complaint">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">File New Complaint</p>
                  <p className="text-xs text-muted-foreground">Report a new incident</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start h-12 hover:bg-muted/50 bg-transparent" asChild>
              <Link href="/track-complaints">
                <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Track Complaints</p>
                  <p className="text-xs text-muted-foreground">Monitor case progress</p>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start h-12 hover:bg-muted/50 bg-transparent" asChild>
              <Link href="/profile">
                <div className="p-2 bg-green-500/10 rounded-lg mr-3">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Update Profile</p>
                  <p className="text-xs text-muted-foreground">Manage your account</p>
                </div>
              </Link>
            </Button>

            <Separator />

            <div className="p-4 bg-muted/30 rounded-xl">
              <h4 className="font-medium text-foreground mb-2">Need Help?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Contact our support team for assistance with your complaints.
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPoliceDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Police Dashboard</h1>
          <p className="text-lg text-muted-foreground">Review and manage citizen complaints efficiently</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" className="shadow-lg">
            <Link href="/police/complaints">
              <FileText className="w-5 h-5 mr-2" />
              Review Complaints
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/police/analytics">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{mockStats.police.pendingReview}</div>
            <p className="text-sm text-muted-foreground mt-1">Awaiting action</p>
            <div className="mt-3">
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">65% capacity</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reviewed Today</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockStats.police.reviewedToday}</div>
            <p className="text-sm text-muted-foreground mt-1">Completed today</p>
            <div className="mt-3 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assigned</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mockStats.police.totalAssigned}</div>
            <p className="text-sm text-muted-foreground mt-1">All time cases</p>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Active Officer
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{mockStats.police.approvalRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
            <div className="mt-3">
              <Progress value={mockStats.police.approvalRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">System overview and comprehensive management</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" className="shadow-lg">
            <Link href="/admin/users">
              <Users className="w-5 h-5 mr-2" />
              Manage Users
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/admin/analytics">
              <BarChart3 className="w-5 h-5 mr-2" />
              System Analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mockStats.admin.totalUsers.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">Registered citizens</p>
            <div className="mt-3 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">+{mockStats.admin.newUsersToday} today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Complaints</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockStats.admin.totalComplaints.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">All time submissions</p>
            <div className="mt-3">
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">85% resolved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Police</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{mockStats.admin.activePolice}</div>
            <p className="text-sm text-muted-foreground mt-1">Online officers</p>
            <div className="mt-3">
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              >
                All Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{mockStats.admin.systemUptime}%</div>
            <p className="text-sm text-muted-foreground mt-1">Uptime (30 days)</p>
            <div className="mt-3">
              <Progress value={mockStats.admin.systemLoad} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{mockStats.admin.systemLoad}% load</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      {user.role === "user" && renderUserDashboard()}
      {user.role === "police" && renderPoliceDashboard()}
      {user.role === "admin" && renderAdminDashboard()}
    </DashboardLayout>
  )
}
