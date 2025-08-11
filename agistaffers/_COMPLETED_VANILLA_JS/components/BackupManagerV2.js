// Backup Management Component V2 - shadcn-ui inspired design
// Uses Tailwind CSS to match shadcn design principles

class BackupManagerV2 {
    constructor(config = {}) {
        this.config = {
            containerId: 'backup-container',
            apiEndpoint: '/api/backups',
            refreshInterval: 30000,
            ...config
        };
        
        this.backups = [];
        this.selectedBackups = new Set();
        this.initialized = false;
        this.refreshInterval = null;
        this.activeTab = 'all';
    }

    async init() {
        if (this.initialized) return;
        
        try {
            await this.createContainer();
            this.setupEventListeners();
            await this.loadBackups();
            this.startAutoRefresh();
            this.initialized = true;
            
            console.log('✅ BackupManagerV2: Initialized successfully');
        } catch (error) {
            console.error('❌ BackupManagerV2: Initialization failed:', error);
        }
    }

    createContainer() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            throw new Error(`Container ${this.config.containerId} not found`);
        }

        container.innerHTML = '';
        container.className = 'p-6 space-y-6';

        const html = `
            <!-- Header Section -->
            <div class="flex flex-col space-y-2">
                <h1 class="text-3xl font-bold tracking-tight">Backup & Recovery Center</h1>
                <p class="text-muted-foreground">Manage and download your server backups</p>
            </div>

            <!-- Quick Actions Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Full Server Backup Card -->
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div class="flex flex-col space-y-1.5 p-6">
                        <div class="flex items-center space-x-4">
                            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <i data-lucide="server" class="h-6 w-6 text-blue-600 dark:text-blue-400"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-semibold">Full Backup</h3>
                                <p class="text-sm text-muted-foreground">Complete server</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 pt-0">
                        <div class="text-2xl font-bold">~35GB</div>
                        <p class="text-xs text-muted-foreground mb-4">Compressed size</p>
                        <button class="full-server-backup-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                            <i data-lucide="download-cloud" class="mr-2 h-4 w-4"></i>
                            Create & Download
                        </button>
                    </div>
                </div>

                <!-- Website Backup Card -->
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div class="flex flex-col space-y-1.5 p-6">
                        <div class="flex items-center space-x-4">
                            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <i data-lucide="globe" class="h-6 w-6 text-green-600 dark:text-green-400"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-semibold">Websites</h3>
                                <p class="text-sm text-muted-foreground">Site files</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 pt-0">
                        <div class="text-2xl font-bold">2 Sites</div>
                        <p class="text-xs text-muted-foreground mb-4">Available</p>
                        <button class="website-backup-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 w-full">
                            <i data-lucide="archive" class="mr-2 h-4 w-4"></i>
                            Backup Sites
                        </button>
                    </div>
                </div>

                <!-- Database Backup Card -->
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div class="flex flex-col space-y-1.5 p-6">
                        <div class="flex items-center space-x-4">
                            <div class="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                                <i data-lucide="database" class="h-6 w-6 text-amber-600 dark:text-amber-400"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-semibold">Databases</h3>
                                <p class="text-sm text-muted-foreground">PostgreSQL</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 pt-0">
                        <div class="text-2xl font-bold">~500MB</div>
                        <p class="text-xs text-muted-foreground mb-4">All databases</p>
                        <button class="database-backup-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-600 text-white hover:bg-amber-700 h-10 px-4 py-2 w-full">
                            <i data-lucide="save" class="mr-2 h-4 w-4"></i>
                            Export DBs
                        </button>
                    </div>
                </div>

                <!-- Container Backup Card -->
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div class="flex flex-col space-y-1.5 p-6">
                        <div class="flex items-center space-x-4">
                            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <i data-lucide="package" class="h-6 w-6 text-purple-600 dark:text-purple-400"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-semibold">Containers</h3>
                                <p class="text-sm text-muted-foreground">Docker</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 pt-0">
                        <div class="text-2xl font-bold">19</div>
                        <p class="text-xs text-muted-foreground mb-4">Running</p>
                        <button class="container-backup-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 w-full">
                            <i data-lucide="layers" class="mr-2 h-4 w-4"></i>
                            Select Containers
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Backups</p>
                            <p class="text-2xl font-bold" id="total-backups">0</p>
                        </div>
                        <i data-lucide="hard-drive" class="h-8 w-8 text-muted-foreground/20"></i>
                    </div>
                </div>
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Size</p>
                            <p class="text-2xl font-bold" id="total-size">0 GB</p>
                        </div>
                        <i data-lucide="pie-chart" class="h-8 w-8 text-muted-foreground/20"></i>
                    </div>
                </div>
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Disk Usage</p>
                            <p class="text-2xl font-bold" id="disk-used">0%</p>
                        </div>
                        <i data-lucide="activity" class="h-8 w-8 text-muted-foreground/20"></i>
                    </div>
                </div>
            </div>

            <!-- Existing Backups Section -->
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="flex flex-col space-y-1.5 p-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-2xl font-semibold">Existing Backups</h3>
                        <button class="refresh-backups-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                            <i data-lucide="refresh-cw" class="mr-2 h-4 w-4"></i>
                            Refresh
                        </button>
                    </div>
                </div>
                <div class="p-6 pt-0">
                    <!-- Tabs -->
                    <div class="w-full">
                        <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full md:w-auto mb-4">
                            <button data-tab="all" class="tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm" data-state="active">
                                All Backups
                            </button>
                            <button data-tab="full-server" class="tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                Full Server
                            </button>
                            <button data-tab="websites" class="tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                Websites
                            </button>
                            <button data-tab="databases" class="tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                Databases
                            </button>
                        </div>
                    </div>

                    <!-- Filters and Actions -->
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div class="flex gap-2">
                            <select id="backup-age-filter" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="">All Ages</option>
                                <option value="today">Today</option>
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                                <option value="old">Older</option>
                            </select>
                        </div>
                        <div class="flex gap-2">
                            <button class="download-selected-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" disabled>
                                <i data-lucide="download" class="mr-2 h-4 w-4"></i>
                                Download Selected
                            </button>
                            <button class="delete-selected-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2" disabled>
                                <i data-lucide="trash-2" class="mr-2 h-4 w-4"></i>
                                Delete Selected
                            </button>
                        </div>
                    </div>

                    <!-- Backup List -->
                    <div class="rounded-md border">
                        <div class="w-full">
                            <div class="backup-list-container" id="backup-list">
                                <div class="p-8 text-center text-muted-foreground">
                                    <div class="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                    <p class="mt-4">Loading backups...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dialogs will be dynamically inserted here -->
            <div id="backup-dialogs"></div>
        `;

        container.insertAdjacentHTML('beforeend', html);
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('backup-manager-v2-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'backup-manager-v2-styles';
        styles.textContent = `
            /* Custom styles matching shadcn-ui design system */
            :root {
                --background: 0 0% 100%;
                --foreground: 222.2 84% 4.9%;
                --card: 0 0% 100%;
                --card-foreground: 222.2 84% 4.9%;
                --popover: 0 0% 100%;
                --popover-foreground: 222.2 84% 4.9%;
                --primary: 222.2 47.4% 11.2%;
                --primary-foreground: 210 40% 98%;
                --secondary: 210 40% 96.1%;
                --secondary-foreground: 222.2 47.4% 11.2%;
                --muted: 210 40% 96.1%;
                --muted-foreground: 215.4 16.3% 46.9%;
                --accent: 210 40% 96.1%;
                --accent-foreground: 222.2 47.4% 11.2%;
                --destructive: 0 84.2% 60.2%;
                --destructive-foreground: 210 40% 98%;
                --border: 214.3 31.8% 91.4%;
                --input: 214.3 31.8% 91.4%;
                --ring: 222.2 84% 4.9%;
            }

            .dark {
                --background: 222.2 84% 4.9%;
                --foreground: 210 40% 98%;
                --card: 222.2 84% 4.9%;
                --card-foreground: 210 40% 98%;
                --popover: 222.2 84% 4.9%;
                --popover-foreground: 210 40% 98%;
                --primary: 210 40% 98%;
                --primary-foreground: 222.2 47.4% 11.2%;
                --secondary: 217.2 32.6% 17.5%;
                --secondary-foreground: 210 40% 98%;
                --muted: 217.2 32.6% 17.5%;
                --muted-foreground: 215 20.2% 65.1%;
                --accent: 217.2 32.6% 17.5%;
                --accent-foreground: 210 40% 98%;
                --destructive: 0 62.8% 30.6%;
                --destructive-foreground: 210 40% 98%;
                --border: 217.2 32.6% 17.5%;
                --input: 217.2 32.6% 17.5%;
                --ring: 212.7 26.8% 83.9%;
            }

            .bg-primary { background-color: hsl(var(--primary)); }
            .text-primary { color: hsl(var(--primary)); }
            .text-primary-foreground { color: hsl(var(--primary-foreground)); }
            .bg-destructive { background-color: hsl(var(--destructive)); }
            .text-destructive { color: hsl(var(--destructive)); }
            .text-destructive-foreground { color: hsl(var(--destructive-foreground)); }
            .bg-muted { background-color: hsl(var(--muted)); }
            .text-muted-foreground { color: hsl(var(--muted-foreground)); }
            .bg-card { background-color: hsl(var(--card)); }
            .text-card-foreground { color: hsl(var(--card-foreground)); }
            .bg-background { background-color: hsl(var(--background)); }
            .bg-accent { background-color: hsl(var(--accent)); }
            .text-accent-foreground { color: hsl(var(--accent-foreground)); }
            .border-input { border-color: hsl(var(--input)); }
            .ring-ring { --tw-ring-color: hsl(var(--ring)); }
            .ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }

            /* Backup list styles */
            .backup-list-container {
                max-height: 600px;
                overflow-y: auto;
            }

            .backup-item {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid hsl(var(--border));
                transition: background-color 0.2s;
            }

            .backup-item:hover {
                background-color: hsl(var(--muted));
            }

            .backup-item.selected {
                background-color: hsl(var(--accent));
            }

            .backup-item-checkbox {
                margin-right: 1rem;
                width: 1rem;
                height: 1rem;
                cursor: pointer;
            }

            .backup-item-info {
                flex: 1;
                min-width: 0;
            }

            .backup-item-name {
                font-weight: 500;
                margin-bottom: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .backup-item-details {
                font-size: 0.875rem;
                color: hsl(var(--muted-foreground));
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .backup-item-actions {
                display: flex;
                gap: 0.5rem;
                margin-left: 1rem;
            }

            /* Full server backup highlight */
            .backup-item.full-server {
                background-color: hsl(217 91% 60% / 0.1);
                border-left: 3px solid hsl(217 91% 60%);
            }

            /* Dialog styles */
            .dialog-backdrop {
                position: fixed;
                inset: 0;
                z-index: 50;
                background-color: rgba(0, 0, 0, 0.8);
                animation: fadeIn 0.15s ease-out;
            }

            .dialog-content {
                position: fixed;
                left: 50%;
                top: 50%;
                z-index: 50;
                transform: translate(-50%, -50%);
                background-color: hsl(var(--background));
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                animation: slideIn 0.15s ease-out;
                max-width: 32rem;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translate(-50%, -48%) scale(0.96);
                }
                to { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            /* Badge styles */
            .badge {
                display: inline-flex;
                align-items: center;
                border-radius: 9999px;
                padding: 0.125rem 0.625rem;
                font-size: 0.75rem;
                font-weight: 600;
                transition: all 0.2s;
            }

            .badge-primary {
                background-color: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
            }

            .badge-secondary {
                background-color: hsl(var(--secondary));
                color: hsl(var(--secondary-foreground));
            }

            .badge-destructive {
                background-color: hsl(var(--destructive));
                color: hsl(var(--destructive-foreground));
            }

            .badge-outline {
                border: 1px solid hsl(var(--border));
                background-color: transparent;
            }

            /* Selection list styles */
            .selection-list {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid hsl(var(--border));
                border-radius: 0.375rem;
                padding: 0.5rem;
                margin-top: 1rem;
                background-color: hsl(var(--muted));
            }

            .selection-item {
                display: flex;
                align-items: center;
                padding: 0.5rem;
                border-radius: 0.25rem;
                transition: background-color 0.2s;
            }

            .selection-item:hover {
                background-color: hsl(var(--accent));
            }

            .selection-item input[type="checkbox"] {
                margin-right: 0.75rem;
                cursor: pointer;
            }

            .selection-item label {
                flex: 1;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .selection-item-info {
                font-size: 0.875rem;
                color: hsl(var(--muted-foreground));
            }
        `;

        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // Refresh button
        document.querySelector('.refresh-backups-btn')?.addEventListener('click', () => {
            this.refreshBackups();
        });

        // Tab triggers
        document.querySelectorAll('.tab-trigger').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Quick action buttons
        document.querySelector('.full-server-backup-btn')?.addEventListener('click', () => {
            this.downloadFullServerBackup();
        });

        document.querySelector('.website-backup-btn')?.addEventListener('click', () => {
            this.showWebsiteBackupDialog();
        });

        document.querySelector('.database-backup-btn')?.addEventListener('click', () => {
            this.createDatabaseBackup();
        });

        document.querySelector('.container-backup-btn')?.addEventListener('click', () => {
            this.showContainerBackupDialog();
        });

        // Bulk action buttons
        document.querySelector('.download-selected-btn')?.addEventListener('click', () => {
            this.downloadSelected();
        });

        document.querySelector('.delete-selected-btn')?.addEventListener('click', () => {
            this.deleteSelected();
        });

        // Filter
        document.getElementById('backup-age-filter')?.addEventListener('change', () => {
            this.applyFilters();
        });
    }

    switchTab(tab) {
        this.activeTab = tab;
        
        // Update tab states
        document.querySelectorAll('.tab-trigger').forEach(trigger => {
            if (trigger.dataset.tab === tab) {
                trigger.dataset.state = 'active';
            } else {
                trigger.removeAttribute('data-state');
            }
        });
        
        this.renderBackups();
    }

    async loadBackups() {
        try {
            const cacheBuster = `?t=${Date.now()}`;
            const response = await fetch(`${this.config.apiEndpoint}${cacheBuster}`, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.backups = data.backups || [];
                this.renderBackups();
                this.updateStats();
            } else {
                console.error('Failed to load backups:', response.statusText);
                this.showError('Failed to load backup list');
            }
            
        } catch (error) {
            console.error('Error loading backups:', error);
            this.showError('Failed to load backup list');
        }
    }

    renderBackups() {
        const backupList = document.getElementById('backup-list');
        if (!backupList) return;

        const filteredBackups = this.getFilteredBackups();

        if (filteredBackups.length === 0) {
            backupList.innerHTML = `
                <div class="p-8 text-center text-muted-foreground">
                    <i data-lucide="archive" class="h-12 w-12 mx-auto mb-4 opacity-50"></i>
                    <h3 class="font-semibold mb-2">No backups found</h3>
                    <p>Create your first backup using the quick actions above.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        backupList.innerHTML = filteredBackups.map(backup => {
            const isFullServer = backup.type === 'full-server';
            const typeIcon = this.getTypeIcon(backup.type);
            const typeBadgeClass = this.getTypeBadgeClass(backup.type);
            
            return `
                <div class="backup-item ${this.selectedBackups.has(backup.name) ? 'selected' : ''} ${isFullServer ? 'full-server' : ''}" data-backup="${backup.name}">
                    <input type="checkbox" class="backup-item-checkbox" 
                           ${this.selectedBackups.has(backup.name) ? 'checked' : ''}
                           onchange="window.backupManagerInstance.toggleSelection('${backup.name}')">
                    
                    <div class="backup-item-info">
                        <div class="backup-item-name">
                            ${typeIcon}
                            <span>${backup.name}</span>
                            ${isFullServer ? '<span class="badge badge-primary ml-2">Full Server</span>' : ''}
                        </div>
                        <div class="backup-item-details">
                            <span class="flex items-center gap-1">
                                <i data-lucide="hard-drive" class="h-3 w-3"></i>
                                ${backup.size}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="calendar" class="h-3 w-3"></i>
                                ${backup.date}
                            </span>
                            <span class="${typeBadgeClass}">${backup.type}</span>
                        </div>
                    </div>
                    
                    <div class="backup-item-actions">
                        <button onclick="window.backupManagerInstance.downloadBackup('${backup.name}')"
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                            <i data-lucide="download" class="h-4 w-4"></i>
                        </button>
                        <button onclick="window.backupManagerInstance.deleteBackup('${backup.name}')"
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-destructive hover:text-destructive-foreground h-9 px-3">
                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Re-create icons
        if (window.lucide) window.lucide.createIcons();
        this.updateSelectionUI();
    }

    getTypeIcon(type) {
        const icons = {
            'full-server': '<i data-lucide="server" class="h-4 w-4 text-blue-600"></i>',
            'websites': '<i data-lucide="globe" class="h-4 w-4 text-green-600"></i>',
            'docker-volumes': '<i data-lucide="package" class="h-4 w-4 text-purple-600"></i>',
            'postgresql': '<i data-lucide="database" class="h-4 w-4 text-amber-600"></i>',
            'configs': '<i data-lucide="settings" class="h-4 w-4 text-gray-600"></i>'
        };
        return icons[type] || '<i data-lucide="file" class="h-4 w-4 text-gray-600"></i>';
    }

    getTypeBadgeClass(type) {
        const classes = {
            'full-server': 'badge badge-primary',
            'websites': 'badge badge-secondary',
            'docker-volumes': 'badge badge-outline',
            'postgresql': 'badge badge-outline',
            'configs': 'badge badge-outline'
        };
        return classes[type] || 'badge badge-outline';
    }

    getFilteredBackups() {
        const ageFilter = document.getElementById('backup-age-filter')?.value || '';
        
        return this.backups.filter(backup => {
            // Tab filter
            if (this.activeTab !== 'all') {
                if (this.activeTab === 'databases' && backup.type !== 'postgresql') return false;
                if (this.activeTab === 'websites' && backup.type !== 'websites') return false;
                if (this.activeTab === 'full-server' && backup.type !== 'full-server') return false;
            }
            
            // Age filter
            if (ageFilter && backup.age !== ageFilter) return false;
            
            return true;
        });
    }

    toggleSelection(backupName) {
        if (this.selectedBackups.has(backupName)) {
            this.selectedBackups.delete(backupName);
        } else {
            this.selectedBackups.add(backupName);
        }
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const count = this.selectedBackups.size;
        const downloadBtn = document.querySelector('.download-selected-btn');
        const deleteBtn = document.querySelector('.delete-selected-btn');
        
        if (downloadBtn) downloadBtn.disabled = count === 0;
        if (deleteBtn) deleteBtn.disabled = count === 0;
    }

    updateStats() {
        const totalBackups = this.backups.length;
        const totalSize = this.backups.reduce((sum, backup) => sum + (backup.sizeBytes || 0), 0);
        const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(1);
        const diskUsedPercent = Math.round((totalSize / (200 * 1024 * 1024 * 1024)) * 100);
        
        document.getElementById('total-backups').textContent = totalBackups;
        document.getElementById('total-size').textContent = `${totalSizeGB} GB`;
        document.getElementById('disk-used').textContent = `${diskUsedPercent}%`;
    }

    refreshBackups() {
        const refreshIcon = document.querySelector('.refresh-backups-btn i');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                refreshIcon.style.animation = '';
            }, 1000);
        }
        this.loadBackups();
    }

    applyFilters() {
        this.renderBackups();
    }

    // Dialog functions
    showDialog(content) {
        const dialogContainer = document.getElementById('backup-dialogs');
        if (!dialogContainer) return;

        const dialogHTML = `
            <div class="dialog-backdrop" onclick="window.backupManagerInstance.closeDialog(event)">
                <div class="dialog-content" onclick="event.stopPropagation()">
                    ${content}
                </div>
            </div>
        `;

        dialogContainer.innerHTML = dialogHTML;
        if (window.lucide) window.lucide.createIcons();
    }

    closeDialog(event) {
        if (event && event.target.classList.contains('dialog-backdrop')) {
            document.getElementById('backup-dialogs').innerHTML = '';
        } else if (!event) {
            document.getElementById('backup-dialogs').innerHTML = '';
        }
    }

    // Backup action methods
    async downloadFullServerBackup() {
        const content = `
            <div class="p-6">
                <h2 class="text-lg font-semibold mb-4">Create Full Server Backup</h2>
                <div class="space-y-4">
                    <div class="rounded-lg border bg-amber-50 dark:bg-amber-900/20 p-4">
                        <div class="flex">
                            <i data-lucide="alert-triangle" class="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5"></i>
                            <div class="ml-3 text-sm">
                                <p class="font-medium text-amber-900 dark:text-amber-200">Large Download</p>
                                <p class="text-amber-800 dark:text-amber-300 mt-1">
                                    This will create a backup of approximately 35-40GB. The process may take several minutes.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <h3 class="font-medium">This backup includes:</h3>
                        <ul class="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• All Docker containers and volumes</li>
                            <li>• All PostgreSQL databases</li>
                            <li>• All website files and assets</li>
                            <li>• System configurations</li>
                            <li>• Everything needed to restore the server</li>
                        </ul>
                    </div>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <button onclick="window.backupManagerInstance.closeDialog()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </button>
                    <button onclick="window.backupManagerInstance.performFullServerBackup()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        <i data-lucide="download-cloud" class="mr-2 h-4 w-4"></i>
                        Create & Download
                    </button>
                </div>
            </div>
        `;
        
        this.showDialog(content);
    }

    async performFullServerBackup() {
        this.closeDialog();
        
        // Show progress dialog
        const progressContent = `
            <div class="p-6 text-center">
                <div class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
                <h3 class="text-lg font-semibold mb-2">Creating Server Backup</h3>
                <p class="text-sm text-muted-foreground">This may take several minutes...</p>
            </div>
        `;
        
        this.showDialog(progressContent);
        
        try {
            const response = await fetch('/api/backups/server/full', {
                method: 'POST',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.closeDialog();
                
                // Download the backup
                const downloadResponse = await fetch(`/api/backups/download/${encodeURIComponent(data.filename)}`, {
                    cache: 'no-cache'
                });
                
                if (downloadResponse.ok) {
                    const blob = await downloadResponse.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = data.filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    
                    this.showSuccess('Full server backup download started!');
                } else {
                    throw new Error('Failed to download backup file');
                }
            } else {
                throw new Error('Failed to create server backup');
            }
        } catch (error) {
            this.closeDialog();
            this.showError(`Backup failed: ${error.message}`);
        }
    }

    async showWebsiteBackupDialog() {
        const websites = [
            { name: 'stepperslife.com', container: 'stepperslife', size: '~150MB' },
            { name: 'admin.agistaffers.com', container: 'admin-dashboard', size: '~100MB' }
        ];
        
        const content = `
            <div class="p-6">
                <h2 class="text-lg font-semibold mb-4">Select Websites to Backup</h2>
                <p class="text-sm text-muted-foreground mb-4">Choose which websites you want to include in the backup:</p>
                
                <div class="selection-list">
                    ${websites.map(site => `
                        <div class="selection-item">
                            <input type="checkbox" id="site-${site.container}" value="${site.container}" checked>
                            <label for="site-${site.container}">
                                <span class="font-medium">${site.name}</span>
                                <span class="selection-item-info">${site.size}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <button onclick="window.backupManagerInstance.closeDialog()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </button>
                    <button onclick="window.backupManagerInstance.performWebsiteBackup()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2">
                        <i data-lucide="archive" class="mr-2 h-4 w-4"></i>
                        Create Backup
                    </button>
                </div>
            </div>
        `;
        
        this.showDialog(content);
    }

    async performWebsiteBackup() {
        const selected = Array.from(document.querySelectorAll('.selection-list input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        if (selected.length === 0) {
            this.showError('Please select at least one website');
            return;
        }
        
        this.closeDialog();
        
        try {
            const response = await fetch('/api/backups/websites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ websites: selected })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.showSuccess(`Website backup created: ${data.filename}`);
                this.refreshBackups();
            } else {
                throw new Error('Failed to create website backup');
            }
        } catch (error) {
            this.showError(`Website backup failed: ${error.message}`);
        }
    }

    async createDatabaseBackup() {
        const content = `
            <div class="p-6">
                <h2 class="text-lg font-semibold mb-4">Create Database Backup</h2>
                <p class="text-sm text-muted-foreground mb-4">
                    This will export all PostgreSQL databases including schema and data.
                </p>
                
                <div class="rounded-lg border bg-blue-50 dark:bg-blue-900/20 p-4">
                    <div class="flex">
                        <i data-lucide="info" class="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5"></i>
                        <div class="ml-3 text-sm">
                            <p class="text-blue-800 dark:text-blue-300">
                                All databases will be exported in a compressed format (~500MB).
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <button onclick="window.backupManagerInstance.closeDialog()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </button>
                    <button onclick="window.backupManagerInstance.performDatabaseBackup()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-600 text-white hover:bg-amber-700 h-10 px-4 py-2">
                        <i data-lucide="database" class="mr-2 h-4 w-4"></i>
                        Export Databases
                    </button>
                </div>
            </div>
        `;
        
        this.showDialog(content);
    }

    async performDatabaseBackup() {
        this.closeDialog();
        
        try {
            const response = await fetch('/api/backups/databases', {
                method: 'POST',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.showSuccess(`Database backup created: ${data.filename}`);
                this.refreshBackups();
            } else {
                throw new Error('Failed to create database backup');
            }
        } catch (error) {
            this.showError(`Database backup failed: ${error.message}`);
        }
    }

    async showContainerBackupDialog() {
        // Show loading state
        const loadingContent = `
            <div class="p-6 text-center">
                <div class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
                <p class="text-sm text-muted-foreground">Loading containers...</p>
            </div>
        `;
        
        this.showDialog(loadingContent);
        
        try {
            const response = await fetch('/api/metrics');
            const data = await response.json();
            const containers = data.docker?.containers || [];
            
            const content = `
                <div class="p-6">
                    <h2 class="text-lg font-semibold mb-4">Select Containers to Backup</h2>
                    <p class="text-sm text-muted-foreground mb-4">Choose which containers and their volumes to backup:</p>
                    
                    <div class="selection-list">
                        ${containers.map(container => `
                            <div class="selection-item">
                                <input type="checkbox" id="container-${container.name}" value="${container.name}">
                                <label for="container-${container.name}">
                                    <span class="font-medium">${container.name}</span>
                                    <span class="selection-item-info">${container.status}</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button onclick="window.backupManagerInstance.closeDialog()" 
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                            Cancel
                        </button>
                        <button onclick="window.backupManagerInstance.performContainerBackup()" 
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2">
                            <i data-lucide="package" class="mr-2 h-4 w-4"></i>
                            Create Backup
                        </button>
                    </div>
                </div>
            `;
            
            this.showDialog(content);
            
        } catch (error) {
            this.closeDialog();
            this.showError('Failed to load container list');
        }
    }

    async performContainerBackup() {
        const selected = Array.from(document.querySelectorAll('.selection-list input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        if (selected.length === 0) {
            this.showError('Please select at least one container');
            return;
        }
        
        this.closeDialog();
        
        try {
            const response = await fetch('/api/backups/containers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ containers: selected })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.showSuccess(`Container backup created: ${data.filename}`);
                this.refreshBackups();
            } else {
                throw new Error('Failed to create container backup');
            }
        } catch (error) {
            this.showError(`Container backup failed: ${error.message}`);
        }
    }

    async downloadBackup(backupName) {
        try {
            const response = await fetch(`/api/backups/download/${encodeURIComponent(backupName)}`, {
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = backupName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showSuccess(`Download started: ${backupName}`);
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            this.showError(`Failed to download: ${backupName}`);
        }
    }

    async deleteBackup(backupName) {
        const content = `
            <div class="p-6">
                <h2 class="text-lg font-semibold mb-4">Delete Backup</h2>
                <div class="rounded-lg border bg-destructive/10 p-4 mb-4">
                    <div class="flex">
                        <i data-lucide="alert-triangle" class="h-4 w-4 text-destructive mt-0.5"></i>
                        <div class="ml-3 text-sm">
                            <p class="font-medium text-destructive">This action cannot be undone</p>
                            <p class="text-destructive/80 mt-1">
                                The backup file will be permanently deleted.
                            </p>
                        </div>
                    </div>
                </div>
                <p class="text-sm text-muted-foreground">
                    Are you sure you want to delete <strong>${backupName}</strong>?
                </p>
                
                <div class="flex justify-end gap-2 mt-6">
                    <button onclick="window.backupManagerInstance.closeDialog()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </button>
                    <button onclick="window.backupManagerInstance.performDeleteBackup('${backupName}')" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                        <i data-lucide="trash-2" class="mr-2 h-4 w-4"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
        
        this.showDialog(content);
    }

    async performDeleteBackup(backupName) {
        this.closeDialog();
        
        try {
            const response = await fetch(`/api/backups/delete/${encodeURIComponent(backupName)}`, {
                method: 'DELETE',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                this.backups = this.backups.filter(b => b.name !== backupName);
                this.selectedBackups.delete(backupName);
                this.renderBackups();
                this.updateStats();
                this.showSuccess(`Deleted: ${backupName}`);
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            this.showError(`Failed to delete: ${backupName}`);
        }
    }

    async downloadSelected() {
        const selected = Array.from(this.selectedBackups);
        if (selected.length === 0) return;
        
        for (const backupName of selected) {
            await this.downloadBackup(backupName);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async deleteSelected() {
        const selected = Array.from(this.selectedBackups);
        if (selected.length === 0) return;
        
        const content = `
            <div class="p-6">
                <h2 class="text-lg font-semibold mb-4">Delete Multiple Backups</h2>
                <div class="rounded-lg border bg-destructive/10 p-4 mb-4">
                    <div class="flex">
                        <i data-lucide="alert-triangle" class="h-4 w-4 text-destructive mt-0.5"></i>
                        <div class="ml-3 text-sm">
                            <p class="font-medium text-destructive">This action cannot be undone</p>
                            <p class="text-destructive/80 mt-1">
                                ${selected.length} backup(s) will be permanently deleted.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="selection-list max-h-48">
                    ${selected.map(name => `<div class="text-sm py-1">• ${name}</div>`).join('')}
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <button onclick="window.backupManagerInstance.closeDialog()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </button>
                    <button onclick="window.backupManagerInstance.performDeleteSelected()" 
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                        <i data-lucide="trash-2" class="mr-2 h-4 w-4"></i>
                        Delete All
                    </button>
                </div>
            </div>
        `;
        
        this.showDialog(content);
    }

    async performDeleteSelected() {
        const selected = Array.from(this.selectedBackups);
        this.closeDialog();
        
        for (const backupName of selected) {
            await this.performDeleteBackup(backupName);
        }
    }

    // Utility methods
    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5';
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="check-circle" class="h-5 w-5"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5';
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="x-circle" class="h-5 w-5"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            this.loadBackups();
        }, this.config.refreshInterval);
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.initialized = false;
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.BackupManagerV2 = BackupManagerV2;
    window.backupManagerInstance = null;
}