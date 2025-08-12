'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Users,
  Workflow,
  Lightbulb,
  Handshake,
  Rocket,
  Brain,
  Bot,
  Search,
  Globe
} from 'lucide-react'

const heroBanners = [
  {
    title: "AI Assistants",
    subtitle: "Your 24/7 Dream Team. They Never Quit. Or Ask for Raises.",
    description: "Think of them as your personal army of super-helpful, non-unionized sidekicks. They answer every question, qualify every lead, and make your customers feel heard. All day, every day. While you're... you know, living your life.",
    cta: "I Want an AI Sidekick",
    link: "/ai-assistants",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Workflow Automation",
    subtitle: "Escape the Busywork. Go Build Something Cool.",
    description: "Remember that mind-numbing, copy-and-paste task you have to do every single day? Yeah, that's gone. We design and build the systems that do the boring work for you. We connect all your apps, we automate the mundane, and we give you a big ol' red button that says 'Done.' You're welcome.",
    cta: "Tell Me More, I'm Intrigued!",
    link: "/workflow-automation",
    icon: Workflow,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Content & SEO AI",
    subtitle: "Don't Just Be Found. Be the First Thing They Talk About.",
    description: "The internet is a noisy, crowded place. We make sure your voice is the one that cuts through the noise. Our AI content strategists don't just help you rank on 'Old Man Google,' we make sure new AI engines like Gemini and ChatGPT are quoting your stuff like it's the gospel. You won't just get traffic; you'll get authority.",
    cta: "I Want to Be a Digital God",
    link: "/content-seo",
    icon: Lightbulb,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Prompt Engineering",
    subtitle: "Your AI Is a Generic Know-It-All. We Turn It Into a Specialist.",
    description: "You're using AI for business, but it's a jack-of-all-trades and a master of none. That's like hiring a doctor who's also a plumber. We'll give you a custom-built AI assistant you can install in your favorite chat app, ready to do your specific job. It's time your AI actually worked for you.",
    cta: "I Want My Personalized AI",
    link: "/prompt-engineering",
    icon: Brain,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Need a Website?",
    subtitle: "Your Launchpad to Freedom. With Less BS.",
    description: "You need a place for your business to exist online that's more than just a digital brochure. It's your home base. Whether you're looking for a quick, 'get it done now' e-commerce store or a custom digital masterpiece that's a work of art, we'll build it for you.",
    cta: "I Want My Digital HQ",
    link: "/websites/pre-built",
    icon: Globe,
    gradient: "from-indigo-500 to-purple-500",
  },
];

export default function HeroRotator() {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
    }, 8000) // Rotate every 8 seconds
    return () => clearInterval(timer)
  }, [])

  const goToNext = () => setCurrentBanner((prev) => (prev + 1) % heroBanners.length)
  const goToPrev = () => setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[600px] flex items-center">
        {/* Animated Background Gradients */}
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
            className="container mx-auto px-4 md:px-8 relative z-10"
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
      </div>
    </section>
  )
}