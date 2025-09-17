"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, FileText, CheckCircle, XCircle, Clock, Shield, Target } from "lucide-react"
import { getAllComplaints } from "@/lib/complaints"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Mock analytics data
const monthlyData = [
  { month: "Jan", complaints: 45, approved: 32, rejected: 8, pending: 5 },
  { month: "Feb", complaints: 52, approved: 38, rejected: 10, pending: 4 },
  { month: "Mar", complaints: 48, approved: 35, rejected: 9, pending: 4 },
  { month: "Apr", complaints: 61, approved: 44, rejected: 12, pending: 5 },
  { month: "May", complaints: 55, approved: 40, rejected: 11, pending: 4 },
  { month: "Jun", complaints: 58, approved: 42, rejected: 13, pending: 3 },
]

const categoryData = [
  { name: "Theft/Burglary", value: 35, color: "#ef4444" },
  { name: "Assault/Violence", value: 25, color: "#f97316" },
  { name: "Vandalism", value: 20, color: "#eab308" },
  { name: "Fraud/Scam", value: 12, color: "#22c55e" },
  { name: "Other", value: 8, color: "#6366f1" },
]

const performanceData = [
  { metric: "Response Time", current: 2.4, target: 2.0, unit: "hours" },
  { metric: "Approval Rate", current: 78, target: 80, unit: "%" },
  { metric: "Case Resolution", current: 85, target: 90, unit: "%" },
  { metric: "Citizen Satisfaction", current: 4.2, target: 4.5, unit: "/5" },
]

export default function PoliceAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== "police") {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getAllComplaints()
        setComplaints(data)
      } catch (error) {
        console.error('Failed to load complaints:', error)
      } finally {
        setLoading(false)
      }
    }
    loadComplaints()
  }, [])

  if (user?.role !== "police") {
    return null
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </DashboardLayout>
    )
  }

  const totalComplaints = complaints.length
  const approvedComplaints = complaints.filter((c) => c.status === "approved").length
  const rejectedComplaints = complaints.filter((c) => c.status === "rejected").length
  const pendingComplaints = complaints.filter((c) => c.status === "pending").length

  const approvalRate = totalComplaints > 0 ? Math.round((approvedComplaints / totalComplaints) * 100) : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Police Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Performance metrics and complaint analysis for your jurisdiction
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Officer: {user.name}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComplaints}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvalRate}%</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingComplaints}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span>-2 from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2.4h</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>20% faster</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Complaint Trends</CardTitle>
              <CardDescription>Complaint volume and resolution over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="complaints" fill="#ef4444" name="Total Complaints" />
                  <Bar dataKey="approved" fill="#22c55e" name="Approved" />
                  <Bar dataKey="rejected" fill="#f97316" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Crime Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Crime Categories</CardTitle>
              <CardDescription>Distribution of complaint types in your jurisdiction</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators and targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceData.map((metric, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <Badge
                      variant={metric.current >= metric.target ? "default" : "secondary"}
                      className={
                        metric.current >= metric.target
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {metric.current >= metric.target ? "On Target" : "Below Target"}
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
                      value={metric.unit === "%" ? metric.current : (metric.current / metric.target) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest complaint reviews and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium">{complaint.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {complaint.userName} • {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      complaint.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : complaint.status === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }
                  >
                    {complaint.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {complaint.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                    {complaint.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
