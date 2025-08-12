'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, Search, Plus, Eye, Edit, Trash2, Download, Upload,
  ShoppingCart, Building2, Zap, BookOpen, Briefcase,
  Star, Users, Globe, TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

interface Template {
  id: string
  templateName: string
  displayName: string
  description: string
  category: string
  thumbnailUrl?: string
  previewUrl?: string
  features: string[]
  version: string
  isActive: boolean
  usageCount: number
  createdAt: string
}

const mockTemplates: Template[] = [
  {
    id: '1',
    templateName: 'dawn',
    displayName: 'Dawn E-commerce',
    description: 'Clean, flexible, and fast e-commerce template',
    category: 'ecommerce',
    features: ['Product filtering', 'Quick add to cart', 'Mega menu', 'Predictive search'],
    version: '15.3.0',
    isActive: true,
    usageCount: 145,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    templateName: 'service-business',
    displayName: 'Service Pro',
    description: 'Professional service business website',
    category: 'service',
    features: ['Service showcase', 'Team profiles', 'Testimonials', 'Contact forms'],
    version: '1.0.0',
    isActive: true,
    usageCount: 89,
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    templateName: 'landing-page',
    displayName: 'Conversion',
    description: 'High-converting landing page template',
    category: 'landing',
    features: ['Hero with CTA', 'Benefits section', 'Social proof', 'Lead capture'],
    version: '1.0.0',
    isActive: true,
    usageCount: 67,
    createdAt: '2024-02-15'
  },
  {
    id: '4',
    templateName: 'blog',
    displayName: 'Publisher',
    description: 'Content-focused blog theme',
    category: 'blog',
    features: ['Article layouts', 'Category pages', 'Author profiles', 'Comments'],
    version: '1.0.0',
    isActive: true,
    usageCount: 34,
    createdAt: '2024-03-01'
  },
  {
    id: '5',
    templateName: 'corporate',
    displayName: 'Corporate',
    description: 'Professional informational website',
    category: 'brochure',
    features: ['About us section', 'Services overview', 'Company history', 'Leadership team'],
    version: '1.0.0',
    isActive: true,
    usageCount: 23,
    createdAt: '2024-03-15'
  }
]

const categoryIcons = {
  ecommerce: ShoppingCart,
  service: Briefcase,
  landing: Zap,
  blog: BookOpen,
  brochure: Building2
}

const categoryColors = {
  ecommerce: 'bg-blue-50 text-blue-700',
  service: 'bg-green-50 text-green-700',
  landing: 'bg-purple-50 text-purple-700',
  blog: 'bg-orange-50 text-orange-700',
  brochure: 'bg-gray-50 text-gray-700'
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'service', label: 'Service Business' },
    { value: 'landing', label: 'Landing Pages' },
    { value: 'blog', label: 'Blog & Content' },
    { value: 'brochure', label: 'Corporate' }
  ]

  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)
  const activeTemplates = templates.filter(t => t.isActive).length

  const handleUploadTemplate = () => {
    setUploadDialogOpen(true)
    toast.info('Upload template dialog opened')
  }

  const handleCreateTemplate = () => {
    setCreateDialogOpen(true)
    toast.info('Create template dialog opened')
  }

  const handlePreviewTemplate = (template: Template) => {
    window.open(`/template-preview/${template.templateName}`, '_blank')
    toast.success(`Opening preview for ${template.displayName}`)
  }

  const handleEditTemplate = (template: Template) => {
    // Navigate to template editor
    toast.info(`Edit mode for ${template.displayName} (Coming Soon)`)
    console.log('Edit template:', template.id)
  }

  const handleDownloadTemplate = (template: Template) => {
    // Download template files
    toast.success(`Downloading ${template.displayName} template`)
    console.log('Download template:', template.id)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Template Management</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleUploadTemplate}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Template
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeTemplates} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">
              Across all templates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Different types
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dawn</div>
            <p className="text-xs text-muted-foreground">
              {mockTemplates[0].usageCount} deployments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => {
          const IconComponent = categoryIcons[template.category as keyof typeof categoryIcons] || Package
          const categoryColor = categoryColors[template.category as keyof typeof categoryColors] || categoryColors.brochure
          
          return (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5" />
                    <CardTitle className="text-lg">{template.displayName}</CardTitle>
                  </div>
                  <Badge className={categoryColor}>
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Template Preview */}
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Preview</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {template.usageCount} uses
                    </span>
                    <span>v{template.version}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadTemplate(template)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}