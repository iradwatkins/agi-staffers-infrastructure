'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowRight, 
  Search, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  Zap, 
  Shield, 
  CheckCircle,
  Sparkles,
  Brain,
  Target,
  Megaphone,
  Bot,
  LineChart,
  Users
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function SEOPage() {
  const { language, t } = useLanguage()
  
  if (!t || !t.seoPage || !t.seoPageExtended) {
    return null // Wait for translations to load
  }
  const services = [
    {
      icon: Bot,
      title: t.seoPageExtended.services.aiSearch.title,
      description: t.seoPageExtended.services.aiSearch.description,
      features: t.seoPageExtended.services.aiSearch.features
    },
    {
      icon: Search,
      title: t.seoPageExtended.services.traditionalSeo.title,
      description: t.seoPageExtended.services.traditionalSeo.description,
      features: t.seoPageExtended.services.traditionalSeo.features
    },
    {
      icon: Brain,
      title: t.seoPageExtended.services.contentIntelligence.title,
      description: t.seoPageExtended.services.contentIntelligence.description,
      features: t.seoPageExtended.services.contentIntelligence.features
    },
    {
      icon: LineChart,
      title: t.seoPageExtended.services.performanceAnalytics.title,
      description: t.seoPageExtended.services.performanceAnalytics.description,
      features: t.seoPageExtended.services.performanceAnalytics.features
    }
  ]

  const results = [
    { 
      metric: t?.seoPageExtended?.results?.traffic?.metric || "Average Traffic Increase", 
      value: "+312%", 
      timeframe: t?.seoPageExtended?.results?.traffic?.timeframe || "in 6 months" 
    },
    { 
      metric: t?.seoPageExtended?.results?.citations?.metric || "AI Search Citations", 
      value: "4.5x", 
      timeframe: t?.seoPageExtended?.results?.citations?.timeframe || "more mentions" 
    },
    { 
      metric: t?.seoPageExtended?.results?.rankings?.metric || "First Page Rankings", 
      value: "87%", 
      timeframe: t?.seoPageExtended?.results?.rankings?.timeframe || "of keywords" 
    },
    { 
      metric: t?.seoPageExtended?.results?.roi?.metric || "ROI Average", 
      value: "8:1", 
      timeframe: t?.seoPageExtended?.results?.roi?.timeframe || "return on investment" 
    }
  ]

  const process = [
    {
      step: "1",
      title: t?.seoPageExtended?.process?.audit?.title || "Deep Dive Audit",
      description: t?.seoPageExtended?.process?.audit?.description || "We analyze your current presence across traditional and AI search platforms."
    },
    {
      step: "2",
      title: t?.seoPageExtended?.process?.strategy?.title || "Strategy Blueprint",
      description: t?.seoPageExtended?.process?.strategy?.description || "Custom roadmap targeting both Google rankings and AI model citations."
    },
    {
      step: "3",
      title: t?.seoPageExtended?.process?.content?.title || "Content Domination",
      description: t?.seoPageExtended?.process?.content?.description || "Create and optimize content that search engines and AI models can't ignore."
    },
    {
      step: "4",
      title: t?.seoPageExtended?.process?.optimize?.title || "Scale & Optimize",
      description: t?.seoPageExtended?.process?.optimize?.description || "Continuously improve rankings while expanding your digital footprint."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-green-500/10 text-green-700 border-green-500/20">
              {t.seoPageExtended.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              {t.seoPageExtended.mainTitle}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t.seoPageExtended.mainDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90">
                {t.seoPage.formButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                {t.seoPageExtended.viewCaseStudies}
                <BarChart3 className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {result.value}
                </div>
                <div className="text-lg font-semibold mt-2">{result.metric}</div>
                <div className="text-sm text-muted-foreground">{result.timeframe}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.seoPageExtended?.servicesTitle || (language === 'en' ? 'SEO Services That Deliver Results' : 'Servicios SEO Que Entregan Resultados')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.seoPageExtended?.servicesDescription || (language === 'en' ? 'We combine traditional SEO mastery with cutting-edge AI optimization. Your competition is still figuring out ChatGPT while you\'re already ranking in it.' : 'Combinamos maestría en SEO tradicional con optimización de IA de vanguardia. Tu competencia aún está descubriendo ChatGPT mientras tú ya estás posicionándote en él.')}
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
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-green-500/20">
                    <div className="flex items-start gap-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.seoPageExtended?.processTitle || (language === 'en' ? 'Our Battle-Tested Process' : 'Nuestro Proceso Probado en Batalla')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.seoPageExtended?.processDescription || (language === 'en' ? 'Four steps to search domination. No fluff, just results.' : 'Cuatro pasos hacia la dominación en búsquedas. Sin relleno, solo resultados.')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-black text-green-500/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-green-500/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {t.seoPageExtended.whyDifferentTitle}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Bot className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t.seoPageExtended.whyDifferent.aiFirst.title}</h3>
                    <p className="text-muted-foreground">
                      {t.seoPageExtended.whyDifferent.aiFirst.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t.seoPageExtended.whyDifferent.precisionTargeting.title}</h3>
                    <p className="text-muted-foreground">
                      {t.seoPageExtended.whyDifferent.precisionTargeting.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t.seoPageExtended.whyDifferent.speedImplementation.title}</h3>
                    <p className="text-muted-foreground">
                      {t.seoPageExtended.whyDifferent.speedImplementation.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <Card className="p-8 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Google Rankings</span>
                    <Badge className="bg-green-500/10 text-green-700">+287%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">AI Citations</span>
                    <Badge className="bg-green-500/10 text-green-700">+450%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "88%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Organic Traffic</span>
                    <Badge className="bg-green-500/10 text-green-700">+312%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t.seoPageExtended.ctaTitle}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.seoPageExtended.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-lg px-8 py-6" asChild>
                <Link href="/leads?service=seo">
                  {t.seoPageExtended.getAudit}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  {t.seoPageExtended.scheduleCall}
                  <Megaphone className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}