'use client'

import React from 'react'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote, Users, TrendingUp, Award, Building2 } from 'lucide-react'

export default function SocialProofSection({ section, settings }: SectionProps) {
  const {
    heading = 'Trusted by Industry Leaders',
    subheading = 'See why top companies choose our solution',
    show_logos = true,
    show_testimonials = true,
    show_stats = true,
    logos = [
      { name: 'TechCorp', image: '/api/placeholder/150/60' },
      { name: 'Innovation Inc', image: '/api/placeholder/150/60' },
      { name: 'Growth Co', image: '/api/placeholder/150/60' },
      { name: 'Scale Ltd', image: '/api/placeholder/150/60' },
      { name: 'Success Inc', image: '/api/placeholder/150/60' },
      { name: 'Transform LLC', image: '/api/placeholder/150/60' }
    ],
    testimonials = [
      {
        text: 'This system transformed our business completely. We saw a 400% increase in leads within the first month.',
        name: 'Sarah Johnson',
        title: 'CEO, TechStart Inc.',
        company: 'TechStart Inc.',
        image: '/api/placeholder/80/80',
        rating: 5,
        results: '+400% Leads'
      },
      {
        text: 'The ROI was immediate. We recovered our investment in the first week and continue to see exponential growth.',
        name: 'Mike Chen',
        title: 'Marketing Director',
        company: 'Growth Dynamics',
        image: '/api/placeholder/80/80',
        rating: 5,
        results: '700% ROI'
      },
      {
        text: 'Finally, a solution that actually works. Our team productivity increased by 300% and our customers love the results.',
        name: 'Jennifer Davis',
        title: 'Operations Manager',
        company: 'Efficiency Plus',
        image: '/api/placeholder/80/80',
        rating: 5,
        results: '+300% Productivity'
      }
    ],
    stats = [
      { number: '10,000+', label: 'Happy Customers', icon: 'Users' },
      { number: '500%', label: 'Average Growth', icon: 'TrendingUp' },
      { number: '99.9%', label: 'Uptime', icon: 'Award' },
      { number: '24/7', label: 'Support', icon: 'Building2' }
    ]
  } = section.settings

  const getIcon = (iconName: string) => {
    const icons = { Users, TrendingUp, Award, Building2 }
    return icons[iconName as keyof typeof icons] || Users
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">{heading}</h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>

        {/* Company Logos */}
        {show_logos && (
          <div className="mb-20">
            <p className="text-center text-muted-foreground mb-8">
              Trusted by leading companies worldwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
              {logos.map((logo, index) => (
                <div key={index} className="flex justify-center">
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="h-12 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        {show_stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => {
              const IconComponent = getIcon(stat.icon)
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-8">
                    <IconComponent className="h-8 w-8 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Testimonials */}
        {show_testimonials && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${
                          star <= testimonial.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-gray-800 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Results Badge */}
                  <Badge className="mb-4 bg-green-100 text-green-800">
                    Result: {testimonial.results}
                  </Badge>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </div>
                      <div className="text-sm text-primary">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white">
                      Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom Trust Section */}
        <div className="mt-16 pt-16 border-t text-center">
          <h3 className="text-2xl font-bold mb-4">
            Join 10,000+ Successful Businesses
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't just take our word for it. See what our customers have achieved 
            and start your own success story today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-green-100 text-green-800">
              ✓ 30-Day Money-Back Guarantee
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              ✓ 24/7 Expert Support
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              ✓ Proven Results
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}

export const schema = {
  name: 'Social Proof',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Section heading',
      default: 'Trusted by Industry Leaders'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Section subheading',
      default: 'See why top companies choose our solution'
    },
    {
      type: 'checkbox',
      id: 'show_logos',
      label: 'Show company logos',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_testimonials',
      label: 'Show customer testimonials',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_stats',
      label: 'Show statistics',
      default: true
    }
  ]
}