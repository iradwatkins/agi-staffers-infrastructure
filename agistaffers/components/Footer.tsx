'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Languages,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'

export default function Footer() {
  const { language, setLanguage, t } = useLanguage()

  if (!t || !t.footer) {
    return null // Return null if translations aren't loaded yet
  }

  const footerLinks = {
    legal: [
      { name: t.footer.legal.privacy, href: '/privacy' },
      { name: t.footer.legal.terms, href: '/terms' },
      { name: t.footer.legal.cookies, href: '/cookies' }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ]

  return (
    <footer className="bg-secondary/20 border-t">
      {/* Newsletter Section */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                {t.footer.newsletter.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t.footer.newsletter.subtitle}
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t.footer.newsletter.placeholder}
                  className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                />
                <Button className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
                  {t.footer.newsletter.button}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto">

          {/* Bottom Bar */}
          <div className="pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-sm text-muted-foreground">
                {t.footer.copyright}
              </div>

              {/* Center section with Social Links, Legal Links */}
              <div className="flex items-center gap-6">
                {/* Social Links */}
                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label={social.label}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    )
                  })}
                </div>

                {/* Legal Links */}
                <div className="flex items-center gap-4 text-sm">
                  {footerLinks.legal.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  "bg-accent hover:bg-accent/80",
                  "text-sm font-medium"
                )}
                title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
              >
                <Languages className="h-4 w-4" />
                <span>{language === 'en' ? 'Español' : 'English'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}