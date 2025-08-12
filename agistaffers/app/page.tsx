'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  ArrowRight, 
  Bot,
  Rocket, 
  Search, 
  Shield, 
  Zap, 
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  Brain,
  Code,
  Database,
  Palette,
  BarChart3,
  Lock,
  Users,
  Workflow,
  Lightbulb,
  Handshake,
  Globe
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'

export default function AGIStaffersHomepage() {
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [currentBanner, setCurrentBanner] = useState(0)
  const { scrollYProgress } = useScroll()
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const heroBanners = [
    {
      title: t.heroBanners.aiAssistants.title,
      subtitle: t.heroBanners.aiAssistants.subtitle,
      description: t.heroBanners.aiAssistants.description,
      cta: t.heroBanners.aiAssistants.cta,
      link: "/ai-assistants",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: t.heroBanners.workflowAutomation.title,
      subtitle: t.heroBanners.workflowAutomation.subtitle,
      description: t.heroBanners.workflowAutomation.description,
      cta: t.heroBanners.workflowAutomation.cta,
      link: "/workflow-automation",
      icon: Workflow,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: t.heroBanners.seo.title,
      subtitle: t.heroBanners.seo.subtitle,
      description: t.heroBanners.seo.description,
      cta: t.heroBanners.seo.cta,
      link: "/seo",
      icon: Search,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: t.heroBanners.promptEngineering.title,
      subtitle: t.heroBanners.promptEngineering.subtitle,
      description: t.heroBanners.promptEngineering.description,
      cta: t.heroBanners.promptEngineering.cta,
      link: "/prompt-engineering",
      icon: Brain,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: t.heroBanners.websites.title,
      subtitle: t.heroBanners.websites.subtitle,
      description: t.heroBanners.websites.description,
      cta: t.heroBanners.websites.cta,
      link: "/websites/pre-built",
      icon: Globe,
      gradient: "from-indigo-500 to-purple-500",
    },
  ]

  useEffect(() => {
    setMounted(true)
    // Auto-rotate hero banners
    const heroInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
    }, 8000) // 8 seconds
    // Auto-rotate features
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => {
      clearInterval(heroInterval)
      clearInterval(featureInterval)
    }
  }, [])

  if (!mounted) return null

  const goToNext = () => setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
  const goToPrev = () => setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)

  const features = [
    {
      icon: Bot,
      title: t.features.items.aiIntegration.title,
      description: t.features.items.aiIntegration.description,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Search,
      title: t.features.items.aiSearchSeo.title,
      description: t.features.items.aiSearchSeo.description,
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: t.features.items.fullAutomation.title,
      description: t.features.items.fullAutomation.description,
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">

      {/* Hero Section with Rotating Banners */}
      <section className="relative min-h-[600px] flex items-center px-4 overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto relative z-10"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                    <span className={cn(
                      "bg-gradient-to-r bg-clip-text text-transparent",
                      heroBanners[currentBanner].gradient
                    )}>
                      {heroBanners[currentBanner].title}
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl font-semibold text-foreground/90"
                >
                  {heroBanners[currentBanner].subtitle}
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-base md:text-lg text-muted-foreground leading-relaxed"
                >
                  {heroBanners[currentBanner].description}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    asChild
                    className={cn(
                      "bg-gradient-to-r hover:opacity-90 transition-all duration-300",
                      "shadow-xl hover:shadow-2xl transform hover:scale-105",
                      "text-lg px-8 py-6",
                      heroBanners[currentBanner].gradient
                    )}
                  >
                    <Link href={heroBanners[currentBanner].link}>
                      {heroBanners[currentBanner].cta} 
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="text-lg px-8 py-6"
                  >
                    <Link href="/contact">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Icon Display */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="hidden lg:flex items-center justify-center"
              >
                <div className={cn(
                  "p-12 rounded-full bg-gradient-to-br",
                  heroBanners[currentBanner].gradient,
                  "opacity-10"
                )}>
                  {(() => {
                    const Icon = heroBanners[currentBanner].icon
                    return <Icon className="h-48 w-48 text-foreground/20" />
                  })()}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Banner Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentBanner === index
                  ? "w-8 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section id="features" className="py-32 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              {t.features.title.split('AGI Staffers')[0]}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"> AGI Staffers</span>
              {t.features.title.split('AGI Staffers')[1] || '?'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.features.subtitle}
            </p>
          </motion.div>

          {/* Interactive Feature Cards */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const isActive = activeFeature === index
                
                return (
                  <motion.div
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveFeature(index)}
                    className={cn(
                      "p-8 rounded-3xl cursor-pointer transition-all duration-500",
                      "border backdrop-blur-sm",
                      isActive 
                        ? "border-primary/50 bg-gradient-to-r from-primary/5 to-purple-500/5 shadow-2xl shadow-primary/10" 
                        : "border-border/50 hover:border-border bg-card/50 hover:shadow-lg"
                    )}
                  >
                    <div className="flex items-start space-x-6">
                      <div className={cn(
                        "p-4 rounded-2xl transition-all duration-300",
                        isActive 
                          ? `bg-gradient-to-br ${feature.color} shadow-lg` 
                          : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "h-8 w-8 transition-colors duration-300",
                          isActive ? "text-white" : "text-muted-foreground"
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground text-lg">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Interactive Preview */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Card className={cn(
                "p-8 rounded-3xl border-0 relative overflow-hidden",
                "bg-gradient-to-br from-card to-card/50",
                "shadow-2xl shadow-black/10 dark:shadow-black/30"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
                <div className="relative z-10">
                  <motion.div
                    key={activeFeature}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    {activeFeature === 0 && (
                      <div className="space-y-6">
                        <Brain className="h-20 w-20 mx-auto text-primary" />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-sm">{t.interactive.aiChatbot}</span>
                            <Badge>{t.interactive.active}</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-sm">{t.interactive.autoContent}</span>
                            <Badge>{t.interactive.running}</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-sm">{t.interactive.smartForms}</span>
                            <Badge>{t.interactive.live}</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeFeature === 1 && (
                      <div className="space-y-6">
                        <Search className="h-20 w-20 mx-auto text-green-500" />
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <div className="text-sm font-medium mb-2">{t.interactive.claudeRanking}</div>
                            <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                              <motion.div 
                                className="bg-green-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "95%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                              ></motion.div>
                            </div>
                          </div>
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <div className="text-sm font-medium mb-2">{t.interactive.perplexityScore}</div>
                            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                              <motion.div 
                                className="bg-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "92%" }}
                                transition={{ duration: 1, delay: 0.7 }}
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeFeature === 2 && (
                      <div className="space-y-6">
                        <Rocket className="h-20 w-20 mx-auto text-purple-500" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-background/50 rounded-lg text-center">
                            <Code className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                            <div className="text-sm font-medium">{t.interactive.deploy}</div>
                          </div>
                          <div className="p-4 bg-background/50 rounded-lg text-center">
                            <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <div className="text-sm font-medium">{t.interactive.database}</div>
                          </div>
                          <div className="p-4 bg-background/50 rounded-lg text-center">
                            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <div className="text-sm font-medium">{t.interactive.monitor}</div>
                          </div>
                          <div className="p-4 bg-background/50 rounded-lg text-center">
                            <Lock className="h-8 w-8 mx-auto mb-2 text-red-500" />
                            <div className="text-sm font-medium">{t.interactive.secure}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid with Hover Effects */}
      <section id="services" className="py-32 px-4 bg-gradient-to-br from-secondary/30 to-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">{t.services.title}</h2>
            <p className="text-xl text-muted-foreground">{t.services.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: t.services.items.modernTechStack.title,
                description: t.services.items.modernTechStack.description,
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: t.services.items.securityFirst.title,
                description: t.services.items.securityFirst.description,
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Rocket,
                title: t.services.items.readyForDevelopment.title,
                description: t.services.items.readyForDevelopment.description,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Palette,
                title: t.services.items.beautifulDesign.title,
                description: t.services.items.beautifulDesign.description,
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: BarChart3,
                title: t.services.items.analyticsMonitoring.title,
                description: t.services.items.analyticsMonitoring.description,
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Brain,
                title: t.services.items.aiIntegration.title,
                description: t.services.items.aiIntegration.description,
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5
                  }}
                  className="group"
                >
                  <Card className={cn(
                    "p-8 h-full rounded-3xl border-0 relative overflow-hidden",
                    "bg-gradient-to-br from-card to-card/80",
                    "shadow-xl shadow-black/5 dark:shadow-black/20",
                    "hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30",
                    "transition-all duration-500 cursor-pointer"
                  )}>
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500",
                      `bg-gradient-to-br ${service.gradient}`
                    )}></div>
                    
                    <div className="relative z-10">
                      <div className={cn(
                        "p-4 rounded-2xl mb-6 w-fit transition-all duration-300",
                        `bg-gradient-to-br ${service.gradient}`,
                        "group-hover:scale-110 group-hover:rotate-3"
                      )}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              {t.cta.title.part1}
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t.cta.title.part2}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className={cn(
                    "px-12 py-6 text-lg font-semibold rounded-2xl",
                    "shadow-2xl shadow-primary/25 hover:shadow-primary/40",
                    "bg-gradient-to-r from-primary to-primary/80",
                    "transition-all duration-300"
                  )}
                >
                  {t.cta.primaryButton}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={cn(
                    "px-12 py-6 text-lg font-semibold rounded-2xl",
                    "border-2 backdrop-blur-sm"
                  )}
                >
                  {t.cta.secondaryButton}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t bg-secondary/20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Bot className="h-10 w-10 text-primary" />
              </motion.div>
              <h3 className="text-3xl font-bold">AGI Staffers</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-lg">
              {t.footer.tagline}
            </p>
            <p className="text-muted-foreground text-sm">
              {t.footer.copyright}
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}