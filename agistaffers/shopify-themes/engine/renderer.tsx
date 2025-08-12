'use client'

import React, { Suspense, lazy } from 'react'
import DOMPurify from 'dompurify'
import { ThemeSection, ThemeSettings, SectionProps } from './types'

// Section component registry
const sectionComponents = new Map<string, React.LazyExoticComponent<React.FC<SectionProps>>>()

// Register Dawn theme sections
sectionComponents.set('header', lazy(() => import('../dawn/sections/header')))
sectionComponents.set('hero', lazy(() => import('../dawn/sections/hero')))
sectionComponents.set('featured-products', lazy(() => import('../dawn/sections/featured-products')))
sectionComponents.set('featured-collection', lazy(() => import('../dawn/sections/featured-collection')))
sectionComponents.set('collection-list', lazy(() => import('../dawn/sections/collection-list')))
sectionComponents.set('image-with-text', lazy(() => import('../dawn/sections/image-with-text')))
sectionComponents.set('rich-text', lazy(() => import('../dawn/sections/rich-text')))
sectionComponents.set('multicolumn', lazy(() => import('../dawn/sections/multicolumn')))
sectionComponents.set('newsletter', lazy(() => import('../dawn/sections/newsletter')))
sectionComponents.set('footer', lazy(() => import('../dawn/sections/footer')))

// Product page sections
sectionComponents.set('main-product', lazy(() => import('../dawn/sections/main-product')))
sectionComponents.set('product-recommendations', lazy(() => import('../dawn/sections/product-recommendations')))

// Collection page sections
sectionComponents.set('main-collection', lazy(() => import('../dawn/sections/main-collection')))
sectionComponents.set('collection-banner', lazy(() => import('../dawn/sections/collection-banner')))

// Cart sections
sectionComponents.set('main-cart', lazy(() => import('../dawn/sections/main-cart')))
sectionComponents.set('cart-drawer', lazy(() => import('../dawn/sections/cart-drawer')))

// Custom sections
sectionComponents.set('custom-liquid', lazy(() => import('../dawn/sections/custom-liquid')))
sectionComponents.set('apps', lazy(() => import('../dawn/sections/apps')))

interface ThemeRendererProps {
  sections: ThemeSection[]
  settings: ThemeSettings
  data?: {
    products?: any[]
    collections?: any[]
    cart?: any
    customer?: any
  }
}

export function ThemeRenderer({ sections, settings, data = {} }: ThemeRendererProps) {
  return (
    <div className="theme-container" style={getThemeStyles(settings)}>
      {/* Inject custom CSS */}
      {settings.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings.custom_css || '', {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: false
        }) }} />
      )}
      
      {/* Inject head scripts */}
      {settings.custom_head_html && (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings.custom_head_html || '', {
          ALLOWED_TAGS: ['meta', 'link'],
          ALLOWED_ATTR: ['rel', 'href', 'name', 'content', 'property'],
          FORBID_TAGS: ['script', 'object', 'embed', 'form'],
          FORBID_ATTR: ['onerror', 'onload', 'onclick']
        }) }} />
      )}

      {/* Render sections */}
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          settings={settings}
          {...data}
        />
      ))}

      {/* Inject body scripts */}
      {settings.custom_body_html && (
        {/* Custom body HTML - Removed for security */}
        {/* Custom HTML injection disabled to prevent XSS attacks */}
      )}
      
      {/* Inject custom JavaScript */}
      {settings.custom_javascript && (
        {/* Custom JavaScript - Removed for security */}
        {/* Direct JavaScript injection disabled to prevent XSS attacks */}
        {/* Use CodeInjector component for safe JavaScript execution */}
      )}
    </div>
  )
}

interface SectionRendererProps extends SectionProps {
  section: ThemeSection
}

function SectionRenderer({ section, ...props }: SectionRendererProps) {
  if (section.disabled) {
    return null
  }

  const Component = sectionComponents.get(section.type)
  
  if (!Component) {
    console.warn(`Section type "${section.type}" not found`)
    return (
      <div className="section-error p-4 bg-red-50 text-red-600">
        Unknown section type: {section.type}
      </div>
    )
  }

  return (
    <Suspense fallback={<SectionLoader />}>
      <div 
        id={`section-${section.id}`}
        className={`section section-${section.type}`}
        data-section-id={section.id}
        data-section-type={section.type}
      >
        <Component section={section} {...props} />
      </div>
    </Suspense>
  )
}

function SectionLoader() {
  return (
    <div className="section-loader animate-pulse">
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  )
}

// Generate theme CSS variables
function getThemeStyles(settings: ThemeSettings): React.CSSProperties {
  return {
    '--color-button': settings.colors_solid_button_labels,
    '--color-accent-1': settings.colors_accent_1,
    '--color-accent-2': settings.colors_accent_2,
    '--color-text': settings.colors_text,
    '--color-background-1': settings.colors_background_1,
    '--color-background-2': settings.colors_background_2,
    '--font-heading': settings.font_heading,
    '--font-body': settings.font_body,
    '--page-width': `${settings.page_width}px`,
    '--spacing-sections': `${settings.spacing_sections}px`,
    '--buttons-radius': `${settings.buttons_radius}px`,
    '--buttons-border': `${settings.buttons_border_thickness}px`,
    '--card-corner-radius': `${settings.card_corner_radius}px`,
    '--card-border': `${settings.card_border_thickness}px`,
  } as React.CSSProperties
}

// Block renderer for nested blocks
export function BlockRenderer({ blocks, settings }: { blocks?: any[], settings: ThemeSettings }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block) => {
        const BlockComponent = getBlockComponent(block.type)
        if (!BlockComponent) return null
        
        return (
          <div key={block.id} className={`block block-${block.type}`}>
            <BlockComponent block={block} settings={settings} />
            {block.blocks && <BlockRenderer blocks={block.blocks} settings={settings} />}
          </div>
        )
      })}
    </>
  )
}

// Get block component (simplified for now)
function getBlockComponent(type: string) {
  // This would load block components similar to sections
  return null
}

// Export section registry for dynamic registration
export function registerSection(type: string, component: React.LazyExoticComponent<React.FC<SectionProps>>) {
  sectionComponents.set(type, component)
}

// Template renderer for page templates
export function TemplateRenderer({ template, settings, data }: {
  template: any
  settings: ThemeSettings
  data?: any
}) {
  // Load sections based on template
  const sections = template.sections || []
  
  return (
    <ThemeRenderer
      sections={sections}
      settings={settings}
      data={data}
    />
  )
}