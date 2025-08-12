'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Globe,
  Activity,
  Workflow,
  Server,
  Package,
  HardDrive,
  Settings,
  Database,
  Container,
  Key,
  Search,
  MessageSquare,
  BarChart3,
  Clock,
  Shield,
  GitBranch,
  Bell,
  Archive,
  Menu,
  X,
  ExternalLink,
  CircleDot,
  LogOut,
  User,
  Smartphone
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { usePWAInstall } from '@/hooks/use-pwa-install'

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  isExternal?: boolean
  isInstallButton?: boolean
  mobileOnly?: boolean
  status?: 'online' | 'offline' | 'warning'
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Customers',
    icon: Users,
    children: [
      { title: 'All Customers', href: '/admin/customers', icon: Users },
      { title: 'Add Customer', href: '/admin/customers/new', icon: Users },
      { title: 'Billing & Subscriptions', href: '/admin/billing', icon: Users },
      { title: 'Support Tickets', href: '/admin/support', icon: MessageSquare }
    ]
  },
  {
    title: 'Sites',
    icon: Globe,
    children: [
      { title: 'Active Sites', href: '/admin/sites', icon: Globe },
      { title: 'Deploy New Site', href: '/admin/sites/deploy', icon: Globe },
      { title: 'Templates', href: '/admin/templates', icon: Package },
      { title: 'Domains & SSL', href: '/admin/domains', icon: Shield }
    ]
  },
  {
    title: 'Monitoring',
    icon: Activity,
    children: [
      { title: 'System Health', href: '/admin/monitoring', icon: Activity },
      { title: 'Site Metrics', href: '/admin/monitoring/sites', icon: BarChart3 },
      { title: 'Alerts', href: '/admin/alerts', icon: Bell },
      { title: 'Historical Data', href: '/admin/monitoring/history', icon: Clock }
    ]
  },
  {
    title: 'Automation',
    icon: Workflow,
    children: [
      { title: 'Workflows (n8n)', href: 'https://n8n.agistaffers.com', icon: GitBranch, isExternal: true, status: 'online' },
      { title: 'AI Builder (Flowise)', href: 'https://flowise.agistaffers.com', icon: Workflow, isExternal: true, status: 'online' },
      { title: 'Scheduled Tasks', href: '/admin/automation/scheduled', icon: Clock },
      { title: 'Event Triggers', href: '/admin/automation/triggers', icon: CircleDot }
    ]
  },
  {
    title: 'Infrastructure',
    icon: Server,
    children: [
      { title: 'Containers (Portainer)', href: 'https://portainer.agistaffers.com', icon: Container, isExternal: true, status: 'online' },
      { title: 'Database (pgAdmin)', href: 'https://pgadmin.agistaffers.com', icon: Database, isExternal: true, status: 'online' },
      { title: 'Storage (MinIO)', href: 'https://minio.agistaffers.com', icon: HardDrive, isExternal: true, status: 'online' },
      { title: 'Secrets (Vault)', href: 'https://vault.agistaffers.com', icon: Key, isExternal: true, status: 'online' }
    ]
  },
  {
    title: 'Tools',
    icon: Package,
    children: [
      { title: 'Search (SearXNG)', href: 'https://searxng.agistaffers.com', icon: Search, isExternal: true, status: 'online' },
      { title: 'Chat (Open WebUI)', href: 'https://chat.agistaffers.com', icon: MessageSquare, isExternal: true, status: 'online' },
      { title: 'Analytics (Grafana)', href: 'https://grafana.agistaffers.com', icon: BarChart3, isExternal: true, status: 'online' },
      { title: 'Uptime (Uptime Kuma)', href: 'https://uptime.agistaffers.com', icon: Clock, isExternal: true, status: 'online' }
    ]
  },
  {
    title: 'Backups',
    icon: Archive,
    children: [
      { title: 'Backup Status', href: '/admin/backups', icon: Archive },
      { title: 'Restore Points', href: '/admin/backups/restore', icon: Archive },
      { title: 'Schedule', href: '/admin/backups/schedule', icon: Clock }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'System Config', href: '/admin/settings', icon: Settings },
      { title: 'Users & Roles', href: '/admin/settings/users', icon: Users },
      { title: 'API Keys', href: '/admin/settings/api', icon: Key },
      { title: 'Security', href: '/admin/settings/security', icon: Shield }
    ]
  },
  // Mobile-only Install App button
  {
    title: 'Install AGI Staffers',
    href: '#install-app',
    icon: Smartphone,
    isInstallButton: true,
    mobileOnly: true
  }
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Customers', 'Sites'])
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { isInstalled, isInstallable, install } = usePWAInstall()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const MenuItemWithTooltip = ({ children, title, collapsed, level }: { 
    children: React.ReactNode
    title: string
    collapsed: boolean
    level: number
  }) => {
    if (collapsed && level === 0) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      )
    }
    return <>{children}</>
  }

  const StatusIndicator = ({ status }: { status?: string }) => {
    if (!status) return null
    
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      warning: 'bg-yellow-500'
    }
    
    return (
      <span className={cn(
        'inline-block w-2 h-2 rounded-full',
        colors[status as keyof typeof colors] || 'bg-gray-500'
      )} />
    )
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const isActive = pathname === item.href
    const Icon = item.icon

    // Special handling for Install App button
    if (item.isInstallButton) {
      // Only show if app is installable and not already installed
      if (!isInstallable || isInstalled) {
        return null
      }
      
      // Only show on mobile if mobileOnly is true
      if (item.mobileOnly) {
        return (
          <MenuItemWithTooltip key={item.title} title={item.title} collapsed={collapsed} level={level}>
            <button
              onClick={install}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'md:hidden', // Hide on desktop
                collapsed && level === 0 && 'justify-center'
              )}
            >
              <Icon className="h-4 w-4" />
              {(!collapsed || level > 0) && <span>{item.title}</span>}
            </button>
          </MenuItemWithTooltip>
        )
      }
      
      return (
        <button
          key={item.title}
          onClick={install}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            collapsed && level === 0 && 'justify-center'
          )}
        >
          <Icon className="h-4 w-4" />
          {(!collapsed || level > 0) && <span>{item.title}</span>}
        </button>
      )
    }

    if (hasChildren) {
      return (
        <div key={item.title}>
          <MenuItemWithTooltip title={item.title} collapsed={collapsed} level={level}>
            <button
              onClick={() => toggleExpanded(item.title)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                collapsed && level === 0 && 'justify-center'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {(!collapsed || level > 0) && <span>{item.title}</span>}
              </div>
              {(!collapsed || level > 0) && hasChildren && (
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              )}
            </button>
          </MenuItemWithTooltip>
          {isExpanded && (!collapsed || level > 0) && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    if (item.isExternal) {
      return (
        <MenuItemWithTooltip key={item.title} title={item.title} collapsed={collapsed} level={level}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              collapsed && level === 0 && 'justify-center'
            )}
          >
            <Icon className="h-4 w-4" />
            {(!collapsed || level > 0) && (
              <>
                <span className="flex-1">{item.title}</span>
                <div className="flex items-center gap-2">
                  <StatusIndicator status={item.status} />
                  <ExternalLink className="h-3 w-3" />
                </div>
              </>
            )}
          </a>
        </MenuItemWithTooltip>
      )
    }

    return (
      <MenuItemWithTooltip key={item.title} title={item.title} collapsed={collapsed} level={level}>
        <Link
          href={item.href || '#'}
          className={cn(
            'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground',
            collapsed && level === 0 && 'justify-center'
          )}
        >
          <Icon className="h-4 w-4" />
          {(!collapsed || level > 0) && <span>{item.title}</span>}
        </Link>
      </MenuItemWithTooltip>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <span className="font-semibold">AGI Staffers</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {navigation.map(item => renderNavItem(item))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-4 space-y-2">
            <div className={cn(
              'flex items-center gap-3',
              collapsed && 'justify-center'
            )}>
              <div className="relative">
                <CircleDot className="h-4 w-4 text-green-500" />
              </div>
              {!collapsed && (
                <div className="flex-1">
                  <p className="text-xs font-medium">System Status</p>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </div>
              )}
            </div>
            
            {/* User Account Section */}
            <div className="border-t pt-2 mt-2">
              <MenuItemWithTooltip title="My Account" collapsed={collapsed} level={0}>
                <Link href="/admin/settings/users">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {!collapsed && <span>My Account</span>}
                  </Button>
                </Link>
              </MenuItemWithTooltip>
              <MenuItemWithTooltip title="Logout" collapsed={collapsed} level={0}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {!collapsed && <span>Logout</span>}
                </Button>
              </MenuItemWithTooltip>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}