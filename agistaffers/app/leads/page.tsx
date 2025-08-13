'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowRight, 
  Sparkles,
  Send,
  Zap,
  Users,
  TrendingUp,
  Shield,
  CheckCircle
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useSearchParams } from 'next/navigation'
import ClientOnly from '@/components/ClientOnly'

function LeadsPageContent() {
  const { language, t } = useLanguage()
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: serviceParam ? [serviceParam] : [] as string[],
    budget: '',
    message: '',
    urgency: 'asap'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Lead form submitted:', formData)
    // Here you would typically send to your backend/CRM
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const services = [
    { id: 'seo', label: language === 'en' ? 'SEO & AI Search' : 'SEO e IA de Búsqueda', icon: TrendingUp },
    { id: 'ai-assistants', label: language === 'en' ? 'AI Assistants' : 'Asistentes de IA', icon: Users },
    { id: 'workflow', label: language === 'en' ? 'Workflow Automation' : 'Automatización de Flujos', icon: Zap },
    { id: 'prompt', label: language === 'en' ? 'Prompt Engineering' : 'Ingeniería de Prompts', icon: Sparkles },
    { id: 'prebuilt', label: language === 'en' ? 'Pre-built Store' : 'Tienda Pre-construida', icon: Shield },
    { id: 'custom', label: language === 'en' ? 'Custom Website' : 'Sitio Web Personalizado', icon: ArrowRight }
  ]

  const budgetOptions = [
    { value: 'under-5k', label: language === 'en' ? 'Under $5,000' : 'Menos de $5,000' },
    { value: '5k-15k', label: '$5,000 - $15,000' },
    { value: '15k-50k', label: '$15,000 - $50,000' },
    { value: 'over-50k', label: language === 'en' ? 'Over $50,000' : 'Más de $50,000' },
    { value: 'discuss', label: language === 'en' ? 'Let\'s discuss' : 'Hablemos' }
  ]

  const urgencyOptions = [
    { value: 'asap', label: language === 'en' ? 'ASAP (Within 1 week)' : 'Lo antes posible (1 semana)' },
    { value: 'month', label: language === 'en' ? 'Within a month' : 'En un mes' },
    { value: 'quarter', label: language === 'en' ? 'Within 3 months' : 'En 3 meses' },
    { value: 'exploring', label: language === 'en' ? 'Just exploring' : 'Solo explorando' }
  ]

  const benefits = [
    {
      icon: CheckCircle,
      text: language === 'en' ? '48-hour response guarantee' : 'Respuesta garantizada en 48 horas'
    },
    {
      icon: CheckCircle,
      text: language === 'en' ? 'Free consultation call' : 'Llamada de consulta gratuita'
    },
    {
      icon: CheckCircle,
      text: language === 'en' ? 'Custom proposal within 3 days' : 'Propuesta personalizada en 3 días'
    },
    {
      icon: CheckCircle,
      text: language === 'en' ? 'No commitment required' : 'Sin compromiso requerido'
    }
  ]

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
              <Sparkles className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Start Your Project Today' : 'Comienza Tu Proyecto Hoy'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {language === 'en' ? (
                <>Your Time Is Your Business. <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Let's Get It Back.</span></>
              ) : (
                <>Tu Tiempo Es Tu Negocio. <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Vamos a Recuperarlo.</span></>
              )}
            </h1>
            <div className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto space-y-4">
              <p>
                {language === 'en' 
                  ? "Let's be honest. You didn't start a business to spend your life in a digital filing cabinet. You started it to be a boss, a visionary, a legend. But somewhere along the way, you got buried under the busywork. We get it. It happens."
                  : "Seamos honestos. No iniciaste un negocio para pasar tu vida en un archivador digital. Lo iniciaste para ser un jefe, un visionario, una leyenda. Pero en algún momento del camino, te enterraron bajo el trabajo innecesario. Lo entendemos. Pasa."
                }
              </p>
              <p>
                {language === 'en' 
                  ? "This isn't just a contact form. This is your first step toward getting your life back. Tell us about the stuff that's holding you back, and we'll show you how an AI Staffer can make it... disappear."
                  : "Esto no es solo un formulario de contacto. Este es tu primer paso para recuperar tu vida. Cuéntanos sobre las cosas que te están frenando, y te mostraremos cómo un Empleado de IA puede hacerlas... desaparecer."
                }
              </p>
              <p className="font-semibold text-primary">
                {language === 'en' 
                  ? "Ready to stop dreaming and start doing?"
                  : "¿Listo para dejar de soñar y empezar a hacer?"
                }
              </p>
              <p className="text-lg">
                {language === 'en' 
                  ? "Fill out the form below, and a real human (we've got a few of those) will reach out to discuss your needs. No pressure, no awkward sales pitches. Just a conversation about how you can have fewer employees, more time, and a whole lot more freedom."
                  : "Completa el formulario a continuación, y un humano real (tenemos algunos de esos) se pondrá en contacto para discutir tus necesidades. Sin presión, sin argumentos de venta incómodos. Solo una conversación sobre cómo puedes tener menos empleados, más tiempo y mucha más libertad."
                }
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {benefits?.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <benefit.icon className="h-4 w-4 text-green-500" />
                  {benefit.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Benefits & Social Proof */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {language === 'en' ? 'Why Choose AGI Staffers?' : '¿Por Qué Elegir AGI Staffers?'}
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {language === 'en' ? '500+ Projects Delivered' : '500+ Proyectos Entregados'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'en' 
                        ? 'From startups to Fortune 500 companies, we\'ve helped businesses of all sizes implement AI solutions.'
                        : 'Desde startups hasta empresas Fortune 500, hemos ayudado a empresas de todos los tamaños a implementar soluciones de IA.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {language === 'en' ? '300% Average ROI' : '300% ROI Promedio'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'en' 
                        ? 'Our clients typically see 3x return on their AI automation investments within the first year.'
                        : 'Nuestros clientes típicamente ven 3x retorno en sus inversiones de automatización con IA en el primer año.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Zap className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {language === 'en' ? '24/7 Support' : 'Soporte 24/7'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'en' 
                        ? 'Round-the-clock support with real humans, not chatbots. We\'re here when you need us.'
                        : 'Soporte las 24 horas con personas reales, no chatbots. Estamos aquí cuando nos necesites.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Lead Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-background to-secondary/20">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  {language === 'en' ? 'Get Your Free Consultation' : 'Obtén Tu Consulta Gratuita'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        {language === 'en' ? 'Full Name *' : 'Nombre Completo *'}
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={language === 'en' ? 'John Doe' : 'Juan Pérez'}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">
                        {language === 'en' ? 'Email Address *' : 'Correo Electrónico *'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder={language === 'en' ? 'john@company.com' : 'juan@empresa.com'}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">
                        {language === 'en' ? 'Phone Number' : 'Número de Teléfono'}
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">
                        {language === 'en' ? 'Company Name' : 'Nombre de la Empresa'}
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder={language === 'en' ? 'Your Company Inc.' : 'Tu Empresa SA'}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Services Interest */}
                  <div>
                    <Label className="text-base font-semibold">
                      {language === 'en' ? 'What services are you interested in? *' : '¿Qué servicios te interesan? *'}
                    </Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {services?.map((service) => {
                        const Icon = service.icon
                        return (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={service.id}
                              checked={formData.services.includes(service.id)}
                              onCheckedChange={() => handleServiceToggle(service.id)}
                            />
                            <Label htmlFor={service.id} className="text-sm flex items-center gap-2 cursor-pointer">
                              <Icon className="h-4 w-4" />
                              {service.label}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <Label htmlFor="budget">
                      {language === 'en' ? 'Project Budget Range' : 'Rango de Presupuesto del Proyecto'}
                    </Label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">
                        {language === 'en' ? 'Select budget range...' : 'Seleccionar rango de presupuesto...'}
                      </option>
                      {budgetOptions?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timeline */}
                  <div>
                    <Label>
                      {language === 'en' ? 'Project Timeline' : 'Cronograma del Proyecto'}
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {urgencyOptions?.map((option) => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="urgency"
                            value={option.value}
                            checked={formData.urgency === option.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                            className="text-primary"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">
                      {language === 'en' ? 'Tell us about your project' : 'Cuéntanos sobre tu proyecto'}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={language === 'en' 
                        ? 'Describe your goals, challenges, and what success looks like...'
                        : 'Describe tus objetivos, desafíos y cómo se ve el éxito...'
                      }
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg py-6"
                  >
                    {language === 'en' ? 'Get My Free Consultation' : 'Obtener Mi Consulta Gratuita'}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {language === 'en' 
                      ? 'By submitting this form, you agree to receive communications from AGI Staffers. We respect your privacy and will never spam you.'
                      : 'Al enviar este formulario, aceptas recibir comunicaciones de AGI Staffers. Respetamos tu privacidad y nunca te enviaremos spam.'
                    }
                  </p>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      </div>
    </ClientOnly>
  )
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <LeadsPageContent />
    </Suspense>
  )
}