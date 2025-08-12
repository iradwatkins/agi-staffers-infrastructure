'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function HeaderSection({ section, settings, cart }: SectionProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const {
    logo = 'AGI Staffers',
    menu_items = [
      { title: 'Shop', url: '/collections/all' },
      { title: 'About', url: '/pages/about' },
      { title: 'Contact', url: '/pages/contact' }
    ],
    enable_search = true,
    enable_account = true,
    enable_cart = true,
    enable_currency_selector = true,
    sticky_header = true,
    transparent_header = false,
    announcement_text = '',
    announcement_link = ''
  } = section.settings

  const cartItemCount = cart?.items?.length || 0

  return (
    <>
      {/* Announcement Bar */}
      {announcement_text && (
        <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
          {announcement_link ? (
            <Link href={announcement_link} className="hover:underline">
              {announcement_text}
            </Link>
          ) : (
            <span>{announcement_text}</span>
          )}
        </div>
      )}

      {/* Main Header */}
      <header 
        className={`
          ${sticky_header ? 'sticky top-0 z-50' : ''} 
          ${transparent_header ? 'bg-transparent' : 'bg-background'}
          border-b transition-all duration-300
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <MobileMenu 
                  menuItems={menu_items}
                  onClose={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {typeof logo === 'string' ? (
                <h1 className="text-xl font-bold">{logo}</h1>
              ) : (
                <img src={logo} alt="Logo" className="h-8" />
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menu_items.map((item: any, index: number) => (
                <div key={index}>
                  {item.submenu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-1">
                          {item.title}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.submenu.map((subitem: any, subindex: number) => (
                          <DropdownMenuItem key={subindex} asChild>
                            <Link href={subitem.url}>{subitem.title}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link 
                      href={item.url}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {enable_search && (
                <div className="relative">
                  {searchOpen ? (
                    <div className="absolute right-0 top-0 flex items-center">
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-48 lg:w-64"
                        autoFocus
                        onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSearchOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Currency Selector */}
              {enable_currency_selector && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>USD ($)</DropdownMenuItem>
                    <DropdownMenuItem>DOP (RD$)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Account */}
              {enable_account && (
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* Cart */}
              {enable_cart && (
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                        variant="destructive"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

// Mobile Menu Component
function MobileMenu({ menuItems, onClose }: any) {
  return (
    <nav className="flex flex-col space-y-4 mt-8">
      {menuItems.map((item: any, index: number) => (
        <div key={index}>
          {item.submenu ? (
            <div>
              <div className="font-medium mb-2">{item.title}</div>
              <div className="ml-4 space-y-2">
                {item.submenu.map((subitem: any, subindex: number) => (
                  <Link
                    key={subindex}
                    href={subitem.url}
                    className="block text-sm text-muted-foreground hover:text-primary"
                    onClick={onClose}
                  >
                    {subitem.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              href={item.url}
              className="block text-lg font-medium"
              onClick={onClose}
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// Section Schema for customizer
export const schema = {
  name: 'Header',
  settings: [
    {
      type: 'text',
      id: 'logo',
      label: 'Logo text',
      default: 'Your Store'
    },
    {
      type: 'checkbox',
      id: 'sticky_header',
      label: 'Enable sticky header',
      default: true
    },
    {
      type: 'checkbox',
      id: 'transparent_header',
      label: 'Transparent header',
      default: false
    },
    {
      type: 'checkbox',
      id: 'enable_search',
      label: 'Enable search',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_account',
      label: 'Enable customer accounts',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_cart',
      label: 'Enable cart',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_currency_selector',
      label: 'Enable currency selector',
      default: true
    },
    {
      type: 'text',
      id: 'announcement_text',
      label: 'Announcement text',
      default: ''
    },
    {
      type: 'url',
      id: 'announcement_link',
      label: 'Announcement link',
      default: ''
    }
  ]
}