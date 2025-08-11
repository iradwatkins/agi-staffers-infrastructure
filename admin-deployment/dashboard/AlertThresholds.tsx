'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertCircle, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface AlertThreshold {
  id: string
  name: string
  metric: string
  operator: 'above' | 'below'
  value: number
  unit: string
  enabled: boolean
  description: string
}

const defaultThresholds: AlertThreshold[] = [
  {
    id: 'cpu-high',
    name: 'High CPU Usage',
    metric: 'cpu',
    operator: 'above',
    value: 80,
    unit: '%',
    enabled: true,
    description: 'Alert when CPU usage exceeds threshold'
  },
  {
    id: 'memory-high',
    name: 'High Memory Usage',
    metric: 'memory',
    operator: 'above',
    value: 85,
    unit: '%',
    enabled: true,
    description: 'Alert when memory usage exceeds threshold'
  },
  {
    id: 'disk-low',
    name: 'Low Disk Space',
    metric: 'disk',
    operator: 'below',
    value: 10,
    unit: 'GB',
    enabled: true,
    description: 'Alert when available disk space falls below threshold'
  },
  {
    id: 'container-down',
    name: 'Container Down',
    metric: 'container',
    operator: 'below',
    value: 1,
    unit: 'count',
    enabled: true,
    description: 'Alert when a container goes down'
  },
  {
    id: 'network-high',
    name: 'High Network Usage',
    metric: 'network',
    operator: 'above',
    value: 100,
    unit: 'MB/s',
    enabled: false,
    description: 'Alert when network usage exceeds threshold'
  }
]

export function AlertThresholds() {
  const [thresholds, setThresholds] = useState<AlertThreshold[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Load saved thresholds from localStorage
    const savedThresholds = localStorage.getItem('alertThresholds')
    if (savedThresholds) {
      try {
        setThresholds(JSON.parse(savedThresholds))
      } catch {
        setThresholds(defaultThresholds)
      }
    } else {
      setThresholds(defaultThresholds)
    }
    setLoading(false)
  }, [])

  const handleToggle = (id: string) => {
    setThresholds(prev => 
      prev.map(threshold => 
        threshold.id === id 
          ? { ...threshold, enabled: !threshold.enabled }
          : threshold
      )
    )
  }

  const handleValueChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setThresholds(prev => 
        prev.map(threshold => 
          threshold.id === id 
            ? { ...threshold, value: numValue }
            : threshold
        )
      )
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Save to localStorage
      localStorage.setItem('alertThresholds', JSON.stringify(thresholds))
      
      // Send to API
      const response = await fetch('/api/alerts/thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thresholds })
      })

      if (response.ok) {
        toast.success('Alert thresholds saved successfully')
      } else {
        throw new Error('Failed to save thresholds')
      }
    } catch (error) {
      console.error('Error saving thresholds:', error)
      toast.error('Failed to save alert thresholds')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Alert Thresholds
        </CardTitle>
        <CardDescription>
          Configure thresholds for automatic alerts and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {thresholds.map((threshold) => (
          <div
            key={threshold.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={threshold.enabled}
                  onCheckedChange={() => handleToggle(threshold.id)}
                />
                <Label htmlFor={threshold.id} className="font-medium">
                  {threshold.name}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {threshold.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-muted-foreground">
                Alert when {threshold.operator}
              </span>
              <Input
                type="number"
                value={threshold.value}
                onChange={(e) => handleValueChange(threshold.id, e.target.value)}
                className="w-20"
                disabled={!threshold.enabled}
              />
              <span className="text-sm text-muted-foreground">
                {threshold.unit}
              </span>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span>Alerts will be sent via push notifications</span>
          </div>
          
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Thresholds'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}