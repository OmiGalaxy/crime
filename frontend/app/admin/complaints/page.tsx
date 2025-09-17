"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Search,
  Calendar,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Shield,
  Phone,
  Mail,
  BarChart3,
} from "lucide-react"
import { getAllComplaints, type Complaint } from "@/lib/complaints"
import { useRouter } from "next/navigation"

export default function AdminComplaintsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    const loadComplaints = async () => {
      try {
        const allComplaints = await getAllComplaints()
        setComplaints(allComplaints)
        setFilteredComplaints(allComplaints)
      } catch (error) {
        console.error('Failed to load complaints:', error)
      }
    }
    
    loadComplaints()
  }, [user, router])

  useEffect(() => {
    let filtered = complaints

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.priority === priorityFilter)
    }

    setFilteredComplaints(filtered)
  }, [complaints, searchTerm, statusFilter, priorityFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "under_review":
        return <AlertTriangle className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Complaints</h1>
            <p className="text-gray-600 dark:text-gray-400">System-wide complaint overview and management dashboard</p>
          </div>
          <Button asChild variant="outline">
            <a href="/admin/analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </a>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {complaints.filter((c) => c.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {complaints.filter((c) => c.status === "approved").length}
              </div>
              <p className="text-xs text-muted-foreground">Processed cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {complaints.filter((c) => c.priority === "high" || c.priority === "urgent").length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by complaint ID, title, or citizen name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Complaints Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No complaints match your current filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{complaint.title}</h3>
                        <Badge className={getStatusColor(complaint.status)}>
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1 capitalize">{complaint.status.replace("_", " ")}</span>
                        </Badge>
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {complaint.priority.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{complaint.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>ID: {complaint.id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{complaint.userName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Filed: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{complaint.location}</span>
                        </div>
                      </div>

                      {complaint.assignedOfficer && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                          <Shield className="w-4 h-4" />
                          <span>Assigned to: {complaint.assignedOfficer}</span>
                        </div>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5" />
                            <span>Admin View - {selectedComplaint?.id}</span>
                          </DialogTitle>
                          <DialogDescription>Complete complaint details and system information</DialogDescription>
                        </DialogHeader>

                        {selectedComplaint && (
                          <div className="space-y-6">
                            {/* Status and Priority */}
                            <div className="flex items-center space-x-3">
                              <Badge className={getStatusColor(selectedComplaint.status)}>
                                {getStatusIcon(selectedComplaint.status)}
                                <span className="ml-1 capitalize">{selectedComplaint.status.replace("_", " ")}</span>
                              </Badge>
                              <Badge className={getPriorityColor(selectedComplaint.priority)}>
                                {selectedComplaint.priority.toUpperCase()} PRIORITY
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Complaint Details */}
                              <div className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Complaint Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-1">Title</h4>
                                      <p className="text-gray-700 dark:text-gray-300">{selectedComplaint.title}</p>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-1">Description</h4>
                                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {selectedComplaint.description}
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-1">Category</h4>
                                        <p className="text-gray-700 dark:text-gray-300">{selectedComplaint.category}</p>
                                      </div>
                                      {selectedComplaint.crimeType && (
                                        <div>
                                          <h4 className="font-semibold mb-1">Crime Type</h4>
                                          <p className="text-gray-700 dark:text-gray-300">
                                            {selectedComplaint.crimeType}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-1">Location</h4>
                                      <p className="text-gray-700 dark:text-gray-300">{selectedComplaint.location}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-1">Date of Incident</h4>
                                        <p className="text-gray-700 dark:text-gray-300">
                                          {new Date(selectedComplaint.dateOfIncident).toLocaleDateString()}
                                        </p>
                                      </div>
                                      {selectedComplaint.timeOfIncident && (
                                        <div>
                                          <h4 className="font-semibold mb-1">Time</h4>
                                          <p className="text-gray-700 dark:text-gray-300">
                                            {selectedComplaint.timeOfIncident}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    {selectedComplaint.witnesses && (
                                      <div>
                                        <h4 className="font-semibold mb-1">Witnesses</h4>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                          {selectedComplaint.witnesses}
                                        </p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Citizen Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Citizen Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <User className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium">{selectedComplaint.userName}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <Mail className="w-4 h-4 text-gray-500" />
                                      <span>{selectedComplaint.userEmail}</span>
                                    </div>
                                    {selectedComplaint.userPhone && (
                                      <div className="flex items-center space-x-3">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span>{selectedComplaint.userPhone}</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Evidence and System Info */}
                              <div className="space-y-4">
                                {/* Evidence Files */}
                                {selectedComplaint.evidenceFiles.length > 0 && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Evidence Files</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 gap-3">
                                        {selectedComplaint.evidenceFiles.map((file, index) => (
                                          <div key={index} className="border rounded p-2 text-center">
                                            <img
                                              src={file || "/placeholder.svg"}
                                              alt={`Evidence ${index + 1}`}
                                              className="w-full h-24 object-cover rounded mb-1"
                                            />
                                            <p className="text-xs text-gray-500">Evidence {index + 1}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* System Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">System Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="font-medium">Complaint ID:</span>
                                      <span>{selectedComplaint.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium">Filed:</span>
                                      <span>{new Date(selectedComplaint.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium">Last Updated:</span>
                                      <span>{new Date(selectedComplaint.updatedAt).toLocaleString()}</span>
                                    </div>
                                    {selectedComplaint.assignedOfficer && (
                                      <div className="flex justify-between">
                                        <span className="font-medium">Assigned Officer:</span>
                                        <span>{selectedComplaint.assignedOfficer}</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Review Notes */}
                                {selectedComplaint.reviewNotes && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Review Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {selectedComplaint.reviewNotes}
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
