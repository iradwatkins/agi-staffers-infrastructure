'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Plus,
  Search,
  Users,
  UserPlus,
  Shield,
  Key,
  Mail,
  Calendar,
  Settings,
  Trash2,
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'moderator' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: string
  createdAt: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  loginAttempts: number
  permissions: string[]
}

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editUserOpen, setEditUserOpen] = useState(false)

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    sendInvite: true,
    temporaryPassword: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Mock data for demonstration
      setUsers([
        {
          id: '1',
          name: 'John Admin',
          email: 'john@agistaffers.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2025-01-11T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          emailVerified: true,
          twoFactorEnabled: true,
          loginAttempts: 0,
          permissions: ['all']
        },
        {
          id: '2',
          name: 'Sarah Moderator',
          email: 'sarah@agistaffers.com',
          role: 'moderator',
          status: 'active',
          lastLogin: '2025-01-11T09:15:00Z',
          createdAt: '2024-02-15T00:00:00Z',
          emailVerified: true,
          twoFactorEnabled: false,
          loginAttempts: 0,
          permissions: ['read_users', 'manage_content', 'view_analytics']
        },
        {
          id: '3',
          name: 'Mike Developer',
          email: 'mike@agistaffers.com',
          role: 'user',
          status: 'active',
          lastLogin: '2025-01-10T16:45:00Z',
          createdAt: '2024-03-10T00:00:00Z',
          emailVerified: true,
          twoFactorEnabled: false,
          loginAttempts: 0,
          permissions: ['read_only', 'deploy_sites']
        },
        {
          id: '4',
          name: 'Lisa Support',
          email: 'lisa@agistaffers.com',
          role: 'moderator',
          status: 'active',
          lastLogin: '2025-01-11T08:20:00Z',
          createdAt: '2024-04-20T00:00:00Z',
          emailVerified: true,
          twoFactorEnabled: true,
          loginAttempts: 0,
          permissions: ['read_users', 'manage_support', 'view_logs']
        },
        {
          id: '5',
          name: 'Alex Intern',
          email: 'alex@agistaffers.com',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-12-01T00:00:00Z',
          emailVerified: false,
          twoFactorEnabled: false,
          loginAttempts: 0,
          permissions: ['read_only']
        },
        {
          id: '6',
          name: 'Chris Security',
          email: 'chris@agistaffers.com',
          role: 'admin',
          status: 'suspended',
          lastLogin: '2025-01-08T14:00:00Z',
          createdAt: '2024-06-15T00:00:00Z',
          emailVerified: true,
          twoFactorEnabled: true,
          loginAttempts: 3,
          permissions: ['all']
        }
      ])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as any,
        status: 'active',
        createdAt: new Date().toISOString(),
        emailVerified: false,
        twoFactorEnabled: false,
        loginAttempts: 0,
        permissions: getRolePermissions(newUser.role as any)
      }

      setUsers([...users, user])
      setCreateUserOpen(false)
      setNewUser({
        name: '',
        email: '',
        role: 'user',
        sendInvite: true,
        temporaryPassword: ''
      })
      
      if (newUser.sendInvite) {
        toast.success('User created and invitation email sent')
      } else {
        toast.success('User created successfully')
      }
    } catch (error) {
      toast.error('Failed to create user')
    }
  }

  const handleUpdateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status }
          : user
      ))
      toast.success(`User ${status === 'active' ? 'activated' : status === 'inactive' ? 'deactivated' : 'suspended'}`)
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers(users.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      toast.success('Password reset email sent to user')
    } catch (error) {
      toast.error('Failed to send password reset email')
    }
  }

  const getRolePermissions = (role: 'admin' | 'moderator' | 'user') => {
    switch (role) {
      case 'admin':
        return ['all']
      case 'moderator':
        return ['read_users', 'manage_content', 'view_analytics', 'manage_support']
      case 'user':
        return ['read_only']
      default:
        return ['read_only']
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500'
      case 'moderator': return 'bg-blue-500'
      case 'user': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      case 'suspended': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-500" />
      case 'suspended': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout title="User Management" subtitle="Manage user accounts, roles, and permissions">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">System users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">Admin privileges</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">2FA Enabled</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.twoFactorEnabled).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((users.filter(u => u.twoFactorEnabled).length / users.length) * 100)}% of users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your criteria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {user.emailVerified ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className="text-xs">Email verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.twoFactorEnabled ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-gray-400" />
                            )}
                            <span className="text-xs">2FA enabled</span>
                          </div>
                          {user.loginAttempts > 0 && (
                            <div className="text-xs text-red-600">
                              {user.loginAttempts} failed attempts
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <span className="text-sm">{formatTimestamp(user.lastLogin)}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatTimestamp(user.createdAt)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">User actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setEditUserOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            {user.status !== 'active' && (
                              <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, 'active')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            {user.status === 'active' && (
                              <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, 'suspended')}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate role and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name *</Label>
              <Input
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address *</Label>
              <Input
                id="userEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User - Read-only access</SelectItem>
                  <SelectItem value="moderator">Moderator - Content management</SelectItem>
                  <SelectItem value="admin">Administrator - Full access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tempPassword">Temporary Password</Label>
              <Input
                id="tempPassword"
                type="password"
                value={newUser.temporaryPassword}
                onChange={(e) => setNewUser({ ...newUser, temporaryPassword: e.target.value })}
                placeholder="Leave empty to auto-generate"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sendInvite">Send invitation email</Label>
              <Switch
                id="sendInvite"
                checked={newUser.sendInvite}
                onCheckedChange={(checked) => setNewUser({ ...newUser, sendInvite: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </AdminLayout>
  )
}