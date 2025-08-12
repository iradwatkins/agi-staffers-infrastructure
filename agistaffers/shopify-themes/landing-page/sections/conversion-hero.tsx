'use client'

import React, { useState, useEffect } from 'react'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  CheckCircle,
  Play,
  Calendar,
  Zap,
  Target,
  Timer
} from 'lucide-react'

export default function ConversionHeroSection({ section, settings }: SectionProps) {
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const {
    headline = 'Transform Your Business in 30 Days',
    subheadline = 'Join 10,000+ entrepreneurs who\'ve doubled their revenue',
    description = 'Get the proven system that\'s helped businesses generate over $50M in additional revenue.',
    primary_cta_text = 'Get Instant Access',
    secondary_cta_text = 'Watch Demo',
    background_video = '',
    background_image = '/api/placeholder/1920/1080',
    show_countdown = true,
    countdown_end_date = '2024-12-31T23:59:59',
    show_social_proof = true,
    show_guarantee = true,
    show_video_button = true,
    urgency_text = 'Limited Time: 50% Off Launch Price',
    social_proof_stats = [
      { number: '10,000+', label: 'Happy Customers', icon: 'Users' },
      { number: '98%', label: 'Success Rate', icon: 'Target' },
      { number: '24hrs', label: 'Quick Results', icon: 'Zap' }
    ],
    features = [
      'Proven system used by 10,000+ businesses',
      '30-day money-back guarantee',
      'Live implementation support',
      'Lifetime access to updates'
    ],
    testimonial = {
      text: 'This system increased our revenue by 300% in just 60 days!',
      name: 'Sarah Johnson',
      title: 'CEO, TechStart Inc.',
      image: '/api/placeholder/80/80'
    }
  } = section.settings

  useEffect(() => {
    if (!show_countdown) return

    const updateCountdown = () => {
      const endDate = new Date(countdown_end_date).getTime()
      const now = new Date().getTime()
      const distance = endDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [countdown_end_date, show_countdown])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    // Lead capture logic here
  }

  const getIcon = (iconName: string) => {
    const icons = { Users, Target, Zap, Award, Star }
    return icons[iconName as keyof typeof icons] || Users
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {background_video ? (
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            poster={background_image}
          >
            <source src={background_video} type="video/mp4" />
          </video>
        ) : (
          <img
            src={background_image}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main Content */}
          <div className="text-white space-y-8">
            {/* Urgency Badge */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-500 text-white animate-pulse">
                <Timer className="h-3 w-3 mr-1" />
                {urgency_text}
              </Badge>
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Money-Back Guarantee
              </Badge>
            </div>

            {/* Headlines */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                {headline}
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-6">
                {subheadline}
              </h2>
              <p className="text-lg text-white/80 max-w-2xl">
                {description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* Countdown Timer */}
            {show_countdown && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-white text-lg font-semibold mb-4 text-center">
                    ⚡ Limited Time Offer Ends In:
                  </h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit}>
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="text-2xl font-bold text-white">
                            {value.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xs text-white/70 uppercase">
                            {unit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Primary CTA */}
            <div className="space-y-4">
              <form onSubmit={handleEmailSubmit} className="flex gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  required
                />
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8">
                  {primary_cta_text}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </form>

              <div className="flex flex-col sm:flex-row gap-3">
                {show_video_button && (
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Play className="h-5 w-5 mr-2" />
                    {secondary_cta_text}
                  </Button>
                )}
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Demo Call
                </Button>
              </div>
            </div>

            {/* Social Proof Stats */}
            {show_social_proof && (
              <div className="flex flex-wrap gap-8 pt-6 border-t border-white/20">
                {social_proof_stats.map((stat, index) => {
                  const IconComponent = getIcon(stat.icon)
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <IconComponent className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {stat.number}
                      </div>
                      <div className="text-sm text-white/70">
                        {stat.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Testimonial */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-800 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee */}
            {show_guarantee && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-green-800 mb-2">
                    30-Day Money-Back Guarantee
                  </h3>
                  <p className="text-green-700 text-sm">
                    If you don't see results in 30 days, we'll refund every penny. 
                    No questions asked.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">256-bit</div>
                <div className="text-xs text-white/70">SSL Encryption</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-white/70">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll to learn more</span>
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
  name: 'Conversion Hero',
  settings: [
    {
      type: 'text',
      id: 'headline',
      label: 'Main headline',
      default: 'Transform Your Business in 30 Days'
    },
    {
      type: 'text',
      id: 'subheadline',
      label: 'Sub headline',
      default: 'Join 10,000+ entrepreneurs who\'ve doubled their revenue'
    },
    {
      type: 'textarea',
      id: 'description',
      label: 'Description',
      default: 'Get the proven system that\'s helped businesses generate over $50M in additional revenue.'
    },
    {
      type: 'text',
      id: 'primary_cta_text',
      label: 'Primary CTA text',
      default: 'Get Instant Access'
    },
    {
      type: 'text',
      id: 'secondary_cta_text',
      label: 'Secondary CTA text',
      default: 'Watch Demo'
    },
    {
      type: 'video_url',
      id: 'background_video',
      label: 'Background video URL'
    },
    {
      type: 'image_picker',
      id: 'background_image',
      label: 'Background image'
    },
    {
      type: 'checkbox',
      id: 'show_countdown',
      label: 'Show countdown timer',
      default: true
    },
    {
      type: 'text',
      id: 'countdown_end_date',
      label: 'Countdown end date (YYYY-MM-DDTHH:mm:ss)',
      default: '2024-12-31T23:59:59'
    },
    {
      type: 'text',
      id: 'urgency_text',
      label: 'Urgency text',
      default: 'Limited Time: 50% Off Launch Price'
    },
    {
      type: 'checkbox',
      id: 'show_social_proof',
      label: 'Show social proof stats',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_guarantee',
      label: 'Show guarantee badge',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_video_button',
      label: 'Show video demo button',
      default: true
    }
  ]
}