'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowRight, 
  Globe, 
  Palette, 
  Code, 
  Rocket, 
  Shield, 
  Sparkles,
  Layers,
  Cpu,
  Smartphone,
  BarChart3,
  CheckCircle
} from 'lucide-react'

export default function CustomWebsitesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const capabilities = [
    {
      icon: Palette,
      title: "Custom Design",
      description: "Unique designs that capture your brand essence. No templates, no compromises."
    },
    {
      icon: Code,
      title: "Advanced Development",
      description: "Complex functionality, custom features, and integrations tailored to your needs."
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Responsive designs that look stunning on every device, optimized for performance."
    },
    {
      icon: BarChart3,
      title: "Analytics & Tracking",
      description: "Built-in analytics to track performance and make data-driven decisions."
    }
  ]

  const projectTypes = [
    "Corporate Websites",
    "SaaS Platforms",
    "Marketplace Solutions",
    "Portfolio Sites",
    "Web Applications",
    "Custom Portals"
  ]

  const process = [
    {
      step: "Discovery",
      description: "We dive deep into your business, goals, and vision"
    },
    {
      step: "Design",
      description: "Create stunning mockups and prototypes for your approval"
    },
    {
      step: "Development",
      description: "Build your site with clean, scalable code"
    },
    {
      step: "Launch",
      description: "Deploy, optimize, and celebrate your new digital presence"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-700 border-indigo-500/20">
              CUSTOM WEB DEVELOPMENT
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Your Vision. <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Pixel Perfect.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              When templates won't cut it, we build digital masterpieces from scratch. 
              Custom websites that tell your story and drive real results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Beyond <span className="text-indigo-500">Templates</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every line of code written specifically for you. Every pixel designed with purpose.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-indigo-500/20">
                    <div className="flex items-start gap-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{capability.title}</h3>
                        <p className="text-muted-foreground">{capability.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                We Build <span className="text-indigo-500">Everything</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                From simple portfolio sites to complex web applications, we have the expertise 
                to bring your vision to life.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {projectTypes.map((type, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-indigo-500" />
                    <span>{type}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
                <div className="text-center mb-6">
                  <Layers className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Our Process</h3>
                </div>

                <div className="space-y-4">
                  {process.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{step.step}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead Generation Form */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8">
              <div className="text-center mb-8">
                <Sparkles className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-3xl font-black mb-2">
                  Let's Build Something <span className="text-indigo-500">Amazing</span>
                </h2>
                <p className="text-muted-foreground">
                  Tell us about your project and we'll get back to you with a custom proposal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Acme Corp"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Estimated Budget</Label>
                    <select
                      id="budget"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    >
                      <option value="">Select budget range</option>
                      <option value="5-10k">$5,000 - $10,000</option>
                      <option value="10-25k">$10,000 - $25,000</option>
                      <option value="25-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <select
                      id="timeline"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.timeline}
                      onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell us about your project, goals, and any specific features you need..."
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
                >
                  Get Your Custom Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  We'll review your project and send you a detailed proposal within 24 hours.
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              No Cookie-Cutter. <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Just Custom.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your business is unique. Your website should be too. 
              Let's create something that stands out from the crowd.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Globe className="h-8 w-8 text-indigo-500 animate-pulse" />
              <Rocket className="h-6 w-6 text-purple-500" />
              <Cpu className="h-8 w-8 text-indigo-500 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}