import { PrismaClient } from '@prisma/client'
import Docker from 'dockerode'
import { ThemeRenderer } from '@/shopify-themes/engine/renderer'
import { ThemeCustomizer } from '@/shopify-themes/engine/customizer'

const prisma = new PrismaClient()
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export interface CustomerSite {
  id: string
  customerId: string
  siteName: string
  domain: string
  themeType: 'dawn' | 'service-business' | 'landing-page' | 'blog' | 'corporate'
  containerId?: string
  containerStatus: 'pending' | 'creating' | 'running' | 'stopped' | 'error'
  themeSettings: Record<string, any>
  customization: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    companyName: string
    customCSS?: string
  }
  sslEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  email: string
  companyName?: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled'
  createdAt: Date
  sites: CustomerSite[]
}

export class MultiTenantThemeService {
  /**
   * Create a new customer site with theme deployment
   */
  async createCustomerSite(data: {
    customerId: string
    siteName: string
    domain: string
    themeType: CustomerSite['themeType']
    customization: CustomerSite['customization']
  }): Promise<CustomerSite> {
    // Create database record
    const site = await prisma.customerSite.create({
      data: {
        customerId: data.customerId,
        siteName: data.siteName,
        domain: data.domain,
        themeType: data.themeType,
        containerStatus: 'pending',
        themeSettings: this.getDefaultThemeSettings(data.themeType),
        customization: data.customization,
        sslEnabled: false
      }
    })

    // Deploy container asynchronously
    this.deployThemeContainer(site.id).catch(console.error)

    return site as CustomerSite
  }

  /**
   * Deploy theme in isolated Docker container
   */
  private async deployThemeContainer(siteId: string): Promise<void> {
    const site = await prisma.customerSite.findUnique({
      where: { id: siteId },
      include: { customer: true }
    })

    if (!site) throw new Error('Site not found')

    try {
      // Update status to creating
      await prisma.customerSite.update({
        where: { id: siteId },
        data: { containerStatus: 'creating' }
      })

      // Create isolated Docker network for customer
      const networkName = `customer-${site.customerId}-network`
      let network
      try {
        network = docker.getNetwork(networkName)
        await network.inspect()
      } catch {
        // Network doesn't exist, create it
        network = await docker.createNetwork({
          Name: networkName,
          Driver: 'bridge',
          Internal: false, // Allow external access through proxy
          Attachable: true,
          Options: {
            'com.docker.network.bridge.enable_ip_masquerade': 'true'
          }
        })
      }

      // Generate theme application with customer's settings
      const themeConfig = this.generateThemeConfig(site)

      // Create container with theme
      const container = await docker.createContainer({
        Image: 'node:18-alpine',
        name: `customer-${site.customerId}-site-${site.id}`,
        Env: [
          `THEME_TYPE=${site.themeType}`,
          `SITE_ID=${site.id}`,
          `CUSTOMER_ID=${site.customerId}`,
          `DOMAIN=${site.domain}`,
          `THEME_CONFIG=${JSON.stringify(themeConfig)}`
        ],
        WorkingDir: '/app',
        Cmd: ['npm', 'start'],
        ExposedPorts: { '3000/tcp': {} },
        PortBindings: {},
        NetworkMode: networkName,
        RestartPolicy: { Name: 'unless-stopped' },
        // Resource limits per customer
        HostConfig: {
          Memory: 512 * 1024 * 1024, // 512MB
          CpuQuota: 50000, // 0.5 CPU cores
          CpuPeriod: 100000,
          StorageOpt: { size: '2G' }, // 2GB storage limit
          SecurityOpt: ['no-new-privileges:true'],
          ReadonlyRootfs: false,
          Tmpfs: { '/tmp': 'rw,noexec,nosuid,size=100m' }
        },
        Labels: {
          'com.agistaffers.customer': site.customerId,
          'com.agistaffers.site': site.id,
          'com.agistaffers.theme': site.themeType,
          'com.agistaffers.managed': 'true'
        }
      })

      // Start container
      await container.start()

      // Update database with container info
      await prisma.customerSite.update({
        where: { id: siteId },
        data: {
          containerId: container.id,
          containerStatus: 'running'
        }
      })

      // Register with Nginx Proxy Manager for SSL and routing
      await this.setupProxyRouting(site.domain, container.id)

    } catch (error) {
      console.error('Failed to deploy theme container:', error)
      await prisma.customerSite.update({
        where: { id: siteId },
        data: { containerStatus: 'error' }
      })
      throw error
    }
  }

  /**
   * Generate theme configuration based on customer settings
   */
  private generateThemeConfig(site: any) {
    const baseConfig = this.getDefaultThemeSettings(site.themeType)
    
    // Apply customer customization
    const customizedConfig = {
      ...baseConfig,
      branding: {
        companyName: site.customization.companyName,
        logo: site.customization.logo,
        primaryColor: site.customization.primaryColor,
        secondaryColor: site.customization.secondaryColor
      },
      customCSS: site.customization.customCSS || '',
      siteSettings: site.themeSettings
    }

    return customizedConfig
  }

  /**
   * Get default theme settings based on type
   */
  private getDefaultThemeSettings(themeType: CustomerSite['themeType']): Record<string, any> {
    const themeDefaults = {
      'dawn': {
        // E-commerce theme defaults
        header: {
          showSearch: true,
          showCart: true,
          showAccount: true
        },
        hero: {
          headline: 'Welcome to Your Store',
          buttonText: 'Shop Now'
        },
        collections: {
          featuredCollections: []
        }
      },
      'service-business': {
        // Service business theme defaults
        serviceHero: {
          headline: 'Professional Services',
          subheadline: 'Expert solutions for your business'
        },
        services: {
          showPricing: true,
          bookingEnabled: true
        }
      },
      'landing-page': {
        // Landing page theme defaults  
        conversionHero: {
          urgencyMessage: 'Limited Time Offer',
          showCountdown: true
        },
        benefits: {
          showFeatures: true
        }
      },
      'blog': {
        // Blog theme defaults
        blogHero: {
          showSearch: true,
          showCategories: true
        },
        articles: {
          postsPerPage: 12,
          showFilters: true
        }
      },
      'corporate': {
        // Corporate theme defaults
        corporateHero: {
          showStats: true,
          showCertifications: true
        },
        about: {
          showTimeline: true,
          showLeadership: true
        }
      }
    }

    return themeDefaults[themeType] || {}
  }

  /**
   * Update customer site theme settings
   */
  async updateSiteSettings(siteId: string, settings: Record<string, any>): Promise<void> {
    await prisma.customerSite.update({
      where: { id: siteId },
      data: {
        themeSettings: settings,
        updatedAt: new Date()
      }
    })

    // Trigger container restart to apply changes
    const site = await prisma.customerSite.findUnique({
      where: { id: siteId }
    })

    if (site?.containerId) {
      await this.restartContainer(site.containerId)
    }
  }

  /**
   * Update customer site customization (branding)
   */
  async updateSiteCustomization(
    siteId: string, 
    customization: Partial<CustomerSite['customization']>
  ): Promise<void> {
    const site = await prisma.customerSite.findUnique({
      where: { id: siteId }
    })

    if (!site) throw new Error('Site not found')

    const updatedCustomization = {
      ...site.customization as any,
      ...customization
    }

    await prisma.customerSite.update({
      where: { id: siteId },
      data: {
        customization: updatedCustomization,
        updatedAt: new Date()
      }
    })

    // Restart container to apply changes
    if (site.containerId) {
      await this.restartContainer(site.containerId)
    }
  }

  /**
   * Setup proxy routing for customer domain
   */
  private async setupProxyRouting(domain: string, containerId: string): Promise<void> {
    try {
      // Get container IP from Docker network
      const container = docker.getContainer(containerId)
      const inspection = await container.inspect()
      const networks = inspection.NetworkSettings.Networks
      const networkName = Object.keys(networks)[0]
      const containerIP = networks[networkName].IPAddress

      // Configure Nginx Proxy Manager via API
      // This would integrate with your existing proxy manager
      const proxyConfig = {
        domain_names: [domain],
        forward_host: containerIP,
        forward_port: 3000,
        ssl_forced: true,
        ssl_provider: 'letsencrypt'
      }

      // Implementation would call Nginx Proxy Manager API
      console.log('Proxy configuration:', proxyConfig)
      
    } catch (error) {
      console.error('Failed to setup proxy routing:', error)
    }
  }

  /**
   * Restart container to apply configuration changes
   */
  private async restartContainer(containerId: string): Promise<void> {
    const container = docker.getContainer(containerId)
    await container.restart()
  }

  /**
   * Delete customer site and cleanup resources
   */
  async deleteCustomerSite(siteId: string): Promise<void> {
    const site = await prisma.customerSite.findUnique({
      where: { id: siteId }
    })

    if (!site) return

    // Stop and remove container
    if (site.containerId) {
      try {
        const container = docker.getContainer(site.containerId)
        await container.stop()
        await container.remove()
      } catch (error) {
        console.error('Failed to remove container:', error)
      }
    }

    // Remove proxy configuration
    await this.removeProxyRouting(site.domain)

    // Delete database record
    await prisma.customerSite.delete({
      where: { id: siteId }
    })
  }

  /**
   * Remove proxy routing configuration
   */
  private async removeProxyRouting(domain: string): Promise<void> {
    // Implementation would call Nginx Proxy Manager API to remove routing
    console.log('Removing proxy configuration for:', domain)
  }

  /**
   * Get customer sites with container status
   */
  async getCustomerSites(customerId: string): Promise<CustomerSite[]> {
    const sites = await prisma.customerSite.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    })

    return sites as CustomerSite[]
  }

  /**
   * Get site performance metrics from container
   */
  async getSiteMetrics(siteId: string): Promise<{
    cpu: number
    memory: number
    network: { rx: number; tx: number }
    status: string
  }> {
    const site = await prisma.customerSite.findUnique({
      where: { id: siteId }
    })

    if (!site?.containerId) {
      throw new Error('Container not found')
    }

    const container = docker.getContainer(site.containerId)
    const stats = await container.stats({ stream: false })

    return {
      cpu: this.calculateCPUPercent(stats),
      memory: stats.memory_stats.usage || 0,
      network: {
        rx: stats.networks?.eth0?.rx_bytes || 0,
        tx: stats.networks?.eth0?.tx_bytes || 0
      },
      status: site.containerStatus
    }
  }

  /**
   * Calculate CPU percentage from Docker stats
   */
  private calculateCPUPercent(stats: any): number {
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - 
                    (stats.precpu_stats?.cpu_usage?.total_usage || 0)
    const systemDelta = stats.cpu_stats.system_cpu_usage - 
                       (stats.precpu_stats?.system_cpu_usage || 0)
    
    if (systemDelta > 0 && cpuDelta > 0) {
      return (cpuDelta / systemDelta) * 100
    }
    return 0
  }
}

export const multiTenantThemeService = new MultiTenantThemeService()