"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Plus,
  Download,
  RefreshCw,
  Baseline as Timeline,
  Shield,
} from "lucide-react"
import { getComplaintsByUser, type Complaint } from "@/lib/complaints"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function TrackComplaintsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadComplaints = async () => {
      if (user) {
        try {
          const userComplaints = await getComplaintsByUser(user.id)
          setComplaints(userComplaints)
          setFilteredComplaints(userComplaints)
        } catch (error) {
          console.error('Failed to load complaints:', error)
        }
      }
      setLoading(false)
    }
    loadComplaints()
  }, [user])

  useEffect(() => {
    let filtered = complaints

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.category.toLowerCase().includes(searchTerm.toLowerCase()),
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

    // Sort complaints
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    setFilteredComplaints(filtered)
  }, [complaints, searchTerm, statusFilter, priorityFilter, sortBy])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    if (user) {
      try {
        const userComplaints = await getComplaintsByUser(user.id)
        setComplaints(userComplaints)
      } catch (error) {
        console.error('Failed to refresh complaints:', error)
      }
    }

    setIsRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Complaint status updated successfully.",
    })
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
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "under_review":
        return 50
      case "approved":
        return 100
      case "rejected":
        return 100
      default:
        return 0
    }
  }

  const getStatusSteps = (complaint: Complaint) => {
    const steps = [
      { label: "Submitted", status: "completed", date: complaint.createdAt },
      {
        label: "Under Review",
        status: complaint.status === "pending" ? "pending" : "completed",
        date: complaint.updatedAt,
      },
      {
        label: complaint.status === "rejected" ? "Rejected" : "Approved",
        status: complaint.status === "approved" || complaint.status === "rejected" ? "completed" : "pending",
        date: complaint.status === "approved" || complaint.status === "rejected" ? complaint.updatedAt : null,
      },
    ]
    return steps
  }

  const getComplaintStats = () => {
    const total = complaints.length
    const pending = complaints.filter((c) => c.status === "pending").length
    const approved = complaints.filter((c) => c.status === "approved").length
    const rejected = complaints.filter((c) => c.status === "rejected").length
    const underReview = complaints.filter((c) => c.status === "under_review").length

    return { total, pending, approved, rejected, underReview }
  }

  const stats = getComplaintStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Track Your Reports
            </h1>
            <p className="text-muted-foreground">Monitor the status and progress of your filed crime reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-primary/20 hover:border-primary/40 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/file-complaint">
                <Plus className="w-4 h-4 mr-2" />
                File New Report
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
              <div className="text-sm text-muted-foreground">Under Review</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, description, ID, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] border-primary/20">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[120px] border-primary/20">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[120px] border-primary/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        {loading ? (
          <Card className="border-primary/20">
            <CardContent className="text-center py-12">
              <div className="text-lg">Loading your reports...</div>
            </CardContent>
          </Card>
        ) : filteredComplaints.length === 0 ? (
          <Card className="border-primary/20">
            <CardContent className="text-center py-12">
              <div className="relative mb-6">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {complaints.length === 0
                  ? "You haven't filed any crime reports yet. Start by filing your first report to help keep your community safe."
                  : "No reports match your current filters. Try adjusting your search criteria."}
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/file-complaint">
                  <Plus className="w-4 h-4 mr-2" />
                  File Your First Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card
                key={complaint.id}
                className="hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {complaint.title}
                        </h3>
                        <Badge className={getStatusColor(complaint.status)}>
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1 capitalize">{complaint.status.replace("_", " ")}</span>
                        </Badge>
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {complaint.priority.toUpperCase()}
                        </Badge>
                        {complaint.assignedOfficer && (
                          <Badge variant="outline" className="border-primary/20">
                            <Shield className="w-3 h-3 mr-1" />
                            Assigned
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">{complaint.description}</p>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary font-medium">{getStatusProgress(complaint.status)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getStatusProgress(complaint.status)}%` }}
                          />
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="font-medium">ID:</span>
                          <span>{complaint.id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">Filed:</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-medium">Updated:</span>
                          <span>{new Date(complaint.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium truncate">{complaint.location}</span>
                        </div>
                      </div>

                      {complaint.assignedOfficer && (
                        <div className="flex items-center space-x-2 text-sm text-primary">
                          <User className="w-4 h-4" />
                          <span className="font-medium">Assigned Officer:</span>
                          <span>{complaint.assignedOfficer}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedComplaint(complaint)}
                            className="border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <FileText className="w-5 h-5 text-primary" />
                              <span>Report Details - {selectedComplaint?.id}</span>
                            </DialogTitle>
                            <DialogDescription>
                              Complete information and timeline for your crime report
                            </DialogDescription>
                          </DialogHeader>

                          {selectedComplaint && (
                            <div className="space-y-6">
                              {/* Status and Priority */}
                              <div className="flex flex-wrap items-center gap-3">
                                <Badge className={getStatusColor(selectedComplaint.status)}>
                                  {getStatusIcon(selectedComplaint.status)}
                                  <span className="ml-1 capitalize">{selectedComplaint.status.replace("_", " ")}</span>
                                </Badge>
                                <Badge className={getPriorityColor(selectedComplaint.priority)}>
                                  {selectedComplaint.priority.toUpperCase()} PRIORITY
                                </Badge>
                                {selectedComplaint.assignedOfficer && (
                                  <Badge variant="outline" className="border-primary/20">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Officer Assigned
                                  </Badge>
                                )}
                              </div>

                              {/* Timeline */}
                              <Card className="border-primary/20">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2 text-lg">
                                    <Timeline className="w-5 h-5 text-primary" />
                                    Case Timeline
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    {getStatusSteps(selectedComplaint).map((step, index) => (
                                      <div key={index} className="flex items-center space-x-4">
                                        <div
                                          className={`w-3 h-3 rounded-full ${
                                            step.status === "completed" ? "bg-primary" : "bg-muted"
                                          }`}
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <span
                                              className={`font-medium ${
                                                step.status === "completed" ? "text-primary" : "text-muted-foreground"
                                              }`}
                                            >
                                              {step.label}
                                            </span>
                                            {step.date && (
                                              <span className="text-sm text-muted-foreground">
                                                {new Date(step.date).toLocaleString()}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>

                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="details">Report Details</TabsTrigger>
                                  <TabsTrigger value="evidence">Evidence</TabsTrigger>
                                  <TabsTrigger value="updates">Updates</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2 text-primary">Report Title</h4>
                                      <p className="text-foreground">{selectedComplaint.title}</p>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2 text-primary">Description</h4>
                                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                                        {selectedComplaint.description}
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2 text-primary">Category</h4>
                                        <p className="text-foreground">{selectedComplaint.category}</p>
                                      </div>
                                      {selectedComplaint.crimeType && (
                                        <div>
                                          <h4 className="font-semibold mb-2 text-primary">Crime Type</h4>
                                          <p className="text-foreground">{selectedComplaint.crimeType}</p>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2 text-primary">Location</h4>
                                      <p className="text-foreground">{selectedComplaint.location}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2 text-primary">Date of Incident</h4>
                                        <p className="text-foreground">
                                          {new Date(selectedComplaint.dateOfIncident).toLocaleDateString()}
                                        </p>
                                      </div>
                                      {selectedComplaint.timeOfIncident && (
                                        <div>
                                          <h4 className="font-semibold mb-2 text-primary">Time of Incident</h4>
                                          <p className="text-foreground">{selectedComplaint.timeOfIncident}</p>
                                        </div>
                                      )}
                                    </div>

                                    {selectedComplaint.witnesses && (
                                      <div>
                                        <h4 className="font-semibold mb-2 text-primary">Witnesses</h4>
                                        <p className="text-foreground whitespace-pre-wrap">
                                          {selectedComplaint.witnesses}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>

                                <TabsContent value="evidence" className="space-y-4">
                                  {selectedComplaint.evidenceFiles.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {selectedComplaint.evidenceFiles.map((file, index) => (
                                        <Card key={index} className="border-primary/20">
                                          <CardContent className="p-4 text-center">
                                            <img
                                              src={file || "/placeholder.svg"}
                                              alt={`Evidence ${index + 1}`}
                                              className="w-full h-32 object-cover rounded mb-2"
                                            />
                                            <p className="text-sm text-muted-foreground">Evidence {index + 1}</p>
                                            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                              <Download className="w-3 h-3 mr-1" />
                                              Download
                                            </Button>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                      <p className="text-muted-foreground">No evidence files uploaded</p>
                                    </div>
                                  )}
                                </TabsContent>

                                <TabsContent value="updates" className="space-y-4">
                                  <div className="space-y-4">
                                    {selectedComplaint.assignedOfficer && (
                                      <Card className="border-primary/20">
                                        <CardContent className="p-4">
                                          <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-primary" />
                                            <div>
                                              <h4 className="font-semibold">Assigned Officer</h4>
                                              <p className="text-muted-foreground">
                                                {selectedComplaint.assignedOfficer}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {selectedComplaint.reviewNotes && (
                                      <Card className="border-primary/20">
                                        <CardContent className="p-4">
                                          <h4 className="font-semibold mb-2 text-primary">Review Notes</h4>
                                          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                                            {selectedComplaint.reviewNotes}
                                          </p>
                                        </CardContent>
                                      </Card>
                                    )}

                                    <Card className="border-primary/20">
                                      <CardContent className="p-4">
                                        <div className="text-sm text-muted-foreground space-y-1">
                                          <p>
                                            <span className="font-medium">Filed:</span>{" "}
                                            {new Date(selectedComplaint.createdAt).toLocaleString()}
                                          </p>
                                          <p>
                                            <span className="font-medium">Last Updated:</span>{" "}
                                            {new Date(selectedComplaint.updatedAt).toLocaleString()}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
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
