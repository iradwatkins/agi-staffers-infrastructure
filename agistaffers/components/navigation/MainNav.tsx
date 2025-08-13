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
  ShoppingBag
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'

export default function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { label: t?.nav?.aiAssistants || 'AI Assistants', href: '/ai-assistants' },
    { label: t?.nav?.workflowAutomation || 'AI Automation', href: '/workflow-automation' },
    { label: t?.nav?.contentSeo || 'AI SEO', href: '/seo' },
    { label: t?.nav?.promptEngineering || 'Custom Prompts', href: '/prompt-engineering' }
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
            <span className="text-2xl font-bold text-foreground">
              AGI STAFFERS
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
                {t?.nav?.needWebsite || 'Need a Website?'} <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/websites/pre-built" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t?.nav?.prebuiltStores || 'Pre-built Stores'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/websites/custom" className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    {t?.nav?.customWebsites || 'Custom Websites'}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* About Us Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                (pathname === '/about' || pathname === '/contact') ? "text-primary" : "text-muted-foreground"
              )}>
                {t?.nav?.about || 'About Us'} <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/about" className="flex items-center">
                    {t?.nav?.about || 'About Us'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="flex items-center">
                    {t?.nav?.contact || 'Contact Us'}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </nav>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button 
            asChild
            className={cn(
              "hidden md:inline-flex",
              "bg-gradient-to-r from-primary to-purple-500",
              "hover:from-primary/90 hover:to-purple-500/90",
              "shadow-lg shadow-primary/25"
            )}
          >
            <Link href="/login">
              {t?.nav?.customerLogin || 'Login'} <ArrowRight className="ml-2 h-4 w-4" />
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
                <p className="text-sm font-medium text-muted-foreground">{t?.nav?.needWebsite || 'Need a Website?'}</p>
                <Link
                  href="/websites/pre-built"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-primary",
                    isActive('/websites/pre-built') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t?.nav?.prebuiltStores || 'Pre-built Stores'}
                </Link>
                <Link
                  href="/websites/custom"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-primary",
                    isActive('/websites/custom') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {t?.nav?.customWebsites || 'Custom Websites'}
                </Link>
              </div>


              <Button asChild className="w-full bg-gradient-to-r from-primary to-purple-500">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  {t?.nav?.customerLogin || 'Login'} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}