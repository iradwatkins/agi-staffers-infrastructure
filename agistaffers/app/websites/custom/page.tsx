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
import { useLanguage } from '@/hooks/useLanguage'

export default function CustomWebsitesPage() {
  const { language, t } = useLanguage()
  
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
      title: t?.customWebsitesExtended?.capabilities?.customDesign?.title,
      description: t?.customWebsitesExtended?.capabilities?.customDesign?.description
    },
    {
      icon: Code,
      title: t?.customWebsitesExtended?.capabilities?.advancedDev?.title,
      description: t?.customWebsitesExtended?.capabilities?.advancedDev?.description
    },
    {
      icon: Smartphone,
      title: t?.customWebsitesExtended?.capabilities?.mobileFirst?.title,
      description: t?.customWebsitesExtended?.capabilities?.mobileFirst?.description
    },
    {
      icon: BarChart3,
      title: t?.customWebsitesExtended?.capabilities?.analytics?.title,
      description: t?.customWebsitesExtended?.capabilities?.analytics?.description
    }
  ]

  const projectTypes = t?.customWebsitesExtended?.projectTypes || []

  const process = [
    {
      step: t?.customWebsitesExtended?.process?.discovery?.step,
      description: t?.customWebsitesExtended?.process?.discovery?.description
    },
    {
      step: t?.customWebsitesExtended?.process?.design?.step,
      description: t?.customWebsitesExtended?.process?.design?.description
    },
    {
      step: t?.customWebsitesExtended?.process?.development?.step,
      description: t?.customWebsitesExtended?.process?.development?.description
    },
    {
      step: t?.customWebsitesExtended?.process?.launch?.step,
      description: t?.customWebsitesExtended?.process?.launch?.description
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
              {t?.customWebsitesExtended?.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              {t?.customWebsitesExtended?.mainTitle?.split('. ')[0]}. <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {t?.customWebsitesExtended?.mainTitle?.split('. ')[1]}.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t?.customWebsitesExtended?.mainDescription}
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
              {t?.customWebsitesExtended?.capabilitiesTitle?.split(' ')[0]} <span className="text-indigo-500">{t?.customWebsitesExtended?.capabilitiesTitle?.split(' ')[1]}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.customWebsitesExtended?.capabilitiesDescription}
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
                {t?.customWebsitesExtended?.projectTypesTitle?.split(' ')[0]} {t?.customWebsitesExtended?.projectTypesTitle?.split(' ')[1]} <span className="text-indigo-500">{t?.customWebsitesExtended?.projectTypesTitle?.split(' ')[2]}</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                {t?.customWebsitesExtended?.projectTypesDescription}
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
                  <h3 className="text-2xl font-bold mb-2">{t?.customWebsitesExtended?.processTitle}</h3>
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
                  {t?.customWebsitesExtended?.formTitle?.split(' ')[0]} {t?.customWebsitesExtended?.formTitle?.split(' ')[1]} {t?.customWebsitesExtended?.formTitle?.split(' ')[2]} <span className="text-indigo-500">{t?.customWebsitesExtended?.formTitle?.split(' ')[3]}</span>
                </h2>
                <p className="text-muted-foreground">
                  {t?.customWebsitesExtended?.formDescription}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t?.customWebsitesExtended?.formLabels?.name}</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={t?.customWebsitesExtended?.formLabels?.placeholders?.name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t?.customWebsitesExtended?.formLabels?.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={t?.customWebsitesExtended?.formLabels?.placeholders?.email}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">{t?.customWebsitesExtended?.formLabels?.company}</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder={t?.customWebsitesExtended?.formLabels?.placeholders?.company}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">{t?.customWebsitesExtended?.formLabels?.budget}</Label>
                    <select
                      id="budget"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    >
                      <option value="">{t?.customWebsitesExtended?.formLabels?.budgetPlaceholder}</option>
                      <option value="5-10k">{t?.customWebsitesExtended?.formLabels?.budgetOptions?.range1}</option>
                      <option value="10-25k">{t?.customWebsitesExtended?.formLabels?.budgetOptions?.range2}</option>
                      <option value="25-50k">{t?.customWebsitesExtended?.formLabels?.budgetOptions?.range3}</option>
                      <option value="50k+">{t?.customWebsitesExtended?.formLabels?.budgetOptions?.range4}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">{t?.customWebsitesExtended?.formLabels?.timeline}</Label>
                    <select
                      id="timeline"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.timeline}
                      onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    >
                      <option value="">{t?.customWebsitesExtended?.formLabels?.timelinePlaceholder}</option>
                      <option value="asap">{t?.customWebsitesExtended?.formLabels?.timelineOptions?.asap}</option>
                      <option value="1-month">{t?.customWebsitesExtended?.formLabels?.timelineOptions?.month1}</option>
                      <option value="2-3-months">{t?.customWebsitesExtended?.formLabels?.timelineOptions?.months2to3}</option>
                      <option value="3-6-months">{t?.customWebsitesExtended?.formLabels?.timelineOptions?.months3to6}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t?.customWebsitesExtended?.formLabels?.description}</Label>
                  <Textarea
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={t?.customWebsitesExtended?.formLabels?.placeholders?.description}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
                >
                  {t?.customWebsitesExtended?.formButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t?.customWebsitesExtended?.formNote}
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
              {t?.customWebsitesExtended?.finalCtaTitle?.split('. ')[0]}. <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {t?.customWebsitesExtended?.finalCtaTitle?.split('. ')[1]}.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t?.customWebsitesExtended?.finalCtaDescription}
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