import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Bot, Globe, Rocket, Search, Shield, Zap } from 'lucide-react'

export default function AGIStaffersHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">AGI Staffers</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-slate-300 hover:text-white transition-colors">Services</a>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                Admin Dashboard
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-400/20">
            AI-Powered Website Development
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Websites with
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> AI & Automation</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            We create powerful, automated websites with AI integration and SEO optimization for modern search engines like Claude, Perplexity, and ChatGPT.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg">
              Create Your Website
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
              View Our Work
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose AGI Staffers?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with proven web development practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-blue-400/50 transition-colors">
              <CardHeader>
                <Bot className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">AI Integration</CardTitle>
                <CardDescription className="text-slate-400">
                  Native AI chatbots, automation, and intelligent content generation built into every site
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-green-400/50 transition-colors">
              <CardHeader>
                <Search className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">AI Search SEO</CardTitle>
                <CardDescription className="text-slate-400">
                  Optimized for Claude, Perplexity, ChatGPT, and other AI search engines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 hover:border-purple-400/50 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Full Automation</CardTitle>
                <CardDescription className="text-slate-400">
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
            <h2 className="text-4xl font-bold text-white mb-4">Complete Website Solutions</h2>
            <p className="text-xl text-slate-300">Everything you need for a modern, AI-powered web presence</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Globe className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Modern Tech Stack</h3>
                  <p className="text-slate-400">Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 text-green-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Security First</h3>
                  <p className="text-slate-400">Magic link authentication, secure deployment, and automated backups</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Rocket className="h-6 w-6 text-purple-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ready for Development</h3>
                  <p className="text-slate-400">GitHub integration, Cursor IDE ready, with full CI/CD pipeline</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-400/20">
              <h3 className="text-2xl font-bold text-white mb-4">What's Included</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                  Complete React website with modern UI
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                  PostgreSQL database setup
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                  AI chatbot integration
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                  SEO optimization for AI search
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                  Automated deployment & monitoring
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-400 mr-3" />
                  Custom domain & SSL certificates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your AI-Powered Website?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the future of web development with automated, intelligent websites that rank on AI search engines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-400 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 border-t border-slate-700">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Bot className="h-8 w-8 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">AGI Staffers</h3>
          </div>
          <p className="text-slate-400 mb-4">
            AI-powered website development and automation specialists
          </p>
          <p className="text-slate-500 text-sm">
            © 2025 AGI Staffers. Building the future of intelligent websites.
          </p>
        </div>
      </footer>
    </div>
  )
}