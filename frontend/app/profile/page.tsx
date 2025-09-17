"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Bell,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  BarChart3,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    caseUpdates: true,
    systemAlerts: true,
  })

  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
    setSuccess("Profile updated successfully!")
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
    setTimeout(() => setSuccess(""), 3000)
  }

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation password do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    // Simulate password update
    setIsChangingPassword(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    })
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
    })
    setIsEditing(false)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      case "police":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  const getActivityStats = () => {
    switch (user?.role) {
      case "admin":
        return [
          { label: "Total Cases", value: "892", icon: FileText, color: "text-primary" },
          { label: "Active Officers", value: "23", icon: Shield, color: "text-blue-600" },
          { label: "System Users", value: "1,247", icon: User, color: "text-green-600" },
          { label: "Monthly Reports", value: "45", icon: BarChart3, color: "text-orange-600" },
        ]
      case "police":
        return [
          { label: "Cases Reviewed", value: "45", icon: FileText, color: "text-primary" },
          { label: "Approval Rate", value: "78%", icon: CheckCircle, color: "text-green-600" },
          { label: "Pending Review", value: "12", icon: Clock, color: "text-yellow-600" },
          { label: "This Month", value: "8", icon: Calendar, color: "text-blue-600" },
        ]
      default:
        return [
          { label: "Reports Filed", value: "3", icon: FileText, color: "text-primary" },
          { label: "Approved", value: "1", icon: CheckCircle, color: "text-green-600" },
          { label: "Pending", value: "1", icon: Clock, color: "text-yellow-600" },
          { label: "Under Review", value: "1", icon: AlertTriangle, color: "text-blue-600" },
        ]
    }
  }

  if (!user) return null

  const activityStats = getActivityStats()

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">Manage your account information, preferences, and security settings</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-primary/20 bg-transparent">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {success && (
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-primary">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1 border-primary/20">
            <CardHeader className="text-center">
              <div className="relative flex justify-center mb-4">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center space-x-2">
                <Badge className={getRoleBadgeColor(user.role)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role.toUpperCase()}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-foreground truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-foreground text-xs leading-relaxed">{user.address}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 border-primary/20 focus:border-primary/40"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 border-primary/20 focus:border-primary/40"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 border-primary/20 focus:border-primary/40"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Account Type</Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="role"
                            value={user.role.toUpperCase()}
                            disabled
                            className="pl-10 bg-muted/50 border-primary/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="pl-10 border-primary/20 focus:border-primary/40"
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-primary/20 focus:border-primary/40 resize-none"
                        placeholder="Tell us a bit about yourself..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className="border-primary/20 hover:border-primary/40 bg-transparent"
                      >
                        Change Password
                      </Button>
                    </div>

                    {isChangingPassword && (
                      <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="pt-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="pl-10 pr-10 border-primary/20 focus:border-primary/40"
                                placeholder="Enter current password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="pl-10 pr-10 border-primary/20 focus:border-primary/40"
                                placeholder="Enter new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="pl-10 pr-10 border-primary/20 focus:border-primary/40"
                                placeholder="Confirm new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsChangingPassword(false)}
                              className="border-primary/20"
                            >
                              Cancel
                            </Button>
                            <Button onClick={handlePasswordSave} className="bg-primary hover:bg-primary/90">
                              Update Password
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-4">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg">
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-muted-foreground">Receive codes via SMS</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg">
                        <div>
                          <p className="font-medium">Email Authentication</p>
                          <p className="text-sm text-muted-foreground">Receive codes via email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Communication</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                          </div>
                          <Switch
                            checked={preferences.emailNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                          </div>
                          <Switch
                            checked={preferences.smsNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                          </div>
                          <Switch
                            checked={preferences.pushNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Content</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Case Updates</p>
                            <p className="text-sm text-muted-foreground">Updates on your filed reports</p>
                          </div>
                          <Switch
                            checked={preferences.caseUpdates}
                            onCheckedChange={(checked) => handlePreferenceChange("caseUpdates", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Weekly Reports</p>
                            <p className="text-sm text-muted-foreground">Weekly summary of activities</p>
                          </div>
                          <Switch
                            checked={preferences.weeklyReports}
                            onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">System Alerts</p>
                            <p className="text-sm text-muted-foreground">Important system notifications</p>
                          </div>
                          <Switch
                            checked={preferences.systemAlerts}
                            onCheckedChange={(checked) => handlePreferenceChange("systemAlerts", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Activity Overview
                    </CardTitle>
                    <CardDescription>Your account activity and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {activityStats.map((stat, index) => (
                        <div key={index} className="text-center p-4 bg-muted/50 rounded-lg border border-primary/10">
                          <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          action: "Filed new crime report",
                          time: "2 hours ago",
                          icon: FileText,
                          color: "text-primary",
                        },
                        {
                          action: "Updated profile information",
                          time: "1 day ago",
                          icon: User,
                          color: "text-green-600",
                        },
                        {
                          action: "Changed notification settings",
                          time: "3 days ago",
                          icon: Settings,
                          color: "text-blue-600",
                        },
                        {
                          action: "Logged in from new device",
                          time: "1 week ago",
                          icon: Shield,
                          color: "text-orange-600",
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
