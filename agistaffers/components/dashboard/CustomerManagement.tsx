'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Plus, Search, Edit, Trash2, Building2, 
  Mail, Phone, Calendar, Globe, Settings 
} from 'lucide-react';

interface Customer {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  phone?: string;
  plan_tier: string;
  status: string;
  subdomain: string;
  created_at: string;
  customer_sites: Array<{
    id: string;
    domain: string;
    status: string;
    created_at: string;
  }>;
}

interface CustomerFormData {
  company_name: string;
  contact_name: string;
  contact_email: string;
  phone: string;
  plan_tier: string;
  billing_email: string;
  notes: string;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    company_name: '',
    contact_name: '',
    contact_email: '',
    phone: '',
    plan_tier: 'basic',
    billing_email: '',
    notes: ''
  });

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data.customers);
      } else {
        console.error('Failed to load customers:', result.error);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form and reload customers
        setFormData({
          company_name: '',
          contact_name: '',
          contact_email: '',
          phone: '',
          plan_tier: 'basic',
          billing_email: '',
          notes: ''
        });
        setShowCreateForm(false);
        await loadCustomers();
        
        // Show success notification
        alert('Customer created successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer');
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadCustomers();
        setSelectedCustomer(null);
        alert('Customer deleted successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer');
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanBadgeColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600">Manage your client accounts and subscriptions</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Customers ({filteredCustomers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredCustomers.map((customer) => (
                  <div 
                    key={customer.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedCustomer?.id === customer.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{customer.company_name}</h3>
                            <p className="text-sm text-gray-600">{customer.contact_name}</p>
                            <p className="text-sm text-gray-500">{customer.contact_email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getPlanBadgeColor(customer.plan_tier)}>
                          {customer.plan_tier}
                        </Badge>
                        <Badge className={getStatusBadgeColor(customer.status)}>
                          {customer.status}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {customer.customer_sites.length} sites
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredCustomers.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No customers found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div>
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Details</span>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Company</Label>
                    <p className="text-sm text-gray-900">{selectedCustomer.company_name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                    <p className="text-sm text-gray-900">{selectedCustomer.contact_name}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`mailto:${selectedCustomer.contact_email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedCustomer.contact_email}
                    </a>
                  </div>
                  
                  {selectedCustomer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a 
                        href={`tel:${selectedCustomer.phone}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {selectedCustomer.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{selectedCustomer.subdomain}.agistaffers.com</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      Created {new Date(selectedCustomer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-gray-500">Sites ({selectedCustomer.customer_sites.length})</Label>
                  <div className="space-y-2 mt-2">
                    {selectedCustomer.customer_sites.map((site) => (
                      <div key={site.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{site.domain}</p>
                          <p className="text-xs text-gray-500">
                            Created {new Date(site.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusBadgeColor(site.status)}>
                          {site.status}
                        </Badge>
                      </div>
                    ))}
                    
                    {selectedCustomer.customer_sites.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No sites created yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Select a customer to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-xl font-semibold">Add New Customer</h2>
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
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_name">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="plan_tier">Plan Tier</Label>
                  <select 
                    id="plan_tier"
                    value={formData.plan_tier}
                    onChange={(e) => setFormData({...formData, plan_tier: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="billing_email">Billing Email</Label>
                  <Input
                    id="billing_email"
                    type="email"
                    value={formData.billing_email}
                    onChange={(e) => setFormData({...formData, billing_email: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full p-2 border rounded-md"
                  />
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
                  Create Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}