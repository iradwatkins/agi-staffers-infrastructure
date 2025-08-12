'use client'

import { AdminSidebar } from '@/components/dashboard/AdminSidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  badge?: string | number
}

export function AdminLayout({ children, title, subtitle, badge }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {title}
              </h1>
              {badge !== undefined && (
                <Badge variant="outline" className="hidden md:inline-flex">
                  {badge}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {subtitle && (
            <p className="text-muted-foreground mb-6">{subtitle}</p>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}