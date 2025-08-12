'use client'

import { useState } from 'react'
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
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Sparkles,
  Send,
  Calendar,
  Users,
  Zap
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import Image from 'next/image'

export default function ContactPage() {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    budget: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
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
    { id: 'seo', label: 'SEO & AI Search' },
    { id: 'ai-assistants', label: 'AI Assistants' },
    { id: 'workflow', label: 'Workflow Automation' },
    { id: 'prompt', label: 'Prompt Engineering' },
    { id: 'prebuilt', label: 'Pre-built Store' },
    { id: 'custom', label: 'Custom Website' }
  ]

  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'en' ? "Address" : "Dirección",
      content: "251 Little Falls Drive",
      description: "Wilmington, DE 19808"
    },
    {
      icon: Mail,
      title: language === 'en' ? "Email Us" : "Correo Electrónico",
      content: "support@agistaffers.com",
      description: language === 'en' ? "We'll respond within 24 hours" : "Responderemos en 24 horas"
    },
    {
      icon: Phone,
      title: language === 'en' ? "Call Us" : "Llámanos",
      content: "404-668-2401",
      description: language === 'en' ? "Mon-Fri 9am-6pm EST" : "Lun-Vie 9am-6pm EST"
    },
    {
      icon: MessageSquare,
      title: language === 'en' ? "WhatsApp (DR)" : "WhatsApp (RD)",
      content: "404-668-2401",
      description: language === 'en' ? "Dominican Republic" : "República Dominicana",
      isWhatsApp: true
    }
  ]

  const faqs = [
    {
      question: "How quickly can you start?",
      answer: "We can typically start within 48 hours for most projects. Pre-built stores launch in 2 days, custom projects begin within a week."
    },
    {
      question: "Do you offer payment plans?",
      answer: "Yes! We offer flexible payment options including monthly plans for larger projects."
    },
    {
      question: "What if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee on all pre-built stores and milestone-based approvals for custom projects."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Absolutely! All our services include support, with options for ongoing maintenance and updates."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {language === 'en' ? 'GET IN TOUCH' : 'CONTÁCTANOS'}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              {language === 'en' ? (
                <>Let's Build Your <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Digital Empire
                </span></>
              ) : (
                <>Construyamos Tu <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Imperio Digital
                </span></>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {language === 'en' 
                ? "Ready to escape the mundane and build something extraordinary? We're here to make it happen."
                : "¿Listo para escapar de lo mundano y construir algo extraordinario? Estamos aquí para hacerlo realidad."
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                    {info.isWhatsApp ? (
                      <div className="flex items-center justify-center mb-3">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                          <path className="text-green-500" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                    ) : (
                      <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    )}
                    <h3 className="font-bold mb-1">{info.title}</h3>
                    <p className="text-lg font-semibold text-primary mb-1">{info.content}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                    {info.isWhatsApp && (
                      <Button 
                        size="sm" 
                        className="mt-3 bg-green-500 hover:bg-green-600"
                        onClick={() => window.open(`https://wa.me/14046682401`, '_blank')}
                      >
                        {language === 'en' ? 'Chat Now' : 'Chatear Ahora'}
                      </Button>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-black mb-2">
                    {language === 'en' ? 'Start Your Project' : 'Inicia Tu Proyecto'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? "Fill out the form and we'll get back to you within 24 hours with a custom strategy."
                      : "Completa el formulario y te responderemos en 24 horas con una estrategia personalizada."
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{language === 'en' ? 'Your Name *' : 'Tu Nombre *'}</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={language === 'en' ? 'John Doe' : 'Juan Pérez'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{language === 'en' ? 'Email Address *' : 'Correo Electrónico *'}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder={language === 'en' ? 'john@company.com' : 'juan@empresa.com'}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
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
                  </div>

                  <div className="space-y-2">
                    <Label>Services You're Interested In</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={formData.services.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <Label 
                            htmlFor={service.id} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            {service.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <select
                      id="budget"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    >
                      <option value="">Select your budget</option>
                      <option value="under-1k">Under $1,000</option>
                      <option value="1-5k">$1,000 - $5,000</option>
                      <option value="5-10k">$5,000 - $10,000</option>
                      <option value="10-25k">$10,000 - $25,000</option>
                      <option value="25k+">$25,000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
                  >
                    {language === 'en' ? 'Send Message' : 'Enviar Mensaje'}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By submitting this form, you agree to our terms and privacy policy. 
                    We promise not to spam you.
                  </p>
                </form>
              </Card>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black mb-2">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions. Still need help? Just ask!
                </p>
              </div>

              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <h3 className="font-bold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </Card>
                </motion.div>
              ))}

              <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
                  <p className="text-muted-foreground mb-4">
                    Most projects begin with a free consultation to understand your needs.
                  </p>
                  <Button size="lg" variant="outline">
                    Book Free Consultation
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              No More <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Waiting
              </span>. Let's Build.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Every minute you wait is a minute your competition gets ahead. 
              Let's change that today.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Users className="h-8 w-8 text-primary animate-pulse" />
              <Zap className="h-6 w-6 text-yellow-500" />
              <Clock className="h-8 w-8 text-purple-500 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}