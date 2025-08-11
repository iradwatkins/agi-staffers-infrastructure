'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, Plus, Search, Play, Pause, Trash2, 
  ExternalLink, Settings, Clock, CheckCircle,
  AlertCircle, XCircle, Loader2, Building2
} from 'lucide-react';

interface Site {
  id: string;
  domain: string;
  status: string;
  container_id?: string;
  ssl_enabled: boolean;
  auto_backup: boolean;
  created_at: string;
  updated_at: string;
  deployment_config: any;
  customers: {
    id: string;
    company_name: string;
    contact_name: string;
  };
  site_templates: {
    id: string;
    template_name: string;
    template_type: string;
  };
}

interface Template {
  id: string;
  template_name: string;
  template_type: string;
  description: string;
  is_active: boolean;
}

interface Customer {
  id: string;
  company_name: string;
  contact_name: string;
}

interface DeploymentStatus {
  site: Site;
  isQueued: boolean;
  queuePosition: number;
  totalInQueue: number;
}

export function SiteManagement() {
  const [sites, setSites] = useState<Site[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    domain: '',
    template_id: '',
    ssl_enabled: true,
    auto_backup: true,
    customConfig: {}
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Poll deployment status for selected site
  useEffect(() => {
    if (selectedSite && ['queued', 'deploying'].includes(selectedSite.status)) {
      const interval = setInterval(() => {
        loadDeploymentStatus(selectedSite.id);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [selectedSite]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [sitesRes, templatesRes, customersRes] = await Promise.all([
        fetch('/api/sites'),
        fetch('/api/templates?active_only=true'),
        fetch('/api/customers')
      ]);
      
      const sitesData = await sitesRes.json();
      const templatesData = await templatesRes.json();
      const customersData = await customersRes.json();
      
      if (sitesData.success) setSites(sitesData.data.sites);
      if (templatesData.success) setTemplates(templatesData.data);
      if (customersData.success) setCustomers(customersData.data.customers);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDeploymentStatus = async (siteId: string) => {
    try {
      const response = await fetch(`/api/sites/${siteId}/deploy`);
      const result = await response.json();
      
      if (result.success) {
        setDeploymentStatus(result.data);
        
        // Update the site in the sites list
        setSites(prev => prev.map(site => 
          site.id === siteId ? result.data.site : site
        ));
        
        // Update selected site if it matches
        if (selectedSite?.id === siteId) {
          setSelectedSite(result.data.site);
        }
      }
    } catch (error) {
      console.error('Error loading deployment status:', error);
    }
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form and reload sites
        setFormData({
          customer_id: '',
          domain: '',
          template_id: '',
          ssl_enabled: true,
          auto_backup: true,
          customConfig: {}
        });
        setShowCreateForm(false);
        await loadData();
        
        // Auto-select the new site and start deployment
        setSelectedSite(result.data);
        await handleDeploySite(result.data.id);
        
        alert('Site created successfully! Deployment started.');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating site:', error);
      alert('Failed to create site');
    }
  };

  const handleDeploySite = async (siteId: string) => {
    try {
      const response = await fetch(`/api/sites/${siteId}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadData();
        await loadDeploymentStatus(siteId);
        alert('Deployment started successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deploying site:', error);
      alert('Failed to start deployment');
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this site? This will remove all associated resources.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadData();
        if (selectedSite?.id === siteId) {
          setSelectedSite(null);
        }
        alert('Site deleted successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting site:', error);
      alert('Failed to delete site');
    }
  };

  const filteredSites = sites.filter(site => 
    site.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.customers.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      deploying: { icon: Loader2, color: 'bg-blue-100 text-blue-800' },
      queued: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      failed: { icon: XCircle, color: 'bg-red-100 text-red-800' },
      pending: { icon: AlertCircle, color: 'bg-gray-100 text-gray-800' },
      deleted: { icon: XCircle, color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className={`w-3 h-3 ${status === 'deploying' ? 'animate-spin' : ''}`} />
        <span>{status}</span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading sites...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Management</h1>
            <p className="text-gray-600">Deploy and manage client websites</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Site</span>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search sites by domain or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sites List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sites ({filteredSites.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredSites.map((site) => (
                  <div 
                    key={site.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSite?.id === site.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedSite(site)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                              <span>{site.domain}</span>
                              {site.status === 'active' && (
                                <ExternalLink 
                                  className="w-4 h-4 text-blue-500 cursor-pointer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://${site.domain}`, '_blank');
                                  }}
                                />
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{site.customers.company_name}</p>
                            <p className="text-sm text-gray-500">{site.site_templates.template_name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(site.status)}
                        <div className="text-xs text-gray-500">
                          {new Date(site.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredSites.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No sites found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Site Details */}
        <div>
          {selectedSite ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Site Details</span>
                  <div className="flex space-x-2">
                    {selectedSite.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => handleDeploySite(selectedSite.id)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteSite(selectedSite.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deployment Progress */}
                {deploymentStatus && ['queued', 'deploying'].includes(selectedSite.status) && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {selectedSite.status === 'queued' ? 'Queued for Deployment' : 'Deploying...'}
                      </span>
                    </div>
                    {deploymentStatus.isQueued && (
                      <p className="text-xs text-blue-700">
                        Position in queue: {deploymentStatus.queuePosition} of {deploymentStatus.totalInQueue}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Domain</Label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900">{selectedSite.domain}</p>
                      {selectedSite.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`https://${selectedSite.domain}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Customer</Label>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{selectedSite.customers.company_name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Template</Label>
                    <p className="text-sm text-gray-900">
                      {selectedSite.site_templates.template_name} 
                      <span className="text-gray-500 ml-2">({selectedSite.site_templates.template_type})</span>
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedSite.status)}
                    </div>
                  </div>

                  {selectedSite.container_id && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Container ID</Label>
                      <p className="text-sm text-gray-900 font-mono">
                        {selectedSite.container_id.substring(0, 12)}...
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">SSL Enabled</Label>
                      <Badge className={selectedSite.ssl_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {selectedSite.ssl_enabled ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Auto Backup</Label>
                      <Badge className={selectedSite.auto_backup ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {selectedSite.auto_backup ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Created</Label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedSite.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Select a site to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Site Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateSite} className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-xl font-semibold">Create New Site</h2>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowCreateForm(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer_id">Customer *</Label>
                  <select 
                    id="customer_id"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company_name} ({customer.contact_name})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="domain">Domain *</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    placeholder="example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="template_id">Template *</Label>
                  <select 
                    id="template_id"
                    value={formData.template_id}
                    onChange={(e) => setFormData({...formData, template_id: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.template_name} ({template.template_type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.ssl_enabled}
                      onChange={(e) => setFormData({...formData, ssl_enabled: e.target.checked})}
                    />
                    <span className="text-sm">Enable SSL</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.auto_backup}
                      onChange={(e) => setFormData({...formData, auto_backup: e.target.checked})}
                    />
                    <span className="text-sm">Auto Backup</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Site
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}