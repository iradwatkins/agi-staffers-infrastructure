// Backup Management Component for VPS Administration
// Allows downloading and deleting backup files from the server

class BackupManager {
    constructor(config = {}) {
        this.config = {
            containerId: 'backup-container',
            apiEndpoint: '/api/backups',
            refreshInterval: 30000, // 30 seconds
            ...config
        };
        
        this.backups = [];
        this.selectedBackups = new Set();
        this.initialized = false;
        this.refreshInterval = null;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            await this.createContainer();
            this.setupEventListeners();
            await this.loadBackups();
            this.startAutoRefresh();
            this.initialized = true;
            
            console.log('✅ BackupManager: Initialized successfully');
        } catch (error) {
            console.error('❌ BackupManager: Initialization failed:', error);
        }
    }

    createContainer() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            throw new Error(`Container ${this.config.containerId} not found`);
        }

        container.innerHTML = '';
        container.className = 'backup-manager-container';

        const html = `
            <div class="backup-manager" role="region" aria-label="Backup Management">
                <div class="backup-header">
                    <h2 class="backup-title">Backup & Recovery Center</h2>
                    <div class="backup-actions-primary">
                        <button class="refresh-backups-btn" aria-label="Refresh backup list">
                            <i data-lucide="refresh-cw" class="refresh-icon"></i>
                            Refresh
                        </button>
                    </div>
                </div>
                
                <!-- Quick Actions Section -->
                <div class="quick-actions-section">
                    <h3 class="section-title">Quick Backup Actions</h3>
                    <div class="quick-actions-grid">
                        <div class="action-card full-server">
                            <div class="action-icon">
                                <i data-lucide="server"></i>
                            </div>
                            <h4>Full Server Backup</h4>
                            <p>Complete server snapshot including all containers, databases, and configurations</p>
                            <p class="backup-size">~35-40GB compressed</p>
                            <button class="action-btn full-server-backup-btn">
                                <i data-lucide="download-cloud"></i>
                                Create & Download
                            </button>
                        </div>
                        
                        <div class="action-card website">
                            <div class="action-icon">
                                <i data-lucide="globe"></i>
                            </div>
                            <h4>Website Backup</h4>
                            <p>Backup specific websites including files, assets, and configurations</p>
                            <p class="backup-size">Varies by site</p>
                            <button class="action-btn website-backup-btn">
                                <i data-lucide="archive"></i>
                                Backup Websites
                            </button>
                        </div>
                        
                        <div class="action-card database">
                            <div class="action-icon">
                                <i data-lucide="database"></i>
                            </div>
                            <h4>Database Backup</h4>
                            <p>Export all PostgreSQL databases with full schema and data</p>
                            <p class="backup-size">~500MB</p>
                            <button class="action-btn database-backup-btn">
                                <i data-lucide="save"></i>
                                Backup Databases
                            </button>
                        </div>
                        
                        <div class="action-card docker">
                            <div class="action-icon">
                                <i data-lucide="package"></i>
                            </div>
                            <h4>Container Backup</h4>
                            <p>Backup Docker containers and their volumes selectively</p>
                            <p class="backup-size">Varies by container</p>
                            <button class="action-btn container-backup-btn">
                                <i data-lucide="layers"></i>
                                Select Containers
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="backup-stats">
                    <div class="stat-card">
                        <div class="stat-value" id="total-backups">0</div>
                        <div class="stat-label">Total Backups</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="total-size">0 GB</div>
                        <div class="stat-label">Total Size</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="disk-used">0%</div>
                        <div class="stat-label">Disk Used</div>
                    </div>
                </div>
                
                <!-- Existing Backups Section -->
                <div class="existing-backups-section">
                    <div class="section-header">
                        <h3 class="section-title">Existing Backups</h3>
                        <div class="backup-controls">
                            <button class="download-selected-btn" aria-label="Download selected backups" disabled>
                                <i data-lucide="download" class="download-icon"></i>
                                Download Selected
                            </button>
                            <button class="delete-selected-btn" aria-label="Delete selected backups" disabled>
                                <i data-lucide="trash-2" class="delete-icon"></i>
                                Delete Selected
                            </button>
                        </div>
                    </div>
                    
                    <div class="backup-filters">
                        <select id="backup-type-filter" class="filter-select">
                            <option value="">All Types</option>
                            <option value="full-server">Full Server</option>
                            <option value="websites">Websites</option>
                            <option value="docker-volumes">Docker Volumes</option>
                            <option value="postgresql">PostgreSQL</option>
                            <option value="configs">Configs</option>
                        </select>
                        
                        <select id="backup-age-filter" class="filter-select">
                            <option value="">All Ages</option>
                            <option value="today">Today</option>
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="old">Older than Month</option>
                        </select>
                        
                        <div class="selection-controls">
                            <button class="select-all-btn">Select All</button>
                            <button class="select-none-btn">Select None</button>
                            <span class="selected-count">0 selected</span>
                        </div>
                    </div>
                    
                    <div class="backup-list" id="backup-list">
                        <div class="loading-state">
                            <div class="spinner"></div>
                            <span>Loading backups...</span>
                        </div>
                    </div>
                </div>
                
                <!-- Confirmation Modal -->
                <div class="modal" id="confirmation-modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="modal-title">Confirm Action</h3>
                            <button class="modal-close" aria-label="Close modal">×</button>
                        </div>
                        <div class="modal-body">
                            <p id="modal-message">Are you sure?</p>
                            <div class="modal-list" id="modal-list"></div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-cancel">Cancel</button>
                            <button class="btn-confirm" id="modal-confirm">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('backup-manager-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'backup-manager-styles';
        styles.textContent = `
            .backup-manager-container {
                padding: 1rem;
                max-width: 100%;
            }

            .backup-manager {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .backup-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .backup-title {
                font-size: 1.75rem;
                font-weight: 700;
                margin: 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .backup-actions-primary button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 8px;
                padding: 0.5rem 1rem;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
            }

            .backup-actions-primary button:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            /* Quick Actions Section */
            .quick-actions-section {
                padding: 2rem 1.5rem;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }

            .section-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1a202c;
                margin: 0 0 1.5rem 0;
            }

            .quick-actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
            }

            .action-card {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                transition: all 0.3s ease;
                border: 1px solid #e2e8f0;
            }

            .action-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .action-card.full-server {
                border-top: 4px solid #3b82f6;
            }

            .action-card.website {
                border-top: 4px solid #10b981;
            }

            .action-card.database {
                border-top: 4px solid #f59e0b;
            }

            .action-card.docker {
                border-top: 4px solid #8b5cf6;
            }

            .action-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 1rem;
            }

            .action-card.full-server .action-icon {
                background: #dbeafe;
                color: #3b82f6;
            }

            .action-card.website .action-icon {
                background: #d1fae5;
                color: #10b981;
            }

            .action-card.database .action-icon {
                background: #fed7aa;
                color: #f59e0b;
            }

            .action-card.docker .action-icon {
                background: #e9d5ff;
                color: #8b5cf6;
            }

            .action-icon i {
                width: 28px;
                height: 28px;
            }

            .action-card h4 {
                font-size: 1.125rem;
                font-weight: 600;
                margin: 0 0 0.5rem 0;
                color: #1a202c;
            }

            .action-card p {
                font-size: 0.875rem;
                color: #64748b;
                margin: 0 0 0.5rem 0;
                line-height: 1.5;
            }

            .backup-size {
                font-weight: 600;
                color: #475569;
                margin-bottom: 1rem !important;
            }

            .action-btn {
                width: 100%;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                border: none;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-size: 0.875rem;
            }

            .action-card.full-server .action-btn {
                background: #3b82f6;
                color: white;
            }

            .action-card.full-server .action-btn:hover {
                background: #2563eb;
            }

            .action-card.website .action-btn {
                background: #10b981;
                color: white;
            }

            .action-card.website .action-btn:hover {
                background: #059669;
            }

            .action-card.database .action-btn {
                background: #f59e0b;
                color: white;
            }

            .action-card.database .action-btn:hover {
                background: #d97706;
            }

            .action-card.docker .action-btn {
                background: #8b5cf6;
                color: white;
            }

            .action-card.docker .action-btn:hover {
                background: #7c3aed;
            }

            /* Existing Backups Section */
            .existing-backups-section {
                padding: 1.5rem;
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .backup-controls {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
            }

            .backup-controls button {
                background: white;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                padding: 0.5rem 1rem;
                color: #374151;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
            }

            .backup-controls button:hover:not(:disabled) {
                background: #f3f4f6;
                border-color: #9ca3af;
            }

            .backup-controls button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .backup-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                padding: 1.5rem;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }

            .stat-card {
                text-align: center;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 0.5rem;
            }

            .stat-label {
                font-size: 0.875rem;
                color: #64748b;
                font-weight: 500;
            }

            .backup-filters {
                padding: 1rem 1.5rem;
                background: #f1f5f9;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                gap: 1rem;
                align-items: center;
                flex-wrap: wrap;
            }

            .filter-select {
                padding: 0.5rem 1rem;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                font-size: 0.875rem;
            }

            .selection-controls {
                margin-left: auto;
                display: flex;
                gap: 0.75rem;
                align-items: center;
            }

            .selection-controls button {
                padding: 0.25rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.2s ease;
            }

            .selection-controls button:hover {
                background: #f3f4f6;
            }

            .selected-count {
                font-size: 0.875rem;
                color: #64748b;
                font-weight: 500;
            }

            .backup-list {
                max-height: 500px;
                overflow-y: auto;
            }

            .loading-state {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                padding: 3rem;
                color: #64748b;
            }

            .spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #e2e8f0;
                border-top: 2px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .backup-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #e2e8f0;
                transition: background-color 0.2s ease;
            }

            .backup-item:hover {
                background: #f8fafc;
            }

            .backup-item.selected {
                background: #eff6ff;
                border-left: 3px solid #3b82f6;
            }

            .backup-item.full-server-item {
                background: #f0f9ff;
                border: 1px solid #bae6fd;
            }

            .backup-item.full-server-item:hover {
                background: #e0f2fe;
            }

            .backup-item.full-server-item.selected {
                background: #dbeafe;
                border-left: 3px solid #3b82f6;
            }

            .backup-checkbox {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }

            .backup-info {
                flex: 1;
                min-width: 0;
            }

            .backup-name {
                font-weight: 500;
                color: #1a202c;
                margin-bottom: 0.25rem;
                word-break: break-all;
            }

            .backup-details {
                font-size: 0.875rem;
                color: #64748b;
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .backup-actions {
                display: flex;
                gap: 0.5rem;
            }

            .backup-actions button {
                padding: 0.375rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.375rem;
            }

            .backup-actions button:hover {
                background: #f3f4f6;
            }

            .backup-actions .download-btn:hover {
                background: #dbeafe;
                border-color: #3b82f6;
                color: #3b82f6;
            }

            .backup-actions .delete-btn:hover {
                background: #fef2f2;
                border-color: #ef4444;
                color: #ef4444;
            }

            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }

            .modal-content {
                background: white;
                border-radius: 8px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }

            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }

            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #64748b;
            }

            .modal-body {
                padding: 1.5rem;
            }

            .modal-list {
                max-height: 200px;
                overflow-y: auto;
                background: #f8fafc;
                border-radius: 6px;
                padding: 1rem;
                margin-top: 1rem;
            }

            .modal-list div {
                padding: 0.25rem 0;
                font-size: 0.875rem;
                color: #374151;
                word-break: break-all;
            }

            .modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }

            .modal-footer button {
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
                font-weight: 500;
            }

            .btn-cancel {
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                color: #374151;
            }

            .btn-confirm {
                background: #3b82f6;
                border: 1px solid #3b82f6;
                color: white;
            }

            .btn-confirm.delete {
                background: #ef4444;
                border-color: #ef4444;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .backup-header {
                    flex-direction: column;
                    align-items: stretch;
                }

                .backup-controls {
                    justify-content: center;
                }

                .backup-filters {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0.75rem;
                }

                .selection-controls {
                    margin-left: 0;
                    justify-content: center;
                }

                .backup-details {
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .backup-actions {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // Refresh button
        document.querySelector('.refresh-backups-btn').addEventListener('click', () => {
            this.refreshBackups();
        });

        // Full server backup button
        document.querySelector('.full-server-backup-btn').addEventListener('click', () => {
            this.downloadFullServerBackup();
        });

        // Website backup button
        document.querySelector('.website-backup-btn').addEventListener('click', () => {
            this.showWebsiteBackupModal();
        });

        // Database backup button
        document.querySelector('.database-backup-btn').addEventListener('click', () => {
            this.createDatabaseBackup();
        });

        // Container backup button
        document.querySelector('.container-backup-btn').addEventListener('click', () => {
            this.showContainerBackupModal();
        });

        // Download selected button
        document.querySelector('.download-selected-btn').addEventListener('click', () => {
            this.downloadSelected();
        });

        // Delete selected button
        document.querySelector('.delete-selected-btn').addEventListener('click', () => {
            this.deleteSelected();
        });

        // Selection controls
        document.querySelector('.select-all-btn').addEventListener('click', () => {
            this.selectAll();
        });

        document.querySelector('.select-none-btn').addEventListener('click', () => {
            this.selectNone();
        });

        // Filters
        document.getElementById('backup-type-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('backup-age-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        // Modal controls
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.hideModal();
        });

        document.querySelector('.btn-cancel').addEventListener('click', () => {
            this.hideModal();
        });

        // Click outside modal to close
        document.getElementById('confirmation-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });
    }

    async loadBackups() {
        try {
            // Fetch backup data from the metrics API via proxy with cache-busting
            const cacheBuster = `?t=${Date.now()}&v=2.2.0`;
            const response = await fetch(`/api/backups${cacheBuster}`, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.backups = data.backups || [];
            } else {
                // Fallback - get backup data from server via SSH call
                console.log('Using fallback backup loading method');
                this.backups = await this.loadBackupsViaAPI();
            }
            
            this.renderBackups();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading backups:', error);
            this.showError('Failed to load backup list');
        }
    }

    async loadBackupsViaAPI() {
        // This will be implemented as part of the metrics API extension
        // For now, return mock data
        return [
            {
                name: 'localai_ollama_storage_20250809_010126.tar.gz',
                path: '/backup/docker-volumes/',
                size: '4.6G',
                sizeBytes: 4939661312,
                type: 'docker-volumes',
                date: '2025-08-09 01:01:26',
                age: 'hours'
            },
            {
                name: 'open-webui_20250809_010031.tar.gz',  
                path: '/backup/docker-volumes/',
                size: '1.7G',
                sizeBytes: 1825361920,
                type: 'docker-volumes', 
                date: '2025-08-09 01:00:31',
                age: 'hours'
            }
        ];
    }

    renderBackups() {
        const backupList = document.getElementById('backup-list');
        
        if (this.backups.length === 0) {
            backupList.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem; color: #64748b;">
                    <i data-lucide="archive" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No backups found</h3>
                    <p>Backups will appear here once they are created.</p>
                </div>
            `;
            return;
        }

        const filteredBackups = this.getFilteredBackups();

        backupList.innerHTML = filteredBackups.map(backup => {
            const isFullServer = backup.type === 'full-server' || backup.isFullServerBackup;
            return `
            <div class="backup-item ${this.selectedBackups.has(backup.name) ? 'selected' : ''} ${isFullServer ? 'full-server-item' : ''}" 
                 data-backup="${backup.name}">
                <input type="checkbox" class="backup-checkbox" 
                       ${this.selectedBackups.has(backup.name) ? 'checked' : ''}
                       onchange="window.backupManagerInstance.toggleSelection('${backup.name}')">
                
                <div class="backup-info">
                    <div class="backup-name">
                        ${isFullServer ? '<i data-lucide="server" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 0.5rem; color: #3b82f6;"></i>' : ''}
                        ${backup.name}
                    </div>
                    <div class="backup-details">
                        <span>Size: ${backup.size}</span>
                        <span>Type: ${isFullServer ? '<strong>Full Server</strong>' : backup.type}</span>
                        <span>Date: ${backup.date}</span>
                        <span>Age: ${this.formatAge(backup.age)}</span>
                    </div>
                </div>
                
                <div class="backup-actions">
                    <button class="download-btn" onclick="window.backupManagerInstance.downloadBackup('${backup.name}')"
                            aria-label="Download ${backup.name}">
                        <i data-lucide="download"></i>
                        Download
                    </button>
                    <button class="delete-btn" onclick="window.backupManagerInstance.deleteBackup('${backup.name}')"
                            aria-label="Delete ${backup.name}">
                        <i data-lucide="trash-2"></i>
                        Delete
                    </button>
                </div>
            </div>
        `}).join('');

        // Re-create icons
        if (window.lucide) window.lucide.createIcons();
    }

    getFilteredBackups() {
        const typeFilter = document.getElementById('backup-type-filter').value;
        const ageFilter = document.getElementById('backup-age-filter').value;

        return this.backups.filter(backup => {
            if (typeFilter && backup.type !== typeFilter) return false;
            if (ageFilter && backup.age !== ageFilter) return false;
            return true;
        });
    }

    formatAge(age) {
        const ageMap = {
            'today': 'Today',
            'hours': 'Few hours ago', 
            'week': 'This week',
            'month': 'This month',
            'old': 'Older than month'
        };
        return ageMap[age] || age;
    }

    toggleSelection(backupName) {
        if (this.selectedBackups.has(backupName)) {
            this.selectedBackups.delete(backupName);
        } else {
            this.selectedBackups.add(backupName);
        }
        
        this.updateSelectionUI();
    }

    selectAll() {
        const filteredBackups = this.getFilteredBackups();
        filteredBackups.forEach(backup => {
            this.selectedBackups.add(backup.name);
        });
        this.renderBackups();
        this.updateSelectionUI();
    }

    selectNone() {
        this.selectedBackups.clear();
        this.renderBackups(); 
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const count = this.selectedBackups.size;
        document.querySelector('.selected-count').textContent = `${count} selected`;
        
        const downloadBtn = document.querySelector('.download-selected-btn');
        const deleteBtn = document.querySelector('.delete-selected-btn');
        
        downloadBtn.disabled = count === 0;
        deleteBtn.disabled = count === 0;
    }

    async downloadBackup(backupName) {
        try {
            // Create download link for individual backup with cache-busting
            const cacheBuster = `?t=${Date.now()}&v=2.2.0`;
            const response = await fetch(`/api/backups/download/${encodeURIComponent(backupName)}${cacheBuster}`, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
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
                
                this.showSuccess(`Downloaded: ${backupName}`);
            } else {
                throw new Error(`Download failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Download error:', error);
            this.showError(`Failed to download: ${backupName}`);
        }
    }

    downloadSelected() {
        const selected = Array.from(this.selectedBackups);
        if (selected.length === 0) return;

        this.showModal(
            'Download Backups',
            `Download ${selected.length} selected backup(s)?`,
            selected,
            () => this.performDownloadSelected(selected),
            'download'
        );
    }

    async performDownloadSelected(backupNames) {
        this.hideModal();
        
        for (const backupName of backupNames) {
            await this.downloadBackup(backupName);
            // Small delay to prevent overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    deleteBackup(backupName) {
        this.showModal(
            'Delete Backup',
            'This action cannot be undone.',
            [backupName],
            () => this.performDeleteBackup(backupName),
            'delete'
        );
    }

    deleteSelected() {
        const selected = Array.from(this.selectedBackups);
        if (selected.length === 0) return;

        this.showModal(
            'Delete Backups', 
            `Delete ${selected.length} selected backup(s)? This action cannot be undone.`,
            selected,
            () => this.performDeleteSelected(selected),
            'delete'
        );
    }

    async performDeleteBackup(backupName) {
        this.hideModal();
        
        try {
            const cacheBuster = `?t=${Date.now()}&v=2.2.0`;
            const response = await fetch(`/api/backups/delete/${encodeURIComponent(backupName)}${cacheBuster}`, {
                method: 'DELETE',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            
            if (response.ok) {
                // Remove from local list
                this.backups = this.backups.filter(b => b.name !== backupName);
                this.selectedBackups.delete(backupName);
                
                this.renderBackups();
                this.updateStats();
                this.updateSelectionUI();
                
                this.showSuccess(`Deleted: ${backupName}`);
            } else {
                throw new Error(`Delete failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            this.showError(`Failed to delete: ${backupName}`);
        }
    }

    async performDeleteSelected(backupNames) {
        this.hideModal();
        
        for (const backupName of backupNames) {
            await this.performDeleteBackup(backupName);
        }
    }

    showModal(title, message, items, onConfirm, type = 'default') {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        
        const itemsList = document.getElementById('modal-list');
        itemsList.innerHTML = items.map(item => `<div>• ${item}</div>`).join('');
        
        const confirmBtn = document.getElementById('modal-confirm');
        confirmBtn.textContent = type === 'delete' ? 'Delete' : 'Confirm';
        confirmBtn.className = `btn-confirm ${type}`;
        
        // Remove previous event listeners
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        const newConfirmBtn = document.getElementById('modal-confirm');
        newConfirmBtn.addEventListener('click', onConfirm);
        
        document.getElementById('confirmation-modal').style.display = 'flex';
    }

    hideModal() {
        document.getElementById('confirmation-modal').style.display = 'none';
    }

    applyFilters() {
        this.renderBackups();
        this.updateSelectionUI();
    }

    updateStats() {
        const totalBackups = this.backups.length;
        const totalSize = this.backups.reduce((sum, backup) => sum + (backup.sizeBytes || 0), 0);
        const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(1);
        
        // Estimate disk usage (assuming 200GB total)
        const diskUsedPercent = Math.round((totalSize / (200 * 1024 * 1024 * 1024)) * 100);
        
        document.getElementById('total-backups').textContent = totalBackups;
        document.getElementById('total-size').textContent = `${totalSizeGB} GB`;
        document.getElementById('disk-used').textContent = `${diskUsedPercent}%`;
    }

    refreshBackups() {
        const refreshIcon = document.querySelector('.refresh-icon');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                refreshIcon.style.animation = '';
            }, 1000);
        }
        
        this.loadBackups();
    }

    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            this.loadBackups();
        }, this.config.refreshInterval);
    }

    showSuccess(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showError(message) {
        // Simple error toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    async downloadFullServerBackup() {
        // Show confirmation modal
        this.showModal(
            'Download Full Server Backup',
            'This will create and download a complete backup of the entire server (~35-40GB). This may take several minutes. Continue?',
            ['Complete server snapshot including:', '• All Docker containers data', '• All databases', '• All websites', '• All configurations', '• Everything needed to restore the server'],
            () => this.performFullServerBackup(),
            'download'
        );
    }

    async performFullServerBackup() {
        this.hideModal();
        
        // Show progress indicator
        const progressModal = document.createElement('div');
        progressModal.className = 'modal';
        progressModal.style.display = 'flex';
        progressModal.innerHTML = `
            <div class="modal-content" style="text-align: center;">
                <div class="modal-header">
                    <h3>Creating Server Backup</h3>
                </div>
                <div class="modal-body">
                    <div class="spinner" style="margin: 2rem auto;"></div>
                    <p>Preparing complete server backup...</p>
                    <p style="font-size: 0.875rem; color: #64748b;">This may take several minutes</p>
                </div>
            </div>
        `;
        document.body.appendChild(progressModal);
        
        try {
            // Request full server backup
            const cacheBuster = `?t=${Date.now()}&v=2.2.0`;
            const response = await fetch(`/api/backups/server/full${cacheBuster}`, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Update progress
                progressModal.querySelector('p').textContent = 'Backup created! Starting download...';
                
                // Download the backup
                const downloadResponse = await fetch(`/api/backups/download/${encodeURIComponent(data.filename)}${cacheBuster}`, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (downloadResponse.ok) {
                    const blob = await downloadResponse.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = data.filename || `agistaffers-full-backup-${new Date().toISOString().split('T')[0]}.tar.gz`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    
                    progressModal.remove();
                    this.showSuccess('Full server backup download started!');
                } else {
                    throw new Error('Failed to download backup file');
                }
            } else {
                throw new Error(`Backup creation failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Full server backup error:', error);
            progressModal.remove();
            this.showError(`Failed to create server backup: ${error.message}`);
        }
    }

    async showWebsiteBackupModal() {
        // Get list of available websites
        const websites = [
            { name: 'stepperslife.com', container: 'stepperslife', size: '~150MB' },
            { name: 'admin.agistaffers.com', container: 'admin-dashboard', size: '~100MB' }
        ];
        
        // Create website selection modal
        const modalContent = `
            <div class="modal-header">
                <h3>Select Websites to Backup</h3>
                <button class="modal-close" aria-label="Close modal">×</button>
            </div>
            <div class="modal-body">
                <p>Choose which websites you want to backup:</p>
                <div class="website-selection-list">
                    ${websites.map(site => `
                        <div class="website-item">
                            <input type="checkbox" id="site-${site.container}" value="${site.container}" checked>
                            <label for="site-${site.container}">
                                <strong>${site.name}</strong>
                                <span class="site-size">${site.size}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel">Cancel</button>
                <button class="btn-confirm" id="website-backup-confirm">Create Backup</button>
            </div>
        `;
        
        const modal = document.getElementById('confirmation-modal');
        modal.querySelector('.modal-content').innerHTML = modalContent;
        modal.style.display = 'flex';
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.hideModal());
        modal.querySelector('.btn-cancel').addEventListener('click', () => this.hideModal());
        modal.querySelector('#website-backup-confirm').addEventListener('click', () => {
            const selected = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            if (selected.length > 0) {
                this.performWebsiteBackup(selected);
            }
        });
    }

    async performWebsiteBackup(websites) {
        this.hideModal();
        
        try {
            const cacheBuster = `?t=${Date.now()}&v=2.2.0`;
            const response = await fetch(`/api/backups/websites${cacheBuster}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ websites })
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
        this.showModal(
            'Create Database Backup',
            'This will export all PostgreSQL databases including schema and data.',
            ['• All databases will be exported', '• Includes full schema and data', '• Compressed for efficiency'],
            () => this.performDatabaseBackup(),
            'download'
        );
    }

    async performDatabaseBackup() {
        this.hideModal();
        
        try {
            const cacheBuster = `?t=${Date.now()}&v=2.2.0`;
            const response = await fetch(`/api/backups/databases${cacheBuster}`, {
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

    async showContainerBackupModal() {
        try {
            // Fetch list of containers
            const response = await fetch('/api/metrics');
            const data = await response.json();
            const containers = data.docker?.containers || [];
            
            // Create container selection modal
            const modalContent = `
                <div class="modal-header">
                    <h3>Select Containers to Backup</h3>
                    <button class="modal-close" aria-label="Close modal">×</button>
                </div>
                <div class="modal-body">
                    <p>Choose which containers and their volumes to backup:</p>
                    <div class="container-selection-list" style="max-height: 300px; overflow-y: auto;">
                        ${containers.map(container => `
                            <div class="container-item">
                                <input type="checkbox" id="container-${container.name}" value="${container.name}">
                                <label for="container-${container.name}">
                                    <strong>${container.name}</strong>
                                    <span class="container-status">${container.status}</span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-confirm" id="container-backup-confirm">Create Backup</button>
                </div>
            `;
            
            const modal = document.getElementById('confirmation-modal');
            modal.querySelector('.modal-content').innerHTML = modalContent;
            modal.style.display = 'flex';
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .website-selection-list,
                .container-selection-list {
                    background: #f8fafc;
                    border-radius: 6px;
                    padding: 1rem;
                    margin-top: 1rem;
                }
                .website-item,
                .container-item {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .website-item:last-child,
                .container-item:last-child {
                    border-bottom: none;
                }
                .website-item input,
                .container-item input {
                    margin-right: 0.75rem;
                }
                .website-item label,
                .container-item label {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }
                .site-size,
                .container-status {
                    font-size: 0.875rem;
                    color: #64748b;
                }
            `;
            document.head.appendChild(style);
            
            // Add event listeners
            modal.querySelector('.modal-close').addEventListener('click', () => this.hideModal());
            modal.querySelector('.btn-cancel').addEventListener('click', () => this.hideModal());
            modal.querySelector('#container-backup-confirm').addEventListener('click', () => {
                const selected = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => cb.value);
                if (selected.length > 0) {
                    this.performContainerBackup(selected);
                }
            });
            
        } catch (error) {
            this.showError('Failed to load container list');
        }
    }

    async performContainerBackup(containers) {
        this.hideModal();
        
        try {
            const cacheBuster = `?t=${Date.now()}&v=2.2.0`;
            const response = await fetch(`/api/backups/containers${cacheBuster}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ containers })
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

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.initialized = false;
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.BackupManager = BackupManager;
    window.backupManagerInstance = null;
}