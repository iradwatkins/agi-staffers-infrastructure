'use client'

// Remove force-dynamic as we want static generation to work

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowRight, 
  Workflow, 
  Zap, 
  Clock, 
  DollarSign, 
  RefreshCw, 
  CheckCircle,
  Sparkles,
  GitBranch,
  Settings,
  Cpu,
  Database,
  Mail,
  Calendar,
  FileText,
  Users
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function WorkflowAutomationPage() {
  const { language, t } = useLanguage()
  
  const automations = [
    {
      icon: Mail,
      title: t?.workflowAutomationExtended?.automationTypes?.emailCommunication?.title || "Email Automation",
      description: t?.workflowAutomationExtended?.automationTypes?.emailCommunication?.description || "Streamline your email campaigns and responses",
      examples: t?.workflowAutomationExtended?.automationTypes?.emailCommunication?.examples || ["Automated welcome sequences", "Lead nurturing campaigns", "Customer support responses", "Newsletter automation"]
    },
    {
      icon: Calendar,
      title: t?.workflowAutomationExtended?.automationTypes?.schedulingCalendar?.title || "Scheduling Automation",
      description: t?.workflowAutomationExtended?.automationTypes?.schedulingCalendar?.description || "Never miss an appointment or deadline again",
      examples: t?.workflowAutomationExtended?.automationTypes?.schedulingCalendar?.examples || ["Automatic booking confirmations", "Meeting reminders", "Calendar synchronization", "Task scheduling"]
    },
    {
      icon: FileText,
      title: t?.workflowAutomationExtended?.automationTypes?.documentProcessing?.title || "Document Processing",
      description: t?.workflowAutomationExtended?.automationTypes?.documentProcessing?.description || "Automate document creation and management",
      examples: t?.workflowAutomationExtended?.automationTypes?.documentProcessing?.examples || ["Invoice generation", "Report compilation", "Contract processing", "Data extraction"]
    },
    {
      icon: Database,
      title: t?.workflowAutomationExtended?.automationTypes?.dataManagement?.title || "Data Management",
      description: t?.workflowAutomationExtended?.automationTypes?.dataManagement?.description || "Keep your data organized and accessible",
      examples: t?.workflowAutomationExtended?.automationTypes?.dataManagement?.examples || ["CRM updates", "Inventory tracking", "Customer data sync", "Analytics reporting"]
    }
  ]

  const benefits = [
    {
      metric: "Time Saved",
      value: "73%",
      description: "Average time reduction on repetitive tasks"
    },
    {
      metric: "Error Reduction",
      value: "95%",
      description: "Fewer mistakes with automated processes"
    },
    {
      metric: "Cost Savings",
      value: "$50K+",
      description: "Annual savings from automation"
    },
    {
      metric: "Processing Speed",
      value: "10x",
      description: "Faster task completion"
    }
  ]

  const process = [
    {
      number: "01",
      title: t?.workflowAutomationExtended?.process?.mapWorkflows?.title || "Analysis & Planning",
      description: t?.workflowAutomationExtended?.process?.mapWorkflows?.description || "We analyze your current workflows and identify automation opportunities"
    },
    {
      number: "02",
      title: t?.workflowAutomationExtended?.process?.designBuild?.title || "Design & Strategy",
      description: t?.workflowAutomationExtended?.process?.designBuild?.description || "Create a custom automation strategy tailored to your business needs"
    },
    {
      number: "03",
      title: t?.workflowAutomationExtended?.process?.testOptimize?.title || "Implementation",
      description: t?.workflowAutomationExtended?.process?.testOptimize?.description || "Build and deploy your automated workflows with testing and optimization"
    },
    {
      number: "04",
      title: t?.workflowAutomationExtended?.process?.deployMonitor?.title || "Monitor & Optimize",
      description: t?.workflowAutomationExtended?.process?.deployMonitor?.description || "Continuously monitor performance and optimize for maximum efficiency"
    }
  ]

  const integrations = [
    "Slack", "Gmail", "Salesforce", "HubSpot", "Stripe", 
    "Shopify", "QuickBooks", "Zoom", "Google Sheets", "Notion"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-700 border-purple-500/20">
              {t?.workflowAutomationExtended?.badge || "WORKFLOW AUTOMATION"}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              {t?.workflowAutomationExtended?.mainTitle || "What if Your Busywork Just... Vanished? Poof. Gone."}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t?.workflowAutomationExtended?.mainDescription || "We eliminate the mind-numbing, soul-crushing tasks that eat your time. Let our AI handle the busywork while you focus on building your empire."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                {t?.workflowAutomationExtended?.automateWorkflow || "Automate My Workflow"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                {t?.workflowAutomationExtended?.seeExamples || "See Examples"}
                <Workflow className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {benefit.value}
                </div>
                <div className="text-lg font-semibold mt-2">{benefit.metric}</div>
                <div className="text-sm text-muted-foreground">{benefit.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Types of Automation We Master
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From email sequences that run themselves to data that organizes automatically. We turn your repetitive tasks into set-it-and-forget-it systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {automations.map((automation, index) => {
              const Icon = automation.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-purple-500/20">
                    <div className="flex items-start gap-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{automation.title}</h3>
                        <p className="text-muted-foreground mb-4">{automation.description}</p>
                        <div className="space-y-2">
                          {automation.examples.map((example, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-purple-500" />
                              <span className="text-sm">{example}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t?.workflowAutomationExtended?.processTitle || "How We Eliminate Your Busywork"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t?.workflowAutomationExtended?.processSubtitle || "Four steps to freedom. We identify what's stealing your time, design the perfect automation, and watch your productivity soar."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl font-black text-purple-500/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {t?.workflowAutomationExtended?.integrationsTitle || "Seamless Integrations"}
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                {t?.workflowAutomationExtended?.integrationsDescription || "We connect with the tools you already use. No forced migrations, no learning new systems. Just seamless automation."}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <GitBranch className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Universal Compatibility</h3>
                    <p className="text-muted-foreground">
                      Works with 500+ popular business tools. If you use it, we can automate it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Settings className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Smart Configuration</h3>
                    <p className="text-muted-foreground">
                      AI-powered setup that learns your workflow and suggests optimal automations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="p-4 text-center hover:shadow-lg transition-all duration-300 border-border/50 hover:border-purple-500/20">
                      <span className="font-semibold">{integration}</span>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">Your Time Back. Calculated.</h2>
                <p className="text-muted-foreground">See what automation could save you every month</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-purple-500" />
                    <span className="font-semibold">Hours Saved Weekly</span>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-700 text-lg px-4 py-2">25+</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    <span className="font-semibold">Monthly Cost Savings</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-700 text-lg px-4 py-2">$8,500</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    <span className="font-semibold">Tasks Automated</span>
                  </div>
                  <Badge className="bg-yellow-500/10 text-yellow-700 text-lg px-4 py-2">150+</Badge>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                  Calculate My Savings
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Get Your Time Back?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop doing what software can do better. Start automation today and watch your productivity skyrocket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-lg px-8 py-6" asChild>
                <Link href="/leads?service=workflow-automation">
                  Start My Automation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  See Demo
                  <RefreshCw className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}