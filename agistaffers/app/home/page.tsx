'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { 
  ArrowRight, 
  Bot, 
  Globe, 
  Rocket, 
  Search, 
  Shield, 
  Zap, 
  Moon, 
  Sun,
  ChevronDown,
  Play,
  Sparkles,
  Brain,
  Code,
  Database,
  Palette,
  BarChart3,
  Lock
} from 'lucide-react'
import { useTheme } from 'next-themes'

export default function AGIStaffersHomepage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const { scrollYProgress } = useScroll()
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const features = [
    {
      icon: Bot,
      title: "AI Integration",
      description: "Native AI chatbots and intelligent automation",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Search,
      title: "AI Search SEO",
      description: "Optimized for Claude, Perplexity, and ChatGPT",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Full Automation",
      description: "Complete CI/CD pipeline and deployment",
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Floating Navigation */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <nav className={cn(
          "flex items-center space-x-6 px-6 py-3 rounded-full",
          "backdrop-blur-md bg-background/80 border border-border/50",
          "shadow-lg shadow-black/5 dark:shadow-black/20"
        )}>
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Bot className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="font-bold text-lg">AGI Staffers</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>
            
            <Button size="sm" className="rounded-full px-4">
              Dashboard
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center z-10 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className={cn(
              "mb-6 px-6 py-2 text-sm font-medium rounded-full",
              "bg-gradient-to-r from-primary/10 to-purple-500/10",
              "border border-primary/20 text-primary",
              "shadow-lg shadow-primary/10"
            )}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Website Development
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
          >
            <span className="block">Build Websites</span>
            <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              with AI Magic
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            We create powerful, automated websites with AI integration and SEO optimization 
            for modern search engines like <strong>Claude</strong>, <strong>Perplexity</strong>, and <strong>ChatGPT</strong>.
          </motion.p>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className={cn(
                  "px-12 py-6 text-lg font-semibold rounded-2xl",
                  "shadow-2xl shadow-primary/25 hover:shadow-primary/40",
                  "bg-gradient-to-r from-primary to-primary/80",
                  "hover:from-primary/90 hover:to-primary/70",
                  "transition-all duration-300"
                )}
              >
                Create Your Website
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className={cn(
                  "px-12 py-6 text-lg font-semibold rounded-2xl",
                  "border-2 backdrop-blur-sm",
                  "hover:bg-accent/50 transition-all duration-300"
                )}
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center text-muted-foreground"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
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
              Why Choose 
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"> AGI Staffers</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine cutting-edge AI technology with proven web development practices
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
                            <span className="text-sm">AI Chatbot</span>
                            <Badge>Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-sm">Auto Content</span>
                            <Badge>Running</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <span className="text-sm">Smart Forms</span>
                            <Badge>Live</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeFeature === 1 && (
                      <div className="space-y-6">
                        <Search className="h-20 w-20 mx-auto text-green-500" />
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <div className="text-sm font-medium mb-2">Claude AI Ranking</div>
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
                            <div className="text-sm font-medium mb-2">Perplexity Score</div>
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
                            <div className="text-sm font-medium">Deploy</div>
                          </div>
                          <div className="p-4 bg-background/50 rounded-lg text-center">
                            <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <div className="text-sm font-medium">Database</div>
                          </div>
                          <div className="p-4 bg-background/50 rounded-lg text-center">
                            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <div className="text-sm font-medium">Monitor</div>
                          </div>
                          <div className="p-4 bg-background/50 rounded-lg text-center">
                            <Lock className="h-8 w-8 mx-auto mb-2 text-red-500" />
                            <div className="text-sm font-medium">Secure</div>
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
            <h2 className="text-5xl md:text-6xl font-black mb-6">Complete Website Solutions</h2>
            <p className="text-xl text-muted-foreground">Everything you need for a modern, AI-powered web presence</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Modern Tech Stack",
                description: "Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Security First",
                description: "Magic link authentication, secure deployment, and automated backups",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Rocket,
                title: "Ready for Development",
                description: "GitHub integration, Cursor IDE ready, with full CI/CD pipeline",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Palette,
                title: "Beautiful Design",
                description: "shadcn/ui components with Apple-like aesthetics and animations",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: BarChart3,
                title: "Analytics & Monitoring",
                description: "Real-time performance tracking and error monitoring with Sentry",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Brain,
                title: "AI Integration",
                description: "Native chatbots, content generation, and intelligent automation",
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
              Ready to Build Your
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI-Powered Website?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Join the future of web development with automated, intelligent websites that rank on AI search engines.
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
                  asChild
                >
                  <Link href="/leads">
                    Start a Project
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
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
                  Schedule Consultation
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
              AI-powered website development and automation specialists
            </p>
            <p className="text-muted-foreground text-sm">
              © 2025 AGI Staffers. Building the future of intelligent websites.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}