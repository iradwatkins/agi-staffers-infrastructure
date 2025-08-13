'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  Globe, 
  Rocket,
  Zap,
  Star,
  Shield
} from 'lucide-react'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      icon: Globe,
      popular: false,
      pricing: {
        monthly: 99,
        yearly: 999
      },
      features: [
        'Basic AI-powered website',
        'Mobile responsive design',
        'Contact forms',
        'Basic SEO optimization',
        'SSL certificate',
        '24/7 hosting',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      description: 'Advanced features for growing businesses',
      icon: Bot,
      popular: true,
      pricing: {
        monthly: 199,
        yearly: 1999
      },
      features: [
        'Everything in Starter',
        'AI chatbot integration',
        'Advanced SEO for AI search',
        'E-commerce functionality',
        'Custom domain',
        'Analytics dashboard',
        'Priority support',
        'Monthly content updates'
      ]
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      icon: Rocket,
      popular: false,
      pricing: {
        monthly: 399,
        yearly: 3999
      },
      features: [
        'Everything in Professional',
        'Custom AI workflows',
        'Multi-site management',
        'Advanced automation',
        'White-label options',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee'
      ]
    }
  ]

  const addOns = [
    {
      name: 'AI Content Generation',
      description: 'Automated blog posts and content updates',
      price: 49,
      icon: Sparkles
    },
    {
      name: 'Advanced Analytics',
      description: 'Detailed performance insights and reporting',
      price: 29,
      icon: Star
    },
    {
      name: 'Security Plus',
      description: 'Enhanced security monitoring and protection',
      price: 39,
      icon: Shield
    },
    {
      name: 'Performance Boost',
      description: 'CDN and caching optimization',
      price: 19,
      icon: Zap
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 px-6 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Transparent Pricing
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Simple, Powerful
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Website Pricing
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Choose the perfect plan for your business. All plans include AI integration, 
              modern design, and optimization for Claude, Perplexity, and ChatGPT search.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-16">
              <div className="flex items-center space-x-4 p-1 bg-muted rounded-full">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all",
                    billingPeriod === 'monthly' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center",
                    billingPeriod === 'yearly' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Yearly
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 20%</Badge>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const price = plan.pricing[billingPeriod]
              const yearlyDiscount = billingPeriod === 'yearly' ? (plan.pricing.monthly * 12 - plan.pricing.yearly) : 0
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-purple-500 text-white px-6 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={cn(
                    "h-full p-8 rounded-3xl border-2 relative overflow-hidden",
                    plan.popular 
                      ? "border-primary/50 bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-2xl" 
                      : "border-border hover:border-primary/30 shadow-lg"
                  )}>
                    <CardHeader className="text-center pb-8">
                      <div className={cn(
                        "p-4 rounded-2xl w-fit mx-auto mb-4",
                        plan.popular 
                          ? "bg-gradient-to-br from-primary to-purple-500" 
                          : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "h-8 w-8",
                          plan.popular ? "text-white" : "text-primary"
                        )} />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-black">${price}</span>
                          <span className="text-muted-foreground ml-1">/{billingPeriod}</span>
                        </div>
                        {billingPeriod === 'yearly' && yearlyDiscount > 0 && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Save ${yearlyDiscount} per year
                          </p>
                        )}
                      </div>

                      <Button 
                        className={cn(
                          "w-full py-6 text-lg font-semibold rounded-xl",
                          plan.popular 
                            ? "bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90" 
                            : "bg-primary hover:bg-primary/90"
                        )}
                        asChild
                      >
                        <Link href="/leads">
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                          What's Included
                        </h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Enhance Your Website
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Add powerful features to boost your website's performance and capabilities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => {
              const Icon = addon.icon
              return (
                <motion.div
                  key={addon.name}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="p-6 h-full rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-bold mb-2">{addon.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>
                      <div className="text-2xl font-bold text-primary">
                        ${addon.price}/mo
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="grid gap-6">
            {[
              {
                question: "What makes your websites AI-optimized?",
                answer: "Our websites are specifically designed to rank well in AI search engines like Claude, Perplexity, and ChatGPT. We use semantic markup, structured data, and AI-friendly content formatting."
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle."
              },
              {
                question: "Do you provide hosting?",
                answer: "Yes, all plans include premium hosting with SSL certificates, CDN, and 99.9% uptime guarantee."
              },
              {
                question: "What kind of support do you offer?",
                answer: "We provide email support for all plans, with priority support for Professional and Enterprise customers. Enterprise plans also include a dedicated account manager."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join hundreds of businesses building the future with AI-powered websites
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-purple-500"
                asChild
              >
                <Link href="/leads">
                  Start Your Project
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-12 py-6 text-lg font-semibold rounded-2xl border-2"
                asChild
              >
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}