'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Shield,
  ArrowRight
} from 'lucide-react'

export default function FooterSection({ section, settings }: SectionProps) {
  const {
    show_newsletter = true,
    newsletter_heading = 'Stay in the loop',
    newsletter_text = 'Subscribe to receive updates, access to exclusive deals, and more.',
    show_payment_icons = true,
    show_social_media = true,
    social_facebook = '',
    social_twitter = '',
    social_instagram = '',
    social_youtube = '',
    show_policies = true,
    copyright_text = '© 2024 AGI Staffers. All rights reserved.',
    footer_blocks = [
      {
        title: 'Quick Links',
        links: [
          { title: 'Search', url: '/search' },
          { title: 'About Us', url: '/pages/about' },
          { title: 'Contact', url: '/pages/contact' },
          { title: 'Size Guide', url: '/pages/size-guide' }
        ]
      },
      {
        title: 'Customer Care',
        links: [
          { title: 'Shipping Info', url: '/pages/shipping' },
          { title: 'Returns', url: '/pages/returns' },
          { title: 'FAQ', url: '/pages/faq' },
          { title: 'Track Your Order', url: '/pages/track-order' }
        ]
      },
      {
        title: 'Company',
        links: [
          { title: 'Careers', url: '/pages/careers' },
          { title: 'Press', url: '/pages/press' },
          { title: 'Investors', url: '/pages/investors' },
          { title: 'Sustainability', url: '/pages/sustainability' }
        ]
      }
    ],
    contact_info = {
      phone: '+1 (555) 123-4567',
      email: 'hello@agistaffers.com',
      address: '123 Commerce St, New York, NY 10001'
    }
  } = section.settings

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Newsletter signup logic here
    console.log('Newsletter signup')
  }

  const socialLinks = [
    { icon: Facebook, url: social_facebook, name: 'Facebook' },
    { icon: Twitter, url: social_twitter, name: 'Twitter' },
    { icon: Instagram, url: social_instagram, name: 'Instagram' },
    { icon: Youtube, url: social_youtube, name: 'YouTube' }
  ].filter(social => social.url)

  const paymentIcons = [
    { name: 'Visa', icon: CreditCard },
    { name: 'Mastercard', icon: CreditCard },
    { name: 'American Express', icon: CreditCard },
    { name: 'PayPal', icon: CreditCard },
    { name: 'Apple Pay', icon: CreditCard },
    { name: 'Google Pay', icon: CreditCard }
  ]

  const trustBadges = [
    { icon: Truck, text: 'Free Shipping' },
    { icon: Shield, text: 'Secure Checkout' },
    { icon: ArrowRight, text: 'Easy Returns' }
  ]

  return (
    <footer className="bg-background border-t">
      {/* Newsletter Section */}
      {show_newsletter && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-2">{newsletter_heading}</h3>
              <p className="text-muted-foreground mb-6">{newsletter_text}</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                />
                <Button type="submit" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info & Contact */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">AGI Staffers</h3>
            <p className="text-muted-foreground mb-6">
              Your trusted partner for premium products and exceptional service. 
              We're committed to delivering quality that exceeds expectations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contact_info.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact_info.phone}</span>
                </div>
              )}
              {contact_info.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${contact_info.email}`} className="hover:underline">
                    {contact_info.email}
                  </a>
                </div>
              )}
              {contact_info.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{contact_info.address}</span>
                </div>
              )}
            </div>

            {/* Social Media */}
            {show_social_media && socialLinks.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Follow Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon
                    return (
                      <Link
                        key={social.name}
                        href={social.url}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={social.name}
                      >
                        <IconComponent className="h-4 w-4" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Blocks */}
          {footer_blocks.map((block: any, index: number) => (
            <div key={index}>
              <h4 className="font-medium mb-4">{block.title}</h4>
              <ul className="space-y-2">
                {block.links.map((link: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.url}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="border-t mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {trustBadges.map((badge, index) => {
              const IconComponent = badge.icon
              return (
                <div key={index} className="flex items-center justify-center gap-3 text-center">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              {copyright_text}
            </div>

            {/* Payment Icons */}
            {show_payment_icons && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">We accept:</span>
                {paymentIcons.map((payment, index) => {
                  const IconComponent = payment.icon
                  return (
                    <div
                      key={index}
                      className="w-8 h-6 bg-muted rounded flex items-center justify-center"
                      title={payment.name}
                    >
                      <IconComponent className="h-3 w-3" />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Legal Links */}
            {show_policies && (
              <div className="flex items-center gap-4 text-sm">
                <Link href="/policies/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="/policies/terms-of-service" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="/policies/refund-policy" className="text-muted-foreground hover:text-foreground">
                  Refund Policy
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

// Section Schema for customizer
export const schema = {
  name: 'Footer',
  settings: [
    {
      type: 'header',
      content: 'Newsletter Settings'
    },
    {
      type: 'checkbox',
      id: 'show_newsletter',
      label: 'Show newsletter signup',
      default: true
    },
    {
      type: 'text',
      id: 'newsletter_heading',
      label: 'Newsletter heading',
      default: 'Stay in the loop'
    },
    {
      type: 'textarea',
      id: 'newsletter_text',
      label: 'Newsletter description',
      default: 'Subscribe to receive updates, access to exclusive deals, and more.'
    },
    {
      type: 'header',
      content: 'Social Media'
    },
    {
      type: 'checkbox',
      id: 'show_social_media',
      label: 'Show social media links',
      default: true
    },
    {
      type: 'url',
      id: 'social_facebook',
      label: 'Facebook URL'
    },
    {
      type: 'url',
      id: 'social_twitter',
      label: 'Twitter URL'
    },
    {
      type: 'url',
      id: 'social_instagram',
      label: 'Instagram URL'
    },
    {
      type: 'url',
      id: 'social_youtube',
      label: 'YouTube URL'
    },
    {
      type: 'header',
      content: 'Contact Information'
    },
    {
      type: 'text',
      id: 'contact_phone',
      label: 'Phone number',
      default: '+1 (555) 123-4567'
    },
    {
      type: 'text',
      id: 'contact_email',
      label: 'Email address',
      default: 'hello@agistaffers.com'
    },
    {
      type: 'textarea',
      id: 'contact_address',
      label: 'Physical address',
      default: '123 Commerce St, New York, NY 10001'
    },
    {
      type: 'header',
      content: 'Payment & Policies'
    },
    {
      type: 'checkbox',
      id: 'show_payment_icons',
      label: 'Show payment icons',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_policies',
      label: 'Show policy links',
      default: true
    },
    {
      type: 'text',
      id: 'copyright_text',
      label: 'Copyright text',
      default: '© 2024 AGI Staffers. All rights reserved.'
    }
  ]
}