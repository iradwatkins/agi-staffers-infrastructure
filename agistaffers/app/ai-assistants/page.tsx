'use client'

// Remove force-dynamic as we want static generation to work

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowRight, 
  Bot, 
  MessageSquare, 
  Clock, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  Sparkles,
  HeadphonesIcon,
  TrendingUp,
  Globe,
  Brain,
  Cpu
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function AIAssistantsPage() {
  const { language, t } = useLanguage()
  
  // Now t will always be available thanks to the updated useLanguage hook
  const assistantTypes = [
    {
      icon: HeadphonesIcon,
      title: t?.aiAssistantsExtended?.assistantTypes?.customerSupport?.title || 'Customer Support',
      description: t?.aiAssistantsExtended?.assistantTypes?.customerSupport?.description || 'AI-powered customer support',
      features: t?.aiAssistantsExtended?.assistantTypes?.customerSupport?.features || []
    },
    {
      icon: TrendingUp,
      title: t?.aiAssistantsExtended?.assistantTypes?.salesAssistant?.title || 'Sales Assistant',
      description: t?.aiAssistantsExtended?.assistantTypes?.salesAssistant?.description || 'AI sales automation',
      features: t?.aiAssistantsExtended?.assistantTypes?.salesAssistant?.features || []
    },
    {
      icon: Brain,
      title: t?.aiAssistantsExtended?.assistantTypes?.knowledgeBase?.title || 'Knowledge Base',
      description: t?.aiAssistantsExtended?.assistantTypes?.knowledgeBase?.description || 'AI knowledge management',
      features: t?.aiAssistantsExtended?.assistantTypes?.knowledgeBase?.features || []
    },
    {
      icon: MessageSquare,
      title: t?.aiAssistantsExtended?.assistantTypes?.socialMedia?.title || 'Social Media',
      description: t?.aiAssistantsExtended?.assistantTypes?.socialMedia?.description || 'AI social media management',
      features: t?.aiAssistantsExtended?.assistantTypes?.socialMedia?.features || []
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: t?.aiAssistantsExtended?.benefits?.available247?.title || '24/7 Available',
      description: t?.aiAssistantsExtended?.benefits?.available247?.description || 'Always online and ready to help'
    },
    {
      icon: Zap,
      title: t?.aiAssistantsExtended?.benefits?.instantResponse?.title || 'Instant Response',
      description: t?.aiAssistantsExtended?.benefits?.instantResponse?.description || 'Get immediate answers and support'
    },
    {
      icon: Globe,
      title: t?.aiAssistantsExtended?.benefits?.unlimitedScale?.title || 'Unlimited Scale',
      description: t?.aiAssistantsExtended?.benefits?.unlimitedScale?.description || 'Handle thousands of conversations simultaneously'
    },
    {
      icon: Shield,
      title: t?.aiAssistantsExtended?.benefits?.alwaysConsistent?.title || 'Always Consistent',
      description: t?.aiAssistantsExtended?.benefits?.alwaysConsistent?.description || 'Reliable and consistent responses every time'
    }
  ]

  const stats = t?.aiAssistantsExtended?.stats ? [
    { label: t.aiAssistantsExtended.stats.responseTime?.label || '', value: t.aiAssistantsExtended.stats.responseTime?.value || '', description: t.aiAssistantsExtended.stats.responseTime?.description || '' },
    { label: t.aiAssistantsExtended.stats.satisfaction?.label || '', value: t.aiAssistantsExtended.stats.satisfaction?.value || '', description: t.aiAssistantsExtended.stats.satisfaction?.description || '' },
    { label: t.aiAssistantsExtended.stats.costReduction?.label || '', value: t.aiAssistantsExtended.stats.costReduction?.value || '', description: t.aiAssistantsExtended.stats.costReduction?.description || '' },
    { label: t.aiAssistantsExtended.stats.conversations?.label || '', value: t.aiAssistantsExtended.stats.conversations?.value || '', description: t.aiAssistantsExtended.stats.conversations?.description || '' }
  ] : []

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-700 border-blue-500/20">
              {t?.aiAssistantsExtended?.badge || 'AI Assistants'}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              {t?.aiAssistantsExtended?.mainTitle || 'AI-Powered Virtual Assistants'}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t?.aiAssistantsExtended?.mainDescription || 'Transform your business with intelligent AI assistants'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90">
                {t?.aiAssistantsExtended?.deployTeam || 'Deploy Now'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                {t?.aiAssistantsExtended?.seeAction || 'See Demo'}
                <Bot className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mt-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assistant Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.aiAssistantsExtended?.typesTitle || 'Types of AI Assistants'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.aiAssistantsExtended?.typesDescription || 'Choose the perfect AI assistant for your business needs'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {assistantTypes.map((assistant, index) => {
              const Icon = assistant.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-blue-500/20">
                    <div className="flex items-start gap-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{assistant.title}</h3>
                        <p className="text-muted-foreground mb-4">{assistant.description}</p>
                        <ul className="space-y-2">
                          {assistant.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-blue-500" />
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

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.aiAssistantsExtended?.benefitsTitle || 'Benefits of AI Assistants'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.aiAssistantsExtended?.benefitsSubtitle || 'Discover how AI assistants can transform your business operations'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {t?.aiAssistantsExtended?.howItWorksTitle || 'How It Works'}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t?.aiAssistantsExtended?.process?.shareKnowledge?.title || 'Share Your Knowledge'}</h3>
                    <p className="text-muted-foreground">
                      {t?.aiAssistantsExtended?.process?.shareKnowledge?.description || 'Configure your AI assistant'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t?.aiAssistantsExtended?.process?.customizeTrain?.title || 'Customize & Train'}</h3>
                    <p className="text-muted-foreground">
                      {t?.aiAssistantsExtended?.process?.customizeTrain?.description || 'Deploy and integrate'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t?.aiAssistantsExtended?.process?.deployScale?.title || 'Deploy & Scale'}</h3>
                    <p className="text-muted-foreground">
                      {t?.aiAssistantsExtended?.process?.deployScale?.description || 'Monitor and optimize'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold">{'Active Conversations'}</p>
                        <p className="text-sm text-muted-foreground">{'Currently in progress'}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-700">342</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold">{'Resolution Rate'}</p>
                        <p className="text-sm text-muted-foreground">{'Successfully resolved'}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-700">87%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-semibold">{'AI Processing'}</p>
                        <p className="text-sm text-muted-foreground">{'Real-time processing'}</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-700">Active</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t?.aiAssistantsExtended?.ctaTitle || 'Ready to Get Started?'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t?.aiAssistantsExtended?.ctaDescription || 'Transform your business with AI assistants today'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-lg px-8 py-6" asChild>
                <Link href="/leads?service=ai-assistants">
                  {t?.aiAssistantsExtended?.startProject || 'Start Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  {t?.aiAssistantsExtended?.talkExpert || 'Talk to Expert'}
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}