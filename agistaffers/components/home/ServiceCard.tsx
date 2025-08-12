'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  title: string
  subtitle: string
  description: string
  cta: string
  link: string
  icon: React.ElementType
  gradient: string
  index: number
}

export default function ServiceCard({
  title,
  subtitle,
  description,
  cta,
  link,
  icon: Icon,
  gradient,
  index
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={cn(
        "h-full border-border/50 bg-card/50 backdrop-blur",
        "hover:border-primary/50 transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/10"
      )}>
        <CardHeader>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
            "bg-gradient-to-br",
            gradient
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {description.split('.').slice(0, 2).join('.') + '.'}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" asChild className="w-full group">
            <Link href={link}>
              {cta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}