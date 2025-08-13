'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Plane,
  Target,
  Users,
  Lightbulb,
  Zap,
  Shield,
  TrendingUp,
  Heart
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'

export default function AboutPage() {
  const { language, t } = useLanguage()

  const values = [
    {
      icon: Target,
      title: language === 'en' ? 'Do More With Less' : 'Hacer Más Con Menos',
      description: language === 'en' 
        ? 'Our core philosophy: eliminate busywork and focus on what truly matters for your business growth.'
        : 'Nuestra filosofía central: eliminar el trabajo innecesario y enfocarse en lo que realmente importa para el crecimiento de tu negocio.'
    },
    {
      icon: Zap,
      title: language === 'en' ? 'Empower Solo Entrepreneurs' : 'Empoderar Emprendedores Individuales',
      description: language === 'en'
        ? 'We believe one person can run a multi-million dollar company. We provide the AI tools to make it happen.'
        : 'Creemos que una persona puede dirigir una empresa multimillonaria. Proporcionamos las herramientas de IA para hacerlo realidad.'
    },
    {
      icon: Heart,
      title: language === 'en' ? 'Your Freedom First' : 'Tu Libertad Primero',
      description: language === 'en'
        ? 'Technology should give you more time and freedom, not chain you to more work. That\'s our promise.'
        : 'La tecnología debería darte más tiempo y libertad, no encadenarte a más trabajo. Esa es nuestra promesa.'
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: language === 'en' ? 'The Spark' : 'La Chispa',
      description: language === 'en' 
        ? 'Former airmen realized the business world had the same inefficiencies as military bureaucracy.'
        : 'Ex-aviadores se dieron cuenta de que el mundo empresarial tenía las mismas ineficiencias que la burocracia militar.'
    },
    {
      year: '2021',
      title: language === 'en' ? 'First AI Assistant' : 'Primer Asistente de IA',
      description: language === 'en'
        ? 'Built our first AI staffer that automated 80% of customer service tasks for a small business.'
        : 'Construimos nuestro primer asistente de IA que automatizó el 80% de las tareas de servicio al cliente para una pequeña empresa.'
    },
    {
      year: '2022',
      title: language === 'en' ? 'Going Full-Time' : 'Tiempo Completo',
      description: language === 'en'
        ? 'Demand grew so fast we had to choose: keep our day jobs or help more entrepreneurs. Easy choice.'
        : 'La demanda creció tan rápido que tuvimos que elegir: mantener nuestros trabajos diarios o ayudar a más emprendedores. Elección fácil.'
    },
    {
      year: '2023',
      title: language === 'en' ? 'The Singlepreneur Vision' : 'La Visión del Emprendedor Individual',
      description: language === 'en'
        ? 'Launched our complete platform: AI assistants, automation tools, and custom websites in one package.'
        : 'Lanzamos nuestra plataforma completa: asistentes de IA, herramientas de automatización y sitios web personalizados en un paquete.'
    },
    {
      year: '2024',
      title: language === 'en' ? 'Global Impact' : 'Impacto Global',
      description: language === 'en'
        ? 'Now helping entrepreneurs in 15+ countries build businesses that run themselves.'
        : 'Ahora ayudamos a emprendedores en más de 15 países a construir negocios que se ejecutan por sí mismos.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
              <Plane className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Our Story' : 'Nuestra Historia'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {language === 'en' ? (
                <>From <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Airmen</span> to AGI STAFFERS</>
              ) : (
                <>De <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Aviadores</span> a AGI STAFFERS</>
              )}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-secondary/20 rounded-2xl p-8 mb-12">
              <p className="text-lg leading-relaxed mb-6">
                {language === 'en' ? (
                  <>Ever heard the old military joke? <strong>"How many airmen does it take to write a report?"</strong> The punchline: One to find a pencil, one to sharpen it, one to grab the paper, and one to actually write the thing.</>
                ) : (
                  <>¿Has escuchado la vieja broma militar? <strong>"¿Cuántos aviadores se necesitan para escribir un reporte?"</strong> El chiste: Uno para encontrar un lápiz, uno para afilarlo, uno para agarrar el papel, y uno para escribir la cosa.</>
                )}
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                {language === 'en' ? (
                  <>It's a perfect example of a system with way more people than it needs. When we started AGI STAFFERS, that joke was our unofficial motto. We saw the world was full of businesses doing things the "hard way," with too many people and too much busywork. We decided to do something about it.</>
                ) : (
                  <>Es un ejemplo perfecto de un sistema con muchas más personas de las que necesita. Cuando comenzamos AGI STAFFERS, esa broma era nuestro lema no oficial. Vimos que el mundo estaba lleno de empresas haciendo las cosas de "la manera difícil", con demasiadas personas y demasiado trabajo innecesario. Decidimos hacer algo al respecto.</>
                )}
              </p>

              <div className="text-center my-8">
                <div className="inline-block bg-gradient-to-r from-primary to-purple-500 text-white px-6 py-3 rounded-full text-xl font-bold">
                  {language === 'en' ? 'We built this company on a single, rebellious idea: do more with less.' : 'Construimos esta empresa en una sola idea rebelde: hacer más con menos.'}
                </div>
              </div>

              <p className="text-lg leading-relaxed mb-6">
                {language === 'en' ? (
                  <>Today, we're living in the time of the singlepreneur. It's a world where one person can run a multi-million-dollar company from their phone. Imagine sitting on a beach, your company running 100% on its own, with an AI assistant handling all the billing and a custom agent notifying you of every key event. That's the dream we're selling—and building.</>
                ) : (
                  <>Hoy, estamos viviendo en la era del emprendedor individual. Es un mundo donde una persona puede dirigir una empresa multimillonaria desde su teléfono. Imagina sentarte en una playa, tu empresa funcionando 100% por sí sola, con un asistente de IA manejando toda la facturación y un agente personalizado notificándote de cada evento clave. Ese es el sueño que estamos vendiendo—y construyendo.</>
                )}
              </p>

              <p className="text-lg leading-relaxed mb-6">
                {language === 'en' ? (
                  <>We created AGI STAFFERS to bring this agentic AI to the common person. To give you the tools, the websites, and the "staffers" you need to build your business from scratch, all on your own terms.</>
                ) : (
                  <>Creamos AGI STAFFERS para llevar esta IA agéntica a la persona común. Para darte las herramientas, los sitios web y los "empleados" que necesitas para construir tu negocio desde cero, todo en tus propios términos.</>
                )}
              </p>

              <p className="text-lg leading-relaxed font-semibold text-primary">
                {language === 'en' ? (
                  <>This isn't about replacing people. It's about empowering you to be limitless. We're here to put the solo entrepreneur back in the driver's seat.</>
                ) : (
                  <>Esto no se trata de reemplazar personas. Se trata de empoderarte para ser ilimitado. Estamos aquí para poner al emprendedor individual de vuelta en el asiento del conductor.</>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              {language === 'en' ? 'Our Core Values' : 'Nuestros Valores Fundamentales'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === 'en' 
                ? 'The principles that guide everything we build'
                : 'Los principios que guían todo lo que construimos'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="p-8 h-full text-center hover:shadow-xl transition-all duration-300">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              {language === 'en' ? 'Our Journey' : 'Nuestro Viaje'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === 'en' 
                ? 'How we got from military paperwork to AI automation'
                : 'Cómo pasamos del papeleo militar a la automatización con IA'
              }
            </p>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <Card className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-xl font-bold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </Card>
                </div>
                <div className="hidden md:block">
                  <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              {language === 'en' ? (
                <>Ready to Join the <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Revolution?</span></>
              ) : (
                <>¿Listo para Unirte a la <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Revolución?</span></>
              )}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Stop dreaming about freedom and start building it. Let us show you how AI can transform your business.'
                : 'Deja de soñar con la libertad y comienza a construirla. Déjanos mostrarte cómo la IA puede transformar tu negocio.'
              }
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg px-8 py-6" asChild>
              <Link href="/leads">
                {language === 'en' ? 'Start Your Journey' : 'Comienza Tu Viaje'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}