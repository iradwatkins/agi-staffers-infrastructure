'use client'

import React, { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import { ThemeSettings } from './types'

interface CodeInjectorProps {
  settings: ThemeSettings
  children: React.ReactNode
}

export function CodeInjector({ settings, children }: CodeInjectorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const sandboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inject custom CSS
    if (settings.custom_css) {
      const styleId = 'custom-theme-css'
      let styleElement = document.getElementById(styleId) as HTMLStyleElement

      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }

      // Sanitize CSS to prevent XSS
      const sanitizedCSS = sanitizeCSS(settings.custom_css)
      styleElement.innerHTML = sanitizedCSS
    }

    // Inject head scripts
    if (settings.custom_head_html) {
      injectHeadScripts(settings.custom_head_html)
    }

    return () => {
      // Cleanup
      const styleElement = document.getElementById('custom-theme-css')
      if (styleElement) {
        styleElement.remove()
      }
    }
  }, [settings.custom_css, settings.custom_head_html])

  useEffect(() => {
    // Execute custom JavaScript in sandboxed environment
    if (settings.custom_javascript) {
      executeInSandbox(settings.custom_javascript)
    }
  }, [settings.custom_javascript])

  return (
    <div className="code-injector">
      {children}
      
      {/* Sandboxed iframe for custom JavaScript execution */}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        style={{ display: 'none' }}
        srcDoc={getSandboxHTML(settings.custom_javascript || '')}
      />
      
      {/* Container for body scripts */}
      {settings.custom_body_html && (
        <div 
          ref={sandboxRef}
          className="custom-body-scripts"
          dangerouslySetInnerHTML={{ 
            __html: sanitizeHTML(settings.custom_body_html) 
          }}
        />
      )}
    </div>
  )
}

// Sanitize CSS to prevent XSS attacks
function sanitizeCSS(css: string): string {
  // Remove any JavaScript execution attempts
  css = css.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  css = css.replace(/javascript:/gi, '')
  css = css.replace(/on\w+\s*=/gi, '')
  
  // Remove @import to prevent external resource loading
  css = css.replace(/@import\s+(?:url\s*\()?\s*['"].*?['"]\s*\)?/gi, '')
  
  // Scope CSS to theme container
  const lines = css.split('\n')
  const scopedLines = lines.map(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('/*')) {
      return line
    }
    
    // Add theme container scope to selectors
    if (line.includes('{')) {
      const selector = line.split('{')[0].trim()
      if (!selector.startsWith('.theme-container')) {
        return `.theme-container ${line}`
      }
    }
    
    return line
  })
  
  return scopedLines.join('\n')
}

// Sanitize HTML to prevent XSS using DOMPurify
function sanitizeHTML(html: string): string {
  // Use DOMPurify for secure HTML sanitization
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'meta', 'link'],
    ALLOWED_ATTR: ['class', 'id', 'rel', 'href', 'name', 'content'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  })
}

// Inject head scripts safely
function injectHeadScripts(html: string) {
  const sanitized = sanitizeHTML(html)
  const temp = document.createElement('div')
  // Use DOMPurify again for extra safety
  const safeSanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: ['meta', 'link', 'title'],
    ALLOWED_ATTR: ['rel', 'href', 'name', 'content', 'property'],
    FORBID_TAGS: ['script'],
    FORBID_ATTR: ['onerror', 'onload']
  })
  temp.innerHTML = safeSanitized
  
  // Extract and inject only safe elements
  const safeElements = temp.querySelectorAll('meta, link[rel="stylesheet"], link[rel="canonical"]')
  safeElements.forEach(el => {
    const existingElement = document.querySelector(`${el.tagName}[${Array.from(el.attributes).map(a => `${a.name}="${a.value}"`).join('][')}]`)
    if (!existingElement) {
      document.head.appendChild(el.cloneNode(true))
    }
  })
}

// Execute JavaScript in sandboxed environment
function executeInSandbox(code: string) {
  try {
    // Create a safe execution context
    const safeGlobals = {
      console: {
        log: (...args: any[]) => console.log('[Custom JS]:', ...args),
        error: (...args: any[]) => console.error('[Custom JS]:', ...args),
        warn: (...args: any[]) => console.warn('[Custom JS]:', ...args),
      },
      // Provide safe APIs
      shopify: {
        cart: {
          getCart: () => window.localStorage.getItem('cart'),
          addItem: (item: any) => console.log('Add to cart:', item),
        },
        customer: {
          isLoggedIn: () => false,
        },
        currency: {
          format: (amount: number) => `$${amount.toFixed(2)}`,
        },
      },
      // Restricted window object
      window: {
        location: {
          href: window.location.href,
          pathname: window.location.pathname,
        },
        localStorage: {
          getItem: (key: string) => {
            if (key.startsWith('theme_')) {
              return window.localStorage.getItem(key)
            }
            return null
          },
          setItem: (key: string, value: string) => {
            if (key.startsWith('theme_')) {
              window.localStorage.setItem(key, value)
            }
          },
        },
      },
    }
    
    // Create function with restricted scope
    const sandboxedFunction = new Function(
      ...Object.keys(safeGlobals),
      `
      "use strict";
      try {
        ${code}
      } catch (error) {
        console.error('[Custom JS Error]:', error);
      }
      `
    )
    
    // Execute with safe globals
    sandboxedFunction(...Object.values(safeGlobals))
  } catch (error) {
    console.error('Failed to execute custom JavaScript:', error)
  }
}

// Generate sandboxed HTML for iframe
function getSandboxHTML(code: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Sandbox</title>
    </head>
    <body>
      <script>
        // Sandboxed execution environment
        (function() {
          'use strict';
          
          // Override dangerous globals
          window.fetch = undefined;
          window.XMLHttpRequest = undefined;
          window.WebSocket = undefined;
          window.EventSource = undefined;
          
          // Safe console
          const safeConsole = {
            log: (...args) => parent.postMessage({ type: 'log', args }, '*'),
            error: (...args) => parent.postMessage({ type: 'error', args }, '*'),
            warn: (...args) => parent.postMessage({ type: 'warn', args }, '*'),
          };
          
          // Replace console
          window.console = safeConsole;
          
          try {
            ${code}
          } catch (error) {
            safeConsole.error('Sandbox error:', error.message);
          }
        })();
      </script>
    </body>
    </html>
  `
}

// Liquid-like template processor
export function processTemplate(template: string, data: Record<string, any>): string {
  // Simple Liquid-like variable replacement
  let processed = template
  
  // Replace variables {{ variable }}
  processed = processed.replace(/\{\{\s*(\w+(?:\.\w+)*)\s*\}\}/g, (match, path) => {
    const value = getNestedValue(data, path)
    return value !== undefined ? String(value) : match
  })
  
  // Process filters {{ variable | filter }}
  processed = processed.replace(/\{\{\s*(\w+(?:\.\w+)*)\s*\|\s*(\w+)\s*\}\}/g, (match, path, filter) => {
    const value = getNestedValue(data, path)
    return applyFilter(value, filter)
  })
  
  // Process conditionals {% if condition %} ... {% endif %}
  processed = processed.replace(/\{%\s*if\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, (match, condition, content) => {
    const value = getNestedValue(data, condition)
    return value ? content : ''
  })
  
  // Process loops {% for item in collection %} ... {% endfor %}
  processed = processed.replace(/\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, 
    (match, itemName, collectionName, content) => {
      const collection = getNestedValue(data, collectionName)
      if (Array.isArray(collection)) {
        return collection.map(item => {
          const itemData = { ...data, [itemName]: item }
          return processTemplate(content, itemData)
        }).join('')
      }
      return ''
    }
  )
  
  return processed
}

// Get nested object value by path
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Apply Liquid-like filters
function applyFilter(value: any, filter: string): string {
  switch (filter) {
    case 'upcase':
      return String(value).toUpperCase()
    case 'downcase':
      return String(value).toLowerCase()
    case 'capitalize':
      return String(value).charAt(0).toUpperCase() + String(value).slice(1)
    case 'money':
      return `$${Number(value).toFixed(2)}`
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'escape':
      return String(value).replace(/[<>"'&]/g, (char) => {
        const escapeMap: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '&': '&amp;'
        }
        return escapeMap[char]
      })
    default:
      return String(value)
  }
}