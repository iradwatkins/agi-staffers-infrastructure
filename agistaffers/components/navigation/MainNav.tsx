'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { 
  Bot, 
  Menu, 
  X, 
  ChevronDown,
  ArrowRight,
  Globe,
  ShoppingBag,
  Building,
  Users,
  Mail
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageToggle from '@/components/LanguageToggle'

export default function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { label: t.nav.services || 'AI Assistants', href: '/ai-assistants' },
    { label: t.nav.features || 'Workflow Automation', href: '/workflow-automation' },
    { label: 'SEO', href: '/seo' },
    { label: t.nav.pricing || 'Prompt Engineering', href: '/prompt-engineering' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Bot className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              AGI Staffers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Need a Website Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname?.startsWith('/websites') ? "text-primary" : "text-muted-foreground"
              )}>
                Need a Website? <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/websites/pre-built" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Pre-built Stores
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/websites/custom" className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Custom Websites
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname?.startsWith('/about') || pathname?.startsWith('/contact') || pathname?.startsWith('/careers') ? "text-primary" : "text-muted-foreground"
              )}>
                Company <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/about" className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Our Story
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/careers" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Careers
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <Button 
            asChild
            className={cn(
              "hidden md:inline-flex",
              "bg-gradient-to-r from-primary to-purple-500",
              "hover:from-primary/90 hover:to-purple-500/90",
              "shadow-lg shadow-primary/25"
            )}
          >
            <Link href="/(auth)/login">
              Customer Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Website Options */}
              <div className="space-y-2 pl-4 border-l-2 border-border">
                <p className="text-sm font-medium text-muted-foreground">Need a Website?</p>
                <Link
                  href="/websites/pre-built"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-primary",
                    isActive('/websites/pre-built') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Pre-built Stores
                </Link>
                <Link
                  href="/websites/custom"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-primary",
                    isActive('/websites/custom') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Custom Websites
                </Link>
              </div>

              {/* Mobile Company Options */}
              <div className="space-y-2 pl-4 border-l-2 border-border">
                <p className="text-sm font-medium text-muted-foreground">Company</p>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-primary",
                    isActive('/about') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Our Story
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-primary",
                    isActive('/contact') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Contact
                </Link>
                <Link
                  href="/careers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-primary",
                    isActive('/careers') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Careers
                </Link>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-primary to-purple-500">
                <Link href="/(auth)/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Customer Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}