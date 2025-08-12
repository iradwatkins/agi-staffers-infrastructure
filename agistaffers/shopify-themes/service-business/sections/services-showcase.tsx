'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  Shield,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  Star
} from 'lucide-react'

export default function ServicesShowcaseSection({ section, settings }: SectionProps) {
  const {
    heading = 'Our Professional Services',
    subheading = 'Comprehensive solutions designed to accelerate your business growth',
    layout = 'grid',
    columns = 3,
    show_pricing = true,
    show_features = true,
    show_cta_buttons = true,
    enable_hover_effects = true,
    services = [
      {
        id: '1',
        title: 'Business Strategy Consulting',
        description: 'Develop winning strategies that align with your business goals and market opportunities.',
        icon: 'Target',
        price: 'Starting at $2,500',
        duration: '4-6 weeks',
        features: [
          'Market Analysis & Research',
          'Competitive Intelligence',
          'Strategic Planning',
          'Implementation Roadmap',
          'Performance Metrics'
        ],
        popular: false,
        url: '/services/strategy-consulting'
      },
      {
        id: '2',
        title: 'Digital Transformation',
        description: 'Modernize your operations with cutting-edge technology and digital solutions.',
        icon: 'Zap',
        price: 'Starting at $5,000',
        duration: '8-12 weeks',
        features: [
          'Technology Assessment',
          'Digital Strategy',
          'System Integration',
          'Process Automation',
          'Training & Support'
        ],
        popular: true,
        url: '/services/digital-transformation'
      },
      {
        id: '3',
        title: 'Marketing & Growth',
        description: 'Accelerate your growth with data-driven marketing strategies and campaigns.',
        icon: 'TrendingUp',
        price: 'Starting at $3,000',
        duration: '6-8 weeks',
        features: [
          'Brand Strategy',
          'Digital Marketing',
          'Content Creation',
          'Performance Analytics',
          'Growth Optimization'
        ],
        popular: false,
        url: '/services/marketing-growth'
      },
      {
        id: '4',
        title: 'Operations Excellence',
        description: 'Streamline operations and improve efficiency with proven methodologies.',
        icon: 'Users',
        price: 'Starting at $4,000',
        duration: '6-10 weeks',
        features: [
          'Process Optimization',
          'Quality Management',
          'Team Training',
          'Performance Monitoring',
          'Continuous Improvement'
        ],
        popular: false,
        url: '/services/operations-excellence'
      },
      {
        id: '5',
        title: 'Risk Management',
        description: 'Protect your business with comprehensive risk assessment and mitigation strategies.',
        icon: 'Shield',
        price: 'Starting at $2,000',
        duration: '3-5 weeks',
        features: [
          'Risk Assessment',
          'Compliance Review',
          'Security Protocols',
          'Insurance Analysis',
          'Crisis Planning'
        ],
        popular: false,
        url: '/services/risk-management'
      },
      {
        id: '6',
        title: 'Leadership Development',
        description: 'Build strong leadership capabilities and enhance team performance.',
        icon: 'Award',
        price: 'Starting at $3,500',
        duration: '8-12 weeks',
        features: [
          'Leadership Assessment',
          'Executive Coaching',
          'Team Building',
          'Performance Management',
          'Succession Planning'
        ],
        popular: false,
        url: '/services/leadership-development'
      }
    ]
  } = section.settings

  const getIcon = (iconName: string) => {
    const icons = {
      Target,
      Zap,
      TrendingUp,
      Users,
      Shield,
      Award,
      Clock,
      DollarSign
    }
    return icons[iconName as keyof typeof icons] || Target
  }

  const ServiceCard = ({ service }: { service: any }) => {
    const IconComponent = getIcon(service.icon)
    
    return (
      <Card className={`group relative overflow-hidden ${enable_hover_effects ? 'hover:shadow-xl transition-all duration-300 hover:-translate-y-2' : ''} ${service.popular ? 'ring-2 ring-primary' : ''}`}>
        {/* Popular Badge */}
        {service.popular && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <IconComponent className="h-8 w-8 text-primary group-hover:text-white" />
          </div>
          <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
          <p className="text-muted-foreground">{service.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pricing & Duration */}
          <div className="flex justify-between items-center text-sm">
            {show_pricing && (
              <div className="flex items-center gap-1 text-primary font-semibold">
                <DollarSign className="h-4 w-4" />
                {service.price}
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {service.duration}
            </div>
          </div>

          {/* Features */}
          {show_features && (
            <div>
              <h4 className="font-medium mb-3">What's Included:</h4>
              <ul className="space-y-2">
                {service.features.slice(0, 4).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {service.features.length > 4 && (
                  <li className="text-sm text-muted-foreground">
                    +{service.features.length - 4} more features
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* CTA Button */}
          {show_cta_buttons && (
            <div className="pt-4">
              <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                <Link href={service.url}>
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>

        {/* Services Grid */}
        <div className={`grid gap-8 mb-12 ${
          layout === 'grid' 
            ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`
            : 'grid-cols-1'
        }`}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-primary/5 rounded-2xl p-8 border border-primary/10">
          <h3 className="text-2xl font-bold mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every business is unique. Let us create a tailored service package 
            that perfectly fits your specific needs and objectives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Schedule Free Consultation
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              View All Services
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Services Showcase',
  settings: [
    {
      type: 'header',
      content: 'Content'
    },
    {
      type: 'text',
      id: 'heading',
      label: 'Section heading',
      default: 'Our Professional Services'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Section subheading',
      default: 'Comprehensive solutions designed to accelerate your business growth'
    },
    {
      type: 'header',
      content: 'Layout'
    },
    {
      type: 'select',
      id: 'layout',
      label: 'Layout style',
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' }
      ],
      default: 'grid'
    },
    {
      type: 'range',
      id: 'columns',
      label: 'Columns (desktop)',
      min: 2,
      max: 4,
      step: 1,
      default: 3
    },
    {
      type: 'header',
      content: 'Display Options'
    },
    {
      type: 'checkbox',
      id: 'show_pricing',
      label: 'Show pricing',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_features',
      label: 'Show features list',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_cta_buttons',
      label: 'Show CTA buttons',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_hover_effects',
      label: 'Enable hover effects',
      default: true
    }
  ]
}