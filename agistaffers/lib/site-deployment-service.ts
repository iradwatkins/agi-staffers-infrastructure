import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export interface DeploymentOptions {
  siteId: string;
  domain: string;
  templatePath: string;
  customConfig?: Record<string, any>;
  sslEnabled?: boolean;
}

export interface DeploymentResult {
  success: boolean;
  containerId?: string;
  error?: string;
  logs?: string[];
}

export class SiteDeploymentService {
  private static instance: SiteDeploymentService;
  private deploymentQueue: Map<string, DeploymentOptions> = new Map();
  private isProcessing = false;

  static getInstance(): SiteDeploymentService {
    if (!SiteDeploymentService.instance) {
      SiteDeploymentService.instance = new SiteDeploymentService();
    }
    return SiteDeploymentService.instance;
  }

  /**
   * Queue a site for deployment
   */
  async queueDeployment(options: DeploymentOptions): Promise<void> {
    console.log(`Queueing deployment for site: ${options.siteId}`);
    
    // Update site status to 'queued'
    await prisma.customer_sites.update({
      where: { id: options.siteId },
      data: { 
        status: 'queued',
        deployment_config: {
          ...options.customConfig,
          queued_at: new Date().toISOString()
        }
      }
    });

    this.deploymentQueue.set(options.siteId, options);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process the deployment queue
   */
  private async processQueue(): Promise<void> {
    if (this.deploymentQueue.size === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    
    // Get next deployment
    const [siteId, options] = this.deploymentQueue.entries().next().value;
    this.deploymentQueue.delete(siteId);

    try {
      console.log(`Processing deployment for site: ${siteId}`);
      
      // Update status to 'deploying'
      await prisma.customer_sites.update({
        where: { id: siteId },
        data: { 
          status: 'deploying',
          deployment_config: {
            ...options.customConfig,
            started_at: new Date().toISOString()
          }
        }
      });

      // Perform the actual deployment
      const result = await this.deployContainer(options);
      
      if (result.success) {
        // Update status to 'active'
        await prisma.customer_sites.update({
          where: { id: siteId },
          data: { 
            status: 'active',
            container_id: result.containerId,
            deployment_config: {
              ...options.customConfig,
              completed_at: new Date().toISOString(),
              container_id: result.containerId
            }
          }
        });

        // Configure Caddy for the new domain
        await this.configureCaddy(options.domain, result.containerId!);
        
        console.log(`✅ Deployment successful for site: ${siteId}`);
        
        // Send notification
        await this.sendDeploymentNotification(siteId, 'success', {
          domain: options.domain,
          container_id: result.containerId
        });
        
      } else {
        // Update status to 'failed'
        await prisma.customer_sites.update({
          where: { id: siteId },
          data: { 
            status: 'failed',
            deployment_config: {
              ...options.customConfig,
              failed_at: new Date().toISOString(),
              error: result.error
            }
          }
        });

        console.log(`❌ Deployment failed for site: ${siteId}`, result.error);
        
        // Send notification
        await this.sendDeploymentNotification(siteId, 'failed', {
          error: result.error
        });
      }
      
    } catch (error) {
      console.error(`Deployment error for site ${siteId}:`, error);
      
      // Update status to 'failed'
      await prisma.customer_sites.update({
        where: { id: siteId },
        data: { 
          status: 'failed',
          deployment_config: {
            ...options.customConfig,
            failed_at: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      });
    }

    // Continue processing queue
    setTimeout(() => this.processQueue(), 1000);
  }

  /**
   * Deploy a Docker container for the site
   */
  private async deployContainer(options: DeploymentOptions): Promise<DeploymentResult> {
    try {
      const { siteId, domain, templatePath, customConfig } = options;
      
      // Generate unique container name
      const containerName = `site-${siteId.substring(0, 8)}`;
      const port = await this.getAvailablePort();
      
      // Create container build context
      const buildContext = await this.prepareBuildContext(templatePath, customConfig);
      
      // Build Docker image
      const imageName = `agistaffers/site-${siteId}`;
      const buildCommand = `docker build -t ${imageName} ${buildContext}`;
      
      console.log(`Building Docker image: ${buildCommand}`);
      const { stdout: buildOutput } = await execAsync(buildCommand);
      
      // Run container
      const runCommand = [
        'docker run -d',
        `--name ${containerName}`,
        `--restart unless-stopped`,
        `-p ${port}:80`,
        `-e DOMAIN=${domain}`,
        `-e SITE_ID=${siteId}`,
        customConfig?.env ? Object.entries(customConfig.env).map(([k, v]) => `-e ${k}="${v}"`).join(' ') : '',
        imageName
      ].filter(Boolean).join(' ');
      
      console.log(`Starting container: ${runCommand}`);
      const { stdout: containerId } = await execAsync(runCommand);
      
      // Wait for container to be ready
      await this.waitForContainerReady(containerName);
      
      return {
        success: true,
        containerId: containerId.trim(),
        logs: [buildOutput]
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      };
    }
  }

  /**
   * Prepare build context from template
   */
  private async prepareBuildContext(templatePath: string, customConfig?: Record<string, any>): Promise<string> {
    const buildDir = `/tmp/site-build-${Date.now()}`;
    
    // Copy template files
    await execAsync(`cp -r ${templatePath} ${buildDir}`);
    
    // Apply custom configuration if provided
    if (customConfig) {
      const configPath = path.join(buildDir, 'config.json');
      await fs.writeFile(configPath, JSON.stringify(customConfig, null, 2));
      
      // If there's a custom Dockerfile, use it
      if (customConfig.dockerfile) {
        const dockerfilePath = path.join(buildDir, 'Dockerfile');
        await fs.writeFile(dockerfilePath, customConfig.dockerfile);
      }
    }
    
    // Ensure Dockerfile exists
    const dockerfilePath = path.join(buildDir, 'Dockerfile');
    try {
      await fs.access(dockerfilePath);
    } catch {
      // Create default Dockerfile for static sites
      const defaultDockerfile = `
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
      `.trim();
      await fs.writeFile(dockerfilePath, defaultDockerfile);
    }
    
    return buildDir;
  }

  /**
   * Configure Caddy reverse proxy for the new site
   */
  private async configureCaddy(domain: string, containerId: string): Promise<void> {
    try {
      // Get container port
      const { stdout: inspectOutput } = await execAsync(`docker inspect ${containerId}`);
      const containerInfo = JSON.parse(inspectOutput)[0];
      const portBinding = containerInfo.NetworkSettings.Ports['80/tcp'];
      const containerPort = portBinding ? portBinding[0].HostPort : '80';
      
      // Create Caddy configuration
      const caddyConfig = `
${domain} {
    reverse_proxy localhost:${containerPort}
    tls {
        on_demand
    }
    log {
        output file /var/log/caddy/${domain}.log
    }
}
      `.trim();
      
      // Write Caddy config file
      const configPath = `/etc/caddy/sites/${domain}.caddy`;
      await execAsync(`echo '${caddyConfig}' | sudo tee ${configPath}`);
      
      // Reload Caddy configuration
      await execAsync('sudo systemctl reload caddy');
      
      console.log(`✅ Caddy configured for domain: ${domain}`);
      
    } catch (error) {
      console.error(`Failed to configure Caddy for ${domain}:`, error);
      throw error;
    }
  }

  /**
   * Get an available port for container
   */
  private async getAvailablePort(): Promise<number> {
    const startPort = 8000;
    const endPort = 9000;
    
    for (let port = startPort; port <= endPort; port++) {
      try {
        const { stdout } = await execAsync(`netstat -tlnp | grep :${port}`);
        if (!stdout.trim()) {
          return port;
        }
      } catch {
        return port; // netstat error usually means port is available
      }
    }
    
    throw new Error('No available ports in range 8000-9000');
  }

  /**
   * Wait for container to be ready
   */
  private async waitForContainerReady(containerName: string, timeoutMs: number = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const { stdout } = await execAsync(`docker exec ${containerName} curl -f http://localhost || echo "not ready"`);
        if (!stdout.includes('not ready')) {
          return;
        }
      } catch {
        // Container not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Container ${containerName} not ready after ${timeoutMs}ms`);
  }

  /**
   * Send deployment notification
   */
  private async sendDeploymentNotification(siteId: string, status: 'success' | 'failed', details: any): Promise<void> {
    try {
      const site = await prisma.customer_sites.findUnique({
        where: { id: siteId },
        include: { customers: true }
      });
      
      if (!site) return;
      
      const message = status === 'success' 
        ? `✅ Site deployed successfully: ${site.domain}`
        : `❌ Site deployment failed: ${site.domain}`;
      
      // Send push notification
      await fetch('http://localhost:3011/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Site Deployment',
          body: message,
          data: {
            type: 'site-deployment',
            status,
            site_id: siteId,
            domain: site.domain,
            customer: site.customers.company_name,
            ...details
          }
        })
      });
      
    } catch (error) {
      console.error('Failed to send deployment notification:', error);
    }
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(siteId: string): Promise<any> {
    const site = await prisma.customer_sites.findUnique({
      where: { id: siteId },
      include: {
        customers: true,
        site_templates: true
      }
    });
    
    return {
      site,
      isQueued: this.deploymentQueue.has(siteId),
      queuePosition: Array.from(this.deploymentQueue.keys()).indexOf(siteId) + 1,
      totalInQueue: this.deploymentQueue.size
    };
  }

  /**
   * Cancel deployment
   */
  async cancelDeployment(siteId: string): Promise<boolean> {
    if (this.deploymentQueue.has(siteId)) {
      this.deploymentQueue.delete(siteId);
      
      // Update status
      await prisma.customer_sites.update({
        where: { id: siteId },
        data: { status: 'cancelled' }
      });
      
      return true;
    }
    
    return false;
  }
}