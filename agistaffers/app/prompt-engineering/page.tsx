'use client'

// Remove force-dynamic as we want static generation to work

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
  Brain, 
  Sparkles, 
  Code, 
  Cpu, 
  Target, 
  CheckCircle,
  Zap,
  Wand2,
  MessageSquare
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function PromptEngineeringPage() {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  
  // Remove dependency on complex translation structure for now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const services = [
    {
      icon: Target,
      title: t?.promptEngineeringExtended?.services?.customTraining?.title,
      description: t?.promptEngineeringExtended?.services?.customTraining?.description
    },
    {
      icon: Code,
      title: t?.promptEngineeringExtended?.services?.promptOptimization?.title,
      description: t?.promptEngineeringExtended?.services?.promptOptimization?.description
    },
    {
      icon: Wand2,
      title: t?.promptEngineeringExtended?.services?.workflowIntegration?.title,
      description: t?.promptEngineeringExtended?.services?.workflowIntegration?.description
    },
    {
      icon: MessageSquare,
      title: t?.promptEngineeringExtended?.services?.responseFineTuning?.title,
      description: t?.promptEngineeringExtended?.services?.responseFineTuning?.description
    }
  ]

  const useCases = t?.promptEngineeringExtended?.useCases || []

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-orange-500/10 text-orange-700 border-orange-500/20">
              {t?.promptEngineeringExtended?.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              {t?.promptEngineeringExtended?.mainTitle?.split('. ')[0]}. <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{t?.promptEngineeringExtended?.mainTitle?.split('. ')[1]}.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t?.promptEngineeringExtended?.mainDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.promptEngineeringExtended?.servicesTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.promptEngineeringExtended?.servicesSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-orange-500/20">
                    <div className="flex items-start gap-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {t?.promptEngineeringExtended?.useCasesTitle}
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                {t?.promptEngineeringExtended?.useCasesDescription}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <span>{useCase}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20">
                <div className="space-y-6">
                  <div className="text-center">
                    <Brain className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{t?.promptEngineeringExtended?.beforeAfterTitle}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Típico Prompt:</p>
                      <p className="text-sm italic">"{t?.promptEngineeringExtended?.genericResponse}"</p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-orange-500" />
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                      <p className="text-sm text-muted-foreground mb-2">Prompt Personalizado:</p>
                      <p className="text-sm font-semibold">"{t?.promptEngineeringExtended?.customResponse}"</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead Generation Form */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8">
              <div className="text-center mb-8">
                <Sparkles className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-black mb-2">
                  {t?.promptEngineeringExtended?.formTitle}
                </h2>
                <p className="text-muted-foreground">
                  {t?.promptEngineeringExtended?.formDescription}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t?.promptEngineeringExtended?.formLabels?.name}</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={t?.promptEngineeringExtended?.formLabels?.name?.includes('Juan') ? 'Juan Pérez' : 'John Doe'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t?.promptEngineeringExtended?.formLabels?.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={t?.promptEngineeringExtended?.formLabels?.email?.includes('Dirección') ? 'juan@empresa.com' : 'john@company.com'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">{t?.promptEngineeringExtended?.formLabels?.company}</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder={t?.promptEngineeringExtended?.formLabels?.company?.includes('Empresa') ? 'Empresa Ejemplo' : 'Acme Corp'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t?.promptEngineeringExtended?.formLabels?.message}</Label>
                  <Textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder={t?.promptEngineeringExtended?.formLabels?.messagePlaceholder}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                >
                  {t?.promptEngineeringExtended?.formButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t?.promptEngineeringExtended?.formNote}
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
              {t?.promptEngineeringExtended?.finalCtaTitle}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t?.promptEngineeringExtended?.finalCtaDescription}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Cpu className="h-8 w-8 text-orange-500 animate-pulse" />
              <Zap className="h-6 w-6 text-yellow-500" />
              <Brain className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}