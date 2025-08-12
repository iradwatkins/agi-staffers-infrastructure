'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  Phone,
  Calendar,
  CheckCircle,
  Play
} from 'lucide-react'

export default function ServiceHeroSection({ section, settings }: SectionProps) {
  const {
    heading = 'Professional Services That Drive Results',
    subheading = 'Expert consultation and solutions tailored to your business needs',
    description = 'We help businesses grow and succeed with our comprehensive range of professional services. From strategy to execution, we\'re your trusted partner.',
    primary_button_text = 'Get Free Consultation',
    primary_button_url = '/contact',
    secondary_button_text = 'View Our Services',
    secondary_button_url = '/services',
    show_video_button = true,
    video_url = 'https://youtube.com/watch?v=example',
    background_image = '/api/placeholder/1920/1080',
    background_overlay = true,
    overlay_opacity = 60,
    text_alignment = 'left',
    show_stats = true,
    show_badges = true,
    enable_booking = true,
    phone_number = '+1 (555) 123-4567'
  } = section.settings

  const stats = [
    { number: '500+', label: 'Happy Clients', icon: Users },
    { number: '15+', label: 'Years Experience', icon: Award },
    { number: '4.9', label: 'Client Rating', icon: Star }
  ]

  const badges = [
    'Certified Professionals',
    'Award Winning Team',
    'Money Back Guarantee'
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      {background_image && (
        <div className="absolute inset-0 z-0">
          <img
            src={background_image}
            alt="Service Background"
            className="w-full h-full object-cover"
          />
          {background_overlay && (
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: overlay_opacity / 100 }}
            />
          )}
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-6 ${text_alignment === 'center' ? 'text-center' : ''}`}>
            {/* Badges */}
            {show_badges && (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Heading */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {heading}
              </h1>
              <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-6">
                {subheading}
              </h2>
              <p className="text-lg text-white/80 max-w-2xl">
                {description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Calendar className="h-5 w-5 mr-2" />
                {primary_button_text}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                {secondary_button_text}
              </Button>

              {show_video_button && (
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Video
                </Button>
              )}
            </div>

            {/* Quick Contact */}
            {enable_booking && (
              <div className="flex items-center gap-4 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 text-white">
                  <Phone className="h-4 w-4" />
                  <span>Call us now:</span>
                  <a href={`tel:${phone_number}`} className="font-semibold hover:underline">
                    {phone_number}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {show_stats && (
            <div className="lg:justify-self-end">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Trusted by Industry Leaders
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon
                    return (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stat.number}
                        </div>
                        <div className="text-white/80 text-sm">
                          {stat.label}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* CTA in stats box */}
                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                  <p className="text-white/80 text-sm mb-3">
                    Ready to get started?
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Schedule Free Discovery Call
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Service Hero',
  settings: [
    {
      type: 'header',
      content: 'Content'
    },
    {
      type: 'text',
      id: 'heading',
      label: 'Heading',
      default: 'Professional Services That Drive Results'
    },
    {
      type: 'text',
      id: 'subheading',
      label: 'Subheading',
      default: 'Expert consultation and solutions tailored to your business needs'
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description',
      default: 'We help businesses grow and succeed with our comprehensive range of professional services.'
    },
    {
      type: 'header',
      content: 'Buttons'
    },
    {
      type: 'text',
      id: 'primary_button_text',
      label: 'Primary button text',
      default: 'Get Free Consultation'
    },
    {
      type: 'url',
      id: 'primary_button_url',
      label: 'Primary button URL',
      default: '/contact'
    },
    {
      type: 'text',
      id: 'secondary_button_text',
      label: 'Secondary button text',
      default: 'View Our Services'
    },
    {
      type: 'url',
      id: 'secondary_button_url',
      label: 'Secondary button URL',
      default: '/services'
    },
    {
      type: 'checkbox',
      id: 'show_video_button',
      label: 'Show video button',
      default: true
    },
    {
      type: 'url',
      id: 'video_url',
      label: 'Video URL',
      default: 'https://youtube.com/watch?v=example'
    },
    {
      type: 'header',
      content: 'Background'
    },
    {
      type: 'image_picker',
      id: 'background_image',
      label: 'Background image'
    },
    {
      type: 'checkbox',
      id: 'background_overlay',
      label: 'Show background overlay',
      default: true
    },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Overlay opacity',
      min: 0,
      max: 100,
      step: 10,
      default: 60
    },
    {
      type: 'header',
      content: 'Layout'
    },
    {
      type: 'select',
      id: 'text_alignment',
      label: 'Text alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' }
      ],
      default: 'left'
    },
    {
      type: 'checkbox',
      id: 'show_stats',
      label: 'Show statistics',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_badges',
      label: 'Show trust badges',
      default: true
    },
    {
      type: 'header',
      content: 'Contact'
    },
    {
      type: 'checkbox',
      id: 'enable_booking',
      label: 'Enable quick booking',
      default: true
    },
    {
      type: 'text',
      id: 'phone_number',
      label: 'Phone number',
      default: '+1 (555) 123-4567'
    }
  ]
}