'use client'

import React from 'react'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Zap, 
  Target, 
  TrendingUp,
  Shield,
  Users,
  Clock,
  Award,
  DollarSign,
  BarChart3
} from 'lucide-react'

export default function BenefitsFeaturesSection({ section, settings }: SectionProps) {
  const {
    heading = 'Why 10,000+ Businesses Choose Our System',
    subheading = 'Transform your results with these proven features',
    layout = 'alternating',
    show_cta = true,
    cta_text = 'Get Started Today',
    features = [
      {
        id: '1',
        title: 'Increase Revenue by 300%',
        description: 'Our proven system has helped businesses increase their revenue by an average of 300% within 90 days.',
        icon: 'TrendingUp',
        benefit: 'Generate more income',
        stats: '+300% Revenue',
        image: '/api/placeholder/600/400',
        details: [
          'Proven conversion optimization',
          'Advanced funnel strategies',
          'Revenue tracking dashboard',
          'A/B testing tools'
        ],
        testimonial: {
          text: 'We went from $10k to $40k per month in just 3 months!',
          name: 'Mike Chen',
          title: 'E-commerce Owner'
        }
      },
      {
        id: '2',
        title: 'Save 20+ Hours Per Week',
        description: 'Automate your marketing and sales processes to focus on what matters most - growing your business.',
        icon: 'Clock',
        benefit: 'Work smarter, not harder',
        stats: '20+ Hours Saved',
        image: '/api/placeholder/600/400',
        details: [
          'Marketing automation',
          'Lead nurturing sequences',
          'Sales pipeline management',
          'Performance analytics'
        ],
        testimonial: {
          text: 'I finally have time to focus on strategy instead of busy work.',
          name: 'Sarah Davis',
          title: 'Marketing Director'
        }
      },
      {
        id: '3',
        title: 'Convert 5x More Leads',
        description: 'Turn more visitors into customers with our battle-tested conversion optimization system.',
        icon: 'Target',
        benefit: 'Higher conversion rates',
        stats: '5x More Conversions',
        image: '/api/placeholder/600/400',
        details: [
          'Landing page optimization',
          'Email sequence templates',
          'Conversion tracking',
          'Split testing tools'
        ],
        testimonial: {
          text: 'Our conversion rate jumped from 2% to 12% in 30 days!',
          name: 'Alex Rodriguez',
          title: 'SaaS Founder'
        }
      },
      {
        id: '4',
        title: 'Reduce Customer Acquisition Cost',
        description: 'Lower your CAC by 60% while increasing customer lifetime value with our optimization strategies.',
        icon: 'DollarSign',
        benefit: 'More profit per customer',
        stats: '-60% CAC',
        image: '/api/placeholder/600/400',
        details: [
          'Audience targeting optimization',
          'Retention strategies',
          'Upsell automation',
          'Cost analysis tools'
        ],
        testimonial: {
          text: 'We cut our ad spend in half while doubling our results.',
          name: 'Jennifer Kim',
          title: 'Growth Marketer'
        }
      }
    ]
  } = section.settings

  const getIcon = (iconName: string) => {
    const icons = {
      TrendingUp,
      Clock,
      Target,
      DollarSign,
      Zap,
      Shield,
      Users,
      Award,
      BarChart3
    }
    return icons[iconName as keyof typeof icons] || TrendingUp
  }

  const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
    const IconComponent = getIcon(feature.icon)
    const isReversed = layout === 'alternating' && index % 2 === 1

    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
        {/* Image */}
        <div className={`${isReversed ? 'lg:col-start-2' : ''}`}>
          <div className="relative">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
            />
            
            {/* Stats Overlay */}
            <div className="absolute top-6 right-6">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {feature.stats}
                  </div>
                  <div className="text-sm text-gray-600">
                    Average Result
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Icon Badge */}
            <div className="absolute bottom-6 left-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <IconComponent className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-6 ${isReversed ? 'lg:col-start-1' : ''}`}>
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary">
              {feature.benefit}
            </Badge>
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              {feature.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Feature Details */}
          <div className="space-y-3">
            {feature.details.map((detail: string, detailIndex: number) => (
              <div key={detailIndex} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{detail}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <Card className="bg-gray-50 border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-800 mb-3 italic">
                "{feature.testimonial.text}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {feature.testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {feature.testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {feature.testimonial.title}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">{heading}</h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>

        {/* Features */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        {show_cta && (
          <div className="mt-20 text-center">
            <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 text-white">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of successful businesses who've already implemented 
                  these game-changing strategies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    {cta_text}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    See More Success Stories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 pt-16 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Businesses Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">$50M+</div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">30 Day</div>
              <div className="text-sm text-muted-foreground">Money-Back Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Benefits & Features',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Section heading',
      default: 'Why 10,000+ Businesses Choose Our System'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Section subheading',
      default: 'Transform your results with these proven features'
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Layout style',
      options: [
        { value: 'alternating', label: 'Alternating' },
        { value: 'standard', label: 'Standard' }
      ],
      default: 'alternating'
    },
    {
      type: 'checkbox',
      id: 'show_cta',
      label: 'Show call-to-action',
      default: true
    },
    {
      type: 'text',
      id: 'cta_text',
      label: 'CTA button text',
      default: 'Get Started Today'
    }
  ]
}