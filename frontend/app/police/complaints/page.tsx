"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Gavel,
} from "lucide-react"
import { getAllComplaints, updateComplaintStatus, crimeTypes, type Complaint } from "@/lib/complaints"
import { useRouter } from "next/navigation"

export default function PoliceComplaintsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [selectedCrimeType, setSelectedCrimeType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user?.role !== "police") {
      router.push("/dashboard")
      return
    }

    const loadComplaints = async () => {
      try {
        const allComplaints = await getAllComplaints()
        setComplaints(allComplaints)
        setFilteredComplaints(allComplaints.filter((c) => c.status === "pending"))
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

  const handleReviewSubmit = async () => {
    if (!selectedComplaint || !reviewAction) return

    setIsSubmitting(true)

    try {
      const success = await updateComplaintStatus(
        selectedComplaint.id,
        reviewAction === "approve" ? "approved" : "rejected",
        reviewNotes,
        selectedCrimeType,
      )

      if (success) {
        if (reviewAction === "reject") {
          // Remove rejected complaint from dashboard
          const updatedComplaints = complaints.filter((c) => c.id !== selectedComplaint.id)
          setComplaints(updatedComplaints)
        } else {
          // Update approved complaint
          const updatedComplaints = complaints.map((c) =>
            c.id === selectedComplaint.id
              ? {
                  ...c,
                  status: "approved" as const,
                  reviewNotes,
                  assignedOfficer: user?.name,
                  crimeType: selectedCrimeType || c.crimeType,
                  updatedAt: new Date().toISOString(),
                }
              : c,
          )
          setComplaints(updatedComplaints)
        }

        // Reset form
        setSelectedComplaint(null)
        setReviewAction(null)
        setReviewNotes("")
        setSelectedCrimeType("")
      }
    } catch (error) {
      console.error("Failed to update complaint:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComplaint = () => {
    if (!selectedComplaint) return
    
    if (confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      const updatedComplaints = complaints.filter((c) => c.id !== selectedComplaint.id)
      setComplaints(updatedComplaints)
      setSelectedComplaint(null)
      setReviewAction(null)
      setReviewNotes("")
      setSelectedCrimeType("")
    }
  }

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

  if (user?.role !== "police") {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Complaints</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and process citizen complaints assigned to your jurisdiction
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Officer: {user.name}</span>
          </div>
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
                    <option value="pending">Pending Review</option>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {complaints.filter((c) => c.status === "pending").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      complaints.filter(
                        (c) =>
                          c.status === "approved" && new Date(c.updatedAt).toDateString() === new Date().toDateString(),
                      ).length
                    }
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {complaints.filter((c) => c.priority === "high" || c.priority === "urgent").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assigned</p>
                  <p className="text-2xl font-bold text-blue-600">{complaints.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Gavel className="w-5 h-5" />
                            <span>Police Review - {selectedComplaint?.id}</span>
                          </DialogTitle>
                          <DialogDescription>
                            Review complaint details and make a decision on the case
                          </DialogDescription>
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

                              {/* Evidence and Review */}
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

                                {/* Review Section */}
                                {selectedComplaint.status === "pending" && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Police Review</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium mb-2">Decision</label>
                                        <div className="flex space-x-4">
                                          <Button
                                            variant={reviewAction === "approve" ? "default" : "outline"}
                                            onClick={() => setReviewAction("approve")}
                                            className={
                                              reviewAction === "approve"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "border-green-600 text-green-600 hover:bg-green-50"
                                            }
                                          >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                          </Button>
                                          <Button
                                            variant={reviewAction === "reject" ? "default" : "outline"}
                                            onClick={() => setReviewAction("reject")}
                                            className={
                                              reviewAction === "reject"
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "border-red-600 text-red-600 hover:bg-red-50"
                                            }
                                          >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>

                                      {reviewAction === "approve" && (
                                        <div>
                                          <label className="block text-sm font-medium mb-2">
                                            Confirm Crime Type (Optional)
                                          </label>
                                          <Select value={selectedCrimeType} onValueChange={setSelectedCrimeType}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select specific crime type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {selectedComplaint.category &&
                                                crimeTypes[selectedComplaint.category as keyof typeof crimeTypes]?.map(
                                                  (type) => (
                                                    <SelectItem key={type} value={type}>
                                                      {type}
                                                    </SelectItem>
                                                  ),
                                                )}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}

                                      <div>
                                        <label className="block text-sm font-medium mb-2">Review Notes</label>
                                        <Textarea
                                          value={reviewNotes}
                                          onChange={(e) => setReviewNotes(e.target.value)}
                                          placeholder="Add your review notes, investigation details, or reasons for decision..."
                                          rows={4}
                                        />
                                      </div>

                                      <Button
                                        onClick={handleReviewSubmit}
                                        disabled={!reviewAction || isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                      >
                                        {isSubmitting ? (
                                          <>
                                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                          </>
                                        ) : (
                                          <>
                                            <Gavel className="w-4 h-4 mr-2" />
                                            Submit Review
                                          </>
                                        )}
                                      </Button>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Previous Review */}
                                {selectedComplaint.reviewNotes && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Previous Review</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Shield className="w-4 h-4 text-blue-500" />
                                          <span className="font-medium">{selectedComplaint.assignedOfficer}</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                          {selectedComplaint.reviewNotes}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Reviewed: {new Date(selectedComplaint.updatedAt).toLocaleString()}
                                        </p>
                                      </div>
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
