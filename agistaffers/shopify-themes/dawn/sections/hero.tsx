'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function HeroSection({ section, settings }: SectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const {
    slides = [{
      image: '/images/hero-1.jpg',
      heading: 'Welcome to Our Store',
      subheading: 'Discover amazing products',
      button_text: 'Shop Now',
      button_link: '/collections/all',
      text_alignment: 'center',
      text_color: 'white'
    }],
    height = 'large',
    auto_rotate = true,
    change_slides_every = 5,
    show_arrows = true,
    show_dots = true,
    overlay_opacity = 30
  } = section.settings

  // Auto-rotate slides
  useEffect(() => {
    if (auto_rotate && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, change_slides_every * 1000)
      return () => clearInterval(interval)
    }
  }, [auto_rotate, change_slides_every, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const heightClasses = {
    small: 'h-64 lg:h-96',
    medium: 'h-96 lg:h-[500px]',
    large: 'h-[500px] lg:h-[600px]',
    fullscreen: 'h-screen'
  }

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }

  return (
    <div className={`relative overflow-hidden ${heightClasses[height as keyof typeof heightClasses]}`}>
      {slides.map((slide: any, index: number) => (
        <div
          key={index}
          className={`
            absolute inset-0 transition-opacity duration-500
            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlay_opacity / 100 }}
          />

          {/* Content */}
          <div className="relative h-full container mx-auto px-4">
            <div className={`
              h-full flex flex-col justify-center
              ${alignmentClasses[slide.text_alignment as keyof typeof alignmentClasses]}
            `}>
              <div className="max-w-2xl">
                {slide.heading && (
                  <h1 
                    className={`
                      text-4xl lg:text-6xl font-bold mb-4
                      ${slide.text_color === 'white' ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    {slide.heading}
                  </h1>
                )}
                
                {slide.subheading && (
                  <p 
                    className={`
                      text-lg lg:text-xl mb-8
                      ${slide.text_color === 'white' ? 'text-gray-200' : 'text-gray-700'}
                    `}
                  >
                    {slide.subheading}
                  </p>
                )}
                
                {slide.button_text && (
                  <Link href={slide.button_link || '#'}>
                    <Button 
                      size="lg"
                      className={`
                        ${slide.text_color === 'white' 
                          ? 'bg-white text-black hover:bg-gray-100' 
                          : 'bg-black text-white hover:bg-gray-900'}
                      `}
                    >
                      {slide.button_text}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {show_arrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {show_dots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Section Schema
export const schema = {
  name: 'Hero',
  settings: [
    {
      type: 'select',
      id: 'height',
      label: 'Section height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'fullscreen', label: 'Fullscreen' }
      ],
      default: 'large'
    },
    {
      type: 'checkbox',
      id: 'auto_rotate',
      label: 'Auto-rotate slides',
      default: true
    },
    {
      type: 'range',
      id: 'change_slides_every',
      label: 'Change slides every',
      min: 3,
      max: 10,
      step: 1,
      unit: 's',
      default: 5
    },
    {
      type: 'checkbox',
      id: 'show_arrows',
      label: 'Show navigation arrows',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_dots',
      label: 'Show dots navigation',
      default: true
    },
    {
      type: 'range',
      id: 'overlay_opacity',
      label: 'Overlay opacity',
      min: 0,
      max: 100,
      step: 10,
      unit: '%',
      default: 30
    }
  ],
  blocks: [
    {
      type: 'slide',
      name: 'Slide',
      settings: [
        {
          type: 'image_picker',
          id: 'image',
          label: 'Image'
        },
        {
          type: 'text',
          id: 'heading',
          label: 'Heading',
          default: 'Image slide'
        },
        {
          type: 'text',
          id: 'subheading',
          label: 'Subheading',
          default: 'Tell your brand story'
        },
        {
          type: 'text',
          id: 'button_text',
          label: 'Button text',
          default: 'Shop Now'
        },
        {
          type: 'url',
          id: 'button_link',
          label: 'Button link'
        },
        {
          type: 'select',
          id: 'text_alignment',
          label: 'Text alignment',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' }
          ],
          default: 'center'
        },
        {
          type: 'select',
          id: 'text_color',
          label: 'Text color',
          options: [
            { value: 'white', label: 'White' },
            { value: 'black', label: 'Black' }
          ],
          default: 'white'
        }
      ]
    }
  ]
}