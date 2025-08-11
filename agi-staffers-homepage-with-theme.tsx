'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Bot, Globe, Rocket, Search, Shield, Zap, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function AGIStaffersHomepage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">AGI Staffers</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="mr-2"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Admin Dashboard
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            AI-Powered Website Development
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Websites with
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"> AI & Automation</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            We create powerful, automated websites with AI integration and SEO optimization for modern search engines like Claude, Perplexity, and ChatGPT.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg">
              Create Your Website
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              View Our Work
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AGI Staffers?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge AI technology with proven web development practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Bot className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Integration</CardTitle>
                <CardDescription>
                  Native AI chatbots, automation, and intelligent content generation built into every site
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-green-500/50 transition-colors">
              <CardHeader>
                <Search className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle>AI Search SEO</CardTitle>
                <CardDescription>
                  Optimized for Claude, Perplexity, ChatGPT, and other AI search engines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle>Full Automation</CardTitle>
                <CardDescription>
                  Complete deployment pipeline from development to production with CI/CD
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Complete Website Solutions</h2>
            <p className="text-xl text-muted-foreground">Everything you need for a modern, AI-powered web presence</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Globe className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Modern Tech Stack</h3>
                  <p className="text-muted-foreground">Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Security First</h3>
                  <p className="text-muted-foreground">Magic link authentication, secure deployment, and automated backups</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Rocket className="h-6 w-6 text-purple-500 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready for Development</h3>
                  <p className="text-muted-foreground">GitHub integration, Cursor IDE ready, with full CI/CD pipeline</p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-3" />
                    Complete React website with modern UI
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-3" />
                    PostgreSQL database setup
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-3" />
                    AI chatbot integration
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-3" />
                    SEO optimization for AI search
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-3" />
                    Automated deployment & monitoring
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-primary mr-3" />
                    Custom domain & SSL certificates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect plan for your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for small businesses</CardDescription>
                <div className="text-3xl font-bold text-primary">$499</div>
                <p className="text-sm text-muted-foreground">One-time setup + $29/month hosting</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Complete website setup</li>
                  <li>✓ AI chatbot integration</li>
                  <li>✓ Basic SEO optimization</li>
                  <li>✓ SSL certificate</li>
                  <li>✓ 30-day support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Professional</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="text-3xl font-bold text-primary">$999</div>
                <p className="text-sm text-muted-foreground">One-time setup + $59/month hosting</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Everything in Starter</li>
                  <li>✓ Advanced AI automation</li>
                  <li>✓ Full SEO optimization</li>
                  <li>✓ Analytics dashboard</li>
                  <li>✓ 90-day support</li>
                  <li>✓ Priority updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="text-3xl font-bold text-primary">Custom</div>
                <p className="text-sm text-muted-foreground">Tailored to your needs</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Everything in Professional</li>
                  <li>✓ Custom AI solutions</li>
                  <li>✓ Multi-site management</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ SLA guarantee</li>
                  <li>✓ White-label options</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/20 to-purple-500/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your AI-Powered Website?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of web development with automated, intelligent websites that rank on AI search engines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Bot className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold">AGI Staffers</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            AI-powered website development and automation specialists
          </p>
          <p className="text-muted-foreground text-sm">
            © 2025 AGI Staffers. Building the future of intelligent websites.
          </p>
        </div>
      </footer>
    </div>
  )
}