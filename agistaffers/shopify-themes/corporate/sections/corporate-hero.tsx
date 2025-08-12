'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Globe, 
  Award,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Shield,
  Target
} from 'lucide-react'

export default function CorporateHeroSection({ section, settings }: SectionProps) {
  const {
    company_name = 'AGI Staffers Corporation',
    headline = 'Leading Innovation in Enterprise Solutions',
    subheadline = 'Trusted by Fortune 500 companies worldwide for over 25 years',
    description = 'We deliver cutting-edge technology solutions that drive business transformation and sustainable growth for organizations across industries.',
    primary_cta_text = 'Explore Our Solutions',
    primary_cta_url = '/solutions',
    secondary_cta_text = 'Contact Us',
    secondary_cta_url = '/contact',
    background_image = '/api/placeholder/1920/1080',
    show_stats = true,
    show_certifications = true,
    show_contact_info = true,
    stats = [
      { number: '25+', label: 'Years of Excellence', icon: 'Award' },
      { number: '500+', label: 'Enterprise Clients', icon: 'Building2' },
      { number: '50+', label: 'Countries Served', icon: 'Globe' },
      { number: '10,000+', label: 'Projects Delivered', icon: 'Target' }
    ],
    certifications = [
      'ISO 27001 Certified',
      'SOC 2 Type II Compliant',
      'Fortune 500 Trusted',
      'Industry Leader'
    ],
    contact_info = {
      phone: '+1 (555) 123-4567',
      email: 'info@agistaffers.com',
      address: 'One Corporate Plaza, New York, NY 10001'
    }
  } = section.settings

  const getIcon = (iconName: string) => {
    const icons = { Award, Building2, Globe, Target, Users, TrendingUp, Shield }
    return icons[iconName as keyof typeof icons] || Building2
  }

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={background_image}
          alt="Corporate Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main Content */}
          <div className="text-white space-y-8">
            {/* Company Badge */}
            <div>
              <Badge className="mb-4 bg-blue-600 text-white">
                <Building2 className="h-3 w-3 mr-1" />
                {company_name}
              </Badge>
            </div>

            {/* Headlines */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                {headline}
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-6">
                {subheadline}
              </h2>
              <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
                {description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href={primary_cta_url}>
                  {primary_cta_text}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href={secondary_cta_url}>
                  {secondary_cta_text}
                </Link>
              </Button>
            </div>

            {/* Certifications */}
            {show_certifications && (
              <div className="pt-6 border-t border-white/20">
                <p className="text-white/70 text-sm mb-3">Trusted & Certified:</p>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                      <Shield className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Company Stats */}
            {show_stats && (
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-center mb-8">
                    Excellence by the Numbers
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => {
                      const IconComponent = getIcon(stat.icon)
                      return (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-slate-800 mb-1">
                            {stat.number}
                          </div>
                          <div className="text-sm text-slate-600">
                            {stat.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            {show_contact_info && (
              <Card className="bg-slate-800/90 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Get in Touch
                  </h3>
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${contact_info.phone}`} className="hover:text-white">
                        {contact_info.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${contact_info.email}`} className="hover:text-white">
                        {contact_info.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-1" />
                      <span className="text-sm">{contact_info.address}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Schedule Consultation
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Investor Relations */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">
                  Investor Relations
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  Access financial reports, earnings, and corporate governance information.
                </p>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                  View Investor Info
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Trust Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8 text-white/60">
        <div className="text-center">
          <div className="text-sm font-medium">NYSE Listed</div>
          <div className="text-xs">AGI</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">Founded</div>
          <div className="text-xs">1999</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">Employees</div>
          <div className="text-xs">25,000+</div>
        </div>
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Corporate Hero',
  settings: [
    {
      type: 'text',
      id: 'company_name',
      label: 'Company name',
      default: 'AGI Staffers Corporation'
    },
    {
      type: 'text',
      id: 'headline',
      label: 'Main headline',
      default: 'Leading Innovation in Enterprise Solutions'
    },
    {
      type: 'text',
      id: 'subheadline',
      label: 'Sub headline',
      default: 'Trusted by Fortune 500 companies worldwide for over 25 years'
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Company description',
      default: 'We deliver cutting-edge technology solutions that drive business transformation.'
    },
    {
      type: 'text',
      id: 'primary_cta_text',
      label: 'Primary CTA text',
      default: 'Explore Our Solutions'
    },
    {
      type: 'url',
      id: 'primary_cta_url',
      label: 'Primary CTA URL',
      default: '/solutions'
    },
    {
      type: 'text',
      id: 'secondary_cta_text',
      label: 'Secondary CTA text',
      default: 'Contact Us'
    },
    {
      type: 'url',
      id: 'secondary_cta_url',
      label: 'Secondary CTA URL',
      default: '/contact'
    },
    {
      type: 'image_picker',
      id: 'background_image',
      label: 'Background image'
    },
    {
      type: 'checkbox',
      id: 'show_stats',
      label: 'Show company statistics',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_certifications',
      label: 'Show certifications',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_contact_info',
      label: 'Show contact information',
      default: true
    }
  ]
}