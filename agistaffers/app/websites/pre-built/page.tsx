'use client'

// Remove force-dynamic as we want static generation to work

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Zap, 
  Shield, 
  Globe, 
  Sparkles,
  Rocket,
  CreditCard,
  Package,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function PreBuiltStoresPage() {
  const { language, t } = useLanguage()
  
  // Remove dependency on complex translation structure for now
  const plans = [
    {
      name: t?.prebuiltStoresExtended?.plans?.starter?.name || "Starter Store",
      price: "$497",
      setup: t?.prebuiltStoresExtended?.plans?.starter?.setup || "One-time setup",
      description: t?.prebuiltStoresExtended?.plans?.starter?.description || "Perfect for launching your first online business",
      features: [
        "Professional e-commerce template",
        "Up to 100 products",
        "Mobile-responsive design",
        "Secure payment processing",
        "Basic SEO optimization",
        "SSL certificate included",
        "Email support",
        "3 months free hosting"
      ],
      popular: false,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: t?.prebuiltStoresExtended?.plans?.growth?.name || "Growth Store",
      price: "$997",
      setup: t?.prebuiltStoresExtended?.plans?.growth?.setup || "One-time setup",
      description: t?.prebuiltStoresExtended?.plans?.growth?.description || "For businesses ready to scale and grow",
      features: [
        "Premium e-commerce template",
        "Unlimited products",
        "Advanced mobile optimization",
        "Multiple payment gateways",
        "Advanced SEO & AI optimization",
        "Custom domain & SSL",
        "Priority email & chat support",
        "6 months free hosting",
        "Email marketing integration",
        "Inventory management",
        "Customer accounts & wishlists"
      ],
      popular: true,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: t?.prebuiltStoresExtended?.plans?.enterprise?.name || "Enterprise Store",
      price: "$2,497",
      setup: t?.prebuiltStoresExtended?.plans?.enterprise?.setup || "One-time setup + customization",
      description: t?.prebuiltStoresExtended?.plans?.enterprise?.description || "Full-featured store with premium support",
      features: [
        "Custom-designed store",
        "Unlimited everything",
        "AI-powered personalization",
        "Multi-currency & languages",
        "Advanced analytics dashboard",
        "Custom integrations",
        "Dedicated account manager",
        "12 months free hosting",
        "Marketing automation suite",
        "Advanced inventory & shipping",
        "B2B features available",
        "API access"
      ],
      popular: false,
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const features = [
    {
      icon: Rocket,
      title: t?.prebuiltStoresExtended?.features?.launch48?.title || "Launch Fast",
      description: t?.prebuiltStoresExtended?.features?.launch48?.description || "Get online in 24-48 hours with a fully functional store"
    },
    {
      icon: Shield,
      title: t?.prebuiltStoresExtended?.features?.secureReliable?.title || "Secure & Reliable",
      description: t?.prebuiltStoresExtended?.features?.secureReliable?.description || "SSL certificates, secure payments, and 99.9% uptime guaranteed"
    },
    {
      icon: TrendingUp,
      title: t?.prebuiltStoresExtended?.features?.builtConvert?.title || "Conversion Optimized",
      description: t?.prebuiltStoresExtended?.features?.builtConvert?.description || "Designed with proven sales psychology and user experience principles"
    },
    {
      icon: Clock,
      title: t?.prebuiltStoresExtended?.features?.support247?.title || "24/7 Support",
      description: t?.prebuiltStoresExtended?.features?.support247?.description || "Round-the-clock technical support and business guidance"
    }
  ]

  const templates = [
    { 
      name: t?.prebuiltStoresExtended?.templates?.fashion?.name || "Fashion & Apparel", 
      products: t?.prebuiltStoresExtended?.templates?.fashion?.products || "Clothing, accessories, jewelry, footwear" 
    },
    { 
      name: t?.prebuiltStoresExtended?.templates?.healthBeauty?.name || "Health & Wellness", 
      products: t?.prebuiltStoresExtended?.templates?.healthBeauty?.products || "Supplements, fitness gear, beauty products" 
    },
    { 
      name: t?.prebuiltStoresExtended?.templates?.electronics?.name || "Electronics", 
      products: t?.prebuiltStoresExtended?.templates?.electronics?.products || "Gadgets, accessories, smart home devices" 
    },
    { 
      name: t?.prebuiltStoresExtended?.templates?.homeLiving?.name || "Home & Garden", 
      products: t?.prebuiltStoresExtended?.templates?.homeLiving?.products || "Furniture, decor, tools, outdoor equipment" 
    },
    { 
      name: t?.prebuiltStoresExtended?.templates?.foodBeverage?.name || "Food & Beverage", 
      products: t?.prebuiltStoresExtended?.templates?.foodBeverage?.products || "Gourmet foods, drinks, kitchen accessories" 
    },
    { 
      name: t?.prebuiltStoresExtended?.templates?.digitalProducts?.name || "Digital Products", 
      products: t?.prebuiltStoresExtended?.templates?.digitalProducts?.products || "Courses, software, templates, subscriptions" 
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
              {t?.prebuiltStoresExtended?.badge || "PRE-BUILT E-COMMERCE STORES"}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              {t?.prebuiltStoresExtended?.mainTitle || "Your Business Needs a Home. And We Don't Build Digital Sheds."}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t?.prebuiltStoresExtended?.mainDescription || "Forget generic templates. We build premium e-commerce stores that sell from day one. Complete with inventory, payments, and everything you need to start making money immediately."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
                {t?.prebuiltStoresExtended?.seePricing || "View Pricing"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                {t?.prebuiltStoresExtended?.viewDemo || "See Store Demos"}
                <ShoppingBag className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.prebuiltStoresExtended?.pricingTitle || "Simple, Transparent Pricing"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.prebuiltStoresExtended?.pricingSubtitle || "Choose your perfect store package. No hidden fees, no monthly subscriptions. Just pay once and start selling."}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={plan.popular ? 'relative' : ''}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                      {t?.prebuiltStoresExtended?.mostPopular || "MOST POPULAR"}
                    </Badge>
                  </div>
                )}
                
                <Card className={`p-8 h-full ${plan.popular ? 'border-purple-500/50 shadow-xl' : 'border-border/50'} hover:shadow-2xl transition-all duration-300`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className={`text-4xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.setup}</p>
                    <p className="text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.popular ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90` : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => {
                      // Redirect to checkout/payment page
                      // For now, redirect to contact page with plan info
                      window.location.href = `/contact?plan=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.price)}`
                    }}
                  >
                    {t?.prebuiltStoresExtended?.buyNow || "Buy Now"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {t?.prebuiltStoresExtended?.guaranteeText || "All plans include free domain for 1 year • SSL certificate • 99.9% uptime guarantee"}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t?.prebuiltStoresExtended?.securePayment || "Secure payment"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t?.prebuiltStoresExtended?.moneyBack || "30-day money back"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t?.prebuiltStoresExtended?.instantSetup || "Instant setup"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.prebuiltStoresExtended?.templatesTitle || "Store Categories Available"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.prebuiltStoresExtended?.templatesSubtitle || "We've got proven templates for every industry. Each one optimized for sales and pre-loaded with winning products."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-indigo-500/20">
                  <Package className="h-8 w-8 text-indigo-500 mb-3" />
                  <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.products}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-12 w-12 text-indigo-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t?.prebuiltStoresExtended?.ctaTitle || "Ready to Start Selling Today?"}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t?.prebuiltStoresExtended?.ctaDescription || "Skip months of development. Get a professional store that's ready to take orders and start generating revenue immediately."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-lg px-8 py-6" asChild>
                <Link href="/leads?service=pre-built-store">
                  {t?.prebuiltStoresExtended?.startBuilding || "Get My Store Now"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  {t?.prebuiltStoresExtended?.questionsLetstalk || "Talk to Sales"}
                  <Globe className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}