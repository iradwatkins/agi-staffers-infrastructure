'use client'

import React, { useState, useEffect } from 'react'
import { ThemeSection, ThemeSettings, SectionSchema } from './types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Settings, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  Save,
  Undo,
  Redo,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

interface ThemeCustomizerProps {
  settings: ThemeSettings
  sections: ThemeSection[]
  onSettingsChange: (settings: ThemeSettings) => void
  onSectionsChange: (sections: ThemeSection[]) => void
  onSave: () => void
  onPublish: () => void
}

export function ThemeCustomizer({
  settings,
  sections,
  onSettingsChange,
  onSectionsChange,
  onSave,
  onPublish
}: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState('sections')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Add to history when changes are made
  const addToHistory = (state: any) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(state)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo/Redo functionality
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      const prevState = history[historyIndex - 1]
      onSettingsChange(prevState.settings)
      onSectionsChange(prevState.sections)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      const nextState = history[historyIndex + 1]
      onSettingsChange(nextState.settings)
      onSectionsChange(nextState.sections)
    }
  }

  return (
    <div className="theme-customizer h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Theme Customizer</h2>
          <div className="flex items-center gap-2">
            {/* Preview Mode Selector */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            {/* Undo/Redo */}
            <Button
              size="sm"
              variant="ghost"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>

            {/* Save/Publish */}
            <Button size="sm" variant="outline" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={onPublish}>
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="theme">Theme Settings</TabsTrigger>
            <TabsTrigger value="code">Custom Code</TabsTrigger>
          </TabsList>

          {/* Sections Tab */}
          <TabsContent value="sections" className="h-full overflow-auto p-4">
            <SectionsManager
              sections={sections}
              onSectionsChange={onSectionsChange}
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
            />
          </TabsContent>

          {/* Theme Settings Tab */}
          <TabsContent value="theme" className="h-full overflow-auto p-4">
            <ThemeSettingsEditor
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          </TabsContent>

          {/* Custom Code Tab */}
          <TabsContent value="code" className="h-full overflow-auto p-4">
            <CustomCodeEditor
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Sections Manager Component
function SectionsManager({
  sections,
  onSectionsChange,
  selectedSection,
  onSelectSection
}: any) {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
    onSectionsChange(newSections)
  }

  const toggleSection = (id: string) => {
    const newSections = sections.map((s: ThemeSection) =>
      s.id === id ? { ...s, disabled: !s.disabled } : s
    )
    onSectionsChange(newSections)
  }

  const deleteSection = (id: string) => {
    onSectionsChange(sections.filter((s: ThemeSection) => s.id !== id))
    onSelectSection(null)
  }

  const addSection = (type: string) => {
    const newSection: ThemeSection = {
      id: `section-${Date.now()}`,
      type,
      settings: {},
      blocks: []
    }
    onSectionsChange([...sections, newSection])
  }

  return (
    <div className="space-y-4">
      {/* Section List */}
      <Card>
        <CardHeader>
          <CardTitle>Page Sections</CardTitle>
          <CardDescription>
            Drag to reorder, click to edit settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {sections.map((section: ThemeSection, index: number) => (
            <div
              key={section.id}
              className={`
                flex items-center gap-2 p-3 border rounded-lg cursor-pointer
                ${selectedSection === section.id ? 'border-primary bg-accent' : ''}
                ${section.disabled ? 'opacity-50' : ''}
              `}
              onClick={() => onSelectSection(section.id)}
            >
              <div className="flex-1">
                <div className="font-medium">{section.type}</div>
                <div className="text-sm text-muted-foreground">
                  {section.blocks?.length || 0} blocks
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSection(section.id)
                  }}
                >
                  {section.disabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveSection(index, 'up')
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={index === sections.length - 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveSection(index, 'down')
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSection(section.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => addSection('hero')}>
              <Plus className="h-4 w-4 mr-2" />
              Hero Banner
            </Button>
            <Button variant="outline" onClick={() => addSection('featured-products')}>
              <Plus className="h-4 w-4 mr-2" />
              Featured Products
            </Button>
            <Button variant="outline" onClick={() => addSection('collection-list')}>
              <Plus className="h-4 w-4 mr-2" />
              Collection List
            </Button>
            <Button variant="outline" onClick={() => addSection('image-with-text')}>
              <Plus className="h-4 w-4 mr-2" />
              Image with Text
            </Button>
            <Button variant="outline" onClick={() => addSection('newsletter')}>
              <Plus className="h-4 w-4 mr-2" />
              Newsletter
            </Button>
            <Button variant="outline" onClick={() => addSection('custom-liquid')}>
              <Plus className="h-4 w-4 mr-2" />
              Custom HTML
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Theme Settings Editor
function ThemeSettingsEditor({ settings, onSettingsChange }: any) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.colors_accent_1}
                onChange={(e) => updateSetting('colors_accent_1', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.colors_accent_1}
                onChange={(e) => updateSetting('colors_accent_1', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.colors_background_1}
                onChange={(e) => updateSetting('colors_background_1', e.target.value)}
                className="w-20"
              />
              <Input
                value={settings.colors_background_1}
                onChange={(e) => updateSetting('colors_background_1', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Heading Font</Label>
            <Select
              value={settings.font_heading}
              onValueChange={(value) => updateSetting('font_heading', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Body Font</Label>
            <Select
              value={settings.font_body}
              onValueChange={(value) => updateSetting('font_body', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Page Width (px)</Label>
            <Slider
              value={[settings.page_width]}
              onValueChange={([value]) => updateSetting('page_width', value)}
              min={1000}
              max={1600}
              step={50}
            />
            <div className="text-sm text-muted-foreground mt-1">
              {settings.page_width}px
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Custom Code Editor
function CustomCodeEditor({ settings, onSettingsChange }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
          <CardDescription>
            Add custom CSS to customize your store's appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={settings.custom_css || ''}
            onChange={(e) => onSettingsChange({ ...settings, custom_css: e.target.value })}
            placeholder="/* Add your custom CSS here */"
            className="font-mono min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom JavaScript</CardTitle>
          <CardDescription>
            Add custom JavaScript for additional functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={settings.custom_javascript || ''}
            onChange={(e) => onSettingsChange({ ...settings, custom_javascript: e.target.value })}
            placeholder="// Add your custom JavaScript here"
            className="font-mono min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Head Scripts</CardTitle>
          <CardDescription>
            Add scripts to the head section (analytics, pixels, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={settings.custom_head_html || ''}
            onChange={(e) => onSettingsChange({ ...settings, custom_head_html: e.target.value })}
            placeholder="<!-- Add head scripts here -->"
            className="font-mono min-h-[150px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}