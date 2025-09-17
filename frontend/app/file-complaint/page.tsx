"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Upload,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Eye,
  Camera,
  Shield,
  Info,
  Star,
  FileImage,
  FileVideo,
  File,
} from "lucide-react"
import { crimeCategories, crimeTypes, createComplaint, type Complaint } from "@/lib/complaints"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
  file: File
}

export default function FileComplaintPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    crimeType: "",
    location: "",
    dateOfIncident: "",
    timeOfIncident: "",
    witnesses: "",
    priority: "medium" as const,
    isEmergency: false,
    additionalInfo: "",
  })

  useEffect(() => {
    const requiredFields = ["title", "description", "category", "location", "dateOfIncident"]
    const completedFields = requiredFields.filter((field) => formData[field as keyof typeof formData])
    setFormProgress((completedFields.length / requiredFields.length) * 100)
  }, [formData])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset crime type when category changes
      ...(field === "category" && { crimeType: "" }),
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = [
        "image/",
        "video/",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      Array.from(files).forEach((file) => {
        if (file.size > maxSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive",
          })
          return
        }

        if (!allowedTypes.some((type) => file.type.startsWith(type) || file.type === type)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported file type`,
            variant: "destructive",
          })
          return
        }

        const newFile: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          file: file,
        }

        setUploadedFiles((prev) => [...prev, newFile])
      })
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const file = prev[index]
      URL.revokeObjectURL(file.url) // Clean up object URL
      return prev.filter((_, i) => i !== index)
    })
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-4 w-4" />
    if (type.startsWith("video/")) return <FileVideo className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && !isAnonymous) return

    setError("")
    setIsSubmitting(true)

    try {
      const complaintData: Omit<Complaint, "id" | "createdAt" | "updatedAt"> = {
        userId: isAnonymous ? "anonymous" : user!.id,
        userName: isAnonymous ? "Anonymous User" : user!.name,
        userEmail: isAnonymous ? "anonymous@crimewatch.com" : user!.email,
        userPhone: isAnonymous ? undefined : user!.phone,
        title: formData.title,
        description:
          formData.description +
          (formData.additionalInfo ? `\n\nAdditional Information: ${formData.additionalInfo}` : ""),
        category: formData.category,
        crimeType: formData.crimeType,
        location: formData.location,
        dateOfIncident: formData.dateOfIncident,
        timeOfIncident: formData.timeOfIncident,
        witnesses: formData.witnesses,
        evidenceFiles: uploadedFiles.map((file) => file.file),
        status: "pending",
        priority: formData.isEmergency ? "urgent" : formData.priority,
      }

      await createComplaint(complaintData)
      setSuccess(true)

      toast({
        title: "Complaint Submitted Successfully!",
        description: "Your complaint has been received and will be reviewed shortly.",
      })

      // Reset form after successful submission
      setTimeout(() => {
        router.push("/track-complaints")
      }, 3000)
    } catch (err) {
      setError("Failed to submit complaint. Please try again.")
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-8 pb-8">
              <div className="relative mb-6">
                <CheckCircle className="w-20 h-20 text-primary mx-auto animate-pulse-glow" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-50" />
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Complaint Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your complaint has been received and assigned a tracking number. You will be notified of any updates via
                email and through your dashboard.
              </p>
              <div className="flex flex-col items-center gap-4 mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
                  Status: Pending Review
                </Badge>
                <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2 text-sm">
                  Priority:{" "}
                  {formData.isEmergency
                    ? "Urgent"
                    : formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/track-complaints")} className="bg-primary hover:bg-primary/90">
                  <Eye className="w-4 h-4 mr-2" />
                  Track Your Complaints
                </Button>
                <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-primary/20">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                File a Crime Report
              </h1>
              <p className="text-muted-foreground">
                Report a crime or incident to the authorities. Please provide as much detail as possible for faster
                processing.
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Form Completion</span>
              <span>{Math.round(formProgress)}%</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>
        </div>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="emergency"
                checked={formData.isEmergency}
                onCheckedChange={(checked) => handleChange("isEmergency", checked as boolean)}
              />
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <Label htmlFor="emergency" className="text-destructive font-semibold">
                  This is an emergency requiring immediate attention
                </Label>
              </div>
            </div>
            {formData.isEmergency && (
              <Alert className="mt-3 border-destructive/20 bg-destructive/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-destructive">
                  For life-threatening emergencies, please call 911 immediately. This form is for urgent but
                  non-life-threatening situations.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {error && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Reporter Information</span>
              </CardTitle>
              <CardDescription>Your contact details for this complaint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Submit this report anonymously
                </Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={user?.name || ""} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input value={user?.email || ""} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input value={user?.phone || "Not provided"} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={user?.address || "Not provided"} disabled className="bg-muted/50" />
                  </div>
                </div>
              )}

              {isAnonymous && (
                <Alert className="border-primary/20 bg-primary/5">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your identity will be kept completely confidential. However, this may limit our ability to follow up
                    with you for additional information.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <span>Incident Details</span>
                <Star className="w-4 h-4 text-destructive" />
              </CardTitle>
              <CardDescription>Provide detailed information about the incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="flex items-center gap-2">
                  Complaint Title <Star className="w-3 h-3 text-destructive" />
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Brief, clear summary of the incident"
                  required
                  className="border-primary/20 focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="flex items-center gap-2">
                    Crime Category <Star className="w-3 h-3 text-destructive" />
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                    <SelectTrigger className="border-primary/20 focus:border-primary/40">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {crimeCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.category && crimeTypes[formData.category as keyof typeof crimeTypes] && (
                  <div>
                    <Label htmlFor="crimeType">Specific Crime Type</Label>
                    <Select value={formData.crimeType} onValueChange={(value) => handleChange("crimeType", value)}>
                      <SelectTrigger className="border-primary/20 focus:border-primary/40">
                        <SelectValue placeholder="Select specific type" />
                      </SelectTrigger>
                      <SelectContent>
                        {crimeTypes[formData.category as keyof typeof crimeTypes].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="flex items-center gap-2">
                  Detailed Description <Star className="w-3 h-3 text-destructive" />
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Provide a comprehensive description of what happened. Include who, what, when, where, and how. Be as specific as possible..."
                  rows={5}
                  required
                  className="border-primary/20 focus:border-primary/40 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/1000 characters</p>
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location of Incident <Star className="w-3 h-3 text-destructive" />
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Full address, intersection, or detailed location description"
                  required
                  className="border-primary/20 focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfIncident" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Incident <Star className="w-3 h-3 text-destructive" />
                  </Label>
                  <Input
                    id="dateOfIncident"
                    type="date"
                    value={formData.dateOfIncident}
                    onChange={(e) => handleChange("dateOfIncident", e.target.value)}
                    required
                    max={new Date().toISOString().split("T")[0]}
                    className="border-primary/20 focus:border-primary/40"
                  />
                </div>
                <div>
                  <Label htmlFor="timeOfIncident">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time of Incident (approximate)
                  </Label>
                  <Input
                    id="timeOfIncident"
                    type="time"
                    value={formData.timeOfIncident}
                    onChange={(e) => handleChange("timeOfIncident", e.target.value)}
                    className="border-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger className="border-primary/20 focus:border-primary/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Non-urgent matter</SelectItem>
                    <SelectItem value="medium">Medium - Standard priority</SelectItem>
                    <SelectItem value="high">High - Requires prompt attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="witnesses">Witnesses</Label>
                <Textarea
                  id="witnesses"
                  value={formData.witnesses}
                  onChange={(e) => handleChange("witnesses", e.target.value)}
                  placeholder="Names, contact information, and descriptions of any witnesses"
                  rows={3}
                  className="border-primary/20 focus:border-primary/40 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleChange("additionalInfo", e.target.value)}
                  placeholder="Any other relevant details, context, or information that might help with the investigation"
                  rows={3}
                  className="border-primary/20 focus:border-primary/40 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-primary" />
                <span>Evidence & Documentation</span>
              </CardTitle>
              <CardDescription>Upload photos, videos, or documents related to the incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="evidence" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Evidence Files
                </Label>
                <Input
                  id="evidence"
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="cursor-pointer border-primary/20 focus:border-primary/40"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Supported formats: Images (JPG, PNG, GIF), Videos (MP4, MOV), Documents (PDF, DOC, DOCX)
                  <br />
                  Maximum file size: 10MB per file
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div>
                  <Label>Uploaded Files ({uploadedFiles.length})</Label>
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-primary/10"
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="text-sm text-muted-foreground">
              <p>
                By submitting this report, you confirm that the information provided is accurate to the best of your
                knowledge.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || formProgress < 80}
                className="bg-primary hover:bg-primary/90 min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
