"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Filter,
  UserPlus,
  Settings,
} from "lucide-react"
import { getAllUsers, createUser, updateUser, deleteUser, getUserStats, type User as UserType } from "@/lib/users"
import { useRouter } from "next/navigation"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    usersByRole: { user: 0, police: 0, admin: 0 }
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "user" as "user" | "police" | "admin",
  })

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    const loadData = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
        setFilteredUsers(allUsers)
        const userStats = await getUserStats()
        setStats(userStats)
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    }

    loadData()
  }, [user, router])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      role: "user",
    })
  }

  const handleCreateUser = async () => {
    setIsSubmitting(true)
    try {
      const newUser = await createUser(formData)
      setUsers((prev) => [...prev, newUser])
      const userStats = await getUserStats()
      setStats(userStats)
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to create user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      const success = await updateUser(selectedUser.id, formData)
      if (success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u)))
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        resetForm()
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setIsSubmitting(true)
    try {
      const success = await deleteUser(userId)
      if (success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
        const userStats = await getUserStats()
        setStats(userStats)
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (user: UserType) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "police":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage system users, roles, and permissions</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Create New User</span>
                </DialogTitle>
                <DialogDescription>
                  Add a new user to the system with appropriate role and permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create-name">Full Name</Label>
                    <Input
                      id="create-name"
                      value={formData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-email">Email</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create-phone">Phone</Label>
                    <Input
                      id="create-phone"
                      value={formData.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleFormChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Citizen</SelectItem>
                        <SelectItem value="police">Police Officer</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="create-address">Address</Label>
                  <Input
                    id="create-address"
                    value={formData.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    placeholder="Enter address"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                    {isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citizens</CardTitle>
              <User className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.usersByRole.user}</div>
              <p className="text-xs text-muted-foreground">Regular users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Police Officers</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.usersByRole.police}</div>
              <p className="text-xs text-muted-foreground">Active officers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Settings className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.usersByRole.admin}</div>
              <p className="text-xs text-muted-foreground">System admins</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Citizens</option>
                  <option value="police">Police Officers</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Users Found</h3>
              <p className="text-gray-600 dark:text-gray-400">No users match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userItem) => (
              <Card key={userItem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={userItem.profileImage || "/placeholder.svg"} />
                        <AvatarFallback className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                          {userItem.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{userItem.name}</h3>
                        <Badge className={getRoleBadgeColor(userItem.role)}>
                          {userItem.role === "admin" && <Settings className="w-3 h-3 mr-1" />}
                          {userItem.role === "police" && <Shield className="w-3 h-3 mr-1" />}
                          {userItem.role === "user" && <User className="w-3 h-3 mr-1" />}
                          {userItem.role.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(userItem)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {userItem.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{userItem.email}</span>
                    </div>
                    {userItem.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{userItem.phone}</span>
                      </div>
                    )}
                    {userItem.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{userItem.address}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(userItem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="w-5 h-5" />
                <span>Edit User</span>
              </DialogTitle>
              <DialogDescription>Update user information and role permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleFormChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Citizen</SelectItem>
                      <SelectItem value="police">Police Officer</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditUser} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                  {isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
