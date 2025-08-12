'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Users, 
  Globe, 
  Award,
  Target,
  Heart,
  Lightbulb,
  Shield,
  ArrowRight,
  CheckCircle,
  Calendar,
  MapPin
} from 'lucide-react'

export default function AboutCompanySection({ section, settings }: SectionProps) {
  const {
    heading = 'About AGI Staffers',
    subheading = 'Building the future through innovation and excellence',
    company_story = 'Founded in 1999, AGI Staffers has grown from a small startup to a global leader in enterprise technology solutions. Our journey began with a simple mission: to help businesses harness the power of technology to achieve extraordinary results.',
    show_mission = true,
    show_values = true,
    show_timeline = true,
    show_leadership = true,
    mission = {
      title: 'Our Mission',
      description: 'To empower organizations worldwide with innovative technology solutions that drive sustainable growth and create lasting value for all stakeholders.',
      icon: 'Target'
    },
    vision = {
      title: 'Our Vision',
      description: 'To be the world\'s most trusted partner in digital transformation, setting the standard for excellence in enterprise technology.',
      icon: 'Lightbulb'
    },
    values = [
      {
        title: 'Innovation',
        description: 'We continuously push boundaries to deliver cutting-edge solutions.',
        icon: 'Lightbulb'
      },
      {
        title: 'Integrity',
        description: 'We conduct business with the highest ethical standards.',
        icon: 'Shield'
      },
      {
        title: 'Excellence',
        description: 'We strive for perfection in everything we do.',
        icon: 'Award'
      },
      {
        title: 'Partnership',
        description: 'We build lasting relationships based on trust and mutual success.',
        icon: 'Heart'
      }
    ],
    timeline = [
      {
        year: '1999',
        title: 'Company Founded',
        description: 'Started as a technology consulting firm in New York',
        icon: 'Building2'
      },
      {
        year: '2005',
        title: 'International Expansion',
        description: 'Opened offices in London and Tokyo',
        icon: 'Globe'
      },
      {
        year: '2010',
        title: 'IPO Launch',
        description: 'Went public on NYSE, raising $500M',
        icon: 'TrendingUp'
      },
      {
        year: '2015',
        title: 'Major Acquisition',
        description: 'Acquired CloudTech Solutions for $2.5B',
        icon: 'Building2'
      },
      {
        year: '2020',
        title: 'AI Division Launch',
        description: 'Launched artificial intelligence and machine learning division',
        icon: 'Lightbulb'
      },
      {
        year: '2024',
        title: 'Global Leadership',
        description: 'Recognized as industry leader with 25,000+ employees worldwide',
        icon: 'Award'
      }
    ],
    leadership = [
      {
        name: 'John Anderson',
        position: 'Chief Executive Officer',
        bio: '20+ years of experience leading global technology companies',
        image: '/api/placeholder/150/150'
      },
      {
        name: 'Sarah Chen',
        position: 'Chief Technology Officer',
        bio: 'Former Google VP, leading our innovation initiatives',
        image: '/api/placeholder/150/150'
      },
      {
        name: 'Michael Roberts',
        position: 'Chief Financial Officer',
        bio: 'Former Goldman Sachs partner, driving our financial strategy',
        image: '/api/placeholder/150/150'
      }
    ]
  } = section.settings

  const getIcon = (iconName: string) => {
    const icons = { Building2, Users, Globe, Award, Target, Heart, Lightbulb, Shield, CheckCircle, Calendar, MapPin }
    return icons[iconName as keyof typeof icons] || Building2
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h2>
          <p className="text-xl text-muted-foreground mb-8">{subheading}</p>
          <p className="text-lg leading-relaxed">{company_story}</p>
        </div>

        {/* Mission & Vision */}
        {show_mission && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">{mission.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {mission.description}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">{vision.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {vision.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Core Values */}
        {show_values && (
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = getIcon(value.icon)
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3">{value.title}</h4>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Company Timeline */}
        {show_timeline && (
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12">Our Journey</h3>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {timeline.map((milestone, index) => {
                  const IconComponent = getIcon(milestone.icon)
                  return (
                    <div key={index} className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                          <Badge className="w-fit bg-primary/10 text-primary">
                            {milestone.year}
                          </Badge>
                          <h4 className="text-xl font-semibold">{milestone.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Leadership Team */}
        {show_leadership && (
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12">Leadership Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((leader, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <h4 className="text-xl font-semibold mb-2">{leader.name}</h4>
                    <p className="text-primary font-medium mb-3">{leader.position}</p>
                    <p className="text-muted-foreground text-sm">{leader.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/leadership">
                  View Full Leadership Team
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that trust AGI Staffers to drive their digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Contact Our Team
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Download Company Profile
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'About Company',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Section heading',
      default: 'About AGI Staffers'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Section subheading',
      default: 'Building the future through innovation and excellence'
    },
    {
      type: 'textarea',
      id: 'company_story',
      label: 'Company story',
      default: 'Founded in 1999, AGI Staffers has grown from a small startup to a global leader...'
    },
    {
      type: 'checkbox',
      id: 'show_mission',
      label: 'Show mission & vision',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_values',
      label: 'Show company values',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_timeline',
      label: 'Show company timeline',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_leadership',
      label: 'Show leadership team',
      default: true
    }
  ]
}