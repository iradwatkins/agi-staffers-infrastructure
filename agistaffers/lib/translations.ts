export interface Translation {
  // Navigation
  nav: {
    services: string;
    features: string;
    pricing: string;
    dashboard: string;
  };
  
  // Hero Section
  hero: {
    badge: string;
    title: {
      part1: string;
      part2: string;
    };
    description: string;
    primaryButton: string;
    secondaryButton: string;
    scrollText: string;
  };
  
  // Features Section
  features: {
    title: string;
    subtitle: string;
    items: {
      aiIntegration: {
        title: string;
        description: string;
      };
      aiSearchSeo: {
        title: string;
        description: string;
      };
      fullAutomation: {
        title: string;
        description: string;
      };
    };
  };
  
  // Services Section
  services: {
    title: string;
    subtitle: string;
    items: {
      modernTechStack: {
        title: string;
        description: string;
      };
      securityFirst: {
        title: string;
        description: string;
      };
      readyForDevelopment: {
        title: string;
        description: string;
      };
      beautifulDesign: {
        title: string;
        description: string;
      };
      analyticsMonitoring: {
        title: string;
        description: string;
      };
      aiIntegration: {
        title: string;
        description: string;
      };
    };
  };
  
  // CTA Section
  cta: {
    title: {
      part1: string;
      part2: string;
    };
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
  };
  
  // Footer
  footer: {
    tagline: string;
    copyright: string;
  };
  
  // Interactive Features
  interactive: {
    aiChatbot: string;
    autoContent: string;
    smartForms: string;
    claudeRanking: string;
    perplexityScore: string;
    deploy: string;
    database: string;
    monitor: string;
    secure: string;
    active: string;
    running: string;
    live: string;
  };
}

export const translations: Record<string, Translation> = {
  en: {
    nav: {
      services: "Services",
      features: "Features", 
      pricing: "Pricing",
      dashboard: "Dashboard"
    },
    hero: {
      badge: "AI-Powered Website Development",
      title: {
        part1: "Build Websites",
        part2: "with AI Magic"
      },
      description: "We create powerful, automated websites with AI integration and SEO optimization for modern search engines like Claude, Perplexity, and ChatGPT.",
      primaryButton: "Create Your Website",
      secondaryButton: "Watch Demo",
      scrollText: "Scroll to explore"
    },
    features: {
      title: "Why Choose AGI Staffers?",
      subtitle: "We combine cutting-edge AI technology with proven web development practices",
      items: {
        aiIntegration: {
          title: "AI Integration",
          description: "Native AI chatbots and intelligent automation"
        },
        aiSearchSeo: {
          title: "AI Search SEO",
          description: "Optimized for Claude, Perplexity, and ChatGPT"
        },
        fullAutomation: {
          title: "Full Automation",
          description: "Complete CI/CD pipeline and deployment"
        }
      }
    },
    services: {
      title: "Complete Website Solutions",
      subtitle: "Everything you need for a modern, AI-powered web presence",
      items: {
        modernTechStack: {
          title: "Modern Tech Stack",
          description: "Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL"
        },
        securityFirst: {
          title: "Security First",
          description: "Magic link authentication, secure deployment, and automated backups"
        },
        readyForDevelopment: {
          title: "Ready for Development",
          description: "GitHub integration, Cursor IDE ready, with full CI/CD pipeline"
        },
        beautifulDesign: {
          title: "Beautiful Design",
          description: "shadcn/ui components with Apple-like aesthetics and animations"
        },
        analyticsMonitoring: {
          title: "Analytics & Monitoring",
          description: "Real-time performance tracking and error monitoring with Sentry"
        },
        aiIntegration: {
          title: "AI Integration",
          description: "Native chatbots, content generation, and intelligent automation"
        }
      }
    },
    cta: {
      title: {
        part1: "Ready to Build Your",
        part2: "AI-Powered Website?"
      },
      subtitle: "Join the future of web development with automated, intelligent websites that rank on AI search engines.",
      primaryButton: "Get Started Today",
      secondaryButton: "Schedule Consultation"
    },
    footer: {
      tagline: "AI-powered website development and automation specialists",
      copyright: "© 2025 AGI Staffers. Building the future of intelligent websites."
    },
    interactive: {
      aiChatbot: "AI Chatbot",
      autoContent: "Auto Content", 
      smartForms: "Smart Forms",
      claudeRanking: "Claude AI Ranking",
      perplexityScore: "Perplexity Score",
      deploy: "Deploy",
      database: "Database",
      monitor: "Monitor",
      secure: "Secure",
      active: "Active",
      running: "Running",
      live: "Live"
    }
  },
  es: {
    nav: {
      services: "Servicios",
      features: "Características",
      pricing: "Precios", 
      dashboard: "Panel"
    },
    hero: {
      badge: "Desarrollo Web Impulsado por IA",
      title: {
        part1: "Construye Sitios Web",
        part2: "con Magia de IA"
      },
      description: "Creamos sitios web potentes y automatizados con integración de IA y optimización SEO para motores de búsqueda modernos como Claude, Perplexity y ChatGPT.",
      primaryButton: "Crear Tu Sitio Web",
      secondaryButton: "Ver Demo",
      scrollText: "Desplázate para explorar"
    },
    features: {
      title: "¿Por Qué Elegir AGI Staffers?",
      subtitle: "Combinamos tecnología de IA de vanguardia con prácticas probadas de desarrollo web",
      items: {
        aiIntegration: {
          title: "Integración de IA",
          description: "Chatbots de IA nativos y automatización inteligente"
        },
        aiSearchSeo: {
          title: "SEO para Búsqueda de IA",
          description: "Optimizado para Claude, Perplexity y ChatGPT"
        },
        fullAutomation: {
          title: "Automatización Completa",
          description: "Pipeline CI/CD completo y despliegue"
        }
      }
    },
    services: {
      title: "Soluciones Web Completas",
      subtitle: "Todo lo que necesitas para una presencia web moderna impulsada por IA",
      items: {
        modernTechStack: {
          title: "Stack Tecnológico Moderno",
          description: "Next.js, React, TypeScript, Tailwind CSS y PostgreSQL"
        },
        securityFirst: {
          title: "Seguridad Primero",
          description: "Autenticación por enlace mágico, despliegue seguro y copias de seguridad automatizadas"
        },
        readyForDevelopment: {
          title: "Listo para Desarrollo",
          description: "Integración con GitHub, preparado para Cursor IDE, con pipeline CI/CD completo"
        },
        beautifulDesign: {
          title: "Diseño Hermoso",
          description: "Componentes shadcn/ui con estética tipo Apple y animaciones"
        },
        analyticsMonitoring: {
          title: "Análisis y Monitoreo",
          description: "Seguimiento de rendimiento en tiempo real y monitoreo de errores con Sentry"
        },
        aiIntegration: {
          title: "Integración de IA",
          description: "Chatbots nativos, generación de contenido y automatización inteligente"
        }
      }
    },
    cta: {
      title: {
        part1: "¿Listo para Construir Tu",
        part2: "Sitio Web Impulsado por IA?"
      },
      subtitle: "Únete al futuro del desarrollo web con sitios web automatizados e inteligentes que se posicionan en motores de búsqueda de IA.",
      primaryButton: "Comienza Hoy",
      secondaryButton: "Programar Consulta"
    },
    footer: {
      tagline: "Especialistas en desarrollo web y automatización impulsada por IA",
      copyright: "© 2025 AGI Staffers. Construyendo el futuro de los sitios web inteligentes."
    },
    interactive: {
      aiChatbot: "Chatbot de IA",
      autoContent: "Contenido Auto",
      smartForms: "Formularios Inteligentes",
      claudeRanking: "Ranking de Claude IA",
      perplexityScore: "Puntuación Perplexity",
      deploy: "Desplegar",
      database: "Base de Datos",
      monitor: "Monitorear",
      secure: "Seguro",
      active: "Activo",
      running: "Ejecutándose",
      live: "En Vivo"
    }
  }
};