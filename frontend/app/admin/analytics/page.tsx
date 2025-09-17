"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, FileText, CheckCircle, XCircle, Clock, Shield, Users, Target, Activity } from "lucide-react"
import { getAllComplaints } from "@/lib/complaints"
import { getUserStats } from "@/lib/users"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Mock analytics data
const monthlyTrends = [
  { month: "Jan", complaints: 45, users: 120, resolved: 38 },
  { month: "Feb", complaints: 52, users: 135, resolved: 44 },
  { month: "Mar", complaints: 48, users: 142, resolved: 41 },
  { month: "Apr", complaints: 61, users: 158, resolved: 52 },
  { month: "May", complaints: 55, users: 167, resolved: 47 },
  { month: "Jun", complaints: 58, users: 178, resolved: 49 },
]

const categoryDistribution = [
  { name: "Theft/Burglary", value: 35, color: "#ef4444" },
  { name: "Assault/Violence", value: 25, color: "#f97316" },
  { name: "Vandalism", value: 20, color: "#eab308" },
  { name: "Fraud/Scam", value: 12, color: "#22c55e" },
  { name: "Other", value: 8, color: "#6366f1" },
]

const responseTimeData = [
  { day: "Mon", avgTime: 2.1, target: 2.0 },
  { day: "Tue", avgTime: 1.8, target: 2.0 },
  { day: "Wed", avgTime: 2.3, target: 2.0 },
  { day: "Thu", avgTime: 1.9, target: 2.0 },
  { day: "Fri", avgTime: 2.5, target: 2.0 },
  { day: "Sat", avgTime: 2.8, target: 2.0 },
  { day: "Sun", avgTime: 2.2, target: 2.0 },
]

const systemMetrics = [
  { metric: "System Uptime", current: 99.9, target: 99.5, unit: "%" },
  { metric: "User Satisfaction", current: 4.3, target: 4.0, unit: "/5" },
  { metric: "Resolution Rate", current: 87, target: 85, unit: "%" },
  { metric: "Response Time", current: 2.2, target: 2.5, unit: "hrs" },
]

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user?.role !== "admin") {
    return null
  }

  const [complaints, setComplaints] = useState([])
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    usersByRole: { user: 0, police: 0, admin: 0 }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const complaintsData = await getAllComplaints()
        const statsData = await getUserStats()
        setComplaints(complaintsData)
        setUserStats(statsData)
      } catch (error) {
        console.error('Failed to load analytics data:', error)
      }
    }
    
    if (user?.role === "admin") {
      loadData()
    }
  }, [user])
  const totalComplaints = complaints.length
  const approvedComplaints = complaints.filter((c) => c.status === "approved").length
  const rejectedComplaints = complaints.filter((c) => c.status === "rejected").length
  const pendingComplaints = complaints.filter((c) => c.status === "pending").length

  const resolutionRate =
    totalComplaints > 0 ? Math.round(((approvedComplaints + rejectedComplaints) / totalComplaints) * 100) : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive system performance and usage analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Live Dashboard</span>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+{userStats.newUsersThisMonth} this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComplaints}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+15% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolutionRate}%</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+5% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Officers</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userStats.usersByRole.police}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>All online</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly System Trends</CardTitle>
              <CardDescription>User growth, complaints, and resolution trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="complaints"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="3"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Crime Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Crime Category Distribution</CardTitle>
              <CardDescription>System-wide complaint categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Response Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Analysis</CardTitle>
            <CardDescription>Average response times vs targets throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#ef4444" strokeWidth={2} name="Avg Response Time" />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators and system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <Badge
                      variant={
                        (metric.unit === "hrs" ? metric.current <= metric.target : metric.current >= metric.target)
                          ? "default"
                          : "secondary"
                      }
                      className={
                        (metric.unit === "hrs" ? metric.current <= metric.target : metric.current >= metric.target)
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {(metric.unit === "hrs" ? metric.current <= metric.target : metric.current >= metric.target)
                        ? "Excellent"
                        : "Good"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Current: {metric.current}
                        {metric.unit}
                      </span>
                      <span>
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                    </div>
                    <Progress
                      value={
                        metric.unit === "%"
                          ? metric.current
                          : metric.unit === "/5"
                            ? (metric.current / 5) * 100
                            : metric.unit === "hrs"
                              ? Math.max(0, 100 - ((metric.current - metric.target) / metric.target) * 100)
                              : (metric.current / metric.target) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Pending Complaints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingComplaints}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting police review</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Processing Rate</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Approved Cases</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{approvedComplaints}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Successfully processed</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Approval Rate</span>
                  <span>{totalComplaints > 0 ? Math.round((approvedComplaints / totalComplaints) * 100) : 0}%</span>
                </div>
                <Progress
                  value={totalComplaints > 0 ? (approvedComplaints / totalComplaints) * 100 : 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>Rejected Cases</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">{rejectedComplaints}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Not processed</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Rejection Rate</span>
                  <span>{totalComplaints > 0 ? Math.round((rejectedComplaints / totalComplaints) * 100) : 0}%</span>
                </div>
                <Progress
                  value={totalComplaints > 0 ? (rejectedComplaints / totalComplaints) * 100 : 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
