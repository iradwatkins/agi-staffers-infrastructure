'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Calendar, 
  User, 
  BookOpen, 
  TrendingUp,
  ArrowRight,
  Rss
} from 'lucide-react'

export default function BlogHeroSection({ section, settings }: SectionProps) {
  const {
    heading = 'Expert Insights & Industry News',
    subheading = 'Stay ahead with the latest trends, tips, and strategies',
    show_search = true,
    show_categories = true,
    show_featured_post = true,
    show_stats = true,
    featured_post = {
      title: 'The Future of Digital Marketing: 10 Trends to Watch in 2024',
      excerpt: 'Discover the emerging trends that will shape digital marketing and how to prepare your business for success.',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      category: 'Digital Marketing',
      image: '/api/placeholder/800/400',
      read_time: '8 min read',
      url: '/blog/future-digital-marketing-2024'
    },
    categories = [
      'Digital Marketing',
      'Business Strategy',
      'Technology',
      'Growth Hacking',
      'Industry News'
    ],
    blog_stats = [
      { number: '500+', label: 'Articles' },
      { number: '50K+', label: 'Readers' },
      { number: '1M+', label: 'Views' }
    ]
  } = section.settings

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h1>
          <p className="text-xl text-muted-foreground mb-8">{subheading}</p>
          
          {/* Search Bar */}
          {show_search && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, topics, or keywords..."
                    className="pl-10"
                  />
                </div>
                <Button>
                  Search
                </Button>
              </div>
            </div>
          )}

          {/* Categories */}
          {show_categories && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                All Posts
              </Badge>
              {categories.map((category, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          {show_featured_post && (
            <div className="lg:col-span-2">
              <div className="relative group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={featured_post.image}
                    alt={featured_post.title}
                    className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-red-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <Badge variant="secondary" className="mb-4">
                      {featured_post.category}
                    </Badge>
                    
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                      <Link href={featured_post.url} className="hover:underline">
                        {featured_post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-white/90 mb-4 line-clamp-2">
                      {featured_post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featured_post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {featured_post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {featured_post.read_time}
                        </div>
                      </div>
                      
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={featured_post.url}>
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blog Stats */}
            {show_stats && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Our Blog by the Numbers
                </h3>
                <div className="space-y-4">
                  {blog_stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-bold text-primary">{stat.number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-primary rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Never Miss an Update</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Get the latest insights delivered to your inbox weekly.
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
                <Button className="w-full bg-white text-primary hover:bg-white/90">
                  Subscribe Now
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-primary-foreground/70">
                <Rss className="h-3 w-3" />
                Join 10,000+ subscribers
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-4">Popular Topics</h3>
              <div className="space-y-2">
                {categories.slice(0, 4).map((category, index) => (
                  <Link
                    key={index}
                    href={`/blog/category/${category.toLowerCase().replace(' ', '-')}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {category}
                  </Link>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4">
                View All Topics
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Blog Hero',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Main heading',
      default: 'Expert Insights & Industry News'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Subheading',
      default: 'Stay ahead with the latest trends, tips, and strategies'
    },
    {
      type: 'checkbox',
      id: 'show_search',
      label: 'Show search bar',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_categories',
      label: 'Show category tags',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_featured_post',
      label: 'Show featured post',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_stats',
      label: 'Show blog statistics',
      default: true
    }
  ]
}