'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  Award,
  MapPin,
  Calendar,
  Star
} from 'lucide-react'

export default function TeamProfilesSection({ section, settings }: SectionProps) {
  const {
    heading = 'Meet Our Expert Team',
    subheading = 'Experienced professionals dedicated to your success',
    layout = 'grid',
    columns = 3,
    show_social_links = true,
    show_expertise = true,
    show_experience = true,
    enable_contact = true,
    team_members = [
      {
        id: '1',
        name: 'Sarah Johnson',
        position: 'Senior Strategy Consultant',
        bio: 'Over 12 years of experience helping Fortune 500 companies achieve breakthrough growth.',
        image: '/api/placeholder/400/500',
        expertise: ['Business Strategy', 'Market Analysis', 'Digital Transformation'],
        experience: '12+ Years',
        location: 'New York, NY',
        social: {
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          twitter: 'https://twitter.com/sarahjohnson',
          email: 'sarah@agistaffers.com'
        },
        certifications: ['MBA Harvard', 'PMP Certified', 'Six Sigma Black Belt']
      },
      {
        id: '2',
        name: 'Michael Chen',
        position: 'Digital Transformation Lead',
        bio: 'Technology visionary with expertise in modernizing legacy systems and processes.',
        image: '/api/placeholder/400/500',
        expertise: ['Cloud Architecture', 'Process Automation', 'System Integration'],
        experience: '10+ Years',
        location: 'San Francisco, CA',
        social: {
          linkedin: 'https://linkedin.com/in/michaelchen',
          twitter: 'https://twitter.com/michaelchen',
          email: 'michael@agistaffers.com'
        },
        certifications: ['AWS Certified', 'Salesforce Certified', 'ITIL Expert']
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        position: 'Marketing & Growth Director',
        bio: 'Creative strategist focused on building brands and driving sustainable growth.',
        image: '/api/placeholder/400/500',
        expertise: ['Brand Strategy', 'Digital Marketing', 'Growth Hacking'],
        experience: '8+ Years',
        location: 'Austin, TX',
        social: {
          linkedin: 'https://linkedin.com/in/emilyrodriguez',
          twitter: 'https://twitter.com/emilyrodriguez',
          email: 'emily@agistaffers.com'
        },
        certifications: ['Google Ads Certified', 'HubSpot Certified', 'Facebook Blueprint']
      }
    ]
  } = section.settings

  const TeamMemberCard = ({ member }: { member: any }) => {
    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Social Links Overlay */}
          {show_social_links && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-3">
                {member.social.linkedin && (
                  <Button size="icon" variant="secondary" asChild>
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.social.twitter && (
                  <Button size="icon" variant="secondary" asChild>
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.social.email && enable_contact && (
                  <Button size="icon" variant="secondary" asChild>
                    <a href={`mailto:${member.social.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Name & Position */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
            <p className="text-primary font-medium">{member.position}</p>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground text-sm mb-4 text-center">
            {member.bio}
          </p>

          {/* Experience & Location */}
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
            {show_experience && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{member.experience}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{member.location}</span>
            </div>
          </div>

          {/* Expertise */}
          {show_expertise && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Expertise:</h4>
              <div className="flex flex-wrap gap-1">
                {member.expertise.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <Award className="h-3 w-3" />
              Certifications:
            </h4>
            <div className="space-y-1">
              {member.certifications.slice(0, 2).map((cert: string, index: number) => (
                <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="h-2 w-2 text-yellow-500" />
                  {cert}
                </div>
              ))}
              {member.certifications.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{member.certifications.length - 2} more
                </div>
              )}
            </div>
          </div>

          {/* Contact Button */}
          {enable_contact && (
            <Button className="w-full" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Contact {member.name.split(' ')[0]}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>

        {/* Team Grid */}
        <div className={`grid gap-8 mb-12 ${
          layout === 'grid' 
            ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`
            : 'grid-cols-1 max-w-2xl mx-auto'
        }`}>
          {team_members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center bg-muted/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Want to Join Our Team?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented professionals who share our passion 
            for delivering exceptional results.
          </p>
          <Button size="lg">
            View Open Positions
          </Button>
        </div>
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Team Profiles',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Section heading',
      default: 'Meet Our Expert Team'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Section subheading',
      default: 'Experienced professionals dedicated to your success'
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
      type: 'checkbox',
      id: 'show_social_links',
      label: 'Show social media links',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_expertise',
      label: 'Show expertise tags',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_experience',
      label: 'Show years of experience',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_contact',
      label: 'Enable contact buttons',
      default: true
    }
  ]
}