// Memory Optimization Dashboard Component
// Add this to your admin dashboard for real-time optimization monitoring

class MemoryOptimizationDashboard {
    constructor() {
        this.services = {
            ollama: {
                name: 'Ollama AI',
                limit: 512,
                reservation: 256,
                features: ['auto-unload', 'model-tracking'],
                critical: false
            },
            'open-webui': {
                name: 'Open WebUI',
                limit: 768,
                reservation: 512,
                features: ['cache-management', 'session-tracking'],
                critical: true
            },
            flowise: {
                name: 'Flowise AI',
                limit: 512,
                reservation: 256,
                features: ['workflow-optimization'],
                critical: false
            },
            neo4j: {
                name: 'Neo4j Graph DB',
                limit: 512,
                reservation: 384,
                features: ['jvm-tuning', 'heap-optimization'],
                critical: true
            },
            n8n: {
                name: 'N8N Automation',
                limit: 512,
                reservation: 256,
                features: ['workflow-caching'],
                critical: true
            }
        };
        
        this.optimizations = {
            lastCleanup: null,
            totalSaved: 0,
            activeOptimizations: [],
            modelUnloads: 0,
            cacheClears: 0
        };
    }
    
    async fetchOptimizationStatus() {
        try {
            const response = await fetch('https://148.230.93.174:3009/api/metrics');
            const data = await response.json();
            
            // Process container data
            if (data.containers) {
                data.containers.forEach(container => {
                    const serviceName = container.name;
                    if (this.services[serviceName]) {
                        this.services[serviceName].current = this.parseMemoryUsage(container.memUsage);
                        this.services[serviceName].status = container.status;
                    }
                });
            }
            
            // Check for optimization opportunities
            this.checkOptimizationOpportunities(data);
            
            return data;
        } catch (error) {
            console.error('Failed to fetch optimization status:', error);
        }
    }
    
    parseMemoryUsage(memString) {
        // Parse Docker memory string like "234MiB / 512MiB"
        const match = memString.match(/(\d+\.?\d*)([A-Z]+)/i);
        if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            
            // Convert to MB
            if (unit.includes('G')) return value * 1024;
            if (unit.includes('M')) return value;
            if (unit.includes('K')) return value / 1024;
            return value;
        }
        return 0;
    }
    
    checkOptimizationOpportunities(data) {
        const opportunities = [];
        
        // Check Ollama for idle models
        const ollama = this.services.ollama;
        if (ollama.current && ollama.current > 300) {
            opportunities.push({
                service: 'Ollama',
                type: 'model-unload',
                savings: ollama.current - 200,
                action: 'Unload idle models',
                priority: 'medium'
            });
        }
        
        // Check for high memory usage
        if (data.system && data.system.memory.percentage > 80) {
            opportunities.push({
                type: 'high-pressure',
                action: 'Activate emergency memory reduction',
                priority: 'high'
            });
        }
        
        // Check for cache clearing opportunities
        if (data.system && data.system.memory.cached > 4096) {
            opportunities.push({
                type: 'cache-clear',
                savings: data.system.memory.cached * 0.5,
                action: 'Clear system cache',
                priority: 'low'
            });
        }
        
        this.optimizations.opportunities = opportunities;
        return opportunities;
    }
    
    async executeOptimization(optimization) {
        switch (optimization.type) {
            case 'model-unload':
                await this.unloadOllamaModels();
                break;
            case 'cache-clear':
                await this.clearSystemCache();
                break;
            case 'high-pressure':
                await this.activateEmergencyMode();
                break;
        }
    }
    
    async unloadOllamaModels() {
        try {
            // Call server endpoint to unload models
            const response = await fetch('/api/optimize/ollama-unload', { method: 'POST' });
            if (response.ok) {
                this.optimizations.modelUnloads++;
                this.optimizations.lastCleanup = new Date();
                return true;
            }
        } catch (error) {
            console.error('Failed to unload Ollama models:', error);
        }
        return false;
    }
    
    renderDashboard() {
        return `
        <div class="memory-optimization-dashboard">
            <h2 class="text-2xl font-bold mb-4">Memory Optimization Status</h2>
            
            <!-- Optimization Summary -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-800 p-4 rounded">
                    <h3 class="text-sm text-gray-400">Models Unloaded</h3>
                    <p class="text-2xl font-bold">${this.optimizations.modelUnloads}</p>
                </div>
                <div class="bg-gray-800 p-4 rounded">
                    <h3 class="text-sm text-gray-400">Memory Saved</h3>
                    <p class="text-2xl font-bold">${Math.round(this.optimizations.totalSaved)}MB</p>
                </div>
                <div class="bg-gray-800 p-4 rounded">
                    <h3 class="text-sm text-gray-400">Active Optimizations</h3>
                    <p class="text-2xl font-bold">${this.optimizations.activeOptimizations.length}</p>
                </div>
                <div class="bg-gray-800 p-4 rounded">
                    <h3 class="text-sm text-gray-400">Last Cleanup</h3>
                    <p class="text-sm">${this.optimizations.lastCleanup ? 
                        new Date(this.optimizations.lastCleanup).toLocaleTimeString() : 'Never'}</p>
                </div>
            </div>
            
            <!-- Service Status -->
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-3">Service Memory Status</h3>
                <div class="space-y-2">
                    ${Object.entries(this.services).map(([key, service]) => `
                        <div class="bg-gray-800 p-3 rounded flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="${service.critical ? 'text-red-400' : 'text-blue-400'}">●</span>
                                <span>${service.name}</span>
                                ${service.features.map(f => `
                                    <span class="text-xs bg-gray-700 px-2 py-1 rounded">${f}</span>
                                `).join('')}
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="text-right">
                                    <div class="text-sm">${service.current || 0}MB / ${service.limit}MB</div>
                                    <div class="text-xs text-gray-400">Reserved: ${service.reservation}MB</div>
                                </div>
                                <div class="w-32 bg-gray-700 rounded-full h-2">
                                    <div class="bg-blue-500 h-2 rounded-full" 
                                         style="width: ${((service.current || 0) / service.limit) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Optimization Opportunities -->
            ${this.optimizations.opportunities && this.optimizations.opportunities.length > 0 ? `
                <div class="mb-6">
                    <h3 class="text-xl font-semibold mb-3">Optimization Opportunities</h3>
                    <div class="space-y-2">
                        ${this.optimizations.opportunities.map(opp => `
                            <div class="bg-yellow-900 bg-opacity-50 border border-yellow-600 p-3 rounded flex items-center justify-between">
                                <div>
                                    <span class="font-medium">${opp.action}</span>
                                    ${opp.savings ? `<span class="text-sm text-gray-400 ml-2">Save ~${Math.round(opp.savings)}MB</span>` : ''}
                                </div>
                                <button onclick="dashboard.executeOptimization(${JSON.stringify(opp)})" 
                                        class="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">
                                    Optimize
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Auto-Optimization Status -->
            <div class="bg-gray-800 p-4 rounded">
                <h3 class="text-lg font-semibold mb-2">Automated Optimizations</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-400">Ollama Model Auto-Unload:</span>
                        <span class="text-green-400 ml-2">Active (30min idle)</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Dynamic Memory Manager:</span>
                        <span class="text-green-400 ml-2">Active (15min checks)</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Docker Cleanup:</span>
                        <span class="text-green-400 ml-2">Active (6hr cycle)</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Neo4j Optimization:</span>
                        <span class="text-green-400 ml-2">Active (daily)</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

// Initialize dashboard
const memoryOptDashboard = new MemoryOptimizationDashboard();

// Add to your main dashboard update cycle
setInterval(async () => {
    await memoryOptDashboard.fetchOptimizationStatus();
    // Update UI with memoryOptDashboard.renderDashboard()
}, 30000); // Update every 30 seconds