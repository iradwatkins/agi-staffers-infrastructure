'use client'

import React, { useState } from 'react'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  Calendar,
  CheckCircle
} from 'lucide-react'

export default function ContactFormSection({ section, settings }: SectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    urgency: ''
  })

  const {
    heading = 'Get Your Free Consultation',
    subheading = 'Ready to transform your business? Let\'s discuss your project.',
    show_contact_info = true,
    enable_scheduling = true,
    show_form = true,
    contact_info = {
      phone: '+1 (555) 123-4567',
      email: 'hello@agistaffers.com',
      address: '123 Business Ave, Suite 100, New York, NY 10001',
      hours: 'Mon-Fri: 9AM-6PM EST'
    }
  } = section.settings

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          {show_contact_info && (
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${contact_info.phone}`} className="hover:text-primary">
                      {contact_info.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${contact_info.email}`} className="hover:text-primary">
                      {contact_info.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span className="text-sm">{contact_info.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contact_info.hours}</span>
                  </div>
                </CardContent>
              </Card>

              {enable_scheduling && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Schedule a Meeting</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Book a free 30-minute discovery call
                    </p>
                    <Button className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Now
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Contact Form */}
          {show_form && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address *</label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company</label>
                        <Input
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Service Needed</label>
                        <Select onValueChange={(value) => setFormData({...formData, service: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strategy">Business Strategy</SelectItem>
                            <SelectItem value="digital">Digital Transformation</SelectItem>
                            <SelectItem value="marketing">Marketing & Growth</SelectItem>
                            <SelectItem value="operations">Operations Excellence</SelectItem>
                            <SelectItem value="risk">Risk Management</SelectItem>
                            <SelectItem value="leadership">Leadership Development</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Project Budget</label>
                        <Select onValueChange={(value) => setFormData({...formData, budget: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-10k">Under $10,000</SelectItem>
                            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="over-100k">Over $100,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Timeline</label>
                      <Select onValueChange={(value) => setFormData({...formData, urgency: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="When do you need to start?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP</SelectItem>
                          <SelectItem value="1-month">Within 1 month</SelectItem>
                          <SelectItem value="3-months">Within 3 months</SelectItem>
                          <SelectItem value="6-months">Within 6 months</SelectItem>
                          <SelectItem value="exploring">Just exploring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Details *</label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your project, goals, and any specific requirements..."
                        rows={5}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* What Happens Next */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">We Review Your Request</h4>
              <p className="text-sm text-muted-foreground">
                Our team reviews your project details within 24 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Discovery Call</h4>
              <p className="text-sm text-muted-foreground">
                We schedule a call to understand your needs and goals
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Custom Proposal</h4>
              <p className="text-sm text-muted-foreground">
                Receive a tailored proposal with timeline and pricing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const schema = {
  name: 'Contact Form',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Section heading',
      default: 'Get Your Free Consultation'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Section subheading'
    },
    {
      type: 'checkbox',
      id: 'show_contact_info',
      label: 'Show contact information',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_scheduling',
      label: 'Enable scheduling widget',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_form',
      label: 'Show contact form',
      default: true
    }
  ]
}