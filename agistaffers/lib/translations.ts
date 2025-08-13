export interface Translation {
  // Navigation
  nav: {
    services: string;
    features: string;
    pricing: string;
    dashboard: string;
    needWebsite: string;
    prebuiltStores: string;
    customWebsites: string;
    company: string;
    ourStory: string;
    about: string;
    contact: string;
    careers: string;
    customerLogin: string;
    aiAssistants: string;
    workflowAutomation: string;
    contentSeo: string;
    promptEngineering: string;
  };
  
  // SEO Page
  seoPageExtended: {
    badge: string;
    mainTitle: string;
    mainDescription: string;
    viewCaseStudies: string;
    services: {
      aiSearch: {
        title: string;
        description: string;
        features: string[];
      };
      traditionalSeo: {
        title: string;
        description: string;
        features: string[];
      };
      contentIntelligence: {
        title: string;
        description: string;
        features: string[];
      };
      performanceAnalytics: {
        title: string;
        description: string;
        features: string[];
      };
    };
    whyDifferentTitle: string;
    whyDifferent: {
      aiFirst: {
        title: string;
        description: string;
      };
      precisionTargeting: {
        title: string;
        description: string;
      };
      speedImplementation: {
        title: string;
        description: string;
      };
    };
    ctaTitle: string;
    ctaDescription: string;
    getAudit: string;
    scheduleCall: string;
  };
  
  // AI Assistants Extended
  aiAssistantsExtended: {
    badge: string;
    mainTitle: string;
    mainSubtitle: string;
    mainDescription: string;
    deployTeam: string;
    seeAction: string;
    assistantTypes: {
      customerSupport: {
        title: string;
        description: string;
        features: string[];
      };
      salesAssistant: {
        title: string;
        description: string;
        features: string[];
      };
      knowledgeBase: {
        title: string;
        description: string;
        features: string[];
      };
      socialMedia: {
        title: string;
        description: string;
        features: string[];
      };
    };
    benefitsTitle: string;
    benefitsSubtitle: string;
    benefits: {
      available247: {
        title: string;
        description: string;
      };
      instantResponse: {
        title: string;
        description: string;
      };
      unlimitedScale: {
        title: string;
        description: string;
      };
      alwaysConsistent: {
        title: string;
        description: string;
      };
    };
    howItWorksTitle: string;
    process: {
      shareKnowledge: {
        title: string;
        description: string;
      };
      customizeTrain: {
        title: string;
        description: string;
      };
      deployScale: {
        title: string;
        description: string;
      };
    };
    ctaTitle: string;
    ctaDescription: string;
    startProject: string;
    talkExpert: string;
  };
  
  // Workflow Automation Extended
  workflowAutomationExtended: {
    badge: string;
    mainTitle: string;
    mainDescription: string;
    automateWorkflow: string;
    seeExamples: string;
    automationTypes: {
      emailCommunication: {
        title: string;
        description: string;
        examples: string[];
      };
      schedulingCalendar: {
        title: string;
        description: string;
        examples: string[];
      };
      documentProcessing: {
        title: string;
        description: string;
        examples: string[];
      };
      dataManagement: {
        title: string;
        description: string;
        examples: string[];
      };
    };
    processTitle: string;
    processSubtitle: string;
    process: {
      mapWorkflows: {
        title: string;
        description: string;
      };
      designBuild: {
        title: string;
        description: string;
      };
      testOptimize: {
        title: string;
        description: string;
      };
      deployMonitor: {
        title: string;
        description: string;
      };
    };
    integrationsTitle: string;
    integrationsDescription: string;
    integrations: {
      thousandPlus: {
        title: string;
        description: string;
      };
      customApis: {
        title: string;
        description: string;
      };
    };
    roiTitle: string;
    roiSubtitle: string;
    calculateRoi: string;
    ctaTitle: string;
    ctaDescription: string;
    startAutomating: string;
    bookDemo: string;
  };
  
  // Prompt Engineering Extended
  promptEngineeringExtended: {
    badge: string;
    mainTitle: string;
    mainDescription: string;
    servicesTitle: string;
    servicesSubtitle: string;
    services: {
      customTraining: {
        title: string;
        description: string;
      };
      promptOptimization: {
        title: string;
        description: string;
      };
      workflowIntegration: {
        title: string;
        description: string;
      };
      responseFineTuning: {
        title: string;
        description: string;
      };
    };
    useCasesTitle: string;
    useCasesDescription: string;
    useCases: string[];
    beforeAfterTitle: string;
    genericResponse: string;
    customResponse: string;
    formTitle: string;
    formDescription: string;
    formLabels: {
      name: string;
      email: string;
      company: string;
      message: string;
      messagePlaceholder: string;
    };
    formButton: string;
    formNote: string;
    finalCtaTitle: string;
    finalCtaDescription: string;
  };
  
  // Pre-built Stores Extended
  prebuiltStoresExtended: {
    badge: string;
    mainTitle: string;
    mainDescription: string;
    seePricing: string;
    viewDemo: string;
    features: {
      launch48: {
        title: string;
        description: string;
      };
      secureReliable: {
        title: string;
        description: string;
      };
      builtConvert: {
        title: string;
        description: string;
      };
      support247: {
        title: string;
        description: string;
      };
    };
    pricingTitle: string;
    pricingSubtitle: string;
    plans: {
      starter: {
        name: string;
        setup: string;
        description: string;
      };
      growth: {
        name: string;
        setup: string;
        description: string;
      };
      enterprise: {
        name: string;
        setup: string;
        description: string;
      };
    };
    mostPopular: string;
    buyNow: string;
    templatesTitle: string;
    templatesSubtitle: string;
    templates: {
      fashion: { name: string; products: string; };
      healthBeauty: { name: string; products: string; };
      electronics: { name: string; products: string; };
      homeLiving: { name: string; products: string; };
      foodBeverage: { name: string; products: string; };
      digitalProducts: { name: string; products: string; };
    };
    ctaTitle: string;
    ctaDescription: string;
    startBuilding: string;
    questionsLetstalk: string;
  };
  
  // Service Pages
  seoPage: {
    title: string;
    subtitle: string;
    description: string;
    formTitle: string;
    formSubtitle: string;
    formButton: string;
    features: {
      aiOptimization: {
        title: string;
        description: string;
      };
      technicalSeo: {
        title: string;
        description: string;
      };
      contentStrategy: {
        title: string;
        description: string;
      };
      performanceTracking: {
        title: string;
        description: string;
      };
    };
  };
  
  aiAssistants: {
    title: string;
    subtitle: string;
    description: string;
    formTitle: string;
    formSubtitle: string;
    formButton: string;
    features: {
      customChatbots: {
        title: string;
        description: string;
      };
      voiceAssistants: {
        title: string;
        description: string;
      };
      processAutomation: {
        title: string;
        description: string;
      };
      dataAnalysis: {
        title: string;
        description: string;
      };
    };
  };
  
  workflowAutomation: {
    title: string;
    subtitle: string;
    description: string;
    formTitle: string;
    formSubtitle: string;
    formButton: string;
    features: {
      taskAutomation: {
        title: string;
        description: string;
      };
      integrations: {
        title: string;
        description: string;
      };
      workflows: {
        title: string;
        description: string;
      };
      monitoring: {
        title: string;
        description: string;
      };
    };
  };
  
  promptEngineering: {
    title: string;
    subtitle: string;
    description: string;
    formTitle: string;
    formSubtitle: string;
    formButton: string;
    features: {
      optimization: {
        title: string;
        description: string;
      };
      testing: {
        title: string;
        description: string;
      };
      library: {
        title: string;
        description: string;
      };
      training: {
        title: string;
        description: string;
      };
    };
  };
  
  prebuiltStores: {
    title: string;
    subtitle: string;
    description: string;
    pricing: {
      basic: {
        name: string;
        price: string;
        description: string;
        features: string[];
      };
      professional: {
        name: string;
        price: string;
        description: string;
        features: string[];
      };
      enterprise: {
        name: string;
        price: string;
        description: string;
        features: string[];
      };
    };
  };
  
  customWebsitesExtended: {
    badge: string;
    mainTitle: string;
    mainDescription: string;
    capabilitiesTitle: string;
    capabilitiesDescription: string;
    capabilities: {
      customDesign: {
        title: string;
        description: string;
      };
      advancedDev: {
        title: string;
        description: string;
      };
      mobileFirst: {
        title: string;
        description: string;
      };
      analytics: {
        title: string;
        description: string;
      };
    };
    projectTypesTitle: string;
    projectTypesDescription: string;
    projectTypes: string[];
    processTitle: string;
    process: {
      discovery: {
        step: string;
        description: string;
      };
      design: {
        step: string;
        description: string;
      };
      development: {
        step: string;
        description: string;
      };
      launch: {
        step: string;
        description: string;
      };
    };
    formTitle: string;
    formDescription: string;
    formLabels: {
      name: string;
      email: string;
      company: string;
      budget: string;
      timeline: string;
      description: string;
      budgetPlaceholder: string;
      timelinePlaceholder: string;
      budgetOptions: {
        range1: string;
        range2: string;
        range3: string;
        range4: string;
      };
      timelineOptions: {
        asap: string;
        month1: string;
        months2to3: string;
        months3to6: string;
      };
      placeholders: {
        name: string;
        email: string;
        company: string;
        description: string;
      };
    };
    formButton: string;
    formNote: string;
    finalCtaTitle: string;
    finalCtaDescription: string;
  };
  
  customWebsites: {
    title: string;
    subtitle: string;
    description: string;
    formTitle: string;
    formSubtitle: string;
    formButton: string;
    features: {
      customDesign: {
        title: string;
        description: string;
      };
      scalability: {
        title: string;
        description: string;
      };
      performance: {
        title: string;
        description: string;
      };
      support: {
        title: string;
        description: string;
      };
    };
  };
  
  contactExtended: {
    badge: string;
    mainTitle: string;
    mainDescription: string;
    contactInfo: {
      address: {
        title: string;
        content: string;
        description: string;
      };
      email: {
        title: string;
        content: string;
        description: string;
      };
      phone: {
        title: string;
        content: string;
        description: string;
      };
      whatsapp: {
        title: string;
        content: string;
        description: string;
        chatNow: string;
      };
    };
    form: {
      title: string;
      description: string;
      labels: {
        name: string;
        email: string;
        phone: string;
        company: string;
        services: string;
        budget: string;
        message: string;
        budgetPlaceholder: string;
        budgetOptions: {
          under1k: string;
          range1to5k: string;
          range5to10k: string;
          range10to25k: string;
          range25kplus: string;
        };
        placeholders: {
          name: string;
          email: string;
          phone: string;
          company: string;
          message: string;
        };
      };
      services: {
        seo: string;
        aiAssistants: string;
        workflow: string;
        prompt: string;
        prebuilt: string;
        custom: string;
      };
      button: string;
      privacyNote: string;
    };
    faqs: {
      title: string;
      description: string;
      questions: {
        howQuickly: {
          question: string;
          answer: string;
        };
        paymentPlans: {
          question: string;
          answer: string;
        };
        satisfaction: {
          question: string;
          answer: string;
        };
        support: {
          question: string;
          answer: string;
        };
      };
      readyToStart: {
        title: string;
        description: string;
        button: string;
      };
    };
    finalCta: {
      title: string;
      description: string;
    };
  };
  
  contact: {
    title: string;
    subtitle: string;
    addressTitle: string;
    address: string;
    emailTitle: string;
    email: string;
    phoneTitle: string;
    phone: string;
    whatsappTitle: string;
    whatsapp: string;
    formTitle: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formButton: string;
  };
  
  // Common form fields
  forms: {
    name: string;
    email: string;
    company: string;
    website: string;
    message: string;
    projectType: string;
    budget: string;
    timeline: string;
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
  
  // Hero Banners
  heroBanners: {
    aiAssistants: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    workflowAutomation: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    seo: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    promptEngineering: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    websites: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
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
    description: string;
    location: string;
    servicesTitle: string;
    websitesTitle: string;
    companyTitle: string;
    legalTitle: string;
    newsletter: {
      title: string;
      subtitle: string;
      placeholder: string;
      button: string;
    };
    services: {
      seo: string;
      aiAssistants: string;
      workflow: string;
      prompt: string;
    };
    websites: {
      prebuilt: string;
      custom: string;
    };
    company: {
      about: string;
      contact: string;
      blog: string;
      careers: string;
    };
    legal: {
      privacy: string;
      terms: string;
      cookies: string;
    };
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

  // Login Pages
  loginPage?: {
    welcomeBack: string;
    signInDescription: string;
    signInWithGoogle: string;
    signingInWithGoogle: string;
    orContinueWithEmail: string;
    emailAddress: string;
    emailPlaceholder: string;
    passwordlessSignIn: string;
    passwordlessDescription: string;
    sendMagicLink: string;
    sendingMagicLink: string;
    checkYourEmail: string;
    magicLinkSent: string;
    clickLinkInEmail: string;
    didntReceiveEmail: string;
    tryAgain: string;
    invalidEmail: string;
    unexpectedError: string;
  };

  adminLoginPage?: {
    adminPortal: string;
    adminSignInDescription: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    rememberMe: string;
    twoFactorCode: string;
    twoFactorPlaceholder: string;
    signIn: string;
    signingIn: string;
    adminAccessOnly: string;
    customerLoginAt: string;
    invalidCredentials: string;
  };

}

export const translations: Record<string, Translation> = {
  en: {
    nav: {
      services: "Services",
      features: "Features", 
      pricing: "Pricing",
      dashboard: "Dashboard",
      needWebsite: "Need a Website?",
      prebuiltStores: "Pre-built Stores",
      customWebsites: "Custom Websites",
      company: "Company",
      ourStory: "Our Story",
      about: "About Us",
      contact: "Contact Us",
      careers: "Careers",
      customerLogin: "Login",
      aiAssistants: "AI Assistants",
      workflowAutomation: "AI Automation",
      contentSeo: "AI SEO",
      promptEngineering: "Custom Prompts"
    },
    seoPageExtended: {
      badge: "SEO THAT ACTUALLY WORKS",
      mainTitle: "Don't Just Be Found. Be the First Thing They Talk About.",
      mainDescription: "We make sure your voice cuts through the noise. Our AI doesn't just help you rank on Google, we make sure ChatGPT and Perplexity are quoting you like gospel.",
      servicesTitle: "SEO Services That Deliver Results", 
      servicesDescription: "We combine traditional SEO mastery with cutting-edge AI optimization. Your competition is still figuring out ChatGPT while you're already ranking in it.",
      processTitle: "Our Battle-Tested Process",
      processDescription: "Four steps to search domination. No fluff, just results.",
      process: {
        audit: {
          title: "Deep Dive Audit",
          description: "We analyze your current presence across traditional and AI search platforms."
        },
        strategy: {
          title: "Strategy Blueprint", 
          description: "Custom roadmap targeting both Google rankings and AI model citations."
        },
        content: {
          title: "Content Domination",
          description: "Create and optimize content that search engines and AI models can't ignore."
        },
        optimize: {
          title: "Scale & Optimize",
          description: "Continuously improve rankings while expanding your digital footprint."
        }
      },
      results: {
        traffic: {
          metric: "Average Traffic Increase",
          timeframe: "in 6 months"
        },
        citations: {
          metric: "AI Search Citations", 
          timeframe: "more mentions"
        },
        rankings: {
          metric: "First Page Rankings",
          timeframe: "of keywords"
        },
        roi: {
          metric: "ROI Average",
          timeframe: "return on investment"
        }
      },
      guaranteeText: "All plans include free domain for 1 year • SSL certificate • 99.9% uptime guarantee",
      securePayment: "Secure payment", 
      moneyBack: "30-day money back",
      instantSetup: "Instant setup",
      viewCaseStudies: "View Case Studies",
      services: {
        aiSearch: {
          title: "AI Search Optimization",
          description: "Get quoted by ChatGPT, Claude, and Perplexity. We optimize your content for AI-powered search engines.",
          features: ["AI snippet optimization", "LLM training data inclusion", "Conversational search ranking"]
        },
        traditionalSeo: {
          title: "Traditional SEO Mastery",
          description: "Dominate Google with battle-tested strategies. First page rankings that actually convert.",
          features: ["Keyword research & strategy", "Technical SEO audit", "Link building campaigns"]
        },
        contentIntelligence: {
          title: "Content Intelligence",
          description: "AI-powered content that ranks and resonates. Every piece optimized for both humans and algorithms.",
          features: ["AI content generation", "Topic cluster mapping", "Semantic SEO optimization"]
        },
        performanceAnalytics: {
          title: "Performance Analytics",
          description: "Real-time insights that drive decisions. Track rankings, traffic, and conversions in one dashboard.",
          features: ["Rank tracking", "Traffic analytics", "Conversion optimization"]
        }
      },
      whyDifferentTitle: "Why We're Different",
      whyDifferent: {
        aiFirst: {
          title: "AI-First Approach",
          description: "While others chase Google algorithms, we're optimizing for AI models that are becoming the primary search interface."
        },
        precisionTargeting: {
          title: "Precision Targeting", 
          description: "We don't spray and pray. Every strategy is laser-focused on keywords and topics that actually drive revenue."
        },
        speedImplementation: {
          title: "Speed of Implementation",
          description: "See results in weeks, not months. Our automation tools and AI systems work 24/7 to accelerate your growth."
        }
      },
      ctaTitle: "Ready to Dominate Search?",
      ctaDescription: "Get your free SEO audit and discover exactly how we'll get you ranking everywhere your customers are searching.",
      getAudit: "Get My Free Audit",
      scheduleCall: "Schedule a Call"
    },
    aiAssistantsExtended: {
      badge: "AI-POWERED WORKFORCE",
      mainTitle: "Your 24/7 Dream Team That Never Quits",
      mainSubtitle: "",
      mainDescription: "Deploy an army of AI assistants that handle customer support, sales, and engagement. They're smarter than chatbots, cheaper than humans, and they never ask for raises.",
      deployTeam: "Deploy My AI Team", 
      seeAction: "See AI in Action",
      assistantTypes: {
        customerSupport: {
          title: "Customer Support AI",
          description: "24/7 support that never sleeps. Handle thousands of inquiries simultaneously with human-like responses.",
          features: ["Instant response time", "Multi-language support", "Sentiment analysis", "Escalation protocols"]
        },
        salesAssistant: {
          title: "Sales AI Assistant",
          description: "Your tireless sales team that qualifies leads, books meetings, and closes deals while you sleep.",
          features: ["Lead qualification", "Meeting scheduling", "Follow-up automation", "CRM integration"]
        },
        knowledgeBase: {
          title: "Knowledge Base AI",
          description: "Transform your documentation into an intelligent assistant that knows everything about your business.",
          features: ["Instant answers", "Document parsing", "Learning from interactions", "Custom training"]
        },
        socialMedia: {
          title: "Social Media AI",
          description: "Engage with your audience 24/7. Reply to comments, DMs, and mentions with your brand voice.",
          features: ["Auto-responses", "Brand voice matching", "Engagement tracking", "Crisis detection"]
        }
      },
      benefitsTitle: "Why AI Assistants Change Everything",
      benefitsSubtitle: "Stop losing customers to slow response times. Stop paying for 24/7 human support. Start scaling intelligently.",
      benefits: {
        available247: {
          title: "Available 24/7/365",
          description: "Never miss a customer inquiry again. Your AI assistants work around the clock, even on holidays."
        },
        instantResponse: {
          title: "Instant Response",
          description: "Zero wait time. Customers get immediate, accurate answers to their questions."
        },
        unlimitedScale: {
          title: "Unlimited Scale",
          description: "Handle 10 or 10,000 conversations simultaneously without breaking a sweat."
        },
        alwaysConsistent: {
          title: "Always Consistent",
          description: "Perfect brand voice every time. No bad days, no mood swings, just consistent excellence."
        }
      },
      howItWorksTitle: "Deploy in Days, Not Months",
      process: {
        shareKnowledge: {
          title: "Share Your Knowledge",
          description: "Upload your FAQs, documentation, and training materials. Our AI learns everything about your business."
        },
        customizeTrain: {
          title: "Customize & Train",
          description: "Set your brand voice, define workflows, and train the AI on your specific use cases and edge cases."
        },
        deployScale: {
          title: "Deploy & Scale",
          description: "Launch on your website, social media, or support channels. Scale to thousands of conversations instantly."
        }
      },
      ctaTitle: "Ready for Your AI Dream Team?",
      ctaDescription: "Join thousands of businesses that have already deployed AI assistants. Start with a free consultation and see the magic in action.",
      startProject: "Start a Project",
      talkExpert: "Talk to an Expert"
    },
    workflowAutomationExtended: {
      badge: "WORKFLOW AUTOMATION",
      mainTitle: "Escape the Busywork. Build Something Cool.",
      mainDescription: "Those mind-numbing tasks you do every day? Consider them gone. We build intelligent automation that does the boring work, so you can focus on the big picture.",
      automateWorkflow: "Automate My Workflow",
      seeExamples: "See Examples",
      automationTypes: {
        emailCommunication: {
          title: "Email & Communication",
          description: "Automate follow-ups, newsletters, and customer communications. Never drop the ball again.",
          examples: [
            "Welcome email sequences",
            "Abandoned cart reminders", 
            "Customer feedback requests",
            "Birthday & anniversary messages"
          ]
        },
        schedulingCalendar: {
          title: "Scheduling & Calendar",
          description: "Eliminate back-and-forth. Let automation handle your appointments and meetings.",
          examples: [
            "Automatic meeting scheduling",
            "Calendar synchronization",
            "Reminder notifications", 
            "Time zone handling"
          ]
        },
        documentProcessing: {
          title: "Document Processing",
          description: "From invoices to contracts, automate your paperwork and focus on what matters.",
          examples: [
            "Invoice generation",
            "Contract creation",
            "Report compilation",
            "Data extraction & entry"
          ]
        },
        dataManagement: {
          title: "Data Management", 
          description: "Keep your data clean, synced, and actionable across all your tools.",
          examples: [
            "CRM synchronization",
            "Database updates",
            "Data validation",
            "Backup automation"
          ]
        }
      },
      processTitle: "From Chaos to Clockwork in 4 Steps",
      processSubtitle: "Our proven process transforms your manual tasks into automated workflows that just work.",
      process: {
        mapWorkflows: {
          title: "Map Your Workflows",
          description: "We analyze your current processes and identify automation opportunities that will have the biggest impact."
        },
        designBuild: {
          title: "Design & Build",
          description: "Custom automation workflows designed specifically for your business needs, not generic templates."
        },
        testOptimize: {
          title: "Test & Optimize", 
          description: "Rigorous testing ensures everything works perfectly before going live. No surprises, just results."
        },
        deployMonitor: {
          title: "Deploy & Monitor",
          description: "Launch your automations with confidence. We monitor performance and optimize continuously."
        }
      },
      integrationsTitle: "Connects With Everything You Already Use",
      integrationsDescription: "No need to change your tech stack. Our automations integrate seamlessly with your existing tools.",
      integrations: {
        thousandPlus: {
          title: "1000+ Integrations",
          description: "Connect all your tools and create workflows that span across platforms."
        },
        customApis: {
          title: "Custom APIs",
          description: "Have a custom tool? We'll build the integration you need."
        }
      },
      roiTitle: "Your Potential Savings",
      roiSubtitle: "Based on average results from our clients",
      calculateRoi: "Calculate My ROI",
      ctaTitle: "Ready to Reclaim Your Time?",
      ctaDescription: "Stop drowning in repetitive tasks. Let's build automations that give you back hours every day to focus on what truly matters.",
      startAutomating: "Start Automating Today",
      bookDemo: "Book a Demo"
    },
    promptEngineeringExtended: {
      badge: "CUSTOM AI SOLUTIONS",
      mainTitle: "Your AI Is Generic. We Make It a Specialist.",
      mainDescription: "Stop using jack-of-all-trades AI. We engineer custom prompts and train AI models that understand your business like a 10-year veteran employee.",
      servicesTitle: "AI That Actually Works For You",
      servicesSubtitle: "We don't just write prompts. We engineer AI systems that become invaluable members of your team.",
      services: {
        customTraining: {
          title: "Custom AI Training",
          description: "We train AI models specifically for your business, understanding your products, services, and unique voice."
        },
        promptOptimization: {
          title: "Prompt Optimization",
          description: "Transform generic AI into a specialist that delivers consistent, accurate results every time."
        },
        workflowIntegration: {
          title: "Workflow Integration", 
          description: "Seamlessly integrate custom prompts into your existing tools and workflows."
        },
        responseFineTuning: {
          title: "Response Fine-Tuning",
          description: "Perfect the tone, style, and accuracy of AI responses to match your brand exactly."
        }
      },
      useCasesTitle: "From Generic to Genius",
      useCasesDescription: "Whether you need AI for legal analysis, medical documentation, or creative writing, we engineer prompts that deliver expert-level results.",
      useCases: [
        "Legal document analysis",
        "Medical report generation", 
        "Technical documentation",
        "Creative content writing",
        "Customer service responses",
        "Data analysis & insights"
      ],
      beforeAfterTitle: "Before vs After",
      genericResponse: "Generic AI Response: \"I can help you with various tasks...\"",
      customResponse: "Your Custom AI: \"Based on your customer's purchase history and the seasonal trend data, I recommend...\"",
      formTitle: "Get Your Custom AI Strategy",
      formDescription: "Tell us about your needs and we'll show you exactly how custom AI can transform your business.",
      formLabels: {
        name: "Your Name *",
        email: "Email Address *",
        company: "Company Name",
        message: "Tell us about your AI needs *",
        messagePlaceholder: "What tasks do you want AI to handle? What problems are you trying to solve?"
      },
      formButton: "Get My Custom AI Strategy",
      formNote: "We'll respond within 24 hours with a custom AI implementation plan for your business.",
      finalCtaTitle: "Stop Fighting With Dumb AI",
      finalCtaDescription: "It's time your AI understood your business as well as you do. Let's build something that actually works."
    },
    prebuiltStoresExtended: {
      badge: "PRE-BUILT E-COMMERCE STORES",
      mainTitle: "Your Store. Live in 48 Hours.",
      mainDescription: "Skip the months of development. Get a professional e-commerce store that's ready to sell. We handle the tech, you handle the sales.",
      seePricing: "See Pricing Below",
      viewDemo: "View Demo Stores",
      features: {
        launch48: {
          title: "Launch in 48 Hours",
          description: "Your store goes live in 2 days or less. We handle everything from setup to launch."
        },
        secureReliable: {
          title: "Secure & Reliable",
          description: "PCI-compliant payment processing and enterprise-grade security built in."
        },
        builtConvert: {
          title: "Built to Convert",
          description: "Optimized checkout flows and proven designs that turn visitors into customers."
        },
        support247: {
          title: "24/7 Support",
          description: "Get help whenever you need it with our round-the-clock support team."
        }
      },
      pricingTitle: "Simple, Transparent Pricing",
      pricingSubtitle: "No hidden fees. No surprise charges. Just one payment and your store is live.",
      plans: {
        starter: {
          name: "Starter Store",
          setup: "One-time setup",
          description: "Perfect for launching your first online business"
        },
        growth: {
          name: "Growth Store", 
          setup: "One-time setup",
          description: "For businesses ready to scale and grow"
        },
        enterprise: {
          name: "Enterprise Store",
          setup: "One-time setup + customization", 
          description: "Full-featured store with premium support"
        }
      },
      mostPopular: "MOST POPULAR",
      buyNow: "Buy Now",
      templatesTitle: "Pre-Built for Every Industry",
      templatesSubtitle: "Choose from our collection of conversion-optimized templates designed for your specific industry.",
      templates: {
        fashion: { name: "Fashion & Apparel", products: "Clothing, Accessories, Shoes" },
        healthBeauty: { name: "Health & Beauty", products: "Cosmetics, Supplements, Wellness" },
        electronics: { name: "Electronics", products: "Gadgets, Accessories, Tech" },
        homeLiving: { name: "Home & Living", products: "Furniture, Decor, Kitchen" },
        foodBeverage: { name: "Food & Beverage", products: "Specialty Foods, Drinks, Snacks" },
        digitalProducts: { name: "Digital Products", products: "Courses, eBooks, Software" }
      },
      ctaTitle: "Ready to Start Selling Online?",
      ctaDescription: "Join thousands of entrepreneurs who launched their stores with us. Your e-commerce success story starts here.",
      startBuilding: "Start Building Today",
      questionsLetstalk: "Questions? Let's Talk"
    },
    seoPage: {
      title: "AI-Powered SEO Optimization",
      subtitle: "Rank your website on the new AI search engines",
      description: "We optimize your website for Claude, Perplexity, ChatGPT, and other AI search engines, ensuring your content is discovered and recommended by artificial intelligence systems.",
      formTitle: "Boost Your AI SEO",
      formSubtitle: "Start ranking on AI search engines today",
      formButton: "Get Free SEO Analysis",
      features: {
        aiOptimization: {
          title: "AI Optimization",
          description: "Structured content for AI comprehension"
        },
        technicalSeo: {
          title: "Technical SEO",
          description: "Performance and structure optimization"
        },
        contentStrategy: {
          title: "Content Strategy",
          description: "Content optimized for AI and humans"
        },
        performanceTracking: {
          title: "Performance Tracking",
          description: "Real-time analytics and reporting"
        }
      }
    },
    aiAssistants: {
      title: "Custom AI Assistants",
      subtitle: "Automate tasks and improve customer experience with AI",
      description: "We develop custom AI assistants that understand your business, automate repetitive tasks, and provide 24/7 support to your customers.",
      formTitle: "Build Your AI Assistant",
      formSubtitle: "Automate your business with artificial intelligence",
      formButton: "Request Demo",
      features: {
        customChatbots: {
          title: "Custom Chatbots",
          description: "Conversational assistants for your business"
        },
        voiceAssistants: {
          title: "Voice Assistants",
          description: "Natural voice interaction"
        },
        processAutomation: {
          title: "Process Automation",
          description: "Intelligent workflows"
        },
        dataAnalysis: {
          title: "Data Analysis",
          description: "AI-powered insights"
        }
      }
    },
    workflowAutomation: {
      title: "Workflow Automation",
      subtitle: "Optimize processes and increase productivity",
      description: "We automate complex workflows, integrate tools, and create systems that work 24/7 without human intervention.",
      formTitle: "Automate Your Business",
      formSubtitle: "Free up time for what really matters",
      formButton: "Start Automation",
      features: {
        taskAutomation: {
          title: "Task Automation",
          description: "Eliminate repetitive manual work"
        },
        integrations: {
          title: "Integrations",
          description: "Connect all your tools"
        },
        workflows: {
          title: "Workflows",
          description: "End-to-end optimized processes"
        },
        monitoring: {
          title: "Monitoring",
          description: "Continuously supervise and optimize"
        }
      }
    },
    promptEngineering: {
      title: "Prompt Engineering",
      subtitle: "Maximize AI potential with optimized prompts",
      description: "We design and optimize professional prompts that extract maximum value from AI models like GPT-4, Claude, and others.",
      formTitle: "Optimize Your AI Prompts",
      formSubtitle: "Get better results from artificial intelligence",
      formButton: "Improve Prompts",
      features: {
        optimization: {
          title: "Prompt Optimization",
          description: "Prompts designed for maximum performance"
        },
        testing: {
          title: "A/B Testing",
          description: "Continuous validation and improvement"
        },
        library: {
          title: "Prompt Library",
          description: "Curated collection of effective prompts"
        },
        training: {
          title: "Training",
          description: "Learn to create effective prompts"
        }
      }
    },
    prebuiltStores: {
      title: "Pre-built Stores",
      subtitle: "Launch your online store in minutes",
      description: "Fully functional online stores with integrated AI, ready to customize and launch.",
      pricing: {
        basic: {
          name: "Basic",
          price: "$999",
          description: "Perfect for getting started",
          features: [
            "Complete online store",
            "Up to 100 products",
            "Basic AI chatbot",
            "SEO optimized",
            "SSL included",
            "Email support"
          ]
        },
        professional: {
          name: "Professional",
          price: "$2,499",
          description: "For growing businesses",
          features: [
            "Everything in Basic",
            "Unlimited products",
            "Advanced AI with personalization",
            "Marketing automation",
            "Advanced analytics",
            "Priority support"
          ]
        },
        enterprise: {
          name: "Enterprise",
          price: "Custom",
          description: "Tailored solutions",
          features: [
            "Everything in Professional",
            "Custom development",
            "Enterprise AI",
            "Unlimited integrations",
            "Guaranteed SLA",
            "Dedicated team"
          ]
        }
      }
    },
    contactExtended: {
      badge: "GET IN TOUCH",
      mainTitle: "Let's Build Your Digital Empire",
      mainDescription: "Ready to escape the mundane and build something extraordinary? We're here to make it happen.",
      contactInfo: {
        address: {
          title: "Address",
          content: "251 Little Falls Drive",
          description: "Wilmington, DE 19808"
        },
        email: {
          title: "Email Us",
          content: "support@agistaffers.com",
          description: "We'll respond within 24 hours"
        },
        phone: {
          title: "Call Us",
          content: "404-668-2401",
          description: "Mon-Fri 9am-6pm EST"
        },
        whatsapp: {
          title: "WhatsApp (DR)",
          content: "404-668-2401",
          description: "Dominican Republic",
          chatNow: "Chat Now"
        }
      },
      form: {
        title: "Start Your Project",
        description: "Fill out the form and we'll get back to you within 24 hours with a custom strategy.",
        labels: {
          name: "Your Name *",
          email: "Email Address *",
          phone: "Phone Number",
          company: "Company Name",
          services: "Services You're Interested In",
          budget: "Budget Range",
          message: "Project Details *",
          budgetPlaceholder: "Select your budget",
          budgetOptions: {
            under1k: "Under $1,000",
            range1to5k: "$1,000 - $5,000",
            range5to10k: "$5,000 - $10,000",
            range10to25k: "$10,000 - $25,000",
            range25kplus: "$25,000+"
          },
          placeholders: {
            name: "John Doe",
            email: "john@company.com",
            phone: "(555) 123-4567",
            company: "Acme Corp",
            message: "Tell us about your project, goals, timeline, and any specific requirements..."
          }
        },
        services: {
          seo: "SEO & AI Search",
          aiAssistants: "AI Assistants",
          workflow: "Workflow Automation",
          prompt: "Prompt Engineering",
          prebuilt: "Pre-built Store",
          custom: "Custom Website"
        },
        button: "Send Message",
        privacyNote: "By submitting this form, you agree to our terms and privacy policy. We promise not to spam you."
      },
      faqs: {
        title: "Frequently Asked Questions",
        description: "Quick answers to common questions. Still need help? Just ask!",
        questions: {
          howQuickly: {
            question: "How quickly can you start?",
            answer: "We can typically start within 48 hours for most projects. Pre-built stores launch in 2 days, custom projects begin within a week."
          },
          paymentPlans: {
            question: "Do you offer payment plans?",
            answer: "Yes! We offer flexible payment options including monthly plans for larger projects."
          },
          satisfaction: {
            question: "What if I'm not satisfied?",
            answer: "We offer a 30-day money-back guarantee on all pre-built stores and milestone-based approvals for custom projects."
          },
          support: {
            question: "Do you provide ongoing support?",
            answer: "Absolutely! All our services include support, with options for ongoing maintenance and updates."
          }
        },
        readyToStart: {
          title: "Ready to Start?",
          description: "Most projects begin with a free consultation to understand your needs.",
          button: "Book Free Consultation"
        }
      },
      finalCta: {
        title: "No More Waiting. Let's Build.",
        description: "Every minute you wait is a minute your competition gets ahead. Let's change that today."
      }
    },
    customWebsitesExtended: {
      badge: "CUSTOM WEB DEVELOPMENT",
      mainTitle: "Your Vision. Pixel Perfect.",
      mainDescription: "When templates won't cut it, we build digital masterpieces from scratch. Custom websites that tell your story and drive real results.",
      capabilitiesTitle: "Beyond Templates",
      capabilitiesDescription: "Every line of code written specifically for you. Every pixel designed with purpose.",
      capabilities: {
        customDesign: {
          title: "Custom Design",
          description: "Unique designs that capture your brand essence. No templates, no compromises."
        },
        advancedDev: {
          title: "Advanced Development",
          description: "Complex functionality, custom features, and integrations tailored to your needs."
        },
        mobileFirst: {
          title: "Mobile-First",
          description: "Responsive designs that look stunning on every device, optimized for performance."
        },
        analytics: {
          title: "Analytics & Tracking",
          description: "Built-in analytics to track performance and make data-driven decisions."
        }
      },
      projectTypesTitle: "We Build Everything",
      projectTypesDescription: "From simple portfolio sites to complex web applications, we have the expertise to bring your vision to life.",
      projectTypes: [
        "Corporate Websites",
        "SaaS Platforms", 
        "Marketplace Solutions",
        "Portfolio Sites",
        "Web Applications",
        "Custom Portals"
      ],
      processTitle: "Our Process",
      process: {
        discovery: {
          step: "Discovery",
          description: "We dive deep into your business, goals, and vision"
        },
        design: {
          step: "Design", 
          description: "Create stunning mockups and prototypes for your approval"
        },
        development: {
          step: "Development",
          description: "Build your site with clean, scalable code"
        },
        launch: {
          step: "Launch",
          description: "Deploy, optimize, and celebrate your new digital presence"
        }
      },
      formTitle: "Let's Build Something Amazing",
      formDescription: "Tell us about your project and we'll get back to you with a custom proposal.",
      formLabels: {
        name: "Your Name *",
        email: "Email Address *",
        company: "Company Name",
        budget: "Estimated Budget",
        timeline: "Timeline",
        description: "Project Description *",
        budgetPlaceholder: "Select budget range",
        timelinePlaceholder: "Select timeline",
        budgetOptions: {
          range1: "$5,000 - $10,000",
          range2: "$10,000 - $25,000", 
          range3: "$25,000 - $50,000",
          range4: "$50,000+"
        },
        timelineOptions: {
          asap: "ASAP",
          month1: "Within 1 month",
          months2to3: "2-3 months",
          months3to6: "3-6 months"
        },
        placeholders: {
          name: "John Doe",
          email: "john@company.com",
          company: "Acme Corp",
          description: "Tell us about your project, goals, and any specific features you need..."
        }
      },
      formButton: "Get Your Custom Quote",
      formNote: "We'll review your project and send you a detailed proposal within 24 hours.",
      finalCtaTitle: "No Cookie-Cutter. Just Custom.",
      finalCtaDescription: "Your business is unique. Your website should be too. Let's create something that stands out from the crowd."
    },
    customWebsites: {
      title: "Custom Websites",
      subtitle: "Unique design that reflects your brand",
      description: "We develop fully customized websites with the latest technologies, optimized for conversion and with integrated AI.",
      formTitle: "Build Your Custom Site",
      formSubtitle: "Unique design for your brand",
      formButton: "Request Quote",
      features: {
        customDesign: {
          title: "Custom Design",
          description: "Unique to your brand"
        },
        scalability: {
          title: "Scalability",
          description: "Grow without limits"
        },
        performance: {
          title: "High Performance",
          description: "Speed and optimization"
        },
        support: {
          title: "Ongoing Support",
          description: "We're always with you"
        }
      }
    },
    contact: {
      title: "Contact Us",
      subtitle: "We're here to help you transform your business with AI",
      addressTitle: "Address",
      address: "251 Little Falls Drive, Wilmington, DE 19808",
      emailTitle: "Email",
      email: "support@agistaffers.com",
      phoneTitle: "Phone",
      phone: "404-668-2401",
      whatsappTitle: "WhatsApp (Dominican Republic)",
      whatsapp: "404-668-2401",
      formTitle: "Send Us a Message",
      formName: "Name",
      formEmail: "Email",
      formMessage: "Message",
      formButton: "Send Message"
    },
    forms: {
      name: "Name",
      email: "Email",
      company: "Company",
      website: "Website",
      message: "Message",
      projectType: "Project Type",
      budget: "Budget",
      timeline: "Timeline"
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
    heroBanners: {
      aiAssistants: {
        title: "AI Assistants",
        subtitle: "Your 24/7 Dream Team. They Never Quit. Or Ask for Raises.",
        description: "Think of them as your personal army of super-helpful, non-unionized sidekicks. They answer every question, qualify every lead, and make your customers feel heard.",
        cta: "I Want an AI Sidekick"
      },
      workflowAutomation: {
        title: "Workflow Automation",
        subtitle: "Escape the Busywork. Go Build Something Cool.",
        description: "Remember that mind-numbing task you do every day? Yeah, that's gone. We design systems that do the boring work for you. We give you a big red button that says 'Done.'",
        cta: "Tell Me More!"
      },
      seo: {
        title: "SEO",
        subtitle: "Don't Just Be Found. Be the First Thing They Talk About.",
        description: "We make sure your voice cuts through the noise. Our AI doesn't just help you rank on Google, we make sure ChatGPT and Perplexity are quoting you like gospel.",
        cta: "Make Me a Digital God"
      },
      promptEngineering: {
        title: "Prompt Engineering",
        subtitle: "Your AI Is Generic. We Make It a Specialist.",
        description: "You're using AI that's a jack-of-all-trades. We'll give you a custom AI assistant ready to do your specific job. It's time your AI actually worked for you.",
        cta: "Get My Personalized AI"
      },
      websites: {
        title: "Need a Website?",
        subtitle: "Your Launchpad to Freedom. With Less BS.",
        description: "Whether you need a quick e-commerce store or a custom digital masterpiece, we'll build your home base online. No fluff, just results.",
        cta: "Build My Digital HQ"
      }
    },
    features: {
      title: "Why Choose AGI STAFFERS?",
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
      copyright: "© 2025 AGI STAFFERS. Building the future of intelligent websites.",
      description: "Your 24/7 AI workforce that never quits. We build digital empires with automation, AI, and a touch of magic.",
      location: "USA • Remote Worldwide",
      servicesTitle: "Services",
      websitesTitle: "Websites",
      companyTitle: "Company",
      legalTitle: "Legal",
      newsletter: {
        title: "Stay Ahead of the Curve",
        subtitle: "Get weekly tips on AI, automation, and digital growth.",
        placeholder: "Enter your email",
        button: "Subscribe"
      },
      services: {
        seo: "SEO",
        aiAssistants: "AI Assistants",
        workflow: "Workflow Automation",
        prompt: "Prompt Engineering"
      },
      websites: {
        prebuilt: "Pre-built Stores",
        custom: "Custom Websites"
      },
      company: {
        about: "About",
        contact: "Contact Us",
        blog: "Blog",
        careers: "Careers"
      },
      legal: {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        cookies: "Cookie Policy"
      }
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
    },
    loginPage: {
      welcomeBack: "Welcome back",
      signInDescription: "Sign in to AGI STAFFERS with your email",
      signInWithGoogle: "Sign in with Google",
      signingInWithGoogle: "Signing in with Google...",
      orContinueWithEmail: "Or continue with email",
      emailAddress: "Email address",
      emailPlaceholder: "you@example.com",
      passwordlessSignIn: "Passwordless sign in",
      passwordlessDescription: "We'll send you a magic link to sign in. No password needed!",
      sendMagicLink: "Send magic link",
      sendingMagicLink: "Sending magic link...",
      checkYourEmail: "Check your email!",
      magicLinkSent: "We've sent a magic link to",
      clickLinkInEmail: "Click the link in your email to sign in. The link will expire in 10 minutes.",
      didntReceiveEmail: "Didn't receive the email?",
      tryAgain: "Try again",
      invalidEmail: "Please enter a valid email address.",
      unexpectedError: "An unexpected error occurred. Please try again."
    },
    adminLoginPage: {
      adminPortal: "Admin Portal",
      adminSignInDescription: "Sign in to access the admin dashboard",
      email: "Email",
      emailPlaceholder: "admin@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me for 30 days",
      twoFactorCode: "Two-Factor Authentication Code",
      twoFactorPlaceholder: "Enter 6-digit code",
      signIn: "Sign In",
      signingIn: "Signing in...",
      adminAccessOnly: "Admin access only. Customer login at",
      customerLoginAt: "agistaffers.com",
      invalidCredentials: "Invalid credentials. Use admin@agistaffers.com / admin123"
    }
  },
  es: {
    nav: {
      services: "Servicios",
      features: "Características",
      pricing: "Precios", 
      dashboard: "Panel",
      needWebsite: "Diseño Web",
      prebuiltStores: "Tiendas Pre-construidas",
      customWebsites: "Sitios Web Personalizados",
      company: "Empresa",
      ourStory: "Nuestra Historia",
      about: "Nosotros",
      contact: "Contáctanos",
      careers: "Carreras",
      customerLogin: "Iniciar",
      aiAssistants: "Asistentes IA",
      workflowAutomation: "Automatización IA",
      contentSeo: "SEO IA",
      promptEngineering: "Prompts a Medida"
    },
    seoPageExtended: {
      badge: "SEO QUE REALMENTE FUNCIONA",
      mainTitle: "No Solo Ser Encontrado. Ser Lo Primero De Lo Que Hablan.",
      mainDescription: "Nos aseguramos de que tu voz atraviese el ruido. Nuestra IA no solo te ayuda a posicionarte en Google, nos aseguramos de que ChatGPT y Perplexity te citen como si fueras un evangelio.",
      servicesTitle: "Servicios SEO Que Entregan Resultados",
      servicesDescription: "Combinamos maestría en SEO tradicional con optimización de IA de vanguardia. Tu competencia aún está descubriendo ChatGPT mientras tú ya estás posicionándote en él.",
      processTitle: "Nuestro Proceso Probado en Batalla", 
      processDescription: "Cuatro pasos hacia la dominación en búsquedas. Sin relleno, solo resultados.",
      process: {
        audit: {
          title: "Auditoría Profunda",
          description: "Analizamos tu presencia actual en plataformas de búsqueda tradicionales y de IA."
        },
        strategy: {
          title: "Plan Estratégico",
          description: "Hoja de ruta personalizada dirigida tanto a rankings de Google como a citas de modelos de IA."
        },
        content: {
          title: "Dominación de Contenido",
          description: "Crear y optimizar contenido que los motores de búsqueda y modelos de IA no puedan ignorar."
        },
        optimize: {
          title: "Escalar y Optimizar",
          description: "Mejorar continuamente los rankings mientras expandes tu huella digital."
        }
      },
      results: {
        traffic: {
          metric: "Aumento Promedio de Tráfico",
          timeframe: "en 6 meses"
        },
        citations: {
          metric: "Citas en Búsqueda IA",
          timeframe: "más menciones"
        },
        rankings: {
          metric: "Rankings Primera Página",
          timeframe: "de keywords"
        },
        roi: {
          metric: "ROI Promedio",
          timeframe: "retorno de inversión"
        }
      },
      guaranteeText: "Todos los planes incluyen dominio gratis por 1 año • Certificado SSL • Garantía de 99.9% de tiempo activo",
      securePayment: "Pago seguro",
      moneyBack: "Garantía de 30 días",
      instantSetup: "Configuración instantánea",
      viewCaseStudies: "Ver Casos de Éxito",
      services: {
        aiSearch: {
          title: "Optimización para Búsqueda de IA",
          description: "Ser citado por ChatGPT, Claude y Perplexity. Optimizamos tu contenido para motores de búsqueda impulsados por IA.",
          features: ["Optimización de snippets de IA", "Inclusión en datos de entrenamiento LLM", "Ranking de búsqueda conversacional"]
        },
        traditionalSeo: {
          title: "Maestría en SEO Tradicional",
          description: "Domina Google con estrategias probadas en batalla. Rankings de primera página que realmente convierten.",
          features: ["Investigación y estrategia de keywords", "Auditoría SEO técnica", "Campañas de link building"]
        },
        contentIntelligence: {
          title: "Inteligencia de Contenido",
          description: "Contenido impulsado por IA que posiciona y resuena. Cada pieza optimizada tanto para humanos como algoritmos.",
          features: ["Generación de contenido con IA", "Mapeo de clusters temáticos", "Optimización SEO semántica"]
        },
        performanceAnalytics: {
          title: "Análisis de Rendimiento",
          description: "Insights en tiempo real que impulsan decisiones. Rastrea rankings, tráfico y conversiones en un dashboard.",
          features: ["Seguimiento de rankings", "Análisis de tráfico", "Optimización de conversiones"]
        }
      },
      whyDifferentTitle: "Por Qué Somos Diferentes",
      whyDifferent: {
        aiFirst: {
          title: "Enfoque AI-First",
          description: "Mientras otros persiguen algoritmos de Google, nosotros optimizamos para modelos de IA que se están convirtiendo en la interfaz principal de búsqueda."
        },
        precisionTargeting: {
          title: "Targeting de Precisión",
          description: "No disparamos al aire. Cada estrategia está enfocada con láser en keywords y temas que realmente generan ingresos."
        },
        speedImplementation: {
          title: "Velocidad de Implementación",
          description: "Ve resultados en semanas, no meses. Nuestras herramientas de automatización y sistemas de IA trabajan 24/7 para acelerar tu crecimiento."
        }
      },
      ctaTitle: "¿Listo para Dominar las Búsquedas?",
      ctaDescription: "Obtén tu auditoría SEO gratuita y descubre exactamente cómo te posicionaremos en todos los lugares donde buscan tus clientes.",
      getAudit: "Obtener Mi Auditoría Gratuita",
      scheduleCall: "Programar una Llamada"
    },
    aiAssistantsExtended: {
      badge: "FUERZA LABORAL IMPULSADA POR IA",
      mainTitle: "Tu Equipo de Ensueño 24/7 Que Nunca Se Rinde",
      mainSubtitle: "",
      mainDescription: "Despliega un ejército de asistentes de IA que manejan soporte al cliente, ventas y engagement. Son más inteligentes que los chatbots, más baratos que los humanos, y nunca piden aumentos.",
      deployTeam: "Desplegar Mi Equipo de IA",
      seeAction: "Ver IA en Acción",
      assistantTypes: {
        customerSupport: {
          title: "IA de Soporte al Cliente",
          description: "Soporte 24/7 que nunca duerme. Maneja miles de consultas simultáneamente con respuestas similares a las humanas.",
          features: ["Tiempo de respuesta instantáneo", "Soporte multiidioma", "Análisis de sentimientos", "Protocolos de escalamiento"]
        },
        salesAssistant: {
          title: "Asistente de Ventas IA",
          description: "Tu equipo de ventas incansable que califica leads, agenda reuniones y cierra ventas mientras duermes.",
          features: ["Calificación de leads", "Programación de reuniones", "Automatización de seguimiento", "Integración CRM"]
        },
        knowledgeBase: {
          title: "IA de Base de Conocimiento",
          description: "Transforma tu documentación en un asistente inteligente que sabe todo sobre tu negocio.",
          features: ["Respuestas instantáneas", "Análisis de documentos", "Aprendizaje de interacciones", "Entrenamiento personalizado"]
        },
        socialMedia: {
          title: "IA de Redes Sociales",
          description: "Interactúa con tu audiencia 24/7. Responde comentarios, DMs y menciones con la voz de tu marca.",
          features: ["Auto-respuestas", "Coincidencia de voz de marca", "Seguimiento de engagement", "Detección de crisis"]
        }
      },
      benefitsTitle: "Por Qué Los Asistentes IA Lo Cambian Todo",
      benefitsSubtitle: "Deja de perder clientes por tiempos de respuesta lentos. Deja de pagar soporte humano 24/7. Comienza a escalar inteligentemente.",
      benefits: {
        available247: {
          title: "Disponible 24/7/365",
          description: "Nunca más pierdas una consulta de cliente. Tus asistentes de IA trabajan las 24 horas, incluso en feriados."
        },
        instantResponse: {
          title: "Respuesta Instantánea",
          description: "Tiempo de espera cero. Los clientes obtienen respuestas inmediatas y precisas a sus preguntas."
        },
        unlimitedScale: {
          title: "Escala Ilimitada",
          description: "Maneja 10 o 10,000 conversaciones simultáneamente sin sudar."
        },
        alwaysConsistent: {
          title: "Siempre Consistente",
          description: "Voz de marca perfecta cada vez. Sin días malos, sin cambios de humor, solo excelencia consistente."
        }
      },
      howItWorksTitle: "Despliega en Días, No Meses",
      process: {
        shareKnowledge: {
          title: "Comparte Tu Conocimiento",
          description: "Sube tus FAQs, documentación y materiales de entrenamiento. Nuestra IA aprende todo sobre tu negocio."
        },
        customizeTrain: {
          title: "Personaliza y Entrena",
          description: "Define la voz de tu marca, establece flujos de trabajo y entrena la IA en tus casos específicos y casos extremos."
        },
        deployScale: {
          title: "Despliega y Escala",
          description: "Lanza en tu sitio web, redes sociales o canales de soporte. Escala a miles de conversaciones instantáneamente."
        }
      },
      ctaTitle: "¿Listo para Tu Equipo de Ensueño IA?",
      ctaDescription: "Únete a miles de empresas que ya han desplegado asistentes de IA. Comienza con una consulta gratuita y ve la magia en acción.",
      startProject: "Iniciar un Proyecto",
      talkExpert: "Hablar con un Experto"
    },
    workflowAutomationExtended: {
      badge: "AUTOMATIZACIÓN DE FLUJOS DE TRABAJO",
      mainTitle: "Escapa del Trabajo Tedioso. Construye Algo Genial.",
      mainDescription: "¿Esas tareas que adormecen la mente que haces todos los días? Considéralas desaparecidas. Construimos automatización inteligente que hace el trabajo aburrido, para que puedas enfocarte en el panorama general.",
      automateWorkflow: "Automatizar Mi Flujo de Trabajo",
      seeExamples: "Ver Ejemplos",
      automationTypes: {
        emailCommunication: {
          title: "Email y Comunicación",
          description: "Automatiza seguimientos, newsletters y comunicaciones con clientes. Nunca más se te caiga la pelota.",
          examples: [
            "Secuencias de email de bienvenida",
            "Recordatorios de carrito abandonado",
            "Solicitudes de feedback de clientes",
            "Mensajes de cumpleaños y aniversarios"
          ]
        },
        schedulingCalendar: {
          title: "Programación y Calendario",
          description: "Elimina el ir y venir. Deja que la automatización maneje tus citas y reuniones.",
          examples: [
            "Programación automática de reuniones",
            "Sincronización de calendario",
            "Notificaciones de recordatorio",
            "Manejo de zonas horarias"
          ]
        },
        documentProcessing: {
          title: "Procesamiento de Documentos",
          description: "Desde facturas hasta contratos, automatiza tu papeleo y enfócate en lo que importa.",
          examples: [
            "Generación de facturas",
            "Creación de contratos",
            "Compilación de reportes",
            "Extracción y entrada de datos"
          ]
        },
        dataManagement: {
          title: "Gestión de Datos",
          description: "Mantén tus datos limpios, sincronizados y accionables en todas tus herramientas.",
          examples: [
            "Sincronización CRM",
            "Actualizaciones de base de datos",
            "Validación de datos",
            "Automatización de backups"
          ]
        }
      },
      processTitle: "Del Caos al Mecanismo de Relojería en 4 Pasos",
      processSubtitle: "Nuestro proceso probado transforma tus tareas manuales en flujos de trabajo automatizados que simplemente funcionan.",
      process: {
        mapWorkflows: {
          title: "Mapea Tus Flujos de Trabajo",
          description: "Analizamos tus procesos actuales e identificamos oportunidades de automatización que tendrán el mayor impacto."
        },
        designBuild: {
          title: "Diseña y Construye",
          description: "Flujos de trabajo de automatización personalizados diseñados específicamente para las necesidades de tu negocio, no plantillas genéricas."
        },
        testOptimize: {
          title: "Prueba y Optimiza",
          description: "Las pruebas rigurosas aseguran que todo funcione perfectamente antes de salir en vivo. Sin sorpresas, solo resultados."
        },
        deployMonitor: {
          title: "Despliega y Monitorea",
          description: "Lanza tus automatizaciones con confianza. Monitoreamos el rendimiento y optimizamos continuamente."
        }
      },
      integrationsTitle: "Se Conecta Con Todo Lo Que Ya Usas",
      integrationsDescription: "No necesitas cambiar tu stack tecnológico. Nuestras automatizaciones se integran sin problemas con tus herramientas existentes.",
      integrations: {
        thousandPlus: {
          title: "1000+ Integraciones",
          description: "Conecta todas tus herramientas y crea flujos de trabajo que abarcan plataformas."
        },
        customApis: {
          title: "APIs Personalizadas",
          description: "¿Tienes una herramienta personalizada? Construiremos la integración que necesites."
        }
      },
      roiTitle: "Tus Ahorros Potenciales",
      roiSubtitle: "Basado en resultados promedio de nuestros clientes",
      calculateRoi: "Calcular Mi ROI",
      ctaTitle: "¿Listo para Recuperar Tu Tiempo?",
      ctaDescription: "Deja de ahogarte en tareas repetitivas. Construyamos automatizaciones que te devuelvan horas cada día para enfocarte en lo que realmente importa.",
      startAutomating: "Comenzar a Automatizar Hoy",
      bookDemo: "Reservar una Demo"
    },
    promptEngineeringExtended: {
      badge: "SOLUCIONES IA PERSONALIZADAS",
      mainTitle: "Tu IA Es Genérica. La Hacemos Especialista.",
      mainDescription: "Deja de usar IA todoterreno. Desarrollamos prompts personalizados y entrenamos modelos de IA que entienden tu negocio como un empleado veterano de 10 años.",
      servicesTitle: "IA Que Realmente Funciona Para Ti",
      servicesSubtitle: "No solo escribimos prompts. Desarrollamos sistemas de IA que se convierten en miembros invaluables de tu equipo.",
      services: {
        customTraining: {
          title: "Entrenamiento de IA Personalizado",
          description: "Entrenamos modelos de IA específicamente para tu negocio, entendiendo tus productos, servicios y voz única."
        },
        promptOptimization: {
          title: "Optimización de Prompts",
          description: "Transforma la IA genérica en un especialista que entrega resultados consistentes y precisos cada vez."
        },
        workflowIntegration: {
          title: "Integración de Flujos de Trabajo",
          description: "Integra sin problemas prompts personalizados en tus herramientas y flujos de trabajo existentes."
        },
        responseFineTuning: {
          title: "Ajuste Fino de Respuestas",
          description: "Perfecciona el tono, estilo y precisión de las respuestas de IA para que coincidan exactamente con tu marca."
        }
      },
      useCasesTitle: "De Genérico a Genio",
      useCasesDescription: "Ya sea que necesites IA para análisis legal, documentación médica o escritura creativa, desarrollamos prompts que entregan resultados de nivel experto.",
      useCases: [
        "Análisis de documentos legales",
        "Generación de reportes médicos",
        "Documentación técnica",
        "Escritura de contenido creativo",
        "Respuestas de servicio al cliente",
        "Análisis de datos e insights"
      ],
      beforeAfterTitle: "Antes vs Después",
      genericResponse: "Respuesta de IA Genérica: \"Puedo ayudarte con varias tareas...\"",
      customResponse: "Tu IA Personalizada: \"Basado en el historial de compras de tu cliente y los datos de tendencias estacionales, recomiendo...\"",
      formTitle: "Obtén Tu Estrategia de IA Personalizada",
      formDescription: "Cuéntanos sobre tus necesidades y te mostraremos exactamente cómo la IA personalizada puede transformar tu negocio.",
      formLabels: {
        name: "Tu Nombre *",
        email: "Dirección de Email *",
        company: "Nombre de la Empresa",
        message: "Cuéntanos sobre tus necesidades de IA *",
        messagePlaceholder: "¿Qué tareas quieres que maneje la IA? ¿Qué problemas estás tratando de resolver?"
      },
      formButton: "Obtener Mi Estrategia de IA Personalizada",
      formNote: "Responderemos dentro de 24 horas con un plan de implementación de IA personalizado para tu negocio.",
      finalCtaTitle: "Deja de Pelear Con IA Tonta",
      finalCtaDescription: "Es hora de que tu IA entienda tu negocio tan bien como tú. Construyamos algo que realmente funcione."
    },
    prebuiltStoresExtended: {
      badge: "TIENDAS E-COMMERCE PRE-CONSTRUIDAS",
      mainTitle: "Tu Tienda. En Vivo en 48 Horas.",
      mainDescription: "Sáltate los meses de desarrollo. Obtén una tienda e-commerce profesional que está lista para vender. Nosotros manejamos la tecnología, tú manejas las ventas.",
      seePricing: "Ver Precios Abajo",
      viewDemo: "Ver Tiendas Demo",
      features: {
        launch48: {
          title: "Lanzar en 48 Horas",
          description: "Tu tienda sale en vivo en 2 días o menos. Manejamos todo desde la configuración hasta el lanzamiento."
        },
        secureReliable: {
          title: "Segura y Confiable",
          description: "Procesamiento de pagos compatible con PCI y seguridad de nivel empresarial incluida."
        },
        builtConvert: {
          title: "Construida para Convertir",
          description: "Flujos de checkout optimizados y diseños probados que convierten visitantes en clientes."
        },
        support247: {
          title: "Soporte 24/7",
          description: "Obtén ayuda cuando la necesites con nuestro equipo de soporte las 24 horas."
        }
      },
      pricingTitle: "Precios Simples y Transparentes",
      pricingSubtitle: "Sin tarifas ocultas. Sin cargos sorpresa. Solo un pago y tu tienda está en vivo.",
      plans: {
        starter: {
          name: "Tienda Inicial",
          setup: "Configuración única",
          description: "Perfecta para lanzar tu primer negocio online"
        },
        growth: {
          name: "Tienda de Crecimiento",
          setup: "Configuración única",
          description: "Para negocios listos para escalar y crecer"
        },
        enterprise: {
          name: "Tienda Empresarial",
          setup: "Configuración única + personalización",
          description: "Tienda con todas las funciones y soporte premium"
        }
      },
      mostPopular: "MÁS POPULAR",
      buyNow: "Comprar Ahora",
      templatesTitle: "Pre-Construidas para Cada Industria",
      templatesSubtitle: "Elige de nuestra colección de plantillas optimizadas para conversión diseñadas para tu industria específica.",
      templates: {
        fashion: { name: "Moda y Ropa", products: "Ropa, Accesorios, Zapatos" },
        healthBeauty: { name: "Salud y Belleza", products: "Cosméticos, Suplementos, Bienestar" },
        electronics: { name: "Electrónicos", products: "Gadgets, Accesorios, Tecnología" },
        homeLiving: { name: "Hogar y Vida", products: "Muebles, Decoración, Cocina" },
        foodBeverage: { name: "Comida y Bebida", products: "Comidas Especiales, Bebidas, Snacks" },
        digitalProducts: { name: "Productos Digitales", products: "Cursos, eBooks, Software" }
      },
      ctaTitle: "¿Listo para Comenzar a Vender Online?",
      ctaDescription: "Únete a miles de emprendedores que lanzaron sus tiendas con nosotros. Tu historia de éxito en e-commerce comienza aquí.",
      startBuilding: "Comenzar a Construir Hoy",
      questionsLetstalk: "¿Preguntas? Hablemos"
    },
    seoPage: {
      title: "Optimización SEO para IA",
      subtitle: "Posiciona tu sitio web en los nuevos motores de búsqueda de IA",
      description: "Optimizamos tu sitio web para Claude, Perplexity, ChatGPT y otros motores de búsqueda de IA, asegurando que tu contenido sea descubierto y recomendado por sistemas de inteligencia artificial.",
      formTitle: "Mejora tu SEO de IA",
      formSubtitle: "Comienza a posicionarte en motores de búsqueda de IA hoy",
      formButton: "Obtener Análisis SEO Gratis",
      features: {
        aiOptimization: {
          title: "Optimización para IA",
          description: "Contenido estructurado para comprensión de IA"
        },
        technicalSeo: {
          title: "SEO Técnico",
          description: "Optimización de rendimiento y estructura"
        },
        contentStrategy: {
          title: "Estrategia de Contenido",
          description: "Contenido optimizado para IA y humanos"
        },
        performanceTracking: {
          title: "Seguimiento de Rendimiento",
          description: "Análisis y reportes en tiempo real"
        }
      }
    },
    aiAssistants: {
      title: "Asistentes de IA Personalizados",
      subtitle: "Automatiza tareas y mejora la experiencia del cliente con IA",
      description: "Desarrollamos asistentes de IA personalizados que entienden tu negocio, automatizan tareas repetitivas y brindan soporte 24/7 a tus clientes.",
      formTitle: "Crea tu Asistente de IA",
      formSubtitle: "Automatiza tu negocio con inteligencia artificial",
      formButton: "Solicitar Demo",
      features: {
        customChatbots: {
          title: "Chatbots Personalizados",
          description: "Asistentes conversacionales para tu negocio"
        },
        voiceAssistants: {
          title: "Asistentes de Voz",
          description: "Interacción natural por voz"
        },
        processAutomation: {
          title: "Automatización de Procesos",
          description: "Flujos de trabajo inteligentes"
        },
        dataAnalysis: {
          title: "Análisis de Datos",
          description: "Insights impulsados por IA"
        }
      }
    },
    workflowAutomation: {
      title: "Automatización de Flujos de Trabajo",
      subtitle: "Optimiza procesos y aumenta la productividad",
      description: "Automatizamos flujos de trabajo complejos, integramos herramientas y creamos sistemas que trabajan 24/7 sin intervención humana.",
      formTitle: "Automatiza tu Negocio",
      formSubtitle: "Libera tiempo para lo que realmente importa",
      formButton: "Comenzar Automatización",
      features: {
        taskAutomation: {
          title: "Automatización de Tareas",
          description: "Elimina trabajo manual repetitivo"
        },
        integrations: {
          title: "Integraciones",
          description: "Conecta todas tus herramientas"
        },
        workflows: {
          title: "Flujos de Trabajo",
          description: "Procesos optimizados de principio a fin"
        },
        monitoring: {
          title: "Monitoreo",
          description: "Supervisa y optimiza continuamente"
        }
      }
    },
    promptEngineering: {
      title: "Ingeniería de Prompts",
      subtitle: "Maximiza el potencial de la IA con prompts optimizados",
      description: "Diseñamos y optimizamos prompts profesionales que extraen el máximo valor de modelos de IA como GPT-4, Claude y otros.",
      formTitle: "Optimiza tus Prompts de IA",
      formSubtitle: "Obtén mejores resultados de la inteligencia artificial",
      formButton: "Mejorar Prompts",
      features: {
        optimization: {
          title: "Optimización de Prompts",
          description: "Prompts diseñados para máximo rendimiento"
        },
        testing: {
          title: "Pruebas A/B",
          description: "Validación y mejora continua"
        },
        library: {
          title: "Biblioteca de Prompts",
          description: "Colección curada de prompts efectivos"
        },
        training: {
          title: "Capacitación",
          description: "Aprende a crear prompts efectivos"
        }
      }
    },
    prebuiltStores: {
      title: "Tiendas Preconstruidas",
      subtitle: "Lanza tu tienda online en minutos",
      description: "Tiendas online completamente funcionales con IA integrada, listas para personalizar y lanzar.",
      pricing: {
        basic: {
          name: "Básico",
          price: "$999",
          description: "Perfecto para empezar",
          features: [
            "Tienda online completa",
            "Hasta 100 productos",
            "Chatbot de IA básico",
            "SEO optimizado",
            "SSL incluido",
            "Soporte por email"
          ]
        },
        professional: {
          name: "Profesional",
          price: "$2,499",
          description: "Para negocios en crecimiento",
          features: [
            "Todo en Básico",
            "Productos ilimitados",
            "IA avanzada con personalización",
            "Automatización de marketing",
            "Análisis avanzado",
            "Soporte prioritario"
          ]
        },
        enterprise: {
          name: "Empresa",
          price: "Personalizado",
          description: "Soluciones a medida",
          features: [
            "Todo en Profesional",
            "Desarrollo personalizado",
            "IA empresarial",
            "Integraciones ilimitadas",
            "SLA garantizado",
            "Equipo dedicado"
          ]
        }
      }
    },
    contactExtended: {
      badge: "CONTÁCTANOS",
      mainTitle: "Construyamos Tu Imperio Digital",
      mainDescription: "¿Listo para escapar de lo mundano y construir algo extraordinario? Estamos aquí para hacerlo realidad.",
      contactInfo: {
        address: {
          title: "Dirección",
          content: "251 Little Falls Drive",
          description: "Wilmington, DE 19808"
        },
        email: {
          title: "Contáctanos por Email",
          content: "support@agistaffers.com",
          description: "Responderemos en 24 horas"
        },
        phone: {
          title: "Llámanos",
          content: "404-668-2401",
          description: "Lun-Vie 9am-6pm EST"
        },
        whatsapp: {
          title: "WhatsApp (RD)",
          content: "404-668-2401",
          description: "República Dominicana",
          chatNow: "Chatear Ahora"
        }
      },
      form: {
        title: "Inicia Tu Proyecto",
        description: "Completa el formulario y te responderemos en 24 horas con una estrategia personalizada.",
        labels: {
          name: "Tu Nombre *",
          email: "Correo Electrónico *",
          phone: "Número de Teléfono",
          company: "Nombre de la Empresa",
          services: "Servicios que te Interesan",
          budget: "Rango de Presupuesto",
          message: "Detalles del Proyecto *",
          budgetPlaceholder: "Selecciona tu presupuesto",
          budgetOptions: {
            under1k: "Menos de $1,000",
            range1to5k: "$1,000 - $5,000",
            range5to10k: "$5,000 - $10,000",
            range10to25k: "$10,000 - $25,000",
            range25kplus: "$25,000+"
          },
          placeholders: {
            name: "Juan Pérez",
            email: "juan@empresa.com",
            phone: "(555) 123-4567",
            company: "Empresa Ejemplo",
            message: "Cuéntanos sobre tu proyecto, objetivos, cronograma y cualquier requisito específico..."
          }
        },
        services: {
          seo: "SEO y Búsqueda IA",
          aiAssistants: "Asistentes de IA",
          workflow: "Automatización de Flujos",
          prompt: "Ingeniería de Prompts",
          prebuilt: "Tienda Pre-construida",
          custom: "Sitio Web Personalizado"
        },
        button: "Enviar Mensaje",
        privacyNote: "Al enviar este formulario, aceptas nuestros términos y política de privacidad. Prometemos no enviarte spam."
      },
      faqs: {
        title: "Preguntas Frecuentes",
        description: "Respuestas rápidas a preguntas comunes. ¿Aún necesitas ayuda? ¡Solo pregunta!",
        questions: {
          howQuickly: {
            question: "¿Qué tan rápido pueden comenzar?",
            answer: "Típicamente podemos comenzar en 48 horas para la mayoría de proyectos. Las tiendas pre-construidas se lanzan en 2 días, los proyectos personalizados comienzan en una semana."
          },
          paymentPlans: {
            question: "¿Ofrecen planes de pago?",
            answer: "¡Sí! Ofrecemos opciones de pago flexibles incluyendo planes mensuales para proyectos más grandes."
          },
          satisfaction: {
            question: "¿Qué pasa si no estoy satisfecho?",
            answer: "Ofrecemos una garantía de devolución de dinero de 30 días en todas las tiendas pre-construidas y aprobaciones basadas en hitos para proyectos personalizados."
          },
          support: {
            question: "¿Proporcionan soporte continuo?",
            answer: "¡Absolutamente! Todos nuestros servicios incluyen soporte, con opciones para mantenimiento y actualizaciones continuas."
          }
        },
        readyToStart: {
          title: "¿Listo para Comenzar?",
          description: "La mayoría de proyectos comienzan con una consulta gratuita para entender tus necesidades.",
          button: "Reservar Consulta Gratuita"
        }
      },
      finalCta: {
        title: "Se Acabó la Espera. Construyamos.",
        description: "Cada minuto que esperas es un minuto en que tu competencia se adelanta. Cambiemos eso hoy."
      }
    },
    customWebsitesExtended: {
      badge: "DESARROLLO WEB PERSONALIZADO",
      mainTitle: "Tu Visión. Pixel Perfecto.",
      mainDescription: "Cuando las plantillas no son suficientes, construimos obras maestras digitales desde cero. Sitios web personalizados que cuentan tu historia y generan resultados reales.",
      capabilitiesTitle: "Más Allá de las Plantillas",
      capabilitiesDescription: "Cada línea de código escrita específicamente para ti. Cada pixel diseñado con propósito.",
      capabilities: {
        customDesign: {
          title: "Diseño Personalizado",
          description: "Diseños únicos que capturan la esencia de tu marca. Sin plantillas, sin compromisos."
        },
        advancedDev: {
          title: "Desarrollo Avanzado",
          description: "Funcionalidad compleja, características personalizadas e integraciones adaptadas a tus necesidades."
        },
        mobileFirst: {
          title: "Mobile-First",
          description: "Diseños responsivos que se ven increíbles en cada dispositivo, optimizados para rendimiento."
        },
        analytics: {
          title: "Análisis y Seguimiento",
          description: "Análisis integrados para rastrear el rendimiento y tomar decisiones basadas en datos."
        }
      },
      projectTypesTitle: "Construimos Todo",
      projectTypesDescription: "Desde sitios de portafolio simples hasta aplicaciones web complejas, tenemos la experiencia para dar vida a tu visión.",
      projectTypes: [
        "Sitios Web Corporativos",
        "Plataformas SaaS",
        "Soluciones de Marketplace",
        "Sitios de Portafolio",
        "Aplicaciones Web",
        "Portales Personalizados"
      ],
      processTitle: "Nuestro Proceso",
      process: {
        discovery: {
          step: "Descubrimiento",
          description: "Profundizamos en tu negocio, objetivos y visión"
        },
        design: {
          step: "Diseño",
          description: "Creamos mockups impresionantes y prototipos para tu aprobación"
        },
        development: {
          step: "Desarrollo",
          description: "Construimos tu sitio con código limpio y escalable"
        },
        launch: {
          step: "Lanzamiento",
          description: "Desplegamos, optimizamos y celebramos tu nueva presencia digital"
        }
      },
      formTitle: "Construyamos Algo Increíble",
      formDescription: "Cuéntanos sobre tu proyecto y te responderemos con una propuesta personalizada.",
      formLabels: {
        name: "Tu Nombre *",
        email: "Dirección de Email *",
        company: "Nombre de la Empresa",
        budget: "Presupuesto Estimado",
        timeline: "Cronograma",
        description: "Descripción del Proyecto *",
        budgetPlaceholder: "Seleccionar rango de presupuesto",
        timelinePlaceholder: "Seleccionar cronograma",
        budgetOptions: {
          range1: "$5,000 - $10,000",
          range2: "$10,000 - $25,000",
          range3: "$25,000 - $50,000",
          range4: "$50,000+"
        },
        timelineOptions: {
          asap: "Lo Antes Posible",
          month1: "Dentro de 1 mes",
          months2to3: "2-3 meses",
          months3to6: "3-6 meses"
        },
        placeholders: {
          name: "Juan Pérez",
          email: "juan@empresa.com",
          company: "Empresa Ejemplo",
          description: "Cuéntanos sobre tu proyecto, objetivos y cualquier característica específica que necesites..."
        }
      },
      formButton: "Obtener Tu Cotización Personalizada",
      formNote: "Revisaremos tu proyecto y te enviaremos una propuesta detallada dentro de 24 horas.",
      finalCtaTitle: "Sin Plantillas. Solo Personalizado.",
      finalCtaDescription: "Tu negocio es único. Tu sitio web también debería serlo. Creemos algo que se destaque entre la multitud."
    },
    customWebsites: {
      title: "Sitios Web Personalizados",
      subtitle: "Diseño único que refleja tu marca",
      description: "Desarrollamos sitios web completamente personalizados con las últimas tecnologías, optimizados para conversión y con IA integrada.",
      formTitle: "Crea tu Sitio Personalizado",
      formSubtitle: "Diseño único para tu marca",
      formButton: "Solicitar Cotización",
      features: {
        customDesign: {
          title: "Diseño Personalizado",
          description: "Único para tu marca"
        },
        scalability: {
          title: "Escalabilidad",
          description: "Crece sin límites"
        },
        performance: {
          title: "Alto Rendimiento",
          description: "Velocidad y optimización"
        },
        support: {
          title: "Soporte Continuo",
          description: "Estamos contigo siempre"
        }
      }
    },
    contact: {
      title: "Contáctanos",
      subtitle: "Estamos aquí para ayudarte a transformar tu negocio con IA",
      addressTitle: "Dirección",
      address: "251 Little Falls Drive, Wilmington, DE 19808",
      emailTitle: "Correo Electrónico",
      email: "support@agistaffers.com",
      phoneTitle: "Teléfono",
      phone: "404-668-2401",
      whatsappTitle: "WhatsApp (República Dominicana)",
      whatsapp: "404-668-2401",
      formTitle: "Envíanos un Mensaje",
      formName: "Nombre",
      formEmail: "Correo Electrónico",
      formMessage: "Mensaje",
      formButton: "Enviar Mensaje"
    },
    forms: {
      name: "Nombre",
      email: "Correo Electrónico",
      company: "Empresa",
      website: "Sitio Web",
      message: "Mensaje",
      projectType: "Tipo de Proyecto",
      budget: "Presupuesto",
      timeline: "Plazo"
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
    heroBanners: {
      aiAssistants: {
        title: "Asistentes de IA",
        subtitle: "Tu Equipo Soñado 24/7. Nunca Renuncian. Ni Piden Aumentos.",
        description: "Piensa en ellos como tu ejército personal de ayudantes súper útiles. Responden cada pregunta, califican cada cliente potencial, y hacen que tus clientes se sientan escuchados.",
        cta: "Quiero un Asistente de IA"
      },
      workflowAutomation: {
        title: "Automatización de Flujos",
        subtitle: "Escapa del Trabajo Tedioso. Ve a Construir Algo Genial.",
        description: "¿Recuerdas esa tarea aburrida que haces todos los días? Ya no más. Diseñamos sistemas que hacen el trabajo aburrido por ti. Te damos un gran botón rojo que dice 'Hecho.'",
        cta: "¡Cuéntame Más!"
      },
      seo: {
        title: "SEO",
        subtitle: "No Solo Ser Encontrado. Ser lo Primero de lo que Hablan.",
        description: "Nos aseguramos de que tu voz atraviese el ruido. Nuestra IA no solo te ayuda a posicionarte en Google, nos aseguramos de que ChatGPT y Perplexity te citen como evangelio.",
        cta: "Hazme un Dios Digital"
      },
      promptEngineering: {
        title: "Ingeniería de Prompts",
        subtitle: "Tu IA es Genérica. La Hacemos Especialista.",
        description: "Estás usando IA que es aprendiz de todo. Te daremos un asistente de IA personalizado listo para hacer tu trabajo específico. Es hora de que tu IA realmente trabaje para ti.",
        cta: "Obtener Mi IA Personalizada"
      },
      websites: {
        title: "¿Necesitas un Sitio Web?",
        subtitle: "Tu Plataforma de Lanzamiento a la Libertad. Con Menos BS.",
        description: "Ya sea que necesites una tienda de comercio electrónico rápida o una obra maestra digital personalizada, construiremos tu base en línea. Sin relleno, solo resultados.",
        cta: "Construir Mi HQ Digital"
      }
    },
    features: {
      title: "¿Por Qué Elegir AGI STAFFERS?",
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
      copyright: "© 2025 AGI STAFFERS. Construyendo el futuro de los sitios web inteligentes.",
      description: "Tu fuerza laboral de IA 24/7 que nunca se rinde. Construimos imperios digitales con automatización, IA y un toque de magia.",
      location: "EE.UU. • Remoto Mundial",
      servicesTitle: "Servicios",
      websitesTitle: "Sitios Web",
      companyTitle: "Empresa",
      legalTitle: "Legal",
      newsletter: {
        title: "Mantente a la Vanguardia",
        subtitle: "Recibe consejos semanales sobre IA, automatización y crecimiento digital.",
        placeholder: "Ingresa tu correo",
        button: "Suscribirse"
      },
      services: {
        seo: "SEO",
        aiAssistants: "Asistentes de IA",
        workflow: "Automatización de Flujos",
        prompt: "Ingeniería de Prompts"
      },
      websites: {
        prebuilt: "Tiendas Preconstruidas",
        custom: "Sitios Personalizados"
      },
      company: {
        about: "Acerca de",
        contact: "Contáctanos",
        blog: "Blog",
        careers: "Carreras"
      },
      legal: {
        privacy: "Política de Privacidad",
        terms: "Términos de Servicio",
        cookies: "Política de Cookies"
      }
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
    },
    loginPage: {
      welcomeBack: "Bienvenido de nuevo",
      signInDescription: "Inicia sesión en AGI STAFFERS con tu correo",
      signInWithGoogle: "Iniciar sesión con Google",
      signingInWithGoogle: "Iniciando sesión con Google...",
      orContinueWithEmail: "O continúa con correo",
      emailAddress: "Dirección de correo",
      emailPlaceholder: "tu@ejemplo.com",
      passwordlessSignIn: "Inicio de sesión sin contraseña",
      passwordlessDescription: "Te enviaremos un enlace mágico para iniciar sesión. ¡No necesitas contraseña!",
      sendMagicLink: "Enviar enlace mágico",
      sendingMagicLink: "Enviando enlace mágico...",
      checkYourEmail: "¡Revisa tu correo!",
      magicLinkSent: "Hemos enviado un enlace mágico a",
      clickLinkInEmail: "Haz clic en el enlace de tu correo para iniciar sesión. El enlace expirará en 10 minutos.",
      didntReceiveEmail: "¿No recibiste el correo?",
      tryAgain: "Intentar de nuevo",
      invalidEmail: "Por favor ingresa una dirección de correo válida.",
      unexpectedError: "Ocurrió un error inesperado. Por favor intenta de nuevo."
    },
    adminLoginPage: {
      adminPortal: "Portal de Administración",
      adminSignInDescription: "Inicia sesión para acceder al panel de administración",
      email: "Correo",
      emailPlaceholder: "admin@ejemplo.com",
      password: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      rememberMe: "Recordarme por 30 días",
      twoFactorCode: "Código de Autenticación de Dos Factores",
      twoFactorPlaceholder: "Ingresa código de 6 dígitos",
      signIn: "Iniciar Sesión",
      signingIn: "Iniciando sesión...",
      adminAccessOnly: "Solo acceso de administrador. Inicio de sesión de clientes en",
      customerLoginAt: "agistaffers.com",
      invalidCredentials: "Credenciales inválidas. Usa admin@agistaffers.com / admin123"
    }
  }
};